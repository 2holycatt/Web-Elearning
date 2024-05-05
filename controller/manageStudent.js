const multer = require('multer');
const xlsx = require('xlsx');
const upload = multer({ dest: 'uploads/' });

const Student = require("../models/student.model");
const User = require("../models/user.model");
const SchoolYear = require("../models/schoolYear");
const Lesson = require("../models/Lessons");
const { findByIdAndUpdate } = require('../models/Layout1');



const uploadedFile = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });

    for (let i = 1; i < data.length; i++) {
      const userData = {
        email: data[i][5],
        prefix: data[i][1],
        name: data[i][2],
        faculty: data[i][3],
        branch: data[i][4],
      };
      const filter = { email: userData.email };
      const update = { $set: userData };
      const options = { upsert: true, returnDocument: 'after' };

      const findEmail = await User.findOne(filter).populate({
          path: 'student',
          populate: { path: 'schoolYear' }
        });;

      console.log(findEmail);
      if (findEmail == undefined) {
        const newUser = new User(userData);
        await newUser.save();
        const userId = newUser._id;
        const studentData = {
          schoolId: data[i][0],
          yearLevel: data[i][7],
          user: userId
        }

        const newStudent = new Student(studentData);
        await newStudent.save(); // บันทึกข้อมูลลงในฐานข้อมูล
  
        const addedStdId = await User.findByIdAndUpdate(
          userId,
          { $push: { student: newStudent._id } },
          { new: true }
        );

        const schoolYear = data[i][6];
        const studentId = newStudent._id;
        const checkExists = await SchoolYear.findOne({ schoolYear });
        if (checkExists) {
          const getYear = checkExists.schoolYear;
          const addId = await SchoolYear.findByIdAndUpdate(
            checkExists._id,
            { $push: { students: studentId._id } },
            { new: true }
          );
  
          const addIdStudent = await Student.findByIdAndUpdate(
            studentId._id,
            { $push: { schoolYear: checkExists._id } },
            { new: true }
          );
        } else if (!checkExists) {
          const creataSchoolYear = new SchoolYear({
            schoolYear: schoolYear
          });
          await creataSchoolYear.save()
          const getYear2 = creataSchoolYear.schoolYear;
          const addId = await Student.findByIdAndUpdate(
            studentId._id,
            { $push: { schoolYear: studentId._id } },
            { new: true }
          );
        } const findUser = await User.findById(userId).populate({
          path: 'student',
          populate: { path: 'schoolYear' } // populate ข้อมูล SchoolYear ใน Student ใน User
        });

        
        // const findUser = await User.findById(userId).populate('student').populate('schoolYear');
        // console.log("email ไม่ซ้ำกัน");
        // console.log(findUser);
      } else {
        // console.log("email ซ้ำกัน");
        // console.log(findEmail);
        const updatedUser = await User.findOneAndUpdate(filter, update, options);
        // const getStudentId = findEmail.student;
        // const studentData = {
        //   schoolId: data[i][0],
        //   yearLevel: data[i][7],
        // }
        // const updateStud = { $set: studentData };
        // const optionsStd = { upsert: true, returnDocument: 'after' };
        // const updatedStudent = await Student.findByIdAndUpdate(getStudentId, updateStud, optionsStd);
        const schoolYear = data[i][6];
        // console.log("ปีเก่า = "+ findEmail.student.schoolYear.schoolYear);
        // console.log("ปีใหม่ = "+ schoolYear);
        // const convertToStringYear = schoolYear.toString();
        const schoolYearObject = { schoolYear: data[i][6] };
        const oldYear = findEmail.student.schoolYear.schoolYear;
        if (schoolYear != oldYear) {
          const findYear = await SchoolYear.findOne(schoolYearObject);
          if (findYear) {
            const updatedYear = await Student.findByIdAndUpdate(
              { _id: findEmail.student._id },
              { $set: { schoolYear: findYear._id } },
              { new: true }
            );
          } else if (!findYear) {
            const creataSchoolYear = new SchoolYear({
              schoolYear: schoolYear
            });
            await creataSchoolYear.save()
            const getYear2 = creataSchoolYear.schoolYear;
            const addId = await Student.findByIdAndUpdate(
              { _id: findEmail.student._id },
              { $push: { schoolYear: findYear._id } },
              { new: true }
            );
          }
        }
        // const findSchoolYear = await SchoolYear.findOne({schoolYear});
        // const getSchoolYearNumber = await 
        // if (schoolYear != findEmail.student.)

      }

    }
    res.redirect('/adminIndex/uploadStudent');
    // res.json(findEmail);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

const uploadedForm = async (req, res) => {
  try {
    const getfname = req.body.fname;
    const getlname = req.body.lname;

    const newUser = new User({
      email: req.body.email,
      prefix: req.body.prefix,
      name: getfname + " " + getlname,
      faculty: req.body.faculty,
      branch: req.body.branch,
    })
    await newUser.save();

    const getUserId = newUser._id;

    const newStudent = new Student({
      schoolId: req.body.studentId,
      studentSchoolYear: req.body.schoolYears,
      user: getUserId,
    });
    await newStudent.save(); // บันทึกข้อมูลลงในฐานข้อมูล
    res.redirect('/adminIndex/uploadStudent');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

const editAccount = async (req, res) => {
  try {

    const stuId = req.query.stuId;
    const stuInfo = await Student.findById(stuId).populate("user");
    const getName = stuInfo.user.name;
    const separatedNames = getName.split(" ");

    const firstName = separatedNames[0];
    const lastName = separatedNames[1];
    const getSchoolYear = stuInfo.schoolYear;
    // console.log(getSchoolYear);
    const findSchool = await SchoolYear.findById(getSchoolYear);
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getLessonId = req.query.lessonId;
    const lesson = await Lesson.findById(getLessonId);
    const allStudents = await Student.find().populate('user');

    res.render("editStudentAccount", { lessons, lesson, allStudents, stuInfo, findSchool, firstName, lastName });
    // res.render("editStudentAccount", { mytitle: "editStudentAccount", lesson, lessons, foundLayouts });

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};

const doEditAccount = async (req, res) => {
  try {

    const stu_id = req.body._id;
    // console.log(stu_id);
    const getUser2 = await Student.findById(stu_id).populate("user");
    const getIduser = getUser2.user;
    const getfname = req.body.fname;
    const getlname = req.body.lname;

    const updatedData = {
      email: req.body.email,
      prefix: req.body.prefix,
      name: getfname + " " + getlname,
      faculty: req.body.faculty,
      branch: req.body.branch,
    }

    const result = await User.findOneAndUpdate(
      { _id: getIduser },
      { $set: updatedData },
      { new: true }
    );

    const updatedData2 = {
      schoolId: req.body.studentId,
      studentSchoolYear: req.body.schoolYears,
    }

    const result2 = await Student.findOneAndUpdate(
      { _id: stu_id },
      { $set: updatedData2 },
      { new: true }
    );

    // const stuId = req.query.stuId;
    // const stuInfo = await Student.findById(stuId).populate("user");
    // const getSchoolYear = stuInfo.schoolYear;
    // // console.log(getSchoolYear);
    // const findSchool = await SchoolYear.findById(getSchoolYear);
    // const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    // const getLessonId = req.query.lessonId;
    // const lesson = await Lesson.findById(getLessonId);
    // const allStudents = await Student.find().populate('user');
    res.redirect('/adminIndex/uploadStudent');
    // res.render("editStudentAccount", { mytitle: "editStudentAccount", lesson, lessons, foundLayouts });

  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
};
module.exports = {
  uploadedFile,
  upload,
  uploadedForm,
  editAccount,
  doEditAccount
};


