const { google } = require('googleapis');
const path = require('path');

const credsPath = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  keyFile: credsPath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const calcularResultado = ({ valor, payout, acertos, totalOperacoes }) => {
  const fracSucesso = acertos / totalOperacoes;
  const fracErro = 1 - fracSucesso;
  return (valor * payout * fracSucesso) - (valor * fracErro);
};

async function simularESalvar({ valor, payout, acertos, totalOperacoes }) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  const spreadsheetId = process.env.SPREADSHEET_ID;

  const novaAba = `Simulacao-${Date.now()}`;
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          duplicateSheet: {
            sourceSheetId: 110682575,
            newSheetName: novaAba,
          },
        },
      ],
    },
  });

  const resultado = calcularResultado({ valor, payout, acertos, totalOperacoes });
  const valores = [[valor, payout, acertos, totalOperacoes, resultado]];

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${novaAba}!A1:E1`,
    valueInputOption: 'RAW',
    requestBody: { values: valores },
  });

  return resultado;
}

module.exports = { simularESalvar };
