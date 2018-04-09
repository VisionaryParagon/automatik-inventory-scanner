import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Modules
import { AppSharedModule } from '../app-shared.module';
import { AdminRoutingModule } from './admin-routing.module';

// Components
import { AdminComponent } from './admin.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminFormComponent } from './admin-form/admin-form.component';
import { AdminDeleteComponent } from './admin-delete/admin-delete.component';

@NgModule({
  declarations: [
    AdminComponent,
    AdminHomeComponent,
    AdminLoginComponent,
    AdminFormComponent,
    AdminDeleteComponent
  ],
  entryComponents: [
    AdminFormComponent,
    AdminDeleteComponent
  ],
  imports: [
    CommonModule,
    AppSharedModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
