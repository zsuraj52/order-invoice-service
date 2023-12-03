import express from "express";
import { createOrder, getOrderDetails, getOrderDetailsArray, updateOrderDetails, deleteOrder } from './Orders/Controllers/order.controller';
import { createInvoice, deleteInvoice, getInvoiceDetails, getInvoiceDetailsArray, updateInvoice } from "./Invoices/controller/invoice.controller";
const router = express.Router();

router.post('/create/order' , createOrder);
router.get('/get/order/:orderId' , getOrderDetails);
router.get('/get/orderList' , getOrderDetailsArray);
router.put('/update/order/:orderId' , updateOrderDetails);
router.delete('/delete/order/:orderId' ,deleteOrder );

router.post('/create/invoice', createInvoice);
router.get('/get/invoice/:invoiceId' , getInvoiceDetails);
router.get('/get/invoiceList' , getInvoiceDetailsArray);
router.put('/update/invoice/:invoiceId',updateInvoice);
router.delete('/delete/invoice/:invoiceId' ,deleteInvoice );


export default router;