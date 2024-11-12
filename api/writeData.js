import { writeData } from '../googleSheets';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Chỉ hỗ trợ phương thức POST' });
  }

  const { values } = req.body;

  if (!values || !Array.isArray(values)) {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
  }

  try {
    const result = await writeData(values);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi khi ghi dữ liệu vào Google Sheets' });
  }
}
