import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Contact, Item } from '../../services/classes';
import { ContactService } from '../../services/contact.service';
import { InventoryService } from '../../services/inventory.service';
import { SortService } from '../../services/sort.service';

import { FadeAnimation, TopDownAnimation } from '../../animations';

@Component({
  selector: 'app-admin-form',
  templateUrl: './admin-form.component.html',
  styleUrls: ['./admin-form.component.css'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class AdminFormComponent implements OnInit {
  item: Item = new Item();
  itemCache: Item = new Item();
  contacts: Contact[];
  sortOptions = [
    'first_name'
  ];
  edit = false;
  loading = false;
  success = false;
  error = false;

  constructor(
    private modalService: MatDialog,
    private modalRef: MatDialogRef<AdminFormComponent>,
    private contactService: ContactService,
    private inventoryService: InventoryService,
    private sortService: SortService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.item = this.data;
    this.getContacts();

    if (this.item._id) {
      this.edit = true;
      this.itemCache = {...this.data};
    } else {
      this.edit = false;
    }
  }

  getContacts() {
    this.contactService.getContacts()
      .then(res => {
        this.contacts = this.sortService.sort(res.filter(c => c.last_name.length > 1), this.sortOptions);
      })
      .catch(() => {
        this.showError('Could not get contacts');
      });
  }

  setUser(checked) {
    if (checked === 'In') {
      this.item.name = '';
      this.item.reason = '';
    }
  }

  createItem(data) {
    this.inventoryService.createItem(data)
      .then((res) => {
        // console.log('Item creation success');
        this.item = res;
        this.itemCache = {...res};
        this.loading = false;
        this.success = true;
      })
      .catch(() => {
        this.showError('Item creation fail');
        this.loading = false;
      });
  }

  updateItem(data) {
    this.inventoryService.updateItem(data)
      .then((res) => {
        // console.log('Update item success');
        this.item = res;
        this.itemCache = {...res};
        this.loading = false;
        this.success = true;
      })
      .catch(() => {
        this.showError('Update item fail');
        this.loading = false;
      });
  }

  submit(data, form) {
    form.submitted = true;

    if (form.valid) {
      this.loading = true;

      if (!this.edit) {
        // New
        this.createItem(data);
      } else {
        // Edit
        this.updateItem(data);
      }
    }
    return false;
  }

  goAgain(form) {
    if (!this.edit) {
      this.item = new Item();
    }
    this.success = false;
    form.submitted = false;
  }

  showError(err) {
    console.log(err);
    this.loading = false;
    this.error = true;
  }

  hideError() {
    this.error = false;
  }

  cacheCheck() {
    if (this.item.item !== this.itemCache.item ||
        this.item.name !== this.itemCache.name ||
        this.item.reason !== this.itemCache.reason ||
        this.item.checked !== this.itemCache.checked) {
      return true;
    } else {
      return false;
    }
  }

  close() {
    if (this.cacheCheck()) {
      if (confirm('All unsaved changes will be lost if this form is closed.\n\nAre you sure you want to close it?')) {
        this.modalRef.close();
      }
    } else {
      this.modalRef.close();
    }
  }
}
