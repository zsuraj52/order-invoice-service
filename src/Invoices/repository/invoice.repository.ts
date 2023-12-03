import logger from "../../../logger/logger";
import Invoice from "../model/invoice";

export const saveInvoiceData = async (invoiceId:string , orderId:string , total:number) => {
    const invoice = await Invoice.create({
        invoiceId: invoiceId,
        orderId: orderId,
        invoiceAmount: total 
    });

    return await invoice.save().then((response:any)=>{
        return response;
    })
}

export const getInvoice = async (invoiceId:string) => {
    return await Invoice.findOne({_id: invoiceId , isDeleted:false })
}

export const getInvoiceArray = async () => {
    return await Invoice.find({isDeleted:false});
}

export const getInvoiceByInvoiceAndOrderId = async (invoiceId:string, orderId:string) =>{
    return await Invoice.find({_id:invoiceId , orderId:orderId , isDeleted:false})
}

export const updateInvoice = async (invoiceId:string, updateData:any, orderId:string) => {
    const invoice = await getInvoiceByInvoiceAndOrderId(invoiceId ,orderId);
    if(!invoice || invoice.length ==0){
        return `No Invoice Found. `;
    }

    await Invoice.findByIdAndUpdate(invoiceId, updateData , {new:true});
    return await getInvoice(invoiceId);
}

export const deleteInvoiceForGivenId = async (invoiceId: string) => {
    const invoice = await getInvoice(invoiceId);
    if(!invoice) {
        throw ('No Invoice Found To Delete');
    }
    logger.info(`invoice found | ${invoice}`)

    invoice.isDeleted = true;
    return await invoice.save().then((res:any) => {
        logger.info(`res after soft deleting order | ${res}`)
        return `Order Deleted Successfully! `
    })   
}

export const getInvoiceByOrderId = async(orderId:string) => {
    return await Invoice.findOne({orderId: orderId , isDeleted:false })
   
}