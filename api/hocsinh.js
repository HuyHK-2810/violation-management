import { authenticateGoogleSheets } from '../googleSheets.js';
const SPREADSHEET_ID = '1v_EoeOYpxa7882cuL1pHm02vMjAm8tVOPmMgk5E_kJU';
// Đọc dữ liệu từ tab hocsinh
export async function getHocsinh(req, res) {
  const sheets = await authenticateGoogleSheets();
  const range = 'hocsinh!A2:B';

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    });
    const rows = response.data.values.map(item => ({
  id: parseInt(item[0]),  
  name: item[1]          
}));;
    res.json(rows || []);
  } catch (error) {
    console.error('Lỗi khi đọc dữ liệu:', error);
    res.status(500).json({ error: 'Lỗi khi đọc dữ liệu từ Google Sheets' });
  }
}
