import { Request, Response } from "express";
import logger from '../../../logger/logger';
import { createOrderService, getOrderDetailService, getAllOrdersService, updateOrderService, deleteOrderService } from "../Services/order.service";
import { OrderDTO } from "../orderDTO/orderDTO";
import { createInvoiceService } from "../../Invoices/services/invoice.service";

export const createOrder = async(req:Request , res:Response) :Promise< OrderDTO | any >=> {
    try{
        logger.info(`body | ${JSON.stringify(req.body)}`);
        const { orderName ,orderDescription ,orderType ,orderSeller ,quantity ,price } = req?.body;

        if( !orderName || !orderDescription || !orderType || !orderSeller || !quantity || !price ){
            return res.status(400).send({"Status":"FAILED" , "Message": "Failed to created order entry" , "Response":"Please Provide all provided fields"})
        }
        
        return await createOrderService(req.body).then( async (orderEntryData:any) => {
            logger.info(`Order Created | Started Creating invoice | ${orderEntryData}`)
            const invoiceObj = {
                items:[ orderEntryData ],
                orderId:orderEntryData._id
            } 
            await createInvoiceService(invoiceObj, `invoice_${Math.random().toString(36).slice(2)}.pdf`).then((invoice:any) => {
                logger.info(`invoice created successfully | ${invoice}`)
                return res.status(201).send({"Status": "SUCCESS" , "Message": "Order Created Successfully" , "Response": orderEntryData})
            })
        })

    }
    catch(e){
        logger.error(`Error in createOrder | ${e}`);
        return res.status(400).send({"Status":"FAILED" , "Message": "Failed to created order entry" , "Response":"Please Provide all provided fields"})
    }
}


export const getOrderDetails = async (req:Request , res:Response):Promise< OrderDTO | any > => {
    try{
        const orderId = req.params?.orderId;
        if(!orderId){
            return res.status(400).send({"Status":"FAILED" , "Message": "Failed to retrieve order data" , "Response": "Please Provide valid input"})
        }
        return await getOrderDetailService(orderId).then((orderData:any) => {
            logger.info(`order Data for id ${orderId} | ${(orderData)}`)
            if(!orderData){
                return res.status(400).send({"Status":"FAILED" , "Message": "Failed to retrieve order data" , "Response": "No Order data found for given id"});
            }
            return res.status(200).send({"Status":"SUCCESS" , "Message":"orderData Fetched Successfully" , "Response": orderData})
        })
    }
    catch(e){
        logger.error(`Error in getOrderDetails | ${e}`);
        return res.status(400).send({"Status":"FAILED" , "Message": "Failed to retrieve order data" , "Response": "No Order data found for given id"});
    }
}

export const getOrderDetailsArray = async (_req:Request , res:Response):Promise< [OrderDTO] | any > => {
    try {
        return await getAllOrdersService().then((orderList:any) => {
            logger.info(`getAllOrdersService response | ${orderList}`)
            return res.status(200).send({"Status":"SUCCESS" , "Message":"orderData Fetched Successfully" , "Response": orderList})    
        })
    } 
    catch (e) {
        logger.error(`Error in getOrderDetailsArray | ${e}`);
        return res.status(400).send({"Status":"FAILED" , "Message": "Failed to retrieve order data" , "Response": "No Orders found"});
    }
}

export const updateOrderDetails = async (req:Request , res:Response) :Promise< OrderDTO | any > => {
    try{
        const orderId :string= req.params?.orderId;
        logger.info(`orderId | ${orderId}`)
        logger.info(`body , ${req.body}`);
        if(!req.body){
            return res.status(400).send({"Status":"FAILED" , "Message": "Failed to retrieve order data" , "Response": "Please provide data to update order"});
        }
        return await updateOrderService(req.body,orderId).then( async(updatedOrder:any) =>{
            logger.info(`updateOrderService response | ${updatedOrder}`)
            const orderId = updatedOrder?._id; 
            delete (updatedOrder?._id);
            delete (updatedOrder?._v);
            delete (updatedOrder?.ipdatedAt);
            delete (updatedOrder?.createdAt);
            updatedOrder.isUpdated = true;

            const invoiceObj = {
                items: [ updatedOrder ],
                orderId: orderId
            };
            logger.info(`Started updating invoice .......`)
            return await createInvoiceService(invoiceObj, `invoice_${Math.random().toString(36).slice(2)}.pdf` ).then((response:any) => {
                if(!response || typeof response == "string"){
                    return res.status(400).send({"Status":"FAILED" , "Message": "Failed to update order data" , "Response":response});        
                }
                return res.status(200).send({"Status": "SUCCESS" , "Message":"orderData Updated Successfully" , "Response": updatedOrder})    
            })
        })
    }
    catch(e){
        logger.error(`Error in getOrderDetailsArray | ${e}`);
        return res.status(400).send({"Status":"FAILED" , "Message": "Failed to update order data" , "Response":e});
    }
}

export const deleteOrder = async (req:Request , res:Response) :Promise<any> => {
    try{
        const orderId = req.params?.orderId;
        logger.info(`orderId | ${orderId}`);
        if(!orderId){
            logger.error(`NO Order found for given id`);
            return res.status(400).send({"Status":"FAILED" , "Message": "Failed to retrieve order data" , "Response": "No Orders found"});
        }
        await deleteOrderService(orderId).then((softDeleteOrder:any) => {
            logger.info(`deleteOrderService response ${softDeleteOrder}`)
            return res.status(200).send({"Status": "SUCCESS" , "Message":"orderData Deleted Successfully"})    

        })
    }
    catch(e){
        logger.error(`Error in deleteOrder | ${e}`);
        return res.status(400).send({"Status":"FAILED" , "Message": "Failed to delete order data" , "Response": e });
    }
}