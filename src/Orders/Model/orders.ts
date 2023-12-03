import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    orderName: {
        type: String,
    },
    orderDescription: {
        type: String,
    },
    orderType: {
        type: String,
    },
    orderSeller: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    price: {
        type: Number,
    },
    isDeleted:{
        type:Boolean,
        default:false
    }  
},
{
    timestamps:true
});

const Order = mongoose.model('orders', orderSchema)
export default Order;