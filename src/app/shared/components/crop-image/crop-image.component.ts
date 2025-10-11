import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-crop-image',
  standalone: true,
  imports: [
    ButtonModule
  ],
  templateUrl: './crop-image.component.html',
  styleUrl: './crop-image.component.scss'
})
export class CropImageComponent implements AfterViewInit {

  // inject region
  private messageService = inject(MessageService);

  // out in region
  @Input() src = '';
  @Input() width = 56;
  @Input() height = 56;
  @Output() onSaveEvent = new EventEmitter<string>();

  multiplier = 1;
  cropBox = { x: 50, y: 50, w: this.width * this.multiplier, h: this.height * this.multiplier };
  img: any;
  @ViewChild('canvas') canvas?: ElementRef;
  @ViewChild('upload') upload?: ElementRef;
  @ViewChild('preview') preview?: ElementRef;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cropImage();
    }, 300)
  }

  zoomIn() {
    if (this.multiplier == 3) return;
    this.multiplier += 0.5;

    this.initCropBox();
    this.draw();
  }

  zoomOut() {
    if (this.multiplier == 1) return;
    this.multiplier -= 0.5;

    this.initCropBox();
    this.draw();
  }

  private initCropBox() {

    const w = this.width * this.multiplier;
    const h = this.height * this.multiplier;

    this.cropBox = { x: 50, y: 50, w: w > 300 ? 280 : w, h: h > 300 ? 280 : h };
  }

  private cropImage() {

    this.img = new Image();
    this.initCropBox();
    let isDragging = false;

    // Load ảnh
    this.upload?.nativeElement.addEventListener("change", (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      // nếu không phải hình ảnh thì không cho upload
      if (!file.type.startsWith("image/")) {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Không phải hình ảnh'
        })

        return;
      }

      // nếu kích thước file lớn hơn 5mb thì không cho upload
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Kích thước tối đa 5MB'
        })
        return;
      }


      const reader = new FileReader();
      reader.onload = () => {
        this.img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

    // Vẽ lại canvas khi ảnh load
    this.img.onload = () => {
      this.canvas!.nativeElement.width = 300;
      this.canvas!.nativeElement.height = 300;
      this.draw();
    };

    // Drag crop box
    this.canvas?.nativeElement.addEventListener("pointerdown", (e: any) => {
      if (
        e.offsetX > this.cropBox.x &&
        e.offsetX < this.cropBox.x + this.cropBox.w &&
        e.offsetY > this.cropBox.y &&
        e.offsetY < this.cropBox.y + this.cropBox.h
      ) {
        isDragging = true;
      }
    });

    // this.canvas?.nativeElement.addEventListener("mousemove", (e: any) => {
    //   if (isDragging) {
    //     this.cropBox.x = e.offsetX - this.cropBox.w / 2;
    //     this.cropBox.y = e.offsetY - this.cropBox.h / 2;
    //     this.draw();
    //   }
    // });

    this.canvas?.nativeElement.addEventListener("pointermove", (e: any) => {
      if (isDragging) {
        this.cropBox.x = e.offsetX - this.cropBox.w / 2;
        this.cropBox.y = e.offsetY - this.cropBox.h / 2;
        this.draw();
      }
    });

    this.canvas?.nativeElement.addEventListener("pointerup", () => (isDragging = false));
  }

  private loadImagePreview() {
    // Load ảnh preview
    const { x, y, w, h } = this.cropBox;

    // Tạo canvas tạm để lấy phần crop
    const tmpCanvas = document.createElement("canvas");
    const tmpCtx = tmpCanvas.getContext("2d")!;
    tmpCanvas.width = w;
    tmpCanvas.height = h;

    tmpCtx.drawImage(this.canvas?.nativeElement, x + 1, y + 1, w - 2, h - 2, 0, 0, w, h);

    // Xuất blob
    tmpCanvas.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      this.preview!.nativeElement.src = url; // Gắn blob vào <img>
    }, "image/png");

  }

  private draw() {

    const ctx = this.canvas?.nativeElement.getContext("2d");

    ctx.clearRect(0, 0, this.canvas?.nativeElement.width, this.canvas?.nativeElement.height);
    // Tính toán scale để ảnh vừa với canvas
    const scale =
      (this.img.width > this.canvas?.nativeElement.width || this.img.height > this.canvas?.nativeElement.height) ?
        Math.min(this.canvas?.nativeElement.width / this.img.width, this.canvas?.nativeElement.height / this.img.height)
        : 1;
    const newWidth = this.img.width * scale;
    const newHeight = this.img.height * scale;

    // Canh giữa ảnh trong canvas
    const x = (this.canvas?.nativeElement.width - newWidth) / 2;
    const y = (this.canvas?.nativeElement.height - newHeight) / 2;

    // Vẽ ảnh vào canvas
    ctx.fillStyle = "transparent";
    ctx.fillRect(0, 0, this.canvas?.nativeElement.width, this.canvas?.nativeElement.height);
    ctx.drawImage(this.img, x, y, newWidth, newHeight);

    // Vẽ khung crop
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.cropBox.x, this.cropBox.y, this.cropBox.w, this.cropBox.h);

    this.loadImagePreview();
  }

  onUpload() {
    this.upload?.nativeElement.click();
  }

  async onSave() {
    // return base64 image
    const base64 = await this.blobUrlToBase64(this.preview?.nativeElement.src);

    this.onSaveEvent.emit(base64);
  }


  private async blobUrlToBase64(blobUrl: string): Promise<string> {
    const response = await fetch(blobUrl);       // Lấy blob từ blob URL
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob); // convert Blob -> Base64
    });
  }

}
