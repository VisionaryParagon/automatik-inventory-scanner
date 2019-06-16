import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Item } from '../../services/classes';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-admin-delete',
  templateUrl: './admin-delete.component.html',
  styleUrls: ['./admin-delete.component.scss']
})
export class AdminDeleteComponent implements OnInit {
  item: Item;
  success = false;
  error = false;

  constructor(
    private inventoryService: InventoryService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.item = this.data;
  }

  deleteUser() {
    this.inventoryService.deleteItem(this.item)
      .subscribe(
        res => this.success = true,
        err => this.showError()
      );
  }

  showError() {
    this.error = true;
  }

  hideError() {
    this.error = false;
  }
}
