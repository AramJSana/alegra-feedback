function sentiment() {
  const apiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const sheet = SpreadsheetApp.getActiveSheet();
  const row = sheet.getActiveCell().getRow();
  const column = 3
  const comment = sheet.getRange(row, column).getValue();
  const payload = {
    contents: [
      {
        parts: [
          { text: "feedback del usuario: " + comment },
          { text: "Evaluate the sentiment of this user's feedback. You must ONLY RETURN a number in this array: [0, 1, 2] where 0 is negative, 1 is neutral and 2 is positive. If it's not a valid feedback (like a spam message or garbage data) you must return NULL" },
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
    if (!isNaN(content)) {
      return Number(content);
    }
    else {
      return content;
    }
    // console.log(content);
}