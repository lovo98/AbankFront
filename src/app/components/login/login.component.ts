import { Component, OnInit } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzButtonModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  ngOnInit(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }

  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
  });

  submitForm(): void {
    if (this.validateForm.valid) {
      this.authService
        .login(
          this.validateForm.value.username,
          this.validateForm.value.password
        )
        .subscribe(
          (response) => {
            localStorage.setItem('authToken', response.token);
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            if (error.status === 200) {
              localStorage.setItem('authToken', 'aquiVaToken');
              this.router.navigate(['/dashboard']);
            } else {
              console.log('Ocurrio un error');
            }
          }
        );
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  constructor(
    private fb: NonNullableFormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}
}
