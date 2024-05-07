const Lesson = require("../models/Lessons");
const Layout1 = require("../models/Layout1");
const fs = require('fs');
const path = require('path');
const Layout2 = require("../models/Layout2");
const Layout3 = require("../models/Layout3");
const Layout4 = require("../models/Layout4");
const Layout5 = require("../models/Layout5");
const Student = require("../models/student.model");
const SchoolYear = require("../models/schoolYear");
const PDFDocument = require('pdfkit');
const atob = require('atob');
const fontPath = path.join(__dirname, 'THSarabunNew.ttf'); // ระบุที่อยู่ของไฟล์ฟอนต์ THSarabun.ttf
const User = require("../models/user.model");
const multer = require('multer');
const upload = multer();

// const pdfjsLib = require('pdfjs-dist');
// const pdfjsWorker = require('pdfjs-dist/lib/pdfjs.worker');

// const path = require('path');
const adminIndex = async (req, res) => {
  try {
    const userData = await User.findById(req.session.userId);
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);
    console.log(userData);
    res.render("adminIndex", { lessons, lesson, userData });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const studentIndex = async (req, res) => {
  try {
    const userData = await User.findById(req.session.userId);
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);

    res.render("studentIndex", { lessons, lesson, userData });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const notLoggedIn = async (req, res) => {
  try {
    res.render("notLoggedIn");
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const manageStudent = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);

    res.render("manageStudent", { lessons, lesson });
    // res.json(allStudents);

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const uploadStudent = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);
    const allStudents = await Student.find().populate('user');
    res.render("upload-excelAndmanual", { lessons, lesson, allStudents });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const uploadStudent2 = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);

    res.render("upload-file-2", { lessons, lesson });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const getEditLessonNamePage = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);

    res.render("EditLessonNamePage", { lessons, lesson });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const editLessonName = async (req, res) => {
  try {
    const _id = req.body._id;

    const editNameNumber = {
      LessonName: req.body.LessonName,
      LessonNumber: req.body.LessonNumber
    }

    const result = await Lesson.findOneAndUpdate(
      { _id: _id },
      { $set: editNameNumber },
      { new: true }
    );

    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    res.render("adminLessonIndex", { mytitle: "adminLessonIndex", lessons });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}


const adminLessonIndex = async (req, res) => {
  try {
    const originPage = req.query.originPage;
    const lessons = await Lesson.find().sort({ createdAt: 1 }).populate("schoolYear");
    // console.log(lessons)
    const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
    const findYear = null;

    res.render("adminLessonIndex", { mytitle: "adminLessonIndex", lessons, originPage: originPage, schoolYears, findYear });

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const schoolYearRender = async (req, res) => {
  try {
    const originPage = req.query.originPage;
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
    const selectedYear = req.query.year;
    // console.log(selectedYear)
    const findYear = await SchoolYear.findOne({ schoolYear: selectedYear });
    res.redirect(`/adminLessonIndex?lessons=${JSON.stringify(lessons)}&originPage=${originPage}&findYear=${JSON.stringify(findYear)}`);


  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}


const addLesson = async (req, res) => {
  try {
    const schoolYearId = req.query.schoolYearId;
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
    res.render("addLesson", { mytitle: "addLesson", lessons, schoolYears, schoolYearId });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }

}

const copyLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).populate("schoolYear");
    const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
    const findYear = null;

    res.render("copyLessons", { mytitle: "copyLessons", lessons, schoolYears, findYear });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }

}

const createLayout = async function (req, res, next) {

  try {

    const schoolYear = req.body.schoolYear;
    const checkExists = await SchoolYear.findOne({ schoolYear });
    if (checkExists) {
      if (req.files && req.files.LessonImage) {

        const uploadedFile = req.files.LessonImage;
        const lessonCreate = new Lesson({
          LessonName: req.body.lessonName,
          LessonImage: {
            data: uploadedFile.data,
            contentType: uploadedFile.mimetype,
          },
          schoolYear: checkExists._id
        });
        await lessonCreate.save();
        const addId = await SchoolYear.findByIdAndUpdate(
          checkExists._id,
          { $push: { lessonArray: lessonCreate._id } },
          { new: true }
        );
        const schYear = addId.schoolYear;
        const lessons = await Lesson.find().sort({ createdAt: 1 }).populate("schoolYear");
        const lessonId = lessonCreate._id;
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
        // res.json(foundLayouts)
        // res.json(lay01_contents)
        res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear });
        // console.log(addId)
        // const lesson_id = lesson._id;
        // const lesson_name = lesson.lessonName;
        // res.render("adminCreateLayout", { mytitle: "adminCreateLayout", lesson, lesson_id, lesson_name });
      } else {
        const lessonCreate = new Lesson({
          LessonName: req.body.lessonName,
          schoolYear: checkExists._id
        });
        await lessonCreate.save();
        const addId = await SchoolYear.findByIdAndUpdate(
          checkExists._id,
          { $push: { lessonArray: lessonCreate._id } },
          { new: true }
        );
        const schYear = addId.schoolYear;

        // console.log(addId)
        const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
        const lessonId = lessonCreate._id;
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
        // res.json(foundLayouts)
        // res.json(lay01_contents)
        res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear });
        // res.render("adminCreateLayout", { mytitle: "adminCreateLayout", lesson, lesson_id, lesson_name });
      }
    } else if (!checkExists) {
      const creataSchoolYear = new SchoolYear({
        schoolYear: schoolYear
      });
      await creataSchoolYear.save()
      if (req.files && req.files.LessonImage) {
        const uploadedFile = req.files.LessonImage;

        const lessonCreate = new Lesson({
          LessonName: req.body.lessonName,
          LessonImage: {
            data: uploadedFile.data,
            contentType: uploadedFile.mimetype,
          },
          schoolYear: creataSchoolYear._id
        });
        await lessonCreate.save();
        const addId = await SchoolYear.findByIdAndUpdate(
          creataSchoolYear._id,
          { $push: { lessonArray: lessonCreate._id } },
          { new: true }
        );
        const schYear = addId.schoolYear;
        const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
        const lessonId = lessonCreate._id;
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
        // res.json(foundLayouts)
        // res.json(lay01_contents)
        res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear });
        // res.render("adminCreateLayout", { mytitle: "adminCreateLayout", lesson, lesson_id, lesson_name });
      } else {
        const lessonCreate = new Lesson({
          LessonName: req.body.lessonName,
          schoolYear: creataSchoolYear._id
        });
        await lessonCreate.save();
        const addId = await SchoolYear.findByIdAndUpdate(
          creataSchoolYear._id,
          { $push: { lessonArray: lessonCreate._id } },
          { new: true }
        );
        const schYear = addId.schoolYear;
        const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
        const lessonId = lessonCreate._id;
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
        // res.json(foundLayouts)
        // res.json(lay01_contents)
        res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear });
        // res.render("adminCreateLayout", { mytitle: "adminCreateLayout", lesson, lesson_id, lesson_name });
      }
    }


  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }

}



// const createLayout_01 = async (req, res) => {
//     try {
//         const { _id, Topic, MainDescription, SubDescription, title, ImageDescription } = req.body;
//         const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);

//         const Url = {
//           data: fs.readFileSync(filePath),
//         };

//         const newLayout = new Layout1({
//           Topic,
//           MainDescription,
//           SubDescription,
//           AboutImage: {
//             title,
//             Url,
//             ImageDescription,
//           },
//           LessonArrayObject: [{ LessonId: _id }],
//         });

//         const savedLayout = await newLayout.save();

//         const lessons = await Lesson.findByIdAndUpdate(
//           _id,
//           { $push: { LayOut1ArrayObject: savedLayout._id } },
//           { new: true }
//         );

//         res.redirect('addLesson');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("เกิดข้อผิดพลาด");
//     }
// };


const eachLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const lessonId = req.query.lessonId;
    const lesson = await Lesson.findById(lessonId).populate("schoolYear");
    const schYear = lesson.schoolYear.schoolYear;
    const layout01 = lesson.LayOut1ArrayObject;
    const layout02 = lesson.LayOut2ArrayObject;
    const layout03 = lesson.LayOut3ArrayObject;
    const layout04 = lesson.LayOut4ArrayObject;
    const layout05 = lesson.LayOut5ArrayObject;

    const getPdf = await Layout5.findById(layout05);
    const getFile = getPdf.file;

    // console.log(getFile);

    let pdfLists = [];
    for (const id of layout05) {
      const findLayout = await Layout5.findById(id);
    }

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
    const foundLayouts5 = await findLayoutsAndStoreData(layout05, Layout5);

    // console.log(foundLayouts5);

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
    // res.json(foundLayouts)
    // res.json(lay01_contents)
    res.render("eachLessons", { mytitle: "eachLessons", lesson, lessons, foundLayouts, schYear, getFile });
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}

const adminExamsIndex = async (req, res) => {
  try {
    res.render("adminExam");
  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }

}

const pdfDowload = async (req, res) => {
  try {
    const LayoutId = req.query.id;
    const layout = await Layout5.findById(LayoutId);
    if (!layout) {
      return res.status(404).send('Layout not found');
    }
    // สร้าง PDF
    const base64Data = layout.PdfFile.content.toString('base64');
    const buffer = Buffer.from(base64Data, 'base64');
    // สร้าง PDF
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', `inline; filename="${layout.PdfFile.filename}"`);
    // เขียนข้อมูลลงใน PDF
    doc.pipe(res);
    doc.font(fontPath) // กำหนดฟอนต์ภาษาไทย
      .fontSize(12)
      .text(buffer.toString('utf-8'), 100, 100); // แสดงข้อความ
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

const showFile = async (req, res) => {
  try {
    const pdfId = req.query.pdfId;
    // const { id } = req.params;
    const item = await Layout5.findById(pdfId);
    if (!item) {
      return next(new Error("No item found"));
    }
    const file = item.file;
    const filePath = path.join(__dirname, `../${file}`);
  
    // Set content type header
    res.setHeader('Content-Type', 'application/pdf');
  
    // Send the PDF file directly
    fs.createReadStream(filePath).pipe(res);

    // const base64String = Buffer.from(pdfData.PdfFile.content).toString('base64');
    // const blob = new Blob([base64String], { type: 'application/pdf' });
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'attachment; filename="' + pdfData.filename + '"');
    // res.send(blob);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving PDF');
  } 
};


module.exports = {
  adminIndex,
  adminLessonIndex,
  adminExamsIndex,
  addLesson,
  createLayout,
  eachLessons,
  getEditLessonNamePage,
  editLessonName,
  manageStudent,
  uploadStudent,
  uploadStudent2,
  schoolYearRender,
  copyLessons,
  pdfDowload,
  showFile,
  notLoggedIn,
  studentIndex
}