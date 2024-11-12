import { authenticateGoogleSheets } from '../googleSheets.js';
const SPREADSHEET_ID = '1v_EoeOYpxa7882cuL1pHm02vMjAm8tVOPmMgk5E_kJU';
// Đọc dữ liệu từ tab violations
export async function getViolations(req, res) {
    const { date, id } = req.query;  // Lấy các tham số từ query string
    const sheets = await authenticateGoogleSheets();
    const range = 'violations!A2:E';  // Phạm vi dữ liệu trong Google Sheets

    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
        });
        const rows = response?.data?.values?.map(item => ({
            date: item[0],
            studentName: item[1],
            violations: item[2],
            totalDeduction: parseInt(item[3]),
            remainingPoints: parseInt(item[4]),
            id: item[5]
        })) ?? [];

        // Lọc dữ liệu nếu có tham số 'date' và 'studentName'
        const filteredRows = rows.filter(record => {
            let isValid = true;

            if (date) {
                isValid = isValid && record.date === date;  // Kiểm tra theo ngày
            }
            if (id) {
                isValid = isValid && record.id === id;  // Kiểm tra theo tên học sinh
            }

            return isValid;  // Nếu điều kiện lọc thỏa mãn thì giữ lại
        });

        res.json(filteredRows);
    } catch (error) {
        console.error('Lỗi khi đọc dữ liệu:', error);
        res.status(500).json({ error: 'Lỗi khi đọc dữ liệu từ Google Sheets' });
    }
}

// Ghi dữ liệu vào tab violations
export async function addViolation(req, res) {
    const sheets = await authenticateGoogleSheets();
    // Lấy dữ liệu từ body của request
    const { date, id, studentName, violations, totalDeduction, remainingPoints } = req.body;

    // Tạo mảng values từ request body
    const values = [date, studentName, violations, totalDeduction, remainingPoints, id ?? studentName];
    try {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'violations!A2:F',  // Chỉ định phạm vi dữ liệu (Cột A đến F)
            valueInputOption: 'RAW',   // Sử dụng giá trị thô
            resource: {
                values: [values],        // Thêm dữ liệu mới vào
            },
        });
        res.json({ message: 'Thêm dữ liệu thành công' });
    } catch (error) {
        console.error('Lỗi khi ghi dữ liệu:', error);
        res.status(500).json({ error: 'Lỗi khi ghi dữ liệu vào Google Sheets' });
    }
}
