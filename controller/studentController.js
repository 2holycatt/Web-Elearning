var Quiz = require('../models/quiz')
var User = require('../models/user.model')
var Student = require('../models/student.model')
var question1 = require('../models/question1')
const multer = require('multer');
const upload = multer();
const passport = require('passport');
var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

// exports.get('/student/', studentMiddleware,function(req, res, next) {
//     if(req.user){
//     res.render('student_index',{
//       user: req.user
//     });
//   }else{
//     res.redirect('/login');
//   }});
exports.studentIndex = async (req, res) => {
    if (req.user.role === 'student') {
    try {
  
      res.render("student_index", { lessons, lesson },{user: req.user} );
    } catch (err) {
      console.error(err);
      res.status(500).send("เกิดข้อผิดพลาด");
    }
  }
    else{
      res.redirect('/login');
    }
  }

exports.getallquiz = (req, res) => {
    if(req.user){
    Quiz.find({upload:true}, (err, qz) => {
        if (err) {
            console.log(error);
            res.json({ msg: "some error!" });
        }
        else {
            res.json({ quiz: qz });
        }
    })
}
else{
    res.redirect('/login');
}
}

exports.getAllQuestion = (req, res) => {
if(req.user){
    Question.find({ quizid: req.params.id }, (err, qz) => {
        if (err) {
            console.log(error);
            res.json({ errormsg: "some error!" });
        }
        else {
            res.json({ msg: qz });
        }
    })
}
else{
    res.redirect('/login');
}
}