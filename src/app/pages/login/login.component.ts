import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup
  serverMessage: string
  constructor(
    private fb: FormBuilder, 
    private firebaseAuth: AngularFireAuth,
    private router: Router
    ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['',[Validators.required]]
    });
  }
  
  onLogin() {
    try {
      this.firebaseAuth.auth.signInWithEmailAndPassword(this.email.value, this.password.value)
      .then(resp=>{
        this.router.navigate(['/','admin'])
      })
    }
    catch (err) {
      this.serverMessage = err;
    }
  }

  onLoginWithGoogle() {

  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }

  get passwordConfirm() {
    return this.form.get('passwordConfirm');
  }
}
