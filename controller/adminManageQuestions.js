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

const mongoose = require('mongoose');

const multer = require('multer');
const upload = multer();

const Grid = require('gridfs-stream');
const { Readable } = require('stream');

const createQuestion_1 = async function (req, res, next) {
    try {
        // ใน express-fileupload, ไฟล์ที่อัปโหลดจะถูกเก็บใน req.files
        const files = req.files;
        // if (!files || !files.Url || !files.Url[0]) {
        //     return res.status(400).send('ไม่พบไฟล์ "Url1" ที่อัปโหลด');
        // }
        const questionCounter = req.body.questionCounter;
        const _id = req.body._id;
        // console.log(_id);

        const uploadedFile = req.files.Url;

        // แน่ใจว่า Layout1 ถูก require และอ้างถึงในโค้ดของคุณ
        const newQuestion1 = await new Question1({
            questionText: req.body.questionText,
            options: req.body.options,
            answer: req.body.answer,
            questionImage: [{
                title: req.body.title,
                Url: {
                    data: uploadedFile.data,
                    contentType: uploadedFile.mimetype,
                },
                ImageDescription: req.body.ImageDescription
            }],
            quizArrayObject: [{
                quizid: _id
            }]
        });

        const savedQuestion1 = await newQuestion1.save();
        const question1_id = savedQuestion1._id;
        // ในส่วนที่ใช้ layoutCounter
        for (let i = 1; i <= questionCounter; i++) {
            const uploadedFile = req.files[`Url${i}`];

            const updatedContentQuestion1 = {
                title: req.body[`title${i}`],
                Url: {
                    data: uploadedFile.data,
                    contentType: uploadedFile.mimetype,
                },
                ImageDescription: req.body[`ImageDescription${i}`]
            };

            await question1.findByIdAndUpdate(
                question1_id,
                { $push: { questionImage: updatedContentQuestion1 } },
                { new: true }
            );
        }

        const getQuestion1_Id = savedQuestion1._id;
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            _id,
            { $push: { question1ArrayObject: getQuestion1_Id } },
            { new: true }
        );

        const quizs = await Quiz.find().sort({ createdAt: 1 }).exec();
      const quizid = req.query.quizid;
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

        // res.json(savedLayout1);
        res.render("nextCreateQuestion", { mytitle: "nextCreateQuestion", quiz, quizs, foundQuestions });
    } catch (err) {
        console.error(err);
        res.status(500).send("เกิดข้อผิดพลาด");
    }
};
const createLayout_02 = async function (req, res, next) {
    try {
        const _id = req.body._id;
        const newLayout02 = await new Layout2({
            Topic: req.body.Topic,
            TextArea1: req.body.TextArea1,
            TextArea2: req.body.TextArea2,
            TextArea3: req.body.TextArea3,

            LessonArrayObject: [{
                LessonId: _id
            }]
        });

        const savedLayout2 = await newLayout02.save();
        const getLayout02_Id = savedLayout2._id;
        const updatedLesson = await Lesson.findByIdAndUpdate(
            _id,
            { $push: { LayOut2ArrayObject: getLayout02_Id } },
            { new: true }
        );
        const lessons = await Lesson.find().sort({ LessonNumber: 1 }).exec();
        const lesson = await Lesson.findById(_id);
        const layout01 = lesson.LayOut1ArrayObject;
        const layout02 = lesson.LayOut2ArrayObject;
        const layout03 = lesson.LayOut3ArrayObject;
        const layout04 = lesson.LayOut4ArrayObject;
        const foundLayouts = [];

        async function findLayoutsAndStoreData(deleteLayouts, Layout) {

            if (deleteLayouts.length > 0) {
                for (const layoutId of deleteLayouts) {
                    const foundLayout = await Layout.findById(layoutId);
                    if (foundLayout) {
                        foundLayouts.push(foundLayout);
                    }
                }
            }

            return foundLayouts;
        }

        const foundLayouts1 = await findLayoutsAndStoreData(layout01, Layout1);
        const foundLayouts2 = await findLayoutsAndStoreData(layout02, Layout2);
        const foundLayouts3 = await findLayoutsAndStoreData(layout03, Layout3);
        const foundLayouts4 = await findLayoutsAndStoreData(layout04, Layout4);

        foundLayouts.sort((a, b) => {
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

        // res.json(savedLayout1);
        res.render("nextCreateLayout", { mytitle: "nextCreateLayout", lesson, lessons, foundLayouts });

    } catch (err) {
        console.error(err);
        res.status(500).send("เกิดข้อผิดพลาด");
    }
}


const getMoreAddContent = async (req, res) => {
    try {
        const lessons = await Lesson.find().sort({ LessonNumber: 1 }).exec();
        const lessonId = req.query.lesson;
        const lesson = await Lesson.findById(lessonId);
        const layout01 = lesson.LayOut1ArrayObject;
        const layout02 = lesson.LayOut2ArrayObject;
        const layout03 = lesson.LayOut3ArrayObject;
        const layout04 = lesson.LayOut4ArrayObject;
        const foundLayouts = [];

        async function findLayoutsAndStoreData(deleteLayouts, Layout) {

            if (deleteLayouts.length > 0) {
                for (const layoutId of deleteLayouts) {
                    const foundLayout = await Layout.findById(layoutId);
                    if (foundLayout) {
                        foundLayouts.push(foundLayout);
                    }
                }
            }

            return foundLayouts;
        }

        const foundLayouts1 = await findLayoutsAndStoreData(layout01, Layout1);
        const foundLayouts2 = await findLayoutsAndStoreData(layout02, Layout2);
        const foundLayouts3 = await findLayoutsAndStoreData(layout03, Layout3);
        const foundLayouts4 = await findLayoutsAndStoreData(layout04, Layout4);

        foundLayouts.sort((a, b) => {
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


        res.render("getMoreAddContent", { mytitle: "getMoreAddContent", lesson, lessons, foundLayouts,user:req.user });
        // res.json(lesson);

    } catch (err) {
        console.error(err);
        res.status(500).send("เกิดข้อผิดพลาด");
    }
};

const createLayout03 = async (req, res) => {
    try {
        // รับข้อมูลจากฟอร์ม
        const { _id, Topic } = req.body;
        const { FileForm } = req.files;
        //   console.log(FileForm);

        if (!FileForm) {
            return res.status(400).json({ error: 'กรุณาเลือกไฟล์' });
        }

        // สร้าง Layout4 object
        const newLayout = new Layout3({
            Description: Topic,
            File: {
                data: FileForm.data,
                metadata: {
                    contentType: FileForm.mimetype,
                    size: FileForm.size,
                },
            },
            LessonArrayObject: {
                LessonId: _id
            }
        });

        // บันทึกลงในฐานข้อมูล
        const savedLayout = await newLayout.save();
        const getLayout02_Id = savedLayout._id;

        const updatedLesson = await Lesson.findByIdAndUpdate(
            _id,
            { $push: { LayOut3ArrayObject: getLayout02_Id } },
            { new: true }
        );

        const lessons = await Lesson.find().sort({ LessonNumber: 1 }).exec();
        const lesson = await Lesson.findById(_id);
        const layout01 = lesson.LayOut1ArrayObject;
        const layout02 = lesson.LayOut2ArrayObject;
        const layout03 = lesson.LayOut3ArrayObject;
        const layout04 = lesson.LayOut4ArrayObject;
        const foundLayouts = [];

        async function findLayoutsAndStoreData(deleteLayouts, Layout) {

            if (deleteLayouts.length > 0) {
                for (const layoutId of deleteLayouts) {
                    const foundLayout = await Layout.findById(layoutId);
                    if (foundLayout) {
                        foundLayouts.push(foundLayout);
                    }
                }
            }

            return foundLayouts;
        }

        const foundLayouts1 = await findLayoutsAndStoreData(layout01, Layout1);
        const foundLayouts2 = await findLayoutsAndStoreData(layout02, Layout2);
        const foundLayouts3 = await findLayoutsAndStoreData(layout03, Layout3);
        const foundLayouts4 = await findLayoutsAndStoreData(layout04, Layout4);

        foundLayouts.sort((a, b) => {
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

        // res.json(savedLayout1);
        res.render("nextCreateLayout", { mytitle: "nextCreateLayout", lesson, lessons, foundLayouts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
};

const createLayout04 = async (req, res) => {
    try {
        // รับข้อมูลจากฟอร์ม
        const { _id, Topic, Description,list, layoutCounter2 } = req.body;
        const newLayout04 = new Layout4({
            Topic: Topic,
            Description: Description,
            list: list,
            LessonArrayObject: {
                LessonId: _id
            }
        });

        // บันทึกลงในฐานข้อมูล
        const savedLayout4 = await newLayout04.save();
        const layout04_id = savedLayout4._id;

        for (let i = 1; i <= layoutCounter2; i++) {
            const updatedContentLayout04 = {
              list: req.body[`list${i}`]
            };
          
            await Layout4.findByIdAndUpdate(
              layout04_id,
              { $push: { Lists: updatedContentLayout04 } },
              { new: true }
            );
          }

        const updatedLesson = await Lesson.findByIdAndUpdate(
            _id,
            { $push: { LayOut4ArrayObject: layout04_id } },
            { new: true }
        );

        const lessons = await Lesson.find().sort({ LessonNumber: 1 }).exec();
        const lesson = await Lesson.findById(_id);
        const layout01 = lesson.LayOut1ArrayObject;
        const layout02 = lesson.LayOut2ArrayObject;
        const layout03 = lesson.LayOut3ArrayObject;
        const layout04 = lesson.LayOut4ArrayObject;
        const foundLayouts = [];

        async function findLayoutsAndStoreData(deleteLayouts, Layout) {

            if (deleteLayouts.length > 0) {
                for (const layoutId of deleteLayouts) {
                    const foundLayout = await Layout.findById(layoutId);
                    if (foundLayout) {
                        foundLayouts.push(foundLayout);
                    }
                }
            }

            return foundLayouts;
        }

        const foundLayouts1 = await findLayoutsAndStoreData(layout01, Layout1);
        const foundLayouts2 = await findLayoutsAndStoreData(layout02, Layout2);
        const foundLayouts3 = await findLayoutsAndStoreData(layout03, Layout3);
        const foundLayouts4 = await findLayoutsAndStoreData(layout04, Layout4);

        foundLayouts.sort((a, b) => {
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

        // res.json(savedLayout1);
        res.render("nextCreateLayout", { mytitle: "nextCreateLayout", lesson, lessons, foundLayouts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
};
module.exports = {
    createQuestion_1,
    getMoreAddContent,
    createLayout_02,
    createLayout03,
    createLayout04
}
