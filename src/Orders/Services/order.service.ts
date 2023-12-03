import logger from "../../../logger/logger"
import { createOrderEntry, getOrderDetailById, getAllOrderDetails,updateOrderDetailsById, deleteOrderForGivenId } from "../repository/order.repository";
import { OrderDTO } from "../orderDTO/orderDTO";

export const createOrderService = async (orderBodyData:OrderDTO) => {
    try{
        logger.info(`createOrderService params | ${JSON.stringify(orderBodyData)}`);
        return await createOrderEntry(orderBodyData);
    }   
    catch(e){
        logger.error(`Error in createOrderService | ${e}`);
        throw(e);
    }
}

export const getOrderDetailService = async (orderId: string) => {
    try{
        logger.info(`getOrderDetailService | orderId | ${orderId}`);
        return await getOrderDetailById(orderId)
    }
    catch(e){
        logger.error(`Error in getOrderDetailService | ${e}`);
        throw(e);
    }
}

export const getAllOrdersService = async() => {
    try{
        return await getAllOrderDetails();
    }
    catch(e){
        logger.error(`Error in getAllOrdersService | ${e}`);
        throw(e);
    }
}

export const updateOrderService = async (data:any , orderId:string) => {
    try{
        const order = await getOrderDetailById(orderId);
        if(!order){
            throw new Error(`No Order Found For Given id`)
        }
        logger.info(`Order Found`)
        return await updateOrderDetailsById(data,orderId);
    }
    catch(e){
        logger.error(`Error in getAllOrdersService | ${e}`);
        throw(e);
    }
}

export const deleteOrderService = async (orderId: string) => {
    try{
        return await deleteOrderForGivenId(orderId)
    }
    catch(e){
        logger.error(`Error in deleteOrderService | ${e}`);
        throw(e);
    }
}