import { AfterViewInit, Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

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
  @Output() onSaveEvent = new EventEmitter<string>();


  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cropImage();

    }, 300)
  }

  private cropImage() {

    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const upload = document.getElementById("upload") as HTMLInputElement;
    const ctx = canvas.getContext("2d")!;
    const preview = document.getElementById("preview") as HTMLImageElement;

    const previewImageWidth = 150;
    const previewImageHeight = 150;

    let img = new Image();
    let cropBox = { x: 50, y: 50, w: previewImageWidth, h: previewImageHeight };
    let isDragging = false;


    // Load ảnh
    upload.addEventListener("change", (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      // nếu không phải hình ảnh thì khong cho upload
      if (!file.type.startsWith("image/")) {

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File must be an image'
        })

        return;
      }

      // nếu kích thước file lớn hơn 5mb thì khong cho upload
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
      canvas.width = 300;
      canvas.height = 300;
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
      ctx.strokeRect(cropBox.x, cropBox.y, cropBox.w, cropBox.h);

      loadImagePreview();
    }

    function loadImagePreview() {
      // Load ảnh preview
      const { x, y, w, h } = cropBox;

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
        e.offsetX > cropBox.x &&
        e.offsetX < cropBox.x + cropBox.w &&
        e.offsetY > cropBox.y &&
        e.offsetY < cropBox.y + cropBox.h
      ) {
        isDragging = true;
      }
    });

    canvas.addEventListener("mousemove", e => {
      if (isDragging) {
        cropBox.x = e.offsetX - cropBox.w / 2;
        cropBox.y = e.offsetY - cropBox.h / 2;
        draw();
      }
    });

    canvas.addEventListener("mouseup", () => (isDragging = false));
  }

  onUpload() {
    document.getElementById("upload")?.click();
  }

  onSave() {
    const preview = document.getElementById("preview") as HTMLImageElement;
    this.onSaveEvent.emit(preview.src);
  }

}
