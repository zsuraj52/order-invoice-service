import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
    },
    orderId: {
        unique:true,
        type: String,
    },
    invoiceAmount:{
        type:Number
    },

    isUpdated:{
        type:Boolean,
        default:false
    }, 
    isDeleted:{
        type:Boolean,
        default:false
    }  
},
{
    timestamps:true
});

const Invoice = mongoose.model('invoice', invoiceSchema)
export default Invoice;