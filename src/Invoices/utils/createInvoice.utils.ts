import * as fs from 'fs';
import logger from '../../../logger/logger';
import PDFDocument from 'pdfkit';


export const createInvoiceUtils = async (invoiceData:any , path:string) => {
    const invoiceId = `invoice_${Math.floor(Math.random() * 1000000000)}`;
        let doc = new PDFDocument({ margin: 50 });

        await generateHeader(doc);
        await generateCustomerInformation(doc, invoiceData, invoiceId);
        const total = await generateInvoiceTable(doc, invoiceData);
        logger.info(`total in invoice ${total}`)
        
        await generateFooter(doc)
        doc.end();
        doc.pipe(fs.createWriteStream(path));
        return {
            total: total,
            invoiceId: invoiceId
        }
}

export const generateCustomerInformation = async (doc: any, invoiceData: any, invoiceId: any) => {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice Details", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text(`Invoice_number:-  ${invoiceId}`, 50, customerInformationTop)
        .font("Helvetica")
        .text(`Order_id:-            ${invoiceData.orderId}`, 50, customerInformationTop + 15)
        .font("Helvetica")
        .font("Helvetica")
        .text(`Invoice_date:-      ${formatDate(new Date())}`, 50, customerInformationTop + 30)
        .moveDown();

    generateHr(doc, 252);
}

function generateHr(doc: any, y: any) {
    doc.strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

function formatDate(date: any) {
    return date.toLocaleString();
}

function generateTableRow(doc: any, y: any, item: any, type: any, unitCost: any, quantity: any, lineTotal: any , gst: any ) {
    doc.fontSize(10)
        .text(item, 50, y)
        .text(type, 150, y)
        .text(unitCost, 200, y)
        .text(quantity, 300, y)
        .text(lineTotal, 370, y)
        .text(gst, 450, y)
}

export const generateInvoiceTable = async (doc: any, invoice: any) => {
    let i;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(doc, invoiceTableTop, "Name", "Type", "Price", "Units", "Total" , "GST" );

    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    let position = 0;
    let total = 0;
    for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i];
        position = invoiceTableTop + (i + 1) * 30;
        generateTableRow( doc,  position,  item?.orderName,  item?.orderType,  ((item?item.price:0).toLocaleString('en-US', { style: 'currency', currency: 'USD' })),  item.quantity,  ((getTotal(item?item.price:0, item.quantity, getGST(item?item.price:0 , item?.quantity))).toLocaleString('en-US', { style: 'currency', currency: 'USD' })) ,  (getGST(item?item.price:0 , item.quantity ).toLocaleString('en-US', { style: 'currency', currency: 'USD' })) );
        total += getGST(item?item.price:0 , item?.quantity) + getTotal(item?item.price:0, item.quantity, getGST(item?item.price:0 , item?.quantity));
    }
    generateHr(doc, position + 20);

    const subtotalPosition = invoiceTableTop + (i + 1) * 30;
    generateTableRow(doc, subtotalPosition, "", "", "Total", "", ((total).toLocaleString('en-US', { style: 'currency', currency: 'USD' })), "",);
    return total;
}

function getTotal(price: number, quantity: number, gst: number) {
    return (price * quantity) + gst;
}

function getGST(price: number , quantity:number) {
    return ((price / 100) * 5) * quantity;
}

export const generateHeader = async (doc: any) => {
    doc.image("/home/lnv23/Work/Suraj/Work/Tasks/Order-Service-Mongo/src/Invoices/services/invoice.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("Testing Company Inc.", 110, 57)
        .fontSize(10)
        .text("Testing Company Inc.", 200, 50, { align: "right" })
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("New York, NY, 10025", 200, 80, { align: "right" })
        .moveDown();
}

export const generateFooter = async (doc: any) => {
    doc.fontSize(10)
        .fillColor("#FF0000")
        .font("Helvetica-Bold")
        .text("NOTE :- Payment is due within 15 days. Thank you for your business.", 50, 700, { align: "center", width: 500 });
}