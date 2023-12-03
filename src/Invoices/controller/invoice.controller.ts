import { Request , Response } from 'express';
import logger from '../../../logger/logger';
import { createInvoiceService, deleteInvoiceService, getInvoiceDetailService, getInvoiceDetailsArrayService, updateInvoiceById } from '../services/invoice.service';
import { createInvoiceUtils } from '../utils/createInvoice.utils';
import { getInvoiceByInvoiceAndOrderId } from '../repository/invoice.repository';




export const createInvoice = async (req:Request , res:Response) :Promise < any > => {
    try{
        const invoiceData = req?.body;
        const invoiceObj = {
            items: [ invoiceData ],
            orderId: req.body.orderId
        } 
        if(!invoiceData){
            return res.status(400).send({"Status":"FAILED" , "Message": "Failed to created invoice entry" , "Response":"Please Provide all provided fields"})
        }
        return await createInvoiceService(invoiceObj , `invoice_${Math.random().toString(36).slice(2)}.pdf`).then((invoice:any) => {
            logger.info(`createInvoiceService response | ${JSON.stringify(invoice)}`);
            return res.status(201).send({"Status": "SUCCESS" , "Message": "Invoice Created Successfully!" , Response: invoice })
        })
    }
    catch(e){
        logger.error(`Error in createInvoice | ${e}`);
        return res.status(400).send({"Status": "FAILED" , "Message": "Failed to created invoice entry" , Response: e})
    }
}


export const getInvoiceDetails = async (req:Request , res:Response) :Promise < any > => {
    try{
        logger.info(`invoiceId | ${req.params?.invoiceId}`);
        const invoiceId = req.params?.invoiceId;
        if(!invoiceId){
            return res.status(400).send({"Status": "FAILED" , "Message": "Failed to retrieve invoice " , "Response": "Please Provide invoice id"})
        }
        return await getInvoiceDetailService(invoiceId).then((invoice:any) => {
            logger.info(`getInvoiceDetailService response | ${JSON.stringify(invoice)}`);
            return res.status(201).send({"Status": "SUCCESS" , "Message": "Invoice Retrieved Successfully!" , Response: invoice })
        })
    }
    catch(e){
        return res.status(400).send({"Status": "FAILED" , "Message": "Failed to retrieve invoice " , "Response": "No Order data found for given id"})
    }
}


export const getInvoiceDetailsArray = async(_req:Request , res:Response) => {
    try{
        return await getInvoiceDetailsArrayService().then((invoiceDataArray:any) => {
            logger.info(`getInvoiceDetailsArrayService | invoiceDataArray | ${invoiceDataArray}`);
            return res.status(200).send({"Status":"SUCCESS" , "Message":"orderData Fetched Successfully" , "Response": invoiceDataArray})    
        })
    }
    catch(e){
        logger.error(`Error in getInvoiceDetailsArrayService | ${e}`);
        return res.status(400).send({"Status":"FAILED" , "Message": "Failed to retrieve invoice data" , "Response": "No Invoices found"});
    }
}


export const updateInvoice = async (req:Request , res:Response) => {
    try{
        logger.info(`invoice id to update | ${req.params?.invoiceId}`);
        const invoiceId = req.params?.invoiceId;
        const invoice = await getInvoiceByInvoiceAndOrderId(invoiceId ,req.body?.orderId);
        logger.info(`invoice ===> ${invoice}`)
        if(!invoice || !invoice.length ){
            return res.status(400).send({"Status": "FAILED" , "Message": "Failed to update invoice. " , "Response": "No invoice found for given invoice id. "})
        }
        if(!invoiceId){
            return res.status(400).send({"Status": "FAILED" , "Message": "Failed to update invoice. " , "Response": "Please Provide invoice id. "})
        }   
        const updateData = req.body;
        const invoiceData = {
            items: [ updateData ] , 
            orderId: req.body.orderId
        };
        const invoiceResponse = await createInvoiceUtils(invoiceData,`invoice_${Math.random().toString(36).slice(2)}.pdf`)
        logger.info(`invoiceResponse | ${JSON.stringify(invoiceResponse)}`);
        const dataToUpdateInvoice = {
            invoiceId: invoiceId,
            orderId: req.body.orderId,
            invoiceAmount : invoiceResponse?.total,
            isUpdated: true
        };
        logger.info(`data for updating invoice for id ${invoiceId} | ${dataToUpdateInvoice}`)
        return await updateInvoiceById(invoiceId , dataToUpdateInvoice , invoiceData.orderId).then((updatedInvoice:any) => {
            if(!updatedInvoice || (typeof updatedInvoice) == "string" ){
                return res.status(400).send({"Status":"FAILED" , "Message": "Failed to update invoice data" , "Response": "No Invoice found"});
            }
            logger.info(`updateInvoiceById | updatedInvoice | ${updatedInvoice}`)
            return res.status(200).send({"Status": "SUCCESS" , "Message": "Invoice Updated Successfully" , "Response": updatedInvoice})    
        })
    }
    catch (e) {
        logger.error(`Error in updateInvoice | ${e}`);
        return res.status(400).send({"Status":"FAILED" , "Message": "Failed to update invoice data" , "Response": "No Invoices found"});
    }
}


export const deleteInvoice = async (req:Request , res:Response) => {
    try{
        const invoiceId = req.params.invoiceId
        logger.info(`invoice id to delete | ${invoiceId}`);
        if(!invoiceId){
            return res.status(400).send({"Status": "FAILED" , "Message": "Failed to delete invoice " , "Response": "Please Provide invoice id"})
        }
        return await deleteInvoiceService(invoiceId).then((response:any) => {
            return res.status(200).send({"Status":"SUCCESS" , "Message":"Invoice Deleted Successfully" , "Response": response})    
        })
    }
    catch(e){
        logger.error(`Error in getInvoiceDetailsArrayService | ${e}`);
        return res.status(400).send({"Status":"FAILED" , "Message": "Failed to delete invoice data" , "Response": "No Invoices found"});
    }
}