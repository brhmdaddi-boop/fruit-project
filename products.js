const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET: استدعاء كل المنتجات
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ POST: إضافة منتج جديد (النسخة المحدثة والاحترافية)
router.post('/', async (req, res) => {
    // استقبال البيانات الجديدة من الواجهة الأمامية
    const { name, description, image, pricing } = req.body;

    // التأكد من أن التسعير موجود وليس فارغًا
    if (!pricing || pricing.length === 0) {
        return res.status(400).json({ message: 'يجب إضافة وحدة تسعير واحدة على الأقل' });
    }

    const product = new Product({
        name,
        description,
        image,
        pricing
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE: مسار لحذف منتج حسب الـ ID
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ message: 'تم حذف المنتج' });
        } else {
            res.status(404).json({ message: 'المنتج غير موجود' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;