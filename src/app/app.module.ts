import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';

// App Modules
import { AppRoutingModule } from './app-routing.module';
import { AppSharedModule } from './app-shared.module';

// Services
import { ContactService } from './services/contact.service';
import { InventoryService } from './services/inventory.service';
import { UserService } from './services/user.service';
import { AdminService } from './services/admin.service';
import { SortService } from './services/sort.service';

// Components
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';

// Services


@NgModule({
  imports: [
    AppRoutingModule,
    AppSharedModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule
  ],
  declarations: [
    AppComponent,
    MainComponent
  ],
  providers: [
    ContactService,
    InventoryService,
    UserService,
    AdminService,
    SortService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
