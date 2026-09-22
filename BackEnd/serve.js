require("dotenv").config();

const express = require("express"); 
const { neon } = require("@neondatabase/serverless");
const app = express(); // Inicializando o app
// 3. Middleware OBRIGATÓRIO para o app entender o body das requisições POST em JSON
app.use(express.json()); 

const sql = neon(process.env.DATABASE_URL);  // Conexão com o BD

const pontuacao = 0; 
const presenças = 0;
const atividades = 0;

async function faltas(presentes) {
    const resultado = await sql`SELECT * FROM alunos`;
    const alunos = resultado.map(row => ({
        id: row.id,  // matricula
        nome: row.nome,
        foto: row.foto,
        faltas: row.faltas
    }));

    for (const aluno of alunos) {
        if (aluno.id != presentes) {
            aluno.faltas += 1; // Incrementar faltas para os alunos ausentes
        } 
        await sql`UPDATE alunos SET faltas = ${aluno.faltas} WHERE id = ${aluno.id}`;
    }   


};

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

        faltas(presentes);

        const resultado = await sql`INSERT INTO aulas (nome, topicos, videos, imgs, atividades, presentes) VALUES (${nome}, ${topicos}, ${videos}, ${imgs}, ${atividades}, ${presentes}}) RETURNING *`;

        if (resultado.length > 0) {
            console.log("Deu tudo certo");
            res.status(201).json(resultado[0]); // Retorna apenas o objeto criado 
        } else {
            res.status(500).json({ error: "Erro ao adicionar aula" });
        }
    } catch (error) {
        console.error("Erro no POST:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

// editar aula
app.put('/api/editarAula/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { nome, topicos, presentes } = req.body;

        if (!nome || !topicos || !presentes) {
            return res.status(400).json({ error: "Nome,  descrição e presentes são obrigatórios" });
        }

        const resultado = await sql`UPDATE aulas SET nome = ${nome}, topicos = ${topicos} WHERE id = ${id} RETURNING *`;

        if (resultado.length > 0) {
            console.log("Aula editada com sucesso");
            res.json(resultado[0]); // Retorna apenas o objeto atualizado
        } else {
            res.status(404).json({ error: "Aula não encontrada" });
        }
    } catch (error) {
        console.error("Erro no PUT:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
});

// deletar aula
app.delete('/api/deletarAula/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const resultado = await sql`DELETE FROM aulas WHERE id = ${id} RETURNING *`;

        if (resultado.length > 0) {
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

// 4. Iniciando o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});