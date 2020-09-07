import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Register } from '../../models/register/register.model';

@Component({
  selector: 'app-register-client',
  templateUrl: './register-client.component.html',
  styleUrls: ['./register-client.component.scss']
})
export class RegisterClientComponent implements OnInit {

  loading = false;
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      userName: [null, Validators.required],
      password: [null, Validators.required, Validators.minLength(8), Validators.maxLength(64)],
      passwordConfirm: [null, Validators.required, Validators.minLength(8), Validators.maxLength(64)],
      phoneNumber: null
    });
  }

  onSubmit(registerForm: Register, formDirective: FormGroupDirective): void {
    this.loading = true;
    this.authService.createClientUser(registerForm)
      .subscribe(
        data => {
          this.snackBar.open('註冊成功', '關閉', { duration: 5000 });
          formDirective.resetForm();
          this.registerForm.reset();
          this.loading = false;
        },
        error => {
          this.snackBar.open('註冊失敗', '關閉', { duration: 5000 });
          this.loading = false;
        }
      );
  }

}
