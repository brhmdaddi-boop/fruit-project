const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// إعدادات التخزين الخاصة بـ multer
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/'); // المجلد الذي سيتم حفظ الصور فيه
    },
    filename(req, file, cb) {
        // تحديد اسم فريد للملف لتجنب تكرار الأسماء
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// دالة للتحقق من أن الملف المرفوع هو صورة
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// إنشاء المسار. upload.single('image') هي التي ستقوم بمعالجة الصورة
// 'image' هو اسم الحقل الذي سنرسله من الواجهة الأمامية
router.post('/', upload.single('image'), (req, res) => {
    // إذا نجح الرفع، ستكون معلومات الملف موجودة في req.file
    // نرسل مسار الملف مرة أخرى للواجهة الأمامية
    res.send(`/${req.file.path.replace(/\\/g, "/")}`);
});

module.exports = router;