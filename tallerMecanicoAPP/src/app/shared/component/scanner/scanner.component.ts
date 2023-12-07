import { Component, EventEmitter, Inject, Injectable, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import {
  BarcodeScanner,
  BarcodeFormat,
  LensFacing,
  Barcode,
} from '@capacitor-mlkit/barcode-scanning';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss'],
})
@Injectable()
export class ScannerComponent implements OnInit {
  @Output()
  barcode = new EventEmitter<Barcode>();
  barcodeFormat = BarcodeFormat;
  barcodes: Barcode[] = [];
 

  constructor(private utilsSvc: UtilsService) {}

  ngOnInit() {}

  formGroup = new UntypedFormGroup({
    formats: new UntypedFormControl([]),
    lensFacing: new UntypedFormControl(LensFacing.Back),
    googleBarcodeScannerModuleInstallState: new UntypedFormControl(0),
    googleBarcodeScannerModuleInstallProgress: new UntypedFormControl(0),
  });

  startScan() {
    // The camera is visible behind the WebView, so that you can customize the UI in the WebView.
    // However, this means that you have to hide all elements that should not be visible.
    // In this case we set a class `barcode-scanner-active`, which then contains certain CSS rules for our app.
    document.querySelector('body')?.classList.add('barcode-scanner-active');
    // Add the `barcodeScanned` listener
    const listener = BarcodeScanner.addListener(
      'barcodeScanned',
      result => {
        this.barcode.emit(result.barcode);
      },
    );
    // Start the barcode scanner
    BarcodeScanner.startScan();
  }

  stopScan() {
    // Make all elements in the WebView visible again
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
    // Remove all listeners
    BarcodeScanner.removeAllListeners();
    // Stop the barcode scanner
    BarcodeScanner.stopScan();
  }

  scanSingleBarcode() {
    return new Promise(resolve => {
      document.querySelector('body')?.classList.add('barcode-scanner-active');
      const listener = BarcodeScanner.addListener(
        'barcodeScanned',
        result => {
          listener.remove();
          document
            .querySelector('body')
            ?.classList.remove('barcode-scanner-active');
          BarcodeScanner.stopScan();
          resolve(result.barcode);
        },
      );
      BarcodeScanner.startScan();
    });
  }

  async scan() {
    this.startScan();
    this.isGoogleBarcodeScannerModuleAvailable();
    this.installGoogleBarcodeScannerModule();
    const { barcodes } = await BarcodeScanner.scan({
      formats: [BarcodeFormat.QrCode],
    });
    this.utilsSvc.presentToast({
      message: 'Se ha escaneado el código correctamente',
      duration: 3000,
      color: 'success',
      position: 'middle',
      icon: 'checkmark-circle-outline'
    });
    this.barcodes = barcodes;
    return barcodes;
  }

  async isSupported() {
    const { supported } = await BarcodeScanner.isSupported();
    return supported;
  }

  async enableTorch() {
    await BarcodeScanner.enableTorch();
  }

  async disableTorch() {
    await BarcodeScanner.disableTorch();
  }

  async  toggleTorch() {
    await BarcodeScanner.toggleTorch();
  }

  async  isTorchEnabled() {
    const { enabled } = await BarcodeScanner.isTorchEnabled();
    return enabled;
  }

  async isTorchAvailable() {
    const { available } = await BarcodeScanner.isTorchAvailable();
    return available;
  }

  async  openSettings() {
    await BarcodeScanner.openSettings();
  }

  async  isGoogleBarcodeScannerModuleAvailable() {
    const { available } =
      await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();
    return available;
  }

  async  installGoogleBarcodeScannerModule() {
    await BarcodeScanner.installGoogleBarcodeScannerModule();
  }
}