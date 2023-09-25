import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],

})
export class LoginPage implements OnInit {
  usuario = '';

  constructor(private router: Router) { }


  firebaseSvb = inject(FirebaseService);

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })



  ngOnInit() { }

  Submit() {

    if (this.form.valid) {
      this.firebaseSvb.signIn(this.form.value as User).then((res) => {
        console.log(res);
        this.router.navigate(['/perfil']);
      }
      ).catch((err) => {
        console.log(err);
      });
    this.router.navigate(['/perfil']);
  }
}

}
