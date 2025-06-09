import { Routes } from '@angular/router';
import { ERouters } from '../shared/interfaces/enuns/e-routers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: ERouters.HOME,
    pathMatch: 'full',
  },
  {
    path: ERouters.HOME,
    loadComponent: () => import('./routes/home/home.page').then( m => m.GenPostPage)
  },
  {
    path: 'config',
    loadComponent: () => import('./routes/config/config.page').then( m => m.ConfigPage)
  },
  {
    path: 'singup',
    loadComponent: () => import('./routes/singup/singup.page').then( m => m.SingupPage)
  },
];
