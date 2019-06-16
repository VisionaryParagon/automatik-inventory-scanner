import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// App Modules
import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './app-shared.module';

// Services
import { ContactService } from './services/contact.service';
import { InventoryService } from './services/inventory.service';
import { AdminService } from './services/admin.service';
import { SortService } from './services/sort.service';

// Components
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';


@NgModule({
  imports: [
    AppRoutingModule,
    AppSharedModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    MainComponent
  ],
  providers: [
    AdminService,
    SortService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
