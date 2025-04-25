const express = require('express');
const db = require("../connectSV/index");
// const { funUpdateDanhMuc, funAddDanhMuc, funAddBaiViet, funUpdateDanhMuc, funDeleteDanhMuc, funAddDanhMuc } = require('../Sevice/funAPI');
const router = express.Router();
const thongBao = require("../Sevice/stringThongBao");

// Lấy danh sách sản phẩm


router.post("/services/apiDanhMuc", async (req, res) => {
  try {
    const {
      funcId,
      tenSP,
      imgSP,
      idDanhMuc,
      id,
   
    } = req.body;

    if (funcId === 9 || funcId === 10) {
      if (
        !funcId ||
        !tenSP ||
        !imgSP ||
        !idDanhMuc ||
        !id
      ) {
        return res.status(400).json({ error: thongBao.messThieuDuLieu });
      }
   
      if (funcId === 9) {
        // api update bai viet
        if (!id) {
          return res.status(400).json({ error: thongBao.messThieuDuLieu });
        }
        const idNumber = Number(id);

        db.query(
          "UPDATE danhmuc SET  tenSP = ?, imgSP = ?, idDanhMuc = ? WHERE id = ?",
          [
            funcId,
            tenSP,
            imgSP,
            idDanhMuc,
            idNumber,
          ],
          (err, result) => {
            if (err) {
              return res
                .status(404)
                .json({ err: "Lỗi update vui lòng thử lại" });
            } else {
              return res
                .status(200)
                .json({ message: "Cập nhật dữ liệu thành công " });
            }
          }
        );
      } else if (funcId === 10) {
        //api them bai viet
        const randomID = randomInt(999999);

        db.query(
          "INSERT INTO danhmuc(funcId,tenSP,imgSP,idDanhMuc, randomID) VALUES (?,?,?,?,?)",
          [
            funcId,
            tenSP,
            imgSP,
            idDanhMuc,
            randomID,
          
          ],
          (err, result) => {
            if (err) {
              return res.status(404).json({ erro: thongBao.messThatBai });
            }
            return res
              .status(200)
              .json({ message: thongBao.messThanhCong, result });
          }
        );
      }
    } else if (funcId ===  11) {

      if (!id) {

        return res.status(400).json({ error: thongBao.messThieuDuLieu });
      }
      const idNumber = Number(id);
      db.query("DELETE FROM danhmuc WHERE id = ? ", [], (err, result) => {
        if (err) {
          return res.status(404).json({ err: "Lỗi khi xóa vui lòng thử lại" });
        } else {
          return res.status(200).json({ message: thongBao.messThanhCong });
        }
      });
    } else if (funcId === 12) {
      
      db.query(
        "SELECT * FROM danhmuc WHERE tenSP = ? AND idDanhMuc = ?",
        [tenSP , idDanhMuc],
        (err, result) => {
          if (err) {
            return res.status(404).json({ erro: thongBao.messThatBai });
          
          }
          return res
            .status(200)
            .json({ message: thongBao.messThanhCong, result });
        }
      );
    } else {
      return res.status(404).json({ err: thongBao.messThieuDuLieu });
    }
  } catch (err) {
    console.log(err);
  }
});


router.get("/services/getDanhMuc", async (req, res) => {
    db.query("SELECT * FROM danhmuc", (err, result) => {
      if (err) {
        console.log("Lỗi lấy danhmuc, vui lòng thử lại sau");
        return res
          .status(404)
          .json({ error: "Lỗi lấy danhmuc, vui lòng thử lại sau !" });
      }
      return res.status(200).json({ response: result });
    });
  });

module.exports = router;