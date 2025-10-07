const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    // 1. ربط الطلب بالعميل الذي قام به
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', // 'User' هو اسم موديل العميل الذي سننشئه لاحقًا
        required: true 
    },

    // 2. قائمة المنتجات المطلوبة
    orderItems: [
        {
            name: { type: String, required: true },
            qty: { type: Number, required: true }, // الكمية (e.g., 20)
            unit: { type: String, required: true }, // الوحدة (e.g., 'kg' or 'box')
            price: { type: Number, required: true } // سعر الوحدة عند وقت الطلب
        }
    ],

    // 3. معلومات التوصيل
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        notes: { type: String } // ملاحظات إضافية من العميل
    },
    
    // 4. معلومات الدفع والسعر
    paymentMethod: {
        type: String,
        required: true,
        default: 'Cash on Delivery' // القيمة الافتراضية
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },

    // 5. حالة الطلب
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], // الحالات الممكنة فقط
        default: 'Pending'
    },
    deliveredAt: { // تاريخ التوصيل الفعلي
        type: Date
    }

}, {
    timestamps: true // سيقوم Mongoose بإضافة تاريخ إنشاء وتحديث الطلب تلقائيًا
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;