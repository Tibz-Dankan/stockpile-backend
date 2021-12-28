const express = require("express");
const cors = require("cors");
const pool = require("./../dbConfig");
require("dotenv").config();
const app = express();
app.use(express.json());

app.use(cors() || cors({ origin: process.env.PRODUCTION_URL }));

// sending verification code to user email
app.post("/password-reset-code", async (req, res) => {
  try {
    const { passwordResetCode } = req.body;
    const sqlQuery = "SELECT * FROM registers WHERE verification_code =$1";
    await pool.connect();
    const response = await pool.query(sqlQuery, [passwordResetCode]);
    if (response.rows.length > 0) {
      res.send(response.rows[0]);
      console.log(
        "password reset code: " +
          response.rows[0].verification_code +
          " is correct and valid"
      );
    } else {
      console.log("password reset code is wrong !");
      res.send({
        PasswordRestCodeVerificationMsg: "Wrong Password reset code !",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = app;
