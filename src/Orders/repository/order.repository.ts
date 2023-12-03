import logger from "../../../logger/logger";
import Order from "../Model/orders";
import { OrderDTO } from "../orderDTO/orderDTO";


export const createOrderEntry = async (orderData:OrderDTO) => {
    const order = await Order.create( orderData ) 
    return await order.save().then((res) =>  {
        logger.info(`order created successfully | ${res}`)
        return res;
    })
}

export const getOrderDetailById = async (orderId :string) => {
    return await Order.findOne({ _id: orderId , isDeleted: false });
}

export const getAllOrderDetails = async () => {
    return await Order.find({ isDeleted: false });
}

export const updateOrderDetailsById = async ( data:any, orderId:string ) => {
    const updateOrder = await Order.findByIdAndUpdate(orderId ,  data , {new:true});
    logger.info(`updateOrder ${JSON.stringify(updateOrder)}`);
    return await getOrderDetailById(orderId);
    
}

export const deleteOrderForGivenId = async (orderId:string) => {
    let order = await getOrderDetailById(orderId);
    if(!order){
        throw (`No Order Found For Given id`)
    }
    logger.info(`Order Found | ${order}`);

    order.isDeleted = true;
    return await order.save().then((res) => {
        logger.info(`res after soft deleting order | ${res}`)
        return `Order Deleted Successfully! `
    })   
    
}