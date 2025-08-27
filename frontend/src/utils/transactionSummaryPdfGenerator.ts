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
        doc.setFont('Times');
    } catch (error) {
        console.error("Error loading custom font: ", error);
        doc.setFont('Helvetica');
        alert("Uyarı: Özel karakterler PDF'te düzgün görüntülenemeyebilir çünkü font yüklenemedi.");
    }

    // --- PDF Content ---

    // Title
    doc.setFontSize(18);
    let title = "Siparis Teklifi";
    if (data.type === 'COLLECTION') {
        title = "Tahsilat Makbuzu";
    } else if (data.type === 'PAYMENT') {
        title = "Tediye Makbuzu";
    }
    doc.text(title, 14, 20);

    // Header Information
    doc.setFontSize(10);
    let yOffset = 30;
    doc.text(`Musteri Adi: ${data.customerCommercialTitle ?? 'N/A'}`, 14, yOffset);
    yOffset += 7;
    doc.text(`Tarih: ${new Date(data.invoiceDate).toLocaleDateString('tr-TR')}`, 14, yOffset);
    yOffset += 7;

    if (data.type === 'COLLECTION' || data.type === 'PAYMENT') {
        doc.setFontSize(12);
        doc.setFont('Times', 'bold');
        doc.text(`Miktar: ${Number(data.grandTotal ?? 0).toFixed(2)} TL`, 14, yOffset);
        doc.setFontSize(10);
        doc.setFont('Times', 'normal');
        yOffset += 10;
    }

    // Only show product table for SALE/PURCHASE
    if (data.type === 'SALE' || data.type === 'PURCHASE') {
        doc.text(`Fatura Tarihi: ${new Date(data.invoiceDate).toLocaleDateString('tr-TR')}`, 14, yOffset);
        yOffset += 7;
        doc.text(`Vade Tarihi: ${data.dueDate ? new Date(data.dueDate).toLocaleDateString('tr-TR') : 'N/A'}`, 14, yOffset);

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
        yOffset = finalY + 10;

        doc.setFontSize(10);
        const rightAlign = doc.internal.pageSize.width - 14;

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

    } else { // For COLLECTION and PAYMENT types, display balances differently
        const rightAlign = doc.internal.pageSize.width - 14;

        doc.text(`Müşteri Eski Bakiye:`, 14, yOffset);
        doc.text(`${Number(data.customerPreviousBalance ?? 0).toFixed(2)} TL`, rightAlign, yOffset, { align: 'right' });
        yOffset += 7;

        doc.text(`Müşteri Yeni Bakiye:`, 14, yOffset);
        doc.text(`${Number(data.customerNewBalance ?? 0).toFixed(2)} TL`, rightAlign, yOffset, { align: 'right' });
        yOffset += 7;

        doc.text(`Yukarıda belirtilen tutar TL hesabınıza işlenmiştir.`, 14, yOffset);
        yOffset += 7;

        doc.text(`En Son Bakiyeniz:`, 14, yOffset);
        doc.text(`${Number(data.customerNewBalance ?? 0).toFixed(2)} TL`, rightAlign, yOffset, { align: 'right' });
        yOffset += 7;
    }

    // Save the PDF
    doc.save(`${data.customerCommercialTitle ?? 'bilinmeyen'} - ${title} - ${new Date(data.invoiceDate).toLocaleDateString('tr-TR')}.pdf`);
};