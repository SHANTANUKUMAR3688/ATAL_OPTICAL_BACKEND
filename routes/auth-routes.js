const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/auth-Controller");
const { sendMail } = require("../controller/mail-controller");

router.post("/register", register);
router.post("/login", login);
router.post('/send-mail', sendMail);

module.exports = router;
