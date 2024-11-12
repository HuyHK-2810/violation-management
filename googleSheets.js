import { google } from 'googleapis';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình xác thực Google API
// const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// const SERVICE_ACCOUNT_KEY_PATH = path.join(__dirname, './config/steam-patrol-309908-abe8340c8638.json');
// const SPREADSHEET_ID = '1v_EoeOYpxa7882cuL1pHm02vMjAm8tVOPmMgk5E_kJU'; // ID của Google Sheet (lấy từ URL của sheet)
// const keyFile = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

// Khởi tạo Google Sheets API client
export async function authenticateGoogleSheets() {
  const keyFile = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
  const auth = new google.auth.GoogleAuth({
    credentials: keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  return sheets;
}

// // Đọc dữ liệu từ Google Sheets
// async function readData() {
//   const sheets = await authenticateGoogleSheets();
//   const range = 'Sheet1!A2:E'; // Thay đổi range phù hợp với sheet của bạn
//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: SPREADSHEET_ID,
//       range: range,
//     });

//     const rows = response.data.values;
//     if (rows.length) {
//       console.log('Dữ liệu từ Google Sheets:');
//       rows.forEach((row) => {
//         console.log(row);
//       });
//     } else {
//       console.log('Không có dữ liệu nào.');
//     }
//   } catch (error) {
//     console.error('Lỗi khi đọc dữ liệu:', error);
//   }
// }

// // Ghi dữ liệu vào Google Sheets
// async function writeData(values) {
//   const sheets = await authenticateGoogleSheets();
//   const range = 'Sheet1!A2'; // Vị trí bắt đầu để ghi dữ liệu vào
//   const resource = {
//     values: values, // Mảng 2 chiều các giá trị cần ghi vào Google Sheets
//   };

//   try {
//     const response = await sheets.spreadsheets.values.update({
//       spreadsheetId: SPREADSHEET_ID,
//       range: range,
//       valueInputOption: 'RAW',
//       resource: resource,
//     });
//     console.log(`Dữ liệu đã được ghi thành công. (${response.data.updatedCells} cells updated)`);
//   } catch (error) {
//     console.error('Lỗi khi ghi dữ liệu:', error);
//   }
// }

// // Ví dụ gọi hàm ghi dữ liệu
// writeData([
//   ['Date', 'Student Name', 'Violation Type'],  // Tiêu đề cột
//   ['2024-11-12', 'Nguyen Van A', 'Late'],    // Dòng dữ liệu
// ]);

// // Ví dụ gọi hàm đọc dữ liệu
// readData();
