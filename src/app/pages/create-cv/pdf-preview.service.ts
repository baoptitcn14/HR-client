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

            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            // Trang đầu tiên
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            // Các trang tiếp theo
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            // Lấy blob thay vì save
            const blob = pdf.output("blob");

            // Convert blob thành object URL
            const url = URL.createObjectURL(blob);

            window.open(url, '_blank');
        });

    }
}