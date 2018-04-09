import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatDialogModule,
  MatInputModule,
  MatSelectModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

import { CookieModule } from 'ngx-cookie';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxDatatableModule,
    ZXingScannerModule.forRoot(),
    CookieModule.forRoot()
  ],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxDatatableModule,
    ZXingScannerModule,
    CookieModule
  ]
})
export class AppSharedModule { }
