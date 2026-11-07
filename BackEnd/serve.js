import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import 'dotenv/config';

const app = express(); 
app.use(cors());
app.use(express.json()); 

const sql = neon(process.env.DATABASE_URL);  // Conexão com o BD
const authBaseUrl = process.env.NEON_AUTH_BASE_URL;
const adminUserId = process.env.ADMIN_USER_ID;
const authJwks = authBaseUrl
    ? createRemoteJWKSet(new URL(`${authBaseUrl.replace(/\/+$/, '')}/.well-known/jwks.json`))
    : null;

async function requireAdmin(req, res, next) {
    if (!authJwks || !adminUserId) {
        return res.status(503).json({ error: "Autenticação administrativa não configurada" });
    }

    const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) {
        return res.status(401).json({ error: "Autenticação necessária" });
    }

    let userId;
    try {
        const { payload } = await jwtVerify(token, authJwks);
        userId = payload.sub;
    } catch {
        return res.status(401).json({ error: "Sessão inválida ou expirada" });
    }

    if (userId !== adminUserId) {
        return res.status(403).json({ error: "Acesso não autorizado" });
    }

    try {
        const users = await sql`
            SELECT role, banned
            FROM neon_auth.user
            WHERE id = ${userId}
            LIMIT 1
        `;

        if (users[0]?.role !== 'admin' || users[0]?.banned) {
            return res.status(403).json({ error: "Acesso não autorizado" });
        }
    } catch (error) {
        console.error("Erro ao verificar administrador:", error);
        return res.status(503).json({ error: "Não foi possível validar o acesso" });
    }

    next();
}

async function verificarAdminOpcional(req) {
    if (!authJwks || !adminUserId) return false;
    const token = req.get('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) return false;

    try {
        const { payload } = await jwtVerify(token, authJwks);
        if (payload.sub !== adminUserId) return false;

        const users = await sql`
            SELECT role, banned
            FROM neon_auth.user
            WHERE id = ${payload.sub}
            LIMIT 1
        `;

        return users[0]?.role === 'admin' && !users[0]?.banned;
    } catch {
        return false;
    }
}

app.use('/api', (req, res, next) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        return requireAdmin(req, res, next);
    }
    next();
});

// 
async function frequenciaAluno (alunoVerificado, disciplinaEscolhida) {
    const resultado = await sql`
    SELECT 
        COUNT(*) FILTER (
            WHERE ${alunoVerificado} = ANY(presentes) 
              AND disciplina = ${disciplinaEscolhida}
              AND (visibilidade IS NULL OR visibilidade != 'professor')
        ) AS presencas,
        COUNT(*) FILTER (
            WHERE disciplina = ${disciplinaEscolhida}
              AND (visibilidade IS NULL OR visibilidade != 'professor')
        ) AS total_aulas
    FROM aulas
`;
    
    const presencas = Number(resultado[0]?.presencas) || 0;
    const totalAulas = Number(resultado[0]?.total_aulas) || 0;
    
    if (totalAulas === 0) return 100;
    
    return Math.round((presencas / totalAulas) * 100);
}

// -----------------------------------------------------------------------------------------------------

// retornar todas as aulas
app.get('/api/aulas', async (req, res) => {
    try {
        const ehAdmin = await verificarAdminOpcional(req);
        const resultado = ehAdmin
            ? await sql`SELECT * FROM aulas`
            : await sql`SELECT * FROM aulas WHERE visibilidade IS NULL OR visibilidade = 'todos' OR visibilidade = 'alunos'`;

        const aulas = resultado.map(row => ({
            id: row.id,
            name: row.name,
            disciplina: row.disciplina,
            topicos: row.topicos,
            video: row.video,          // pode ser null
            imgs: row.imgs,              // pode ser null
            atividades: row.atividades,  // pode ser null
            presentes: row.presentes,
            visibilidade: row.visibilidade || 'todos'
        }));
        
        res.json(aulas);
    } catch (error) {
        console.error("Erro no GET:", error);
        res.status(500).json({ error: "Erro ao buscar aulas" });
    }
});

function normalizarMidia(valor) {
    if (!valor) return null;
    if (Array.isArray(valor)) {
        const linhas = valor
            .map(item => {
                if (typeof item === 'string') return item.trim();
                if (item && typeof item === 'object' && item.url) {
                    const url = String(item.url).trim();
                    const nome = item.nome ? String(item.nome).trim() : '';
                    return nome ? `${nome} | ${url}` : url;
                }
                return '';
            })
            .filter(Boolean);
        return linhas.length > 0 ? linhas.join('\n') : null;
    }
    if (typeof valor === 'string') {
        const limpo = valor.trim();
        return limpo.length > 0 ? limpo : null;
    }
    return null;
}

app.post('/api/adicionarAula', async (req, res) => {
    try {
        const { name, topicos, presentes, disciplina, visibilidade } = req.body;
        const video = normalizarMidia(req.body.video);
        const imgs = normalizarMidia(req.body.imgs);
        const atividades = normalizarMidia(req.body.atividades);
        const visibilidadeDefinida = visibilidade || 'todos';

        if (!name || !topicos || !presentes) {
            return res.status(400).json({ error: "Name,  descrição, disciplina e presentes são obrigatórios" });
        }

        const adicionando = await sql`INSERT INTO aulas (name, topicos, disciplina, video, imgs, atividades, presentes, visibilidade) VALUES (${name}, ${topicos}, ${disciplina}, ${video}, ${imgs}, ${atividades}, ${presentes}, ${visibilidadeDefinida}) RETURNING *`;

        if (adicionando.length > 0) {
            console.log("Deu tudo certo");
            res.status(201).json(adicionando[0]); 
        } else {
            res.status(500).json({ error: "Erro ao adicionar aula" });
        }
    } catch (error) {
        console.error("Erro no POST:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

app.put('/api/editarAula/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, topicos, presentes, disciplina, visibilidade } = req.body;
        const video = normalizarMidia(req.body.video);
        const imgs = normalizarMidia(req.body.imgs);
        const atividades = normalizarMidia(req.body.atividades);
        const visibilidadeDefinida = visibilidade || 'todos';

        if (!name || !topicos || !presentes) {
            return res.status(400).json({ error: "Name,  descrição, disciplina e presentes são obrigatórios" });
        }

        const editando = await sql`UPDATE aulas SET name = ${name}, topicos = ${topicos}, disciplina = ${disciplina}, video = ${video}, imgs = ${imgs}, atividades = ${atividades}, presentes = ${presentes}, visibilidade = ${visibilidadeDefinida} WHERE id = ${id} RETURNING *`;

        if (editando.length > 0) {
            console.log("Aula editada com sucesso");
            res.json(editando[0]);
        } else {
            res.status(404).json({ error: "Aula não encontrada" });
        }
    } catch (error) {
        console.error("Erro no PUT:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

app.patch('/api/aulaVisibilidade/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { visibilidade } = req.body;

        if (!visibilidade || !['todos', 'alunos', 'professor'].includes(visibilidade)) {
            return res.status(400).json({ error: "Visibilidade inválida" });
        }

        const editando = await sql`UPDATE aulas SET visibilidade = ${visibilidade} WHERE id = ${id} RETURNING *`;

        if (editando.length > 0) {
            res.json(editando[0]);
        } else {
            res.status(404).json({ error: "Aula não encontrada" });
        }
    } catch (error) {
        console.error("Erro no PATCH:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

app.delete('/api/deletarAula/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletando = await sql`DELETE FROM aulas WHERE id = ${id} RETURNING *`;

        if (deletando.length > 0) {
            console.log("Aula deletada com sucesso");
            res.json({ message: "Aula deletada com sucesso" });
        } else {
            res.status(404).json({ error: "Aula não encontrada" });
        }
    } catch (error) {
        console.error("Erro no DELETE:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

// ------------------------------------------------------------------------------------------------------------------


// retornar todos alunos
app.get('/api/alunos', async (req, res) => {
    try {
        const resultado = await sql`SELECT * FROM alunos`;

        const alunosPromises = resultado.map(async (row) => ({
            id: row.id,
            name: row.name,
            disciplina: row.disciplina,
            frequencia: await frequenciaAluno(row.name, row.disciplina)
        }));

        const alunos = await Promise.all(alunosPromises);
        
        res.json(alunos);
    } catch (error) {
        console.error("Erro no GET:", error);
        res.status(500).json({ error: "Erro ao buscar alunos" });
    }
});

app.post('/api/adicionarAluno', async (req, res) => {
    try {
        const { name, disciplina } = req.body;

        if (!name || !disciplina ) {
            return res.status(400).json({ error: "Name e descrição são obrigatórios" });
        }

        const adicionando = await sql`INSERT INTO alunos (name, disciplina) VALUES (${name}, ${disciplina}) RETURNING *`;


        if (adicionando.length > 0) {
            console.log("Deu tudo certo");
            res.status(201).json(adicionando[0]); 
        } else {
            res.status(500).json({ error: "Erro ao adicionar aluno" });
        }
    } catch (error) {
        console.error("Erro no POST:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

app.put('/api/editarAluno/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, disciplina } = req.body;

        if (!name || !disciplina) {
            return res.status(400).json({ error: "Name e descrição são obrigatórios" });
        }

        const editando = await sql`UPDATE alunos SET name = ${name}, disciplina = ${disciplina} WHERE id = ${id} RETURNING *`;

        if (editando.length > 0) {
            console.log("aluno editada com sucesso");
            res.json(editando[0]);
        } else {
            res.status(404).json({ error: "aluno não encontrada" });
        }
    } catch (error) {
        console.error("Erro no PUT:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

app.delete('/api/deletaraluno/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletando = await sql`DELETE FROM alunos WHERE id = ${id} RETURNING *`;

        if (deletando.length > 0) {
            console.log("aluno deletada com sucesso");
            res.json({ message: "aluno deletada com sucesso" });
        } else {
            res.status(404).json({ error: "aluno não encontrada" });
        }
    } catch (error) {
        console.error("Erro no DELETE:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});


if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}

export default app;
