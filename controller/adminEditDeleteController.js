const Lesson = require("../models/Lessons");
const Layout1 = require("../models/Layout1");
const Layout2 = require("../models/Layout2");
const Layout3 = require("../models/Layout3");
const Layout4 = require("../models/Layout4");
const SchoolYear = require("../models/schoolYear");

const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const deleteLesson = async (req, res) => {
  const getLesson_id = req.query.lessonId;
  // const pageName = req.query.pageName;
  const getLesson = await Lesson.findById(getLesson_id);

  const deleteLayout01 = getLesson.LayOut1ArrayObject;
  const deleteLayout02 = getLesson.LayOut2ArrayObject;
  const deleteLayout03 = getLesson.LayOut3ArrayObject;
  const deleteLayout04 = getLesson.LayOut4ArrayObject;

  async function deleteLayouts(deleteLayouts, Layout) {
    if (deleteLayouts.length > 0) {
      for (const layoutId of deleteLayouts) {
        const deletedLayout = await Layout.findByIdAndDelete(layoutId);
      }
    }
  }
  // เรียกใช้ฟังก์ชั่น deleteLayouts สำหรับแต่ละประเภทของ Layout
  await deleteLayouts(deleteLayout01, Layout1);
  await deleteLayouts(deleteLayout02, Layout2);
  await deleteLayouts(deleteLayout03, Layout3);
  await deleteLayouts(deleteLayout04, Layout4);

  const deleteLesson = await Lesson.findByIdAndDelete(getLesson_id)

  // res.redirect(pageName);

  const lessons = await Lesson.find().sort({ createdAt: 1 }).populate("schoolYear");
  // console.log(lessons)
  const schoolYears = await SchoolYear.find().sort({ schoolYear: 0 });
  const findYear = null;

  res.render("adminLessonIndex", { mytitle: "adminLessonIndex", lessons, schoolYears, findYear });
}

const editLesson = async function (req, res, next) {
  const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
  const lessonId = req.query.lesson;
  const lesson = await Lesson.findById(lessonId).populate("schoolYear");
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


  // res.json(foundLayouts);
  res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts });

}

const deleteLayout = async (req, res) => {
  const _id = req.query.lessonId;
  const getLayout_id = req.query.layoutId;
  const getWhatLayout = req.query.whatLayout;

  if (getWhatLayout === "1") {
    await Layout1.findByIdAndDelete(getLayout_id);
  } else if (getWhatLayout === "2") {
    await Layout2.findByIdAndDelete(getLayout_id);

  } else if (getWhatLayout === "3") {
    await Layout3.findByIdAndDelete(getLayout_id);

  } else if (getWhatLayout === "4") {
    await Layout4.findByIdAndDelete(getLayout_id);

  }
  console.log(_id);

  // เรียกใช้ฟังก์ชั่น deleteLayouts สำหรับแต่ละประเภทของ Layout
  // res.redirect(pageName);

  const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
  const lessonId = req.query.lesson;
  const lesson = await Lesson.findById(_id).populate("schoolYear");
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


  // res.json(foundLayouts);
  res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts });
}


const makeEdit = async function (req, res, next) {
  try {
    const _id = req.body._id;
    const layoutId = req.body.layoutId;

    const uploadedFile = req.files.Url;

    const updatedData = {
      Topic: req.body.Topic,
      MainDescription: req.body.MainDescription,
      SubDescription: req.body.SubDescription,
      AboutImage: [{
        title: req.body.title,
        Url: {
          data: uploadedFile.data,
          contentType: uploadedFile.mimetype,
          ImageDescription: req.body.ImageDescription
        }
      }],
    };

    // console.log(req.files)

    // const finalCountImg = req.body.finalCountImg;
    // for (let i = 1; i <= finalCountImg.length; i++) {
    //   const uploadedFile = req.files[`Url${i}`];
    //   updatedData.AboutImage.push({
    //     title: req.body[`title${i}`],
    //     Url: {
    //       data: uploadedFile.data,
    //       contentType: uploadedFile.mimetype,
    //     }
    //     , ImageDescription: req.body[`ImageDescription${i}`]
    //   });
    // }

    const result = await Layout1.findOneAndUpdate(
      { _id: layoutId },
      { $set: updatedData },
      { new: true } // ให้คืนค่าข้อมูลที่ถูกอัปเดต
    );

    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    // const lessonId = result.LessonArrayObject[0].LessonId;
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
    res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts });

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

const makeEdit2 = async function (req, res, next) {
  try {
    const _id = req.body._id;
    const layoutId = req.body.layoutId;

    console.log(_id);
    const Topic = req.body.Topic;
    const TextArea1 = req.body.TextArea1;
    const TextArea2 = req.body.TextArea3;
    const TextArea3 = req.body.TextArea3;
    const updatedData = {
      Topic: Topic,
      TextArea1: TextArea1,
      TextArea2: TextArea2,
      TextArea3: TextArea3,
    };

    const result = await Layout2.findOneAndUpdate(
      { _id: layoutId },
      { $set: updatedData },
      { new: true }
    );
    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    // const lessonId = result.LessonArrayObject[0].LessonId;
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
    res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts });

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

const makeEdit3 = async function (req, res, next) {
  try {
    const _id = req.body._id;
    const layoutId = req.body.layoutId;
    const uploadedFile = req.files.FileForm;

    const updatedData = {
      Description: req.body.Description,
      File: {
        data: uploadedFile.data,
        contentType: uploadedFile.mimetype,
      }
    }

    const result = await Layout3.findOneAndUpdate(
      { _id: layoutId },
      { $set: updatedData },
      { new: true } // ให้คืนค่าข้อมูลที่ถูกอัปเดต
    );

    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    // const lessonId = result.LessonArrayObject[0].LessonId;
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
    res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts });

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
};

const makeEdit4 = async function (req, res, next) {
  try {
    const _id = req.body._id;

    const updatedData = {
      Topic: req.body.Topic,
      Description: req.body.Description,
      Lists: [],
    };

    const finalCountImg = req.body.finalCountImg;
    for (let i = 0; i <= finalCountImg.length; i++) {
      updatedData.Lists.push({
        list: req.body[`list${i}`],
      });

      const result = await Layout4.findOneAndUpdate(
        { _id: _id },
        { $set: updatedData },
        { new: true }
      );
    }

    const lessons = await Lesson.find().sort({ createdAt: 1 }).exec();
    // const lessonId = result.LessonArrayObject[0].LessonId;
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
    res.render("adminEdit", { mytitle: "adminEdit", lesson, lessons, foundLayouts });

  } catch (err) {
    console.error(err);
    res.status(500).send("เกิดข้อผิดพลาด");
  }
}




module.exports = {
  deleteLesson,
  editLesson,
  makeEdit,
  makeEdit2,
  makeEdit3,
  makeEdit4,
  deleteLayout
}