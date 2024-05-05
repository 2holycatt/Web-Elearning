var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user.model');

const editProfile = (req, res) => {
    // ตรวจสอบสถานะล็อกอิน
    if (req.user) {
      // ถ้าล็อกอินแล้ว
      // ดึงข้อมูลที่แก้ไขจาก req.body
      const { fname, lname } = req.body;
  
      // ทำการอัปเดตข้อมูลที่แก้ไขลงในฐานข้อมูล
      User.findByIdAndUpdate(req.user.id, { fname, lname }, { new: true })
        .then((updatedUser) => {
          // หลังจากอัปเดตแล้ว, สามารถ redirect กลับไปที่หน้า profile หรือหน้าอื่น ๆ ตามที่คุณต้องการ
          res.redirect('/profile');
        })
        .catch((error) => {
          // หากเกิดข้อผิดพลาดในการอัปเดต, คุณสามารถจัดการตามที่คุณต้องการ
          console.error(error);
          res.redirect('/profile');
        });
    } else {
      // ถ้ายังไม่ล็อกอิน ให้ redirect ไปยังหน้า login
      res.redirect('/login');
    }
};

module.exports = { editProfile };