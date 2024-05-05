var Quiz = require('../models/quiz')
var User = require('../models/user.model')
const Student = require("../models/student.model");
const Teacher = require("../models/teacher.model")
const fs = require('fs');
const path = require('path');
const question1 = require("../models/question1");
const question2 = require("../models/question2");
const question3 = require("../models/question3");
const question4 = require("../models/question4");
const multer = require('multer');
const upload = multer();
const passport = require('passport');
const mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const Grid = require('gridfs-stream');
const { Readable } = require('stream');


exports.createQuiz = async (req, res) => {
  try {
    //   whoid = req.user.id;
    whoemail = req.user.email;
    const quiz = new Quiz({
      quizname: req.body.quizname,
      quizdescription: req.body.quizdescription,
      quizImage: req.body.quizImage,
      // owner: whoid,
      owneremail: whoemail
    });
    await quiz.save();
    res.redirect('/adminIndex/adminExamsIndex');
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "some error!" });
  }
}



exports.getUploadquiz = (req, res) => {
  Quiz.find({ owner: req.userId, upload: false }, (err, qz) => {
    if (err) {
      console.log(error);
      res.json({ msg: "some error!" });
    }
    else {
      res.json({ quiz: qz });
    }
  })
}

exports.seeStudent = (req, res) => {
  User.find({ role: "student" }, (err, usr) => {
    if (err) {
      console.log(error);
      res.json({ msg: "some error!" });
    }
    else {
      res.json({ user: usr });
    }
  })
}

// exports.createQuestion_1 = (req, res) => {

//     Question.find({ quizid: req.body.quizid }, (err, q) => {
//         if (err) {
//             console.log(error);
//             res.json({ msg: "some error!" });
//         }
//         else {
//             var question1 = new question1({
//                 quizid: req.body.quizid,
//                 questionId: q.length + 1,
//                 questionText: req.body.questionText,
//                 questionImage: req.body.questionImage,
//                 answer: req.body.answer,
//                 options: req.body.options
//             });

//             question1.save((error, qsn) => {
//                 if (error) {
//                     console.log(error);
//                     res.json({ msg: "some error!" });
//                 }
//                 else {
//                     res.status(200).json({ message: "yes question added!!" })
//                 }
//             })
//         }
//     })
// }

exports.uploadQuiz = (req, res) => {
  console.log("upload back");
  console.log(req.body);
  Question.find({ quizid: req.body.id }, (err, qz) => {
    if (err) {
      console.log(error);
      res.json({ msg: "some error!" });
    }
    else {
      console.log(qz.length);
      if (qz.length < 5) {
        res.json({ msg: "You must have 5 question in the quiz for upload quiz!!" });
      }
      else {
        Quiz.updateOne({ _id: req.body.id }, { upload: true }, function (err, user) {
          if (err) {
            console.log(err)
            res.json({ msg: "something went wrong!!" })
          }
          else {
            const io = req.app.get('io');
            io.emit("quizcrud", "Quiz Crud done here");
            res.json({ message: "quiz uploaded!" });
          }
        })

      }

    }
  })

}

exports.deleteQuiz = (req, res) => {
  var id = req.params.id
  // console.log(req.params.id);
  Quiz.deleteOne({ _id: id }, (err) => {
    if (err) {
      res.json({ msg: "Somthing went wrong!!" });
      console.log("err in delete by admin");
    }
  })
  Question.deleteMany({ quizid: id }, (err) => {
    if (err) {
      res.json({ msg: "Somthing went wrong!!" });
      console.log("err in delete by admin");
    }
  })
  const io = req.app.get('io');
  io.emit("quizcrud", "Quiz Curd done here");
  res.status(200).json({ msg: "yes deleted user by admin" })
}


exports.getHomequiz = (req, res) => {
  Quiz.find({ owner: req.userId, upload: true }, (err, qz) => {
    if (err) {
      console.log(error);
      res.json({ msg: "some error!" });
    }
    else {
      res.json({ quiz: qz });
    }
  })
}

exports.getAllQuestion = (req, res) => {
  // const url = `http://localhost:4200/teacher/seequestion`
  Question.find({ quizid: req.params.id }, (err, qz) => {
    if (err) {
      console.log(error);
      res.json({ errormsg: "some error!" });
    }
    else {
      res.json({ msg: qz });
    }
  })
  res.redirect(
    'adminExam')
}


exports.deleteQuestion = (req, res) => {
  var id = req.params.id
  Question.deleteOne({ _id: id }, (err) => {
    if (err) {
      res.json({ msg: "Somthing went wrong!!" });
      console.log("err in delete  question by admin");
    }
  })
  res.json({ msg: "yes deleted user by admin" })
}


exports.adminExamsIndex = async (req, res) => {
  try {
    const quiz = await Quiz.find().sort({ createdAt: 1 }).exec();
    res.render("adminExam", { mytitle: "adminExam", quiz, user: req.user }); // ถ้าไฟล์อยู่ในโฟลเดอร์ views
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}
// เพิ่มการแสดงหน้าสร้างแบบทดสอบ
exports.addQuizPage = async (req, res) => {
  if (req.user) {
    try {
      const quiz = await Quiz.find().sort({ createdAt: 1 }).exec();
      res.render("addQuiz", { mytitle: "addQuiz", quiz, user: req.user }); // เปลี่ยนชื่อหน้าตามที่คุณต้องการ
    } catch (err) {
      console.error(err);
      res.status(500).send("เกิดข้อผิดพลาด");
    }
  }
  else {
    res.redirect('/login');
  }
}

exports.eachQuizs = async (req, res) => {
  if (req.user) {
    try {
      const quizs = await Quiz.find().sort({ createdAt: 1 }).exec();
      const quizid = req.query.quizId;
      const quiz = await Quiz.findById(quizid);
      const question1 = quiz.question1ArrayObject;
      const question2 = quiz.question2ArrayObject;
      const question3 = quiz.question3ArrayObject;
      const question4 = quiz.question4ArrayObject;

      const foundQuestions = [];
      async function findQuestionsAndStoreData(deleteQuestions, Question) {

        if (deleteQuestions.length > 0) {
          for (const questionId of deleteQuestions) {
            const foundQuestion = await Question.findById(questionId);
            if (foundQuestion) {
              foundQuestions.push(foundQuestion);
            }
          }
        }

        return foundQuestions;
      }

      const foundQuestions1 = await findQuestionsAndStoreData(question1, question1);
      const foundQuestions2 = await findQuestionsAndStoreData(question2, question2);
      const foundQuestions3 = await findQuestionsAndStoreData(question3, question3);
      const foundQuestions4 = await findQuestionsAndStoreData(question4, question4);

      foundQuestions.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        if (dateA < dateB) {
          return -1;
        } else if (dateA > dateB) {
          return 1;
        } else {
          return 0;
        }
      });
      // res.json(foundLayouts)
      // res.json(lay01_contents)
      res.render("eachQuizs", { mytitle: "eachQuizs", quiz, quizs, foundQuestions, user: req.user });
    } catch (err) {
      console.error(err);
      res.status(500).send("เกิดข้อผิดพลาด");
    }
  }
  else {
    res.redirect('/login');
  }
}

exports.createQuestion = async function (req, res, next) {
  if (req.user.role === 'teacher') {
    try {
      if (req.files && req.files.quizImage) {
        const uploadedFile = req.files.quizImage;
        const quiz = new Quiz({
          quizname: req.body.quizname,
          quizImage: {
            data: uploadedFile.data,
            contentType: uploadedFile.mimetype,
          }
        });
        await quiz.save();
        const quiz_id = Quiz._id;
        const quiz_name = Quiz.quizName;
        res.render("adminCreateQuestion", { mytitle: "adminCreateQuestion", quiz, quiz_id, quiz_name, user: req.user });
      } else {
        const quiz = new Quiz({
          QuizName: req.body.quizname,
        });
        await quiz.save();
        const quiz_id = quiz._id;
        const quiz_name = quiz.quizname;
        res.render("adminCreateQuestion", { mytitle: "adminCreateQuestion", quiz, quiz_id, quiz_name, user: req.user });
      }

    } catch (err) {
      console.error(err);
      res.status(500).send("เกิดข้อผิดพลาด");
    }

  }
  else {
    res.redirect('/login');
  }
}