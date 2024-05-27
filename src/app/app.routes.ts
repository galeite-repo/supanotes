import { Routes } from '@angular/router';
import { AuthLoginComponent } from './auth/features/auth-login/auth-login.component';
import { AuthSignupComponent } from './auth/features/auth-signup/auth-signup.component';
import { NoteListComponent } from './notes/features/note-list/note-list.component';
import { privateGuard, publicGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [publicGuard],
    component: AuthLoginComponent,
  },
  {
    path: 'signup',
    canActivate: [publicGuard],
    component: AuthSignupComponent,
  },
  {
    path: '',
    canActivate: [privateGuard],
    component: NoteListComponent,
  },
];
