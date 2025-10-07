const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const bcrypt = require('bcryptjs'); // سنستخدم هذه المكتبة لتشفير كلمات المرور

// --- المسار الأول: إنشاء حساب عميل جديد (Registration) ---
router.post('/register', async (req, res) => {
    try {
        const { companyName, email, password, phone, address } = req.body;

        // التأكد من أن البريد الإلكتروني غير مسجل من قبل
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'هذا البريد الإلكتروني مسجل بالفعل' });
        }

        // تشفير كلمة المرور قبل حفظها
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // إنشاء مستخدم جديد
        const user = new User({
            companyName,
            email,
            password: hashedPassword, // حفظ كلمة المرور المشفرة
            phone,
            address
        });

        const createdUser = await user.save();
        res.status(201).json({
            _id: createdUser._id,
            companyName: createdUser.companyName,
            email: createdUser.email,
            isAdmin: createdUser.isAdmin
        });

    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
});


// --- المسار الثاني: تسجيل دخول عميل (Login) ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // البحث عن المستخدم باستخدام البريد الإلكتروني
        const user = await User.findOne({ email });

        // إذا كان المستخدم موجودًا وكلمة المرور صحيحة
        if (user && (await bcrypt.compare(password, user.password))) {
             res.json({
                _id: user._id,
                companyName: user.companyName,
                email: user.email,
                isAdmin: user.isAdmin,
                message: 'تم تسجيل الدخول بنجاح'
             });
        } else {
            res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
        }

    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في الخادم', error: error.message });
    }
});


module.exports = router;