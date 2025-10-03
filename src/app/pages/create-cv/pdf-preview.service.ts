import { Injectable } from '@angular/core';
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

            const margin = 1; // lề trái/phải
            const imgWidth = pdfWidth - margin * 2;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let positionY = 0;

            // --- Trang đầu tiên ---
            const centerX = (pdfWidth - imgWidth) / 2; // căn giữa ngang
            pdf.addImage(imgData, "PNG", centerX, positionY, imgWidth, imgHeight);
            heightLeft -= pdfHeight;

            // --- Các trang tiếp theo ---
            while (heightLeft > 0) {
                pdf.addPage();
                positionY = heightLeft - imgHeight;

                // Vẫn căn giữa
                pdf.addImage(imgData, "PNG", centerX, positionY, imgWidth, imgHeight);
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