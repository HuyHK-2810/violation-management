import express from 'express';
import { getViolations, addViolation } from './api/violations.js';
import { getHocsinh } from './api/hocsinh.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = 3000;

app.use(express.json());

// API cho tab violations
app.get('/api/violations', getViolations);
app.post('/api/violations', addViolation);

// API cho tab hocsinh
app.get('/api/hocsinh', getHocsinh);
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
