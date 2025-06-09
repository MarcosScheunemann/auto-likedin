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
    loadComponent: () => import('./routes/gen-post/gen-post.page').then( m => m.GenPostPage)
  },
];
