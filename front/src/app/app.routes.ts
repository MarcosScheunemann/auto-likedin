import { Routes } from '@angular/router';
import { ERouters } from '../shared/interfaces/enuns/e-routers';

export const routes: Routes = [
  {
    path: ERouters.HOME,
    loadComponent: () => import('./routes/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: ERouters.HOME,
    pathMatch: 'full',
  },
];
