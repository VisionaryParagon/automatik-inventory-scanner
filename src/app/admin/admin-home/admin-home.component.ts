import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';

import { CookieService } from 'ngx-cookie';

import { Item } from '../../services/classes';
import { InventoryService } from '../../services/inventory.service';
import { AdminService } from '../../services/admin.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

import { AdminFormComponent } from '../admin-form/admin-form.component';
import { AdminDeleteComponent } from '../admin-delete/admin-delete.component';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class AdminHomeComponent implements OnInit {
  loading = false;
  inventory = [];
  filteredInventory = [];
  item: Item;
  filter = '';
  selected = [];
  columns: any[] = [
    { prop: 'item', name: 'Item', width: 300 },
    { prop: 'checked', name: 'Status', width: 100 },
    { prop: 'name', name: 'Checked Out By', width: 250 },
    { prop: 'reason', name: 'Reason for Check-Out', width: 300 },
    { prop: 'date', name: 'Modified Date', width: 250 }
  ];
  modalOptions = {
    maxWidth: '768px'
  };
  error = false;

  constructor(
    private router: Router,
    private modalService: MatDialog,
    private cookieService: CookieService,
    private inventoryService: InventoryService,
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.getInventory();
  }

  getInventory() {
    this.loading = true;
    this.inventoryService.getItems()
      .then(res => {
        this.inventory = res;
        this.filteredInventory = [...res];
        if (this.filter) {
          this.updateFilter();
        }
        this.loading = false;
      })
      .catch(() => {
        this.showError();
      });
  }

  resetInventory() {
    this.filter = '';
    this.selected = [];
    this.getInventory();
  }

  openNew() {
    const modal = this.modalService.open(AdminFormComponent, {
      data: new Item(),
      maxHeight: '90%',
      maxWidth: '768px',
      width: '80%'
    });
    modal.afterClosed().subscribe(result => {
      this.resetInventory();
    });
  }

  openEdit(info) {
    const modal = this.modalService.open(AdminFormComponent, {
      data: info,
      maxHeight: '90%',
      maxWidth: '768px',
      width: '80%'
    });
    modal.afterClosed().subscribe(result => {
      this.resetInventory();
    });
  }

  openDelete(info) {
    const modal = this.modalService.open(AdminDeleteComponent, {
      data: info,
      maxHeight: '90%',
      maxWidth: '768px',
      width: '80%'
    });
    modal.afterClosed().subscribe(result => {
      this.resetInventory();
    });
  }

  updateFilter() {
    const val = this.filter.toLowerCase();

    const filtered = this.filteredInventory.filter(d => {
      return  d.item.toLowerCase().indexOf(val) !== -1 ||
              d.checked.toLowerCase().indexOf(val) !== -1 ||
              d.name.toLowerCase().indexOf(val) !== -1 ||
              d.reason.toLowerCase().indexOf(val) !== -1;
    });

    this.inventory = filtered;
  }

  clearFilter() {
    this.filter = '';
    this.getInventory();
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}
