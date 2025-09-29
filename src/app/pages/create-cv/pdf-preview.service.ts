import { inject, Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from "jspdf";

@Injectable({
    providedIn: 'root',
})
export class PdfPreviewService {
    previewPdf(selector: string) {
        html2canvas(document.querySelector(selector)!, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // const imgWidth = pdfWidth;
            // const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const margin = 3; // mm - lề trái/phải/trên/dưới

            const usableWidth = pdfWidth - margin * 2;
            const usableHeight = (canvas.height * usableWidth) / canvas.width;

            let heightLeft = usableHeight;

            // tính vị trí x để căn giữa
            const centerX = (pdfWidth - usableWidth) / 2;
            const centerY = (pdfHeight - usableHeight) / 2;


            // Trang đầu tiên
            pdf.addImage(imgData, "PNG", centerX, centerY, usableWidth, usableHeight);
            heightLeft -= pdfHeight;

            // Các trang tiếp theo
            while (heightLeft > 0) {
                pdf.addPage();
                pdf.addImage(imgData, "PNG", centerX, centerY, usableWidth, usableHeight);
                heightLeft -= pdfHeight - margin * 2;
            }

            // Lấy blob thay vì save
            const blob = pdf.output("blob");

            // Convert blob thành object URL
            const url = URL.createObjectURL(blob);

            window.open(url, '_blank');
        });

    }
}