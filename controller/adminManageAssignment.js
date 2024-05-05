const Assignments = require("../models/Assignments");
const asyncWrapper = require("../middleware/asyncWrapper");
const Lesson = require("../models/Lessons");
const Student = require("../models/student.model");
const moment = require('moment');
const path = require('path');
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const SchoolYear = require("../models/schoolYear");

const assignmentIndex = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const schoolYear = await SchoolYear.find();
    // สร้างฟังก์ชันสำหรับการแปลงวันที่ในแต่ละ object ในอาร์เรย์
    const formatAssignmentDates = (assignments) => {
      return assignments.map(assignment => {
        const formattedStartDate = moment(assignment.StartDate).format('DD/MM/YYYY hh:mm A');
        const formattedDeadline = moment(assignment.Deadline).format('DD/MM/YYYY hh:mm A');

        return {
          ...assignment,
          StartDate: formattedStartDate,
          Deadline: formattedDeadline
        };
      });
    };
    const assignments = await Assignments.find().populate("schoolYear").sort({ createdAt: 1 }).exec();
    const formattedAssignments = formatAssignmentDates(assignments);
    // res.json(formattedAssignments);
    //ใช้ตอนแสดงผล
    // const getStartTimeMoment12h = moment(getStartTime).format('DD/MM/YYYY hh:mm A');
    // const getEndTimeMoment12h = moment(getendTime).format('DD/MM/YYYY hh:mm A');
    res.render('assignmentIndex', { lessons, formattedAssignments, schoolYear });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}

const assignmentDetail = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getAssignId = req.query.id;
    const assignment = await Assignments.findById(getAssignId).populate("schoolYear");;
    const formattedStartDate = moment(assignment.StartDate).format('DD/MM/YYYY hh:mm A');
    const formattedDeadline = moment(assignment.Deadline).format('DD/MM/YYYY hh:mm A');
    const schoolYear = await SchoolYear.find();
    const updatedFiles = assignment.files.map(filePath => {
      const { file } = filePath;
      const fileName = file.slice(33); // นำ string ตั้งแต่ตำแหน่งที่ 33 เป็นต้นไป
      return fileName;
    });

    res.render('assignmentDetail', { schoolYear, lessons, assignment, updatedFiles, formattedStartDate, formattedDeadline });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}

const uploadAssignments = asyncWrapper(async (req, res) => {
  try {

    const { name, Description, StartDate, Deadline, Score, schoolYear } = req.body;
    const files = req.files;
    const checkExists = await SchoolYear.findOne({ schoolYear });
    // console.log(files);
    // res.json(files);

    if (checkExists) {
      const saveAssign = new Assignments({
        name,
        Description,
        StartDate,
        Deadline,
        Score,
        schoolYearNumber: schoolYear,
        schoolYear: checkExists._id
      });
      // const filePaths = files.map(file => file.path);
      const fileData = files.map(files => {
        return {
          file: files.path,
          contentType: files.mimetype
        };
      });
      await saveAssign.save();
      const assignId = saveAssign._id;
      for (const i of fileData) {
        const updatedAssign = await Assignments.findByIdAndUpdate(
          assignId,
          { $push: { files: i } },
          { new: true }
        );
      }

      const addAssignId = await SchoolYear.findByIdAndUpdate(
        checkExists._id,
        { $push: { Assignments: saveAssign._id } },
        { new: true }
      );
    } else if (!checkExists) {
      const creataSchoolYear = new SchoolYear({
        schoolYear: schoolYear
      });
      await creataSchoolYear.save()

      const saveAssign = new Assignments({
        name,
        Description,
        StartDate,
        Deadline,
        Score,
        schoolYearNumber: schoolYear,
        schoolYear: creataSchoolYear._id
      });
      // const filePaths = files.map(file => file.path);
      const fileData = files.map(files => {
        return {
          file: files.path,
          contentType: files.mimetype
        };
      });
      await saveAssign.save();
      const assignId = saveAssign._id;
      for (const i of fileData) {
        const updatedAssign = await Assignments.findByIdAndUpdate(
          assignId,
          { $push: { files: i } },
          { new: true }
        );
      }

      const addAssignId = await SchoolYear.findByIdAndUpdate(
        creataSchoolYear._id,
        { $push: { Assignments: saveAssign._id } },
        { new: true }
      );

    }



    res.redirect('/adminIndex/assignmentIndex')

  } catch (error) {
    console.error(error);
    res.status(500).send('เกิดข้อผิดพลาดในการอัปโหลดและเขียนลงในฐานข้อมูล');
  }
});

const showFileArray = async (req, res) => {
  try {
    const assignId = req.query.id;
    const fileIndex = req.query.index;
    const assignment = await Assignments.findById(assignId);
    const getFiles = assignment.files[fileIndex];
    const contentType = getFiles.contentType;
    const getFilePath = assignment.files[fileIndex].file;
    const filePath = path.join(__dirname, `../${getFilePath}`); // เส้นทางไฟล์

    // Set content type header
    res.setHeader('Content-Type', `${contentType}`);
    const fileName = getFilePath.slice(33);
    res.attachment(fileName);

    // Send the file directly
    fs.createReadStream(filePath).pipe(res);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file');
  }
}

const delFile = async (req, res) => {
  try {
    const getAssignId = req.query.assignId;
    const getIndex = req.query.fileIndex;

    const assign = await Assignments.findById(getAssignId).populate("schoolYear");
    const schoolYearId = assign.schoolYear._id;
    const fileNameToDelete = assign.files[getIndex].file;
    const filePath = fileNameToDelete;
    const deletedFileId = assign.files[getIndex]._id;
    const assignId = assign._id

    // ลบไฟล์
    unlinkFile(filePath)
      .then(() => {
        console.log('File deleted successfully');
        return Assignments.findByIdAndUpdate(getAssignId, {
          $pull: {
            files: { _id: deletedFileId }
          }
        });
      })
      .then(() => {
        console.log('File object deleted from MongoDB successfully');
        res.redirect('/adminIndex/assignmentDetail?id=' + getAssignId);
        // ทำ process อื่น ๆ ต่อไปที่คุณต้องการ

      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error deleting file');
      });

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file');
  }
}

const editAssign = async (req, res) => {
  try {
    const { assignId, name, Description, Score, StartDate, Deadline, schoolYear } = req.body;
    const getFiles = req.files;
    // const checkExists = await SchoolYear.findOne({ schoolYear });

    // if (checkExists) {
    if (StartDate != "" || Deadline != "") {
      const updatedAssignment = await Assignments.findByIdAndUpdate(assignId, {
        name: name,
        Description: Description,
        Score: Score,
        StartDate: StartDate,
        Deadline: Deadline,
      },
        { new: true });
    } else if (StartDate == "" || Deadline == "") {
      const updatedAssignment = await Assignments.findByIdAndUpdate(assignId, {
        name: name,
        Description: Description,
        Score: Score,

      },
        { new: true });
    }

    const fileData = getFiles.map(files => {
      return {
        file: files.path,
        contentType: files.mimetype
      };
    });
    for (const i of fileData) {

      const updatedAssign = await Assignments.findByIdAndUpdate(
        assignId,
        { $push: { files: i } },
        { new: true }
      );
    }



    res.redirect('/adminIndex/assignmentDetail?id=' + assignId);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving file');
  }
}

const delAssign = async (req, res) => {
  const getAssignId = req.query.assignId;
  const assign = await Assignments.findById(getAssignId);

  const files = assign.files;
  // res.json(files);
  for (const i of files) {
    unlinkFile(i.file)
      .then(() => {
        return Assignments.findByIdAndUpdate(getAssignId, {
          $pull: {
            files: { _id: i._id }
          }
        });
      })
  }

  const deleteAssign = await Assignments.findByIdAndDelete(getAssignId);
  res.redirect('/adminIndex/assignmentIndex');
};

const submitDetail = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    const getAssignId = req.query.id;
    const assignment = await Assignments.findById(getAssignId).populate("schoolYear");;
    const formattedStartDate = moment(assignment.StartDate).format('DD/MM/YYYY hh:mm A');
    const formattedDeadline = moment(assignment.Deadline).format('DD/MM/YYYY hh:mm A');
    const schoolYear = await SchoolYear.find();
    const updatedFiles = assignment.files.map(filePath => {
      const { file } = filePath;
      const fileName = file.slice(33); // นำ string ตั้งแต่ตำแหน่งที่ 33 เป็นต้นไป
      return fileName;
    });

    res.render('submitDetail', { schoolYear, lessons, assignment, updatedFiles, formattedStartDate, formattedDeadline });

  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}

module.exports = {
  uploadAssignments,
  assignmentIndex,
  assignmentDetail,
  showFileArray,
  delFile,
  editAssign,
  delAssign,
  submitDetail
}