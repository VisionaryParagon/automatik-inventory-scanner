import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminGuardService } from '../services/admin-guard.service';

import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        canActivate: [AdminGuardService],
        component: AdminHomeComponent
      },
      {
        path: 'login',
        component: AdminLoginComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/admin'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AdminGuardService
  ]
})
export class AdminRoutingModule {}
