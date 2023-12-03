import logger from "../../../logger/logger";
import { saveInvoiceData, getInvoiceArray, updateInvoice, deleteInvoiceForGivenId, getInvoiceByOrderId, getInvoice } from "../repository/invoice.repository";
import { createInvoiceUtils } from "../utils/createInvoice.utils";



export const createInvoiceService = async (invoiceData: any, path: string) => {
    try {
        logger.info(`createInvoiceService | ${JSON.stringify(invoiceData)}`)

        const invoice:any = await getInvoiceByOrderId(invoiceData.orderId);
        logger.info(`invoice ${invoice}`)

        if(!invoice){
            logger.info(`condition => when no invoice found `)
            const totalAndInvoiceId = await createInvoiceUtils(invoiceData , path);
            logger.info(`totalAndInvoiceId | ${JSON.stringify(totalAndInvoiceId)}`)
        
            return await saveInvoiceData(totalAndInvoiceId?.invoiceId, invoiceData.orderId ,totalAndInvoiceId?.total ).then((invoice: any) => {
                return invoice;
            })
        }; 

        const totalAndInvoiceId = await createInvoiceUtils(invoiceData , path);
        logger.info(`totalAndInvoiceId | ${JSON.stringify(totalAndInvoiceId)}`)
        
        const dataToUpdateInvoice = {
            invoiceId: invoice._id,
            orderId: invoiceData.orderId,
            invoiceAmount : totalAndInvoiceId?.total,
            isUpdated: true
        };
        logger.info(`dataToUpdateInvoice | ${dataToUpdateInvoice}`);
        return await updateInvoiceById(invoice._id , dataToUpdateInvoice , invoiceData.orderId).then((updatedInvoice) => {
            if(!updatedInvoice || (typeof updatedInvoice) == "string" ){
                return "No Invoice found";
            }
            logger.info(`updateInvoiceById | updatedInvoice | invoice updated for order updation | ${updatedInvoice}`)
            return  updatedInvoice;    

        })
    }
    catch (e) {
        logger.error(`Error in createInvoiceService | ${e} `);
        throw (e);
    }
}

export const getInvoiceDetailService = async (invoiceId: string) => {
    try {
        logger.info(`invoiceId | ${invoiceId}`);
        return await getInvoice(invoiceId).then((invoice: any) => {
            return invoice;
        })
    }
    catch (e) {
        logger.error(`Error in getInvoiceDetailService | ${e} `);
        throw (e);
    }
}

export const getInvoiceDetailsArrayService = async () => {
    try {
        return await getInvoiceArray().then((invoices:any) => {
            return invoices
        })
    } 
    catch (e) {
        logger.error(`Error in getInvoiceDetailsArrayService | ${e} `);
        throw (e);
    }
} 

export const updateInvoiceById = async (invoiceId:string , updateData:any , orderId:string) => {
    try {
        logger.info(`invoiceId | ${invoiceId} & updateData | ${JSON.stringify(updateData)} | orderId | ${orderId}`);
        return await updateInvoice(invoiceId,updateData ,orderId).then((updatedInvoiceData:any) => {
            logger.info(`invoice updated for id ${invoiceId} | ${updatedInvoiceData}`)
            return updatedInvoiceData; 
        })
    } 
    catch (e) {
        logger.error(`Error in updateInvoiceById | ${e} `);
        throw (e);
    }
}

export const deleteInvoiceService = async (invoiceId:string) => {
    try {
        return await deleteInvoiceForGivenId(invoiceId).then((res:any) => {
            return res;
        } )
    } 
    catch (e) {
        logger.error(`Error in deleteInvoiceService | ${e} `);
        throw (e);
    }
}