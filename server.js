const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// API lấy dữ liệu từ data.json
app.get('/api/violations', (req, res) => {
    const { date, studentName } = req.query;

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            return res.status(500).json({ error: 'Lỗi đọc file dữ liệu' });
        }

        try {
            const records = JSON.parse(data);
            const filteredRecords = records.filter(record =>
                record.date === date && record.studentName === studentName
            );
            res.json(filteredRecords);
        } catch (parseError) {
            console.error('Lỗi parse JSON:', parseError);
            res.status(500).json({ error: 'Lỗi parse dữ liệu JSON' });
        }
    });
});

// API lưu dữ liệu mới vào data.json
app.post('/api/violations', (req, res) => {
    const newRecord = req.body;

    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            return res.status(500).json({ error: 'Lỗi đọc file dữ liệu' });
        }

        try {
            const records = JSON.parse(data);
            records.push(newRecord);

            fs.writeFile('data.json', JSON.stringify(records, null, 2), 'utf8', (writeErr) => {
                if (writeErr) {
                    console.error('Lỗi ghi file:', writeErr);
                    return res.status(500).json({ error: 'Lỗi ghi file dữ liệu' });
                }
                res.json({ message: 'Lưu dữ liệu thành công' });
            });
        } catch (parseError) {
            console.error('Lỗi parse JSON:', parseError);
            res.status(500).json({ error: 'Lỗi parse dữ liệu JSON' });
        }
    });
});

app.get('/api/hocsinh', (req, res) => {

    fs.readFile('hocsinh.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            return res.status(500).json({ error: 'Lỗi đọc file dữ liệu' });
        }

        try {
               const students = JSON.parse(data);
            res.json(students);
        } catch (parseError) {
            console.error('Lỗi parse JSON:', parseError);
            res.status(500).json({ error: 'Lỗi parse dữ liệu JSON' });
        }
    });
});


// Khởi động server
app.listen(PORT, () => {
    console.log(`Server chạy tại http://localhost:${PORT}`);
});
