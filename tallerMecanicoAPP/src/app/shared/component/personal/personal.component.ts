import { Component, OnInit, inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.models';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePersonalComponent } from '../add-update-personal/add-update-personal.component';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent implements OnInit {
  users: User[] = [];

  constructor(private firebaseSvc: FirebaseService) {}
  utilsSvc = inject(UtilsService);
  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.firebaseSvc.getUsers().subscribe((users) => {
      this.users = users;
    });
  }
  
  addUpdatePersonal() {
    this.utilsSvc.presentModal({
      component: AddUpdatePersonalComponent,
      cssClass: 'add-update-modal'
    })
  }
}