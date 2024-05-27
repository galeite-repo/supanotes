import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

interface SignUpForm {
  email: FormControl<null | string>;
  password: FormControl<null | string>;
}
@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './auth-signup.component.html',
  styleUrl: './auth-signup.component.scss',
})
export class AuthSignupComponent {
  private _formBuilder = inject(FormBuilder);
  private _authService = inject(AuthService);

  form = this._formBuilder.group<SignUpForm>({
    email: this._formBuilder.control(null, [
      Validators.required,
      Validators.email,
    ]),
    password: this._formBuilder.control(null, [Validators.required]),
  });

  async submit() {
    if (this.form.invalid) return;

    try {
      const { error } = await this._authService.signup({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      });
      if (error) throw error;

      // alert('E-mail ou Senha Inválidos!');
    } catch (error) {
      console.error(error);
    }
  }
}
