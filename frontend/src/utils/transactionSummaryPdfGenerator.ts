import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { TransactionSummaryData } from 'src/types';

/**
 * Generates a PDF summary of a transaction using Times New Roman font.
 * @param {TransactionSummaryData} data - The data for the transaction summary.
 */
export const generateTransactionSummaryPdf = (data: TransactionSummaryData) => {
    const doc = new jsPDF();

    // --- Font Loading ---
    try {
        // Fetch the Times New Roman font file from the assets folder.
        /*const fontResponse = await fetch('../assets/Roboto-VariableFont_wdth,wght.ttf');
        if (!fontResponse.ok) {
            throw new Error('Font file could not be loaded.');
        }
        console.log("Font Response:", fontResponse);
        const fontBuffer = await fontResponse.arrayBuffer();
        const fontBytes = new Uint8Array(fontBuffer);
        let binary = '';
        fontBytes.forEach((byte) => {
            binary += String.fromCharCode(byte);
        });
        const fontBase64 = btoa(binary);

        doc.addFileToVFS('Roboto-VariableFont_wdth,wght.ttf', fontBase64);
        doc.addFont('Roboto-VariableFont_wdth,wght.ttf', 'Roboto-VariableFont_wdth,wght', 'normal');
        doc.addFont('Roboto-Italic-VariableFont_wdth,wght.ttf', 'Roboto-Italic-VariableFont_wdth,wght', 'normal');*/
        doc.setFont('Times');

    } catch (error) {
        console.error("Error loading custom font: ", error);
        // Fallback to a standard font if loading fails.
        doc.setFont('Helvetica');
        alert("Uyarı: Özel karakterler PDF'te düzgün görüntülenemeyebilir çünkü font yüklenemedi.");
    }

    // --- PDF Content ---

    // Title
    doc.setFontSize(18);
    doc.text("Siparis Teklifi", 14, 20);

    // Header Information
    doc.setFontSize(10);
    let yOffset = 30;
    doc.text(`Musteri Adi: ${data.customerCommercialTitle ?? 'N/A'}`, 14, yOffset);
    yOffset += 7;
    doc.text(`Fatura Tarihi: ${new Date(data.invoiceDate).toLocaleDateString('tr-TR')}`, 14, yOffset);
    yOffset += 7;
    doc.text(`Vade Tarihi: ${data.dueDate ? new Date(data.dueDate).toLocaleDateString('tr-TR') : 'N/A'}`, 14, yOffset);

    // Table of Products
    const tableColumn = ["Ürün Adi", "Miktar", "Birim", "Birim Fiyat", "Ürün Toplam Fiyati", "KDV Tutari", "Ürün Genel Toplam"];
    const tableRows: (string | number)[][] = [];
    let totalProductsPrice = 0;

    data.items?.forEach(item => {
        const product = data.products?.find(p => p.id === item.productId);
        const productTotalPrice = Number(item.price) * item.quantity;
        const vatAmount = productTotalPrice * (item.vatRate / 100);
        totalProductsPrice += productTotalPrice;

        tableRows.push([
            product?.name ?? 'N/A',
            item.quantity,
            item.unit,
            Number(item.price).toFixed(2),
            productTotalPrice.toFixed(2),
            vatAmount.toFixed(2),
            (item.total ?? 0).toFixed(2),
        ]);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: yOffset + 5,
        theme: 'grid',
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            font: 'Times-New-Roman',
            fontStyle: 'bold',
        },
        styles: {
            font: 'Times-New-Roman',
        },
    });

    const finalY = (doc as any).lastAutoTable.finalY;

    // Summary at the bottom
    doc.setFontSize(10);
    yOffset = finalY + 10;
    const rightAlign = doc.internal.pageSize.width - 14;

    doc.text(`Musteri Eski Bakiye:`, 14, yOffset);
    doc.text(`${Number(data.customerPreviousBalance ?? 0).toFixed(2)}`, rightAlign, yOffset, { align: 'right' });
    yOffset += 7;

    doc.text(`Musteri Yeni Bakiye:`, 14, yOffset);
    doc.text(`${Number(data.customerNewBalance ?? 0).toFixed(2)}`, rightAlign, yOffset, { align: 'right' });
    yOffset += 7;

    doc.text(`Toplam KDV:`, 14, yOffset);
    doc.text(`${Number(data.totalVat ?? 0).toFixed(2)}`, rightAlign, yOffset, { align: 'right' });
    yOffset += 7;

    doc.text(`Urunler Toplami:`, 14, yOffset);
    doc.text(`${totalProductsPrice.toFixed(2)}`, rightAlign, yOffset, { align: 'right' });
    yOffset += 10;

    doc.setFontSize(11);
        doc.setFont('Times', 'bold');
    doc.text(`Genel Toplam:`, 14, yOffset);
    doc.text(`${Number(data.grandTotal ?? 0).toFixed(2)}`, rightAlign, yOffset, { align: 'right' });

    // Save the PDF
    doc.save(`${data.customerCommercialTitle ?? 'bilinmeyen'} - Sipariş Teklifi - ${new Date(data.invoiceDate).toLocaleDateString('tr-TR')}.pdf`);
};