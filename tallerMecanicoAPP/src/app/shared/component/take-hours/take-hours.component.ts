import { Component, Input, OnInit, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { format, parseISO } from 'date-fns';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Attentions } from 'src/app/models/user.models';

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

  @Input() attention: Attentions;

form = new FormGroup({
  id: new FormControl(''),
  cliente_id: new FormControl(''),
  date: new FormControl(''),
  description: new FormControl('', [Validators.required, Validators.minLength(3)]),
  status: new FormControl(''),
  email: new FormControl('', [Validators.required, Validators.email]),
  name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  phone: new FormControl('', [Validators.required, Validators.minLength(9)]),
  vehicle: new FormControl('', [Validators.required, Validators.minLength(3)]),
});


  ngOnInit() {
    this.form.controls.date.setValue(this.getMinDate());
    if (this.attention) {
      this.form.setValue(this.attention);
    }
  }

  constructor(private auth: AngularFireAuth) {
    this.auth.authState.subscribe(user => {
      if (user) {
        this.getDatosUser(user.uid);
      } else {
      }
    });
  }

 

  async Submit(){
    if (this.form.valid) {
      if (this.attention) {
        this.updateAppointment();
      } else {
        this.scheduleAppointment();
      }
    }
  }


  async scheduleAppointment() {
    const path = 'appointments'; // Update the path to the main path
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      if (this.rol === 'cliente') {
        this.form.controls.status.setValue('Pendiente');
      } else if (this.rol === 'administrativo' || this.rol === 'mecanico' || this.rol === 'administrador') {
        this.form.controls.status.setValue('Aceptada');
      }
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

  async updateAppointment() {
    const path = `appointments/${this.attention.id}`; // Actualiza la ruta a la ruta principal
    const loading = await this.utilsSvc.loading();
    await loading.present();
    try {
      delete this.form.value.id;
      delete this.form.value.cliente_id;
      this.form.controls.date.setValue(format(parseISO(this.form.value.date), 'dd/MM/yyyy'));
      await this.firebaseSvc.updateDocument(path, this.form.value);
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Hora actualizada correctamente',
        duration: 2500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline'
      });
    } catch (error) {
      console.log(error);
      if (error instanceof RangeError && error.message === 'Invalid time value') {
        this.utilsSvc.presentToast({
          message: 'Por favor, seleccione una fecha.',
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      } else {
        this.utilsSvc.presentToast({
          message: 'Problema al actualizar la hora. ' + error.message,
          duration: 2500,
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        });
      }
    } finally {
      loading.dismiss();
    }
  }

  // =================== Fechas ===================
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

  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    this.form.controls.date.setValue(selectedDate);
    console.log(this.form.value.date);
  }

  // =================== FIN FECHAS ===================

  // Obtener rol
  getDatosUser( uid: string ){
    const path = 'users'
    const id = uid;
    this.firestore.collection(path).doc(id).valueChanges().subscribe( res => {
      
      
      const data = res as { perfil: string, uid: string} | undefined;
      if (data) {
        this.rol = data.perfil
        this.form.controls.cliente_id.setValue(data.uid);
      }
    })
    
  }
}

