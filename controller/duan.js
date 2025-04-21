const express = require('express');
const db = require("../connectSV/index");
const router = express.Router();


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