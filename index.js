require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { simularESalvar } = require('./services/sheetsService');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/simular', async (req, res) => {
  try {
    const { valor, payout, acertos, totalOperacoes } = req.body;
    const resultado = await simularESalvar({ valor, payout, acertos, totalOperacoes });
    res.status(200).json({ mensagem: 'Simulação salva com sucesso', resultado });
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
