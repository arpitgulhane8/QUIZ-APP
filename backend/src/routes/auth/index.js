const express = require('express');
const router = express.Router();
const {signin,login} = require('../../controller/auth_controller');


//Loin route
router.post("/login",login);
// Register route
router.post("/register",signin);

module.exports = router;
