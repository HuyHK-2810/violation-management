import { readData } from '../googleSheets';

export default async function handler(req, res) {
  try {
    const data = await readData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi đọc dữ liệu từ Google Sheets' });
  }
}
