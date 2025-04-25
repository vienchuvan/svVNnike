const express = require('express');
const db = require("../connectSV/index");
const router = express.Router();
const randomID = Math.floor(Math.random() * 999999);

router.post("/services/addDuAn", async (req, res) => {
  const { id, user, tenDuAn, diaChiDuAn, imgDuAn } = req.body;
  console.log("body", req.body);
  const randomID = Math.floor(Math.random() * 999999);

  const query = "INSERT INTO duan (id, user, tenDuAn, diaChiDuAn, imgDuAn) VALUES (?, ?, ?, ?, ?)";
  db.query(query, [randomID, user, tenDuAn, diaChiDuAn, imgDuAn], (err, result) => {
    if (err) {
      console.log("Lỗi khi thêm dự án:", err);
      return res.status(500).json({ error: "Không thể thêm dự án, vui lòng thử lại sau!" });
    }
    return res.status(201).json({ message: "Thêm dự án thành công!" });
  });
});

router.put("/services/updateDuAn/:id", async (req, res) => {
  const { id } = req.params;
  const { user, tenDuAn, diaChiDuAn, imgDuAn } = req.body;
  const query = "UPDATE duan SET user = ?, tenDuAn = ?, diaChiDuAn = ?, imgDuAn = ? WHERE id = ?";
  db.query(query, [user, tenDuAn, diaChiDuAn, imgDuAn, id], (err, result) => {
    if (err) {
      console.log("Lỗi khi cập nhật dự án:", err);
      return res.status(500).json({ error: "Không thể cập nhật dự án, vui lòng thử lại sau!" });
    }
    return res.status(200).json({ message: "Cập nhật dự án thành công!" });
  });
});

router.delete("/services/deleteDuAn/:id", async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM duan WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) {
      console.log("Lỗi khi xóa dự án:", err);
      return res.status(500).json({ error: "Không thể xóa dự án, vui lòng thử lại sau!" });
    }
    return res.status(200).json({ message: "Xóa dự án thành công!" });
  });
});

router.get("/services/getDuAn", async (req, res) => {
    db.query("SELECT * FROM duan", (err, result) => {
      if (err) {
        console.log("Vui lòng thử lại sau");
        return res
          .status(404)
          .json({ error: "Vui lòng thử lại sau !" });
      }
      return res.status(200).json({ response: result });
    });
  });

module.exports = router;