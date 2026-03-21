function summary() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveCell().getRow();
  const column = 3
  const comment = sheet.getRange(row, column).getValue();
  const payload = {
    contents: [
      {
        parts: [
          { text: "Feedback de usuario: " + comment },
          { text: "Dame en español, un resumen muy corto del anterior feedback de usuario. SOLAMENTE ESCRIBE el resumen del texto, sé sucinto y puntual, no inicies con 'El usuario', en una sola línea y sin usar formato markdown. Procura que el resumen sea más corto que el texto original. Si detectas que el feedback es spam, únicamente escribe Reseña Inválida" },
        ],
      },
    ],
  };



    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent';
    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'x-goog-api-key': apiKey,
      },
      payload: JSON.stringify(payload)
    };

    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response);
    const content = data['candidates'][0]['content']['parts'][0]['text'];
    // console.log(content);
    return content;
}