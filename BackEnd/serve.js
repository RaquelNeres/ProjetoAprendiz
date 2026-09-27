import express from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

const app = express(); 
app.use(cors());
app.use(express.json()); 

const sql = neon(process.env.DATABASE_URL);  // Conexão com o BD

// 
async function frequenciaAluno (alunoVerificado) {
    const resultado = await sql`
        SELECT 
            COUNT(CASE WHEN ${alunoVerificado} = ANY(presentes) THEN 1 END) as presencas,
            COUNT(*) as total_aulas
        FROM aulas
    `;
    
    const presencas = parseInt(resultado[0].presencas) || 0;
    const totalAulas = parseInt(resultado[0].total_aulas) || 0;
    
    if (totalAulas === 0) return 100;
    
    return Math.round((presencas / totalAulas) * 100);
}

// -----------------------------------------------------------------------------------------------------

// retornar todas as aulas
app.get('/api/aulas', async (req, res) => {
    try {
        const resultado = await sql`SELECT * FROM aulas`;

        const aulas = resultado.map(row => ({
            id: row.id,
            nome: row.nome,
            topicos: row.topicos,
            videos: row.videos,          // pode ser null
            imgs: row.imgs,              // pode ser null
            atividades: row.atividades,  // pode ser null
            presentes: row.presentes
        }));
        
        res.json(aulas);
    } catch (error) {
        console.error("Erro no GET:", error);
        res.status(500).json({ error: "Erro ao buscar aulas" });
    }
});

app.post('/api/adicionarAula', async (req, res) => {
    try {
        const { nome, topicos, presentes } = req.body;
        const videos = req.body.videos ? req.body.videos : null;
        const imgs = req.body.imgs ? req.body.imgs : null;
        const atividades = req.body.atividades ? req.body.atividades : null;

        if (!nome || !topicos || !presentes) {
            return res.status(400).json({ error: "Nome,  descrição e presentes são obrigatórios" });
        }

        const adicionando = await sql`INSERT INTO aulas (nome, topicos, videos, imgs, atividades, presentes) VALUES (${nome}, ${topicos}, ${videos}, ${imgs}, ${atividades}, ${presentes}) RETURNING *`;

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
        const { nome, topicos, presentes } = req.body;
        const videos = req.body.videos ? req.body.videos : null;
        const imgs = req.body.imgs ? req.body.imgs : null;
        const atividades = req.body.atividades ? req.body.atividades : null;

        if (!nome || !topicos || !presentes) {
            return res.status(400).json({ error: "Nome,  descrição e presentes são obrigatórios" });
        }

        const editando = await sql`UPDATE aulas SET nome = ${nome}, topicos = ${topicos}, videos = ${videos}, imgs = ${imgs}, atividades = ${atividades}, presentes = ${presentes} WHERE id = ${id} RETURNING *`;

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

        const alunos = resultado.map(row => ({
            id: row.id,
            nome: row.nome,
            disciplina: row.disciplina,
            frequencia: await frequenciaAluno(row.nome)
        }));
        
        res.json(alunos);
    } catch (error) {
        console.error("Erro no GET:", error);
        res.status(500).json({ error: "Erro ao buscar alunos" });
    }
});

app.post('/api/adicionarAluno', async (req, res) => {
    try {
        const { nome, disciplina } = req.body;

        if (!nome || !disciplina ) {
            return res.status(400).json({ error: "Nome e descrição são obrigatórios" });
        }

        const adicionando = await sql`INSERT INTO alunos (nome, disciplina) VALUES (${nome}, ${disciplina}) RETURNING *`;


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
        const { nome, disciplina } = req.body;

        if (!nome || !disciplina) {
            return res.status(400).json({ error: "Nome e descrição são obrigatórios" });
        }

        const editando = await sql`UPDATE alunos SET nome = ${nome}, disciplina = ${disciplina} WHERE id = ${id} RETURNING *`;

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});