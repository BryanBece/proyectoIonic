import { Component, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { format, parseISO } from 'date-fns';

@Component({
  selector: 'app-take-hours',
  templateUrl: './take-hours.component.html',
  styleUrls: ['./take-hours.component.scss'],
})
export class TakeHoursComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  firestore = inject(AngularFirestore);
  rol: string = '';

form = new FormGroup({
  id: new FormControl(''),
  date: new FormControl(''),
  description: new FormControl('', [Validators.required, Validators.minLength(3)]),
  status: new FormControl(''),
  email: new FormControl('', [Validators.required, Validators.email]),
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  telefono: new FormControl('', [Validators.required, Validators.minLength(9)]),
  vehicle: new FormControl('', [Validators.required, Validators.minLength(3)]),
});


  ngOnInit() {
    this.form.controls.date.setValue(this.getMinDate());
    console.log(this.form.value.date);
  }

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.form.controls.date.setValue(selectedDate);
    console.log(this.form.value.date);
  }
  
  

  async Submit(){
    const path = 'appointments'; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      delete this.form.value.id;
      this.form.controls.date.setValue(format(parseISO(this.form.value.date), 'dd/MM/yyyy'));
      await this.firebaseSvc.addDocument(path, this.form.value);
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Hora agendada correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problema al agendar la hora. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }


  async scheduleAppointment() {
    const path = 'appointments'; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      delete this.form.value.id;
      await this.firebaseSvc.addDocument(path, this.form.value);
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Appointment scheduled successfully',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Problem scheduling the appointment. ' + error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      });
    } finally {
      loading.dismiss();
    }
  }

  // Fecha minima para el datepicker
  getMinDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const formattedDate = `${year}-${this.padZero(month)}-${this.padZero(day)}`;
    return formattedDate;
  }
  
  padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  // Obtener rol
  getDatosUser( uid: string ){
    const path = 'users'
    const id = uid;
    this.firestore.collection(path).doc(id).valueChanges().subscribe( res => {
      
      
      const data = res as { perfil: string } | undefined;
      if (data) {
        this.rol = data.perfil
      }
    })
    
  }
}

