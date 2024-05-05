var express = require('express');
var router = express.Router();
const LoginController = require("../controller/Login");
const adminController = require("../controller/adminController");
const adminEditDelete = require("../controller/adminEditDeleteController");
const adminManageLayouts = require("../controller/adminManageLayouts");
const manageStudent = require("../controller/manageStudent");
const assignmentsController = require("../controller/adminManageAssignment");

// Middleware For Files Uploading
const upload = require("../middleware/multer");

// Middleware For Login System
const redirectIfAuth = require("../middleware/redirectIfAuth");
const studentMiddleware = require("../middleware/studentMiddleware");
const teacherMiddleware = require("../middleware/teacherMiddleware");

// Not Logged in Routes
router.get('/', redirectIfAuth, adminController.notLoggedIn);
router.get('/login', redirectIfAuth, LoginController.ifNotLoggedIn);
router.get('/logout', LoginController.logout);


// Login Process
router.post('/loginToWeb', LoginController.loginPage);
router.post('/saveInfoStudent', LoginController.saveInfoStudent);

// Admin Center Router
router.get('/adminIndex', teacherMiddleware, adminController.adminIndex);
router.get('/adminIndex/adminLessonIndex', teacherMiddleware, adminController.adminLessonIndex);
router.get('/adminIndex/manageStudent', teacherMiddleware, adminController.manageStudent);
router.get('/adminIndex/uploadStudent', teacherMiddleware, adminController.uploadStudent);
router.get('/adminIndex/uploadStudent2', teacherMiddleware, adminController.uploadStudent2);
router.get('/adminIndex/schoolYearRender', teacherMiddleware, adminController.schoolYearRender);
router.get('/adminIndex/addLesson', teacherMiddleware, adminController.addLesson);
router.get('/adminIndex/getEditLessonNamePage', teacherMiddleware, adminController.getEditLessonNamePage);
router.post('/adminIndex/editLessonName', adminController.editLessonName);
router.get('/adminIndex/pdfDowload', teacherMiddleware, adminController.pdfDowload);
router.get('/adminIndex/showFile', teacherMiddleware, adminController.showFile);
router.post('/adminIndex/createLayout', adminController.createLayout);
router.get('/adminIndex/eachLessons', teacherMiddleware, adminController.eachLessons)
router.get('/adminIndex/copyLessons', teacherMiddleware, adminController.copyLessons)


//Admin Assignments Router
router.get('/adminIndex/showFileArray', teacherMiddleware, assignmentsController.showFileArray);
router.get('/adminIndex/assignmentIndex', teacherMiddleware, assignmentsController.assignmentIndex);
router.get('/adminIndex/assignmentDetail', teacherMiddleware, assignmentsController.assignmentDetail);
router.get('/adminIndex/delFile', teacherMiddleware, assignmentsController.delFile);
router.get('/adminIndex/delAssign', teacherMiddleware, assignmentsController.delAssign);
router.get('/adminIndex/submitDetail', teacherMiddleware, assignmentsController.submitDetail);

const { uploadAssignments, editAssign } = require("../controller/adminManageAssignment");
router.route('/adminIndex/uploadAssignments').post(upload.array("file"), uploadAssignments);
router.route('/adminIndex/editAssign').post(upload.array("file"), editAssign);

//Admin Layout Manangement
router.post('/adminIndex/createLayout_01', adminManageLayouts.createLayout_01);
router.post('/adminIndex/createLayout_02', adminManageLayouts.createLayout_02);
router.post('/adminIndex/createLayout_03', adminManageLayouts.createLayout03);
router.post('/adminIndex/createLayout_04', adminManageLayouts.createLayout04);
router.get('/adminIndex/getMoreAddContent', teacherMiddleware, adminManageLayouts.getMoreAddContent);
router.post('/adminIndex/copyLessons', adminManageLayouts.copyLessons);
router.get('/adminIndex/deleteLesson', teacherMiddleware, adminEditDelete.deleteLesson);
router.get('/adminIndex/editLesson', teacherMiddleware, adminEditDelete.editLesson)
router.post('/adminIndex/makeEdit', adminEditDelete.makeEdit)
router.post('/adminIndex/makeEdit2', adminEditDelete.makeEdit2)
router.post('/adminIndex/makeEdit3', adminEditDelete.makeEdit3)
router.get('/adminIndex/deleteLayout', teacherMiddleware, adminEditDelete.deleteLayout)

const { createLayout_05 } = require("../controller/adminManageLayouts");
router.route('/adminIndex/createLayout_05').post(upload.single("file"), createLayout_05);

//Admin Students Management
router.post('/adminIndex/upload-form', manageStudent.uploadedForm);
router.get('/adminIndex/editAccount', teacherMiddleware, manageStudent.editAccount);
router.post('/adminIndex/doEditAccount', manageStudent.doEditAccount);


module.exports = router;
