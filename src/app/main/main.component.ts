import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Contact, Item } from '../services/classes';
import { ContactService } from '../services/contact.service';
import { InventoryService } from '../services/inventory.service';
import { SortService } from '../services/sort.service';

import { FadeAnimation, TopDownAnimation } from '../animations';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  animations: [ FadeAnimation, TopDownAnimation ]
})
export class MainComponent implements OnInit {
  contacts: Contact[];
  selectedContact: Contact;
  inventory: Item[];
  userName: string;
  userItems = [];
  selectedUser = false;
  checkOut: boolean;
  sortOptions = [
    'first_name'
  ];
  anyVal: any;
  loading = false;
  submitting = false;
  success = false;
  error = false;

  @ViewChild('scanner')
  scanner;

  hasCameras = false;
  hasPermission: boolean;
  startScanning = false;
  selectedDevice: MediaDeviceInfo;
  scannedItems = [];

  reasonFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private contactService: ContactService,
    private inventoryService: InventoryService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.getContacts();
    this.initScanner();
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

  getInventory(user?) {
    this.inventoryService.getItems()
      .then(res => {
        this.inventory = res;
        if (user) {
          this.userItems = this.inventory.filter(item => item.name === user);
        }
        this.loading = false;
      })
      .catch(() => {
        this.showError('Could not get inventory');
      });
  }

  initScanner() {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      // console.log('Devices: ', devices);

      // selects the devices's front camera by default
      for (const device of devices) {
        if (/front|facetime/gi.test(device.label)) {
          this.scanner.changeDevice(device);
          this.selectedDevice = device;
          break;
        }
      }
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });
  }

  checkItems(contact) {
    this.loading = true;
    this.userName = contact.first_name + ' ' + contact.last_name;

    this.getInventory(this.userName);
  }

  setCheckOut() {
    this.checkOut = true;
    this.selectedUser = true;
    this.startScanning = true;
  }

  setCheckIn() {
    this.checkOut = false;
    this.selectedUser = true;
    this.startScanning = true;
  }

  handleQrCodeResult(scan: string) {
    // console.log('Result: ', scan);
    const itemCheck = this.inventory.filter(i => i.item === scan);
    const scanCheck = this.scannedItems.filter(i => i === scan);
    const userCheck = this.userItems.filter(i => i.item === scan);

    if (this.checkOut) {
      // check-out scans
      if (itemCheck.length) {
        if (itemCheck[0].checked === 'In') {
          if (!scanCheck.length) {
            this.scannedItems.push(scan);
          } else {
            alert('Item already scanned.');
          }
        } else {
          if (itemCheck[0].name === this.userName) {
            alert('You have already checked out this item.');
          } else {
            const anyway = confirm('This item is already checked out by ' + itemCheck[0].name + '.\n\nCheck-out anyway?');
            if (anyway) {
              // Check item back in
              this.checkItemIn(scan);

              // Add item to scan list
              this.scannedItems.push(scan);
            }
          }
        }
      } else {
        alert('Item not in inventory.');
      }
    } else {
      // check-in scans
      if (itemCheck.length) {
        if (itemCheck[0].checked === 'Out') {
          if (!scanCheck.length) {
            if (userCheck.length) {
              this.scannedItems.push(scan);
            } else {
              const anyway = confirm('This item is checked out by ' + itemCheck[0].name + '.\n\nCheck-in anyway?');
              if (anyway) {
                // Add item to scan list
                this.scannedItems.push(scan);
              }
            }
          } else {
            alert('Item already scanned.');
          }
        } else {
          alert('Item is not checked out.');
        }
      } else {
        alert('Item not in inventory.');
      }
    }
  }

  removeItem(item) {
    const idx = this.scannedItems.indexOf(item);

    if (idx > -1) {
      this.scannedItems.splice(idx, 1);
    }
  }

  updateInventory(item) {
    this.inventoryService.updateItem(item)
      .then(res => {
        console.log(res.item + ' updated', 'checked: ' + res.checked);
      })
      .catch(() => {
        this.showError('Could not update inventory item');
      });
  }

  checkItemOut(item) {
    const updatedItem = this.inventory.filter(f => f.item === item)[0];

    updatedItem.checked = 'Out';
    updatedItem.name = this.userName;
    updatedItem.reason = this.reasonFormControl.value;
    updatedItem.date = new Date();

    this.userItems.push(updatedItem);
    this.updateInventory(updatedItem);
  }

  checkItemIn(item) {
    const updatedItem = this.inventory.filter(f => f.item === item)[0];

    updatedItem.checked = 'In';
    updatedItem.name = '';
    updatedItem.reason = '';
    updatedItem.date = new Date();

    this.userItems = this.userItems.filter(i => i.item !== item);
    this.updateInventory(updatedItem);
  }

  submit() {
    this.submitting = true;

    if (this.scannedItems.length) {
      if (this.checkOut) {
        // check-out submit
        if (this.reasonFormControl.valid) {
          this.scannedItems.forEach(i => this.checkItemOut(i));
          this.submitting = false;
          this.startScanning = false;
          this.success = true;
        } else {
          this.submitting = false;
          this.reasonFormControl.markAsTouched();
        }
      } else {
        // check-in submit
        this.scannedItems.forEach(i => this.checkItemIn(i));
        this.submitting = false;
        this.startScanning = false;
        this.success = true;
      }
    } else {
      this.submitting = false;
      alert('No items have been scanned.');
    }
  }

  startOver() {
    window.location.reload();
  }

  goAgain(toggle) {
    if (toggle === 'out') {
      this.setCheckOut();
    } else {
      this.setCheckIn();
    }
    this.getInventory(this.userName);
    this.scannedItems = [];
    this.success = false;
  }

  showError(err) {
    console.log(err);
    this.loading = false;
    this.submitting = false;
    this.startScanning = false;
    this.error = true;
  }
}
