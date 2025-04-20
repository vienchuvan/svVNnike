const express = require('express');
const db = require("../connectSV/index");
const router = express.Router();

// Lấy danh sách sản phẩm
router.get("/services/getSanPham", async (req, res) => {
    db.query("SELECT * FROM sanpham", (err, result) => {
      if (err) {
        console.log("Lỗi lấy san pham, vui lòng thử lại sau");
        return res
          .status(404)
          .json({ error: "Lỗi lấy san pham, vui lòng thử lại sau !" });
      }
      return res.status(200).json({ response: result });
    });
  });

module.exports = router;