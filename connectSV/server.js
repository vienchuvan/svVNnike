const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('../controller/auth')
const quanTri = require('../controller/quanTriBaiViet')
const sanpham = require('../controller/sanpham')
const danhMuc = require('../controller/danhmuc')
const duan = require('../controller/duan')
const app = express();
const port = 3001;
const path = require("path");
const fs = require("fs");
// Middleware
app.use(cors());
app.use(bodyParser.json());
const uploadDir = path.join(__dirname, "../uploads");
fs.readdir(uploadDir, (err, files) => {
    if (err) {
        console.error("Lỗi đọc thư mục uploads:", err);
    } else {
        console.log("Danh sách file trong uploads:", files);
    }
});


// app.use(express.static(path.join(__dirname, 'dist')));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quantri', quanTri);
app.use('/api/sanpham', sanpham)
app.use('/api/duan', duan)
app.use('/api/danhmuc', danhMuc)
app.use("/api/uploads", express.static(uploadDir));

console.log("Serving static files from:", uploadDir);
app.listen(port, () => {
    console.log(`🚀 Server chạy tại: http://localhost:${port}`);
});