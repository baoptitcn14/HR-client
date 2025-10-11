import { AfterViewInit, Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
  @Input() width = 150;
  @Input() height = 150;
  @Output() onSaveEvent = new EventEmitter<string>();

  multiplier = 2;
  cropBox = { x: 50, y: 50, w: this.width * this.multiplier, h: this.height * this.multiplier };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cropImage();
    }, 300)
  }

  zoomIn() {
    if (this.multiplier == 2) return;
    this.multiplier += 0.5;

    this.initCropBox();
  }

  zoomOut() {
    if (this.multiplier == 1) return;
    this.multiplier -= 0.5;

    this.initCropBox();
  }

  private initCropBox() {
    this.cropBox = { x: 50, y: 50, w: this.width * this.multiplier, h: this.height * this.multiplier };
  }

  private cropImage() {

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const upload = document.getElementById("upload") as HTMLInputElement;
    const ctx = canvas.getContext("2d")!;
    const preview = document.getElementById("preview") as HTMLImageElement;

    let img = new Image();
    this.initCropBox();
    let isDragging = false;
    let self = this;

    // Load ảnh
    upload.addEventListener("change", (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      // nếu không phải hình ảnh thì không cho upload
      if (!file.type.startsWith("image/")) {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File must be an image'
        })

        return;
      }

      // nếu kích thước file lớn hơn 5mb thì không cho upload
      if (file.size > 5 * 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size must be less than 5MB'
        })
        return;
      }


      const reader = new FileReader();
      reader.onload = () => {
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });

    // Vẽ lại canvas khi ảnh load
    img.onload = () => {
      canvas.width = 450;
      canvas.height = 450;
      draw();
    };

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Tính toán scale để ảnh vừa với canvas
      const scale =
        (img.width > canvas.width || img.height > canvas.height) ?
          Math.min(canvas.width / img.width, canvas.height / img.height)
          : 1;
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;

      // Canh giữa ảnh trong canvas
      const x = (canvas.width - newWidth) / 2;
      const y = (canvas.height - newHeight) / 2;

      // Vẽ ảnh vào canvas
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, x, y, newWidth, newHeight);

      // Vẽ khung crop
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 2;
      ctx.strokeRect(self.cropBox.x, self.cropBox.y, self.cropBox.w, self.cropBox.h);

      loadImagePreview();
    }

    function loadImagePreview() {
      // Load ảnh preview
      const { x, y, w, h } = self.cropBox;

      // Tạo canvas tạm để lấy phần crop
      const tmpCanvas = document.createElement("canvas");
      const tmpCtx = tmpCanvas.getContext("2d")!;
      tmpCanvas.width = w;
      tmpCanvas.height = h;

      tmpCtx.drawImage(canvas, x + 1, y + 1, w - 2, h - 2, 0, 0, w, h);

      // Xuất blob
      tmpCanvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        preview.src = url; // Gắn blob vào <img>
      }, "image/png");

    }


    // Drag crop box
    canvas.addEventListener("mousedown", e => {
      if (
        e.offsetX > this.cropBox.x &&
        e.offsetX < this.cropBox.x + this.cropBox.w &&
        e.offsetY > this.cropBox.y &&
        e.offsetY < this.cropBox.y + this.cropBox.h
      ) {
        isDragging = true;
      }
    });

    canvas.addEventListener("mousemove", e => {
      if (isDragging) {
        this.cropBox.x = e.offsetX - this.cropBox.w / 2;
        this.cropBox.y = e.offsetY - this.cropBox.h / 2;
        draw();
      }
    });

    canvas.addEventListener("mouseup", () => (isDragging = false));
  }

  onUpload() {
    document.getElementById("upload")?.click();
  }

  async onSave() {
    const preview = document.getElementById("preview") as HTMLImageElement;

    // return base64 image
    const base64 = await this.blobUrlToBase64(preview.src);

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
