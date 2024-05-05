const multer = require("multer");
const iconv = require("iconv-lite");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      const timestamp = new Date().toISOString(); // สร้าง timestamp
      const originalFilename = file.originalname;
      const filenameWithoutSpaces = originalFilename.replace(/\s+/g, '_'); // แทนที่ช่องว่างด้วย "_"
      const filename = iconv.decode(filenameWithoutSpaces, 'utf-8'); // ถอดรหัสจาก originalName เป็น utf-8 (ภาษาไทย)
      cb(null, timestamp + '_' + filename); // เชื่อมต่อ timestamp กับชื่อไฟล์เข้าด้วยกัน
    },
  });
  

const fileFilter = (req, file, cb) => {
  //reject a file if it's not a jpg or png
  if (
    // file.mimetype === "image/jpeg" ||
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.mimetype === "application/msword" 

  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  // limits: {
  //   fileSize: 1024 * 1024 * 5,
  // },
  fileFilter: fileFilter,
});

module.exports = upload;
