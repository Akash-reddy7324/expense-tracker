// Client-side Google Identity Services flow expected.
// After you get an access token, call exportToGoogleSheets(token, rows).
export async function exportToGoogleSheets(token: string, rows: (string|number)[][]){
  // 1) Create spreadsheet
  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ properties: { title: `Expenses ${new Date().toISOString().slice(0,10)}` } })
  });
  const sheet = await createRes.json();
  const values = [["Date","Amount","Category","Note","Payment Method"], ...rows];

  // 2) Append rows
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheet.spreadsheetId}/values/A1:append?valueInputOption=RAW`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ values })
  });
  return `https://docs.google.com/spreadsheets/d/${sheet.spreadsheetId}`;
}
