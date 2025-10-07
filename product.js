const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    unit: { // الوحدة: 'kg', 'box', 'piece'
        type: String,
        required: true
    },
    price: { // السعر لهذه الوحدة
        type: Number,
        required: true
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: { // يمكننا إضافة تصنيف لاحقًا (خضروات، فواكه)
        type: String,
        default: 'General'
    },
    image: { // ✅ حقل جديد لصورة المنتج
        type: String,
        required: true,
        default: '/images/products/default.png'
    },
    // ✅ نظام التسعير الجديد والمطور
    pricing: [pricingSchema] 
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;