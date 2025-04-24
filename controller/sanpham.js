const express = require("express");
const db = require("../connectSV/index");
const router = express.Router();
const thongBao = require("../Sevice/stringThongBao");

router.post("/services/apiSanPham", async (req, res) => {
  try {
    const {
      funcId, tenSP, imgSP, idDanhMuc, id, idSanPham, maSP, mota, type, quyCach
    } = req.body;

    if (funcId === 9 || funcId === 10) {
      if (!tenSP || !imgSP || !idDanhMuc || !maSP) {
        return res.status(500).json({ error: thongBao.messThieuDuLieu });
      }

      if (funcId === 9) {
        // Cập nhật sản phẩm
        if (!id) return res.status(400).json({ error: thongBao.messThieuDuLieu });

        const idNumber = Number(id);
        db.query(
          "UPDATE qly_sanpham SET tenSP = ?, imgSP = ?, idDanhMuc = ?, maSP = ?, mota = ? WHERE id = ?",
          [tenSP, imgSP, idDanhMuc, maSP, mota, idNumber],
          async (err, result) => {
            if (err) return res.status(404).json({ err: "Lỗi update sản phẩm" });

            // Cập nhật quy cách: Xóa cũ -> thêm mới
            db.query(
              "DELETE FROM quycach_sanpham WHERE idSanPham = ?",
              [idNumber],
              async (err) => {
                if (err) return res.status(500).json({ error: "Lỗi xóa quy cách cũ" });

                if (Array.isArray(quyCach) && quyCach.length > 0) {
                  const values = quyCach.map(qc => [idNumber, qc.quyCach, qc.giaBan, qc.dinhMuc]);
                  db.query(
                    "INSERT INTO quycach_sanpham (idSanPham, quyCach, giaBan, dinhMuc) VALUES ?",
                    [values],
                    (err2) => {
                      if (err2) return res.status(500).json({ error: "Lỗi thêm quy cách mới" });
                      return res.status(200).json({ message: "Cập nhật thành công" });
                    }
                  );
                } else {
                  return res.status(200).json({ message: "Cập nhật thành công (không có quy cách)" });
                }
              }
            );
          }
        );
      }  else if (funcId === 10) {
        // Thêm sản phẩm
        const randomID = Math.floor(Math.random() * 999999);
      
        db.query(
          "INSERT INTO qly_sanpham(id, tenSP, imgSP, idDanhMuc, maSP, mota) VALUES (?, ?, ?, ?, ?, ?)",
          [randomID, tenSP, imgSP, idDanhMuc, maSP, mota],
          (err, result) => {
            if (err) return res.status(404).json({ error: thongBao.messThatBai });
      
            const idSanPhamNew = randomID; // ✅ Dùng randomID vì bạn đang tự set ID, không dùng AUTO_INCREMENT
      
            if (Array.isArray(quyCach) && quyCach.length > 0) {
              const values = quyCach.map(qc => [idSanPhamNew, qc.quyCach, qc.giaBan, qc.dinhMuc]);
      
              db.query(
                "INSERT INTO quycach_sanpham (idSanPham, quyCach, giaBan, dinhMuc) VALUES ?",
                [values],
                (err2) => {
                  if (err2) return res.status(500).json({ error: "Lỗi thêm quy cách" });
                  return res.status(200).json({ message: thongBao.messThanhCong });
                }
              );
            } else {
              return res.status(200).json({ message: thongBao.messThanhCong });
            }
          }
        );
      }
    } else if (funcId === 11) {
      if (!id) return res.status(400).json({ error: thongBao.messThieuDuLieu });

      const idNumber = Number(id);
      if (type === 1) {
        // Xóa sản phẩm
        db.query("DELETE FROM quycach_sanpham WHERE idSanPham = ?", [idNumber], (err1) => {
          if (err1) return res.status(500).json({ error: "Lỗi xóa quy cách" });

          db.query("DELETE FROM qly_sanpham WHERE id = ?", [idNumber], (err2) => {
            if (err2) return res.status(500).json({ error: "Lỗi xóa sản phẩm" });
            return res.status(200).json({ message: thongBao.messThanhCong });
          });
        });
      } else if (type === 2) {
        // Xóa quy cách
        db.query("DELETE FROM quycach_sanpham WHERE id = ?", [idNumber], (err) => {
          if (err) return res.status(500).json({ error: "Lỗi xóa quy cách" });
          return res.status(200).json({ message: thongBao.messThanhCong });
        });
      }
    } else if (funcId === 12) {
      db.query(
        "SELECT * FROM qly_sanpham WHERE tenSP = ? AND idDanhMuc = ?",
        [tenSP, idDanhMuc],
        (err, result) => {
          if (err) return res.status(404).json({ error: thongBao.messThatBai });
          return res.status(200).json({ message: thongBao.messThanhCong, result });
        }
      );
    } else if (funcId === 13) {
      db.query(
        "SELECT * FROM quycach_sanpham WHERE idSanPham = ?",
        [idSanPham],
        (err, result) => {
          if (err) return res.status(404).json({ error: thongBao.messThatBai });
          return res.status(200).json({ message: thongBao.messThanhCong, result });
        }
      );
    } else {
      return res.status(404).json({ error: thongBao.messThieuDuLieu });
    }
  } catch (err) {
    console.error("Lỗi hệ thống:", err);
    return res.status(500).json({ error: "Lỗi hệ thống" });
  }
});

router.get("/services/getSanPham", async (req, res) => {
  db.query("SELECT * FROM qly_sanpham", (err, result) => {
    if (err) return res.status(404).json({ error: "Lỗi lấy sản phẩm!" });
    return res.status(200).json({ response: result });
  });
});

module.exports = router;
