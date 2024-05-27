import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

interface LoginForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './auth-login.component.html',
  styleUrl: './auth-login.component.scss',
})
export class AuthLoginComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);

  form = this._formBuilder.group<LoginForm>({
    email: this._formBuilder.control(null, [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control(null, [Validators.required]),
  });

  async submit() {
    if (this.form.invalid) return;

    try {
      const { error } = await this._authService.login({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      if (error) throw error;

      this._router.navigateByUrl('/');
    } catch (error) {
      if(error instanceof Error){
        console.error(error);
      }
    }
  }

  async authWithGoogle(){
    try {
      await this._authService.signInWithGoogle()
    } catch (error) {
      console.log(error);
    }
  }
  async authWithGithub(){
    try {
      await this._authService.signInWithGithub()
    } catch (error) {
      console.log(error);
    }
  }
}
