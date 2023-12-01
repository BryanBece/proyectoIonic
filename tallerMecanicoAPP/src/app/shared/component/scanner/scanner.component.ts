import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { VIDEO_CONFIG } from "./scanner.const";
import jsQR from "jsqr";
import { Subject, takeUntil, timer } from "rxjs";

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoElement') video!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  videoStream!: MediaStream;
  config = { ...VIDEO_CONFIG };
  private destroy$ = new Subject<void>();
  result = '';

  ngAfterViewInit(): void {
    this.prepareScanner();
  }

  async prepareScanner(): Promise<void> {
    const available = await this.checkCamera();
    if (available) {
      this.startScanner();
    }
  }

  changeCamera(): void {
    let { facingMode } = this.config.video;
    this.config.video.facingMode = facingMode === 'environment' ? 'user' : 'environment';
    this.startScanner();
  }

  async startScanner(): Promise<void> {
    this.videoStream = await navigator.mediaDevices.getUserMedia(this.config);
    this.video.nativeElement.srcObject = this.videoStream;
    this.spyCamera();
  }

  spyCamera(): void {
    if (this.video.nativeElement && this.canvas.nativeElement) {
      const { clientWidth, clientHeight } = this.video.nativeElement;
      this.canvas.nativeElement.width = clientWidth;
      this.canvas.nativeElement.height = clientHeight;
      const canvas = this.canvas.nativeElement.getContext('2d');
      canvas.drawImage(this.video.nativeElement, 0, 0, clientWidth, clientHeight);
      const inversionAttempts = 'dontInvert';
      const imageData = canvas.getImageData(0, 0, clientWidth, clientHeight);
      const qrcode = jsQR(imageData.data, imageData.width, clientHeight, { inversionAttempts });
      if (qrcode) {
        const { data } = qrcode;
        this.result = data;
      } else {
        timer(100).pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.spyCamera();
        });
      }
    }
  }

  async checkCamera(): Promise<boolean> {
    const cameraPermissions = await navigator.permissions.query({ name: 'camera' } as any);
    const isOk = cameraPermissions.state !== "denied";
    const hasMediaDevice = 'mediaDevices' in navigator;
    const hasUserMedia = 'getUserMedia' in navigator.mediaDevices;
    if (!hasMediaDevice || (!hasUserMedia && isOk)) {
      alert("No se puede acceder a la cámara, por favor verifique los permisos de la aplicación.");
    }
    return cameraPermissions.state !== "denied";
  }

  ngOnDestroy(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach((track) => track.stop());
    }
    this.video = null!;
    this.destroy$.next();
    this.destroy$.complete();
  }
}