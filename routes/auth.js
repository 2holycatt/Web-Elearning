// var express = require('express');
// var router = express.Router();
// var passport = require('passport');
// var User = require('../models/user.model');
// var mongoose = require('mongoose');
// var teacherMiddleware = require("../middleware/teacherMiddleware");
// var studentMiddleware = require('../middleware/studentMiddleware');
// var GoogleStrategy = require('passport-google-oauth2').Strategy;
// var multer = require('multer');

// //Controller
// var profileController = require('../controller/profileController');

// //Google
// passport.use(new GoogleStrategy({
//   clientID: process.env['GOOGLE_CLIENT_ID'],
//   clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
//   callbackURL: '/oauth2/redirect/google',
//   scope: ['profile', 'email'],
//   passReqToCallback: true
// }, function verify(request, accessToken, refreshToken, profile, done) {
//   console.log(accessToken, profile);

//   // ตรวจสอบว่ามี email อยู่หรือไม่
//   if (!profile.emails || !profile.emails[0] || !profile.emails[0].value) {
//     return done(new Error('Email not found in Google profile'));
//   }

//   // ตรวจสอบว่ามี id อยู่หรือไม่
//   if (!profile.id) {
//     return done(new Error('ID not found in Google profile'));
//   }
//   // ดึงข้อมูลรูปภาพจาก Google Profile
//   const imageBuffer = getImageBuffer(profile);
//   // ใช้ Promise ในการค้นหาผู้ใช้
//   User.findOne({ googleId: profile.id })
//     .then((user) => {
//       if (!user) {
//         // Check if the user is a teacher based on some criteria (e.g., email domain)
//         const isTeacher = isTeacherProfile(profile);

//         // ใช้ Promise ในการบันทึกผู้ใช้ใหม่
//         return User.create({
//           googleId: profile.id,
//           email: profile.emails[0].value,
//           name: profile.displayName,
//           fname: profile.given_name,
//           lname: profile.family_name,
//           role: isTeacher ? 'teacher' : 'student',
//         });
//       } else {
//         return user;
//       }
//     })
//     .then((savedUser) => {
//       const user = {
//         id: savedUser.id,
//         name: savedUser.name,
//         fname: savedUser.fname,
//         lname: savedUser.lname,
//         role: savedUser.role,
//         email: savedUser.email,
//         img: savedUser.img
//       };
//       return done(null, user);
//     })
//     .catch((err) => {
//       return done(err);
//     });
// }));

// function isTeacherProfile(profile) {
//   // Check if 'emails' property is defined and not empty
//   if (profile && profile.emails && Array.isArray(profile.emails) && profile.emails.length > 0) {
//     return profile.emails.some(email => email.value.endsWith('@gmail.com'));
//   }
//   // If 'emails' is not defined or empty, default to false
//   return false;
// }

// // function isStudentProfile(profile) {
// //   // Check if 'emails' property is defined and not empty
// //   if (profile && profile.emails && Array.isArray(profile.emails) && profile.emails.length > 0) {
// //     return profile.emails.some(email => email.value.endsWith('@kkumail.com'));
// //   }
// //   // If 'emails' is not defined or empty, default to false
// //   return false;
// // }

// function getImageBuffer(profile) {
//   // ตรวจสอบว่ามีรูปภาพใน Profile หรือไม่
//   if (profile.photos && profile.photos[0] && profile.photos[0].value) {
//     // นำ URL ของรูปภาพมาดึง
//     const imageUrl = profile.photos[0].value;

//     // ดึงข้อมูลรูปภาพจาก URL
//     // ในกรณีนี้, ให้เรียกใช้งานฟังก์ชันที่ดึงข้อมูลรูปภาพและแปลงเป็น Buffer
//     const imageBuffer = fetchAndConvertImage(imageUrl);

//     return imageBuffer;
//   }

//   return null;
// }

// // ฟังก์ชันสำหรับดึงข้อมูลรูปภาพจาก URL และแปลงเป็น Buffer
// function fetchAndConvertImage(imageUrl) {
//   // ในกรณีนี้, คุณต้องใช้โมดูลที่รองรับการดึงข้อมูลรูปภาพจาก URL (เช่น axios, node-fetch) และแปลงเป็น Buffer
//   // ตัวอย่างเช่นใช้ axios
//   const axios = require('axios');

//   return axios
//     .get(imageUrl, { responseType: 'arraybuffer' })
//     .then((response) => Buffer.from(response.data, 'binary'))
//     .catch((error) => {
//       console.error('Error fetching image:', error);
//       return null;
//     });
// }

// passport.serializeUser(function (user, done) {
//   process.nextTick(function () {
//     done(null, {
//       id: user.id,
//       name: user.name,
//       fname: user.fname,
//       lname: user.lname,
//       role: user.role,
//       email: user.email,
//       img: user.img
//     });
//   });
// });

// passport.deserializeUser(function (user, done) {
//   process.nextTick(function () {
//     return done(null, user);
//   });
// });


// //multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'public/uploads'); // กำหนด directory ที่จะบันทึกไฟล์
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.png'); // กำหนดชื่อไฟล์
//   }
// });

// const upload = multer({ storage: storage }).single('profileImage');
// // module.exports = upload; // export ตัวแปร upload เพื่อให้ไฟล์อื่นสามารถนำไปใช้งานได้
// // Middleware ที่เรียกในทุก request
// router.use((req, res, next) => {
//   // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
//   if (req.isAuthenticated()) {
//     // ถ้าล็อกอินแล้ว, เรียก deserializeUser ของ Passport
//     passport.deserializeUser(req.user, (err, user) => {
//       if (err) {
//         return next(err);
//       }

//       // อัพเดท req.user ด้วยข้อมูลล่าสุด
//       req.user = user;

//       // ดึงข้อมูลผู้ใช้ล่าสุดจากฐานข้อมูล
//       User.findById(user.id)
//         .then((latestUser) => {
//           // ถ้าไม่พบผู้ใช้ล่าสุด, อาจจะต้อง handle ตามกรณี
//           if (!latestUser) {
//             return next(new Error('User not found'));
//           }

//           // อัพเดท req.user ด้วยข้อมูลล่าสุดที่ดึงมาจากฐานข้อมูล
//           req.user = {
//             id: latestUser.id,
//             name: latestUser.name,
//             fname: latestUser.fname,
//             lname: latestUser.lname,
//             role: latestUser.role,
//             email: latestUser.email,
//             img: latestUser.img
//           };

//           next();
//         })
//         .catch(next);
//     });
//   } else {
//     // ถ้ายังไม่ล็อกอิน, ไปต่อไป
//     next();
//   }
// });

// //Index
// // router.get('/', function (req, res, next) {
// //   if (!req.user) {
// //     // ถ้าผู้ใช้ไม่ได้ล็อกอิน
// //     return res.render('login');
// //   } else {
// //     return res.render('signup');
// //   }
// // });



// router.get('/student/', studentMiddleware, function (req, res, next) {
//   if (req.user) {
//     res.render('student_index', {
//       user: req.user
//     });
//   } else {
//     res.redirect('/login');
//   }
// });

// router.get('/adminIndex/', teacherMiddleware, function (req, res, next) {
//   if (req.user) {
//     res.render('adminIndex', {
//       user: req.user
//     });
//   } else {
//     res.redirect('/login');
//   }
// });


// // login
// router.get('/login', function (req, res, next) {
//   // ตรวจสอบว่าผู้ใช้ล็อกอินหรือไม่
//   if (req.isAuthenticated()) {
//     // ถ้าล็อกอินแล้ว, ดูว่าเป็นนักเรียนหรือครู
//     if (req.user.role === 'student') {
//       // Redirect ไปที่หน้านักเรียน
//       res.redirect('/student/');
//     } else if (req.user.role === 'teacher') {
//       // Redirect ไปที่หน้าครู
//       res.redirect('/adminIndex/');
//     }
//   } else {
//     // ถ้ายังไม่ล็อกอิน, แสดงหน้า log in
//     res.render('login');
//   }
// });

// //Google login
// router.get('/login/federated/google', passport.authenticate('google'));
// router.get('/oauth2/redirect/google', passport.authenticate('google', {
//   failureRedirect: '/login', // Redirect to home if authentication fails
// }), function (req, res) {
//   // Successful authentication, now handle role-specific redirect
//   if (req.user) {
//     // User is logged in
//     if (req.user.role === 'student') {
//       // Redirect to the student page if the user is a student
//       res.redirect('/student/');
//     } else if (req.user.role === 'teacher') {
//       // Redirect to the teacher page if the user is a teacher
//       res.redirect('/adminIndex/');
//     } else {
//       // Handle other roles if needed
//       res.redirect('/login');
//     }
//   } else {
//     // User is not logged in, redirect to home
//     res.redirect('/login');
//   }
// });

// // profile
// router.get('/profile', function (req, res) {
//   // ตรวจสอบสถานะล็อกอิน
//   if (req.user.role === 'student') {
//     // ถ้าเป็น role นักเรียน ให้ render profile_st
//     res.render('profile_st', { user: req.user });
//   } else if (req.user.role === 'teacher') {
//     // ถ้าเป็น role อาจารย์ ให้ render profile_t
//     res.render('profile_t', { user: req.user });
//   } else {
//     // ถ้าเป็น role อื่น ๆ ที่ไม่ได้ระบุ ให้เลือก render profile
//     res.redirect('/login');
//   };
// })

// //Edit profile
// router.get('/profile/edit', function (req, res) {
//   // ตรวจสอบสถานะล็อกอิน
//   if (req.user.role === 'student') {
//     // ถ้าเป็น role นักเรียน ให้ render profile_st
//     res.render('edit_profile_st', { user: req.user });
//   } else if (req.user.role === 'teacher') {
//     // ถ้าเป็น role อาจารย์ ให้ render profile_t
//     res.render('edit_profile_t', { user: req.user });
//   } else {
//     // ถ้าเป็น role อื่น ๆ ที่ไม่ได้ระบุ ให้เลือก render profile
//     res.redirect('/login');
//   };
// });

// router.post('/profile/edit', profileController.editProfile);

// //logout
// router.post('/logout', function (req, res, next) {
//   req.logout(function (err) {
//     if (err) { return next(err); }
//     res.redirect('/login');
//   });
// });


// module.exports = router;