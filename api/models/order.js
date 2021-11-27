const mongoose = require('mongoose');
const Product = require('./product');

const orderSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    product:{type: mongoose.Schema.Types.ObjectId, ref:Product, required:true}, // here we are connecting our this schema to our product schema
    quantity:{type:Number,default:1}
});
module.exports = mongoose.model('Order',orderSchema) 