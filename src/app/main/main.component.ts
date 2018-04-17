import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { Contact, Item, User } from '../services/classes';
import { ContactService } from '../services/contact.service';
import { InventoryService } from '../services/inventory.service';
import { UserService } from '../services/user.service';
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
  inventory: Item[];
  user: User = new User();
  selectedContact: Contact;
  userExists = false;
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
  userItems = [];
  scannedItems = [];

  reasonFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(
    private contactService: ContactService,
    private inventoryService: InventoryService,
    private userService: UserService,
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

  getInventory() {
    this.inventoryService.getItems()
      .then(res => {
        this.inventory = res;
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
    this.user.name = contact.first_name + ' ' + contact.last_name;

    this.userService.getUserName(this.user)
      .then(res => {
        setTimeout(() => {
          if (res.valid) {
            this.userExists = true;
            this.user = res.data;
            this.userItems = this.user.items;
          } else {
            this.userExists = false;
            this.userItems = [];
          }

          this.loading = false;
        }, 1000);
      })
      .catch(() => {
        this.showError('Could not get user by name');
      });
  }

  setUser() {
    this.getInventory();
    this.selectedUser = true;
    this.startScanning = true;
  }

  setCheckOut() {
    this.checkOut = true;
    this.setUser();
  }

  setCheckIn() {
    this.checkOut = false;
    this.setUser();
  }

  handleQrCodeResult(scan: string) {
    // console.log('Result: ', scan);
    const itemCheck = this.inventory.filter(i => i.item === scan);
    const scanCheck = this.scannedItems.filter(i => i === scan);
    const userCheck = this.userItems.filter(i => i === scan);

    if (this.checkOut) {
      // check-out scans
      if (itemCheck.length) {
        if (itemCheck[0].checked === 0) {
          if (!scanCheck.length) {
            this.scannedItems.push(scan);
          } else {
            alert('Item already scanned.');
          }
        } else {
          if (itemCheck[0].name === this.user.name) {
            alert('You have already checked out this item.');
          } else {
            const anyway = confirm('This item is already checked out by ' + itemCheck[0].name + '.\n\nCheck-out anyway?');
            if (anyway) {
              // Remove item from previous user's item list
              this.userService.getUserName(itemCheck[0])
                .then(res => {
                  if (res.valid) {
                    const itemHolder = res.data;
                    const itemIdx = itemHolder.items.indexOf(scan);

                    if (itemIdx > -1) {
                      itemHolder.items.splice(itemIdx, 1);

                      this.userService.updateUser(itemHolder)
                        .then(res2 => {
                          console.log('Item removed from ' + res2.name);
                        })
                        .catch(() => {
                          this.showError('Could not update user');
                        });
                    }
                  } else {
                    console.log('itemHolder doesn\'t exist');
                  }
                })
                .catch(() => {
                  this.showError('Could not get user by name');
                });

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
        if (itemCheck[0].checked === 1) {
          if (!scanCheck.length) {
            if (userCheck.length) {
              this.scannedItems.push(scan);
            } else {
              alert('Item is not checked out by you.');
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
        console.log(res.name + ' updated', 'checked: ' + res.checked);
      })
      .catch(() => {
        this.showError('Could not update inventory item');
      });
  }

  checkItemOut(item) {
    const updatedItem = this.inventory.filter(f => f.item === item)[0];

    updatedItem.checked = 1;
    updatedItem.name = this.user.name;
    updatedItem.reason = this.reasonFormControl.value;
    updatedItem.date = new Date();

    this.updateInventory(updatedItem);
  }

  checkItemIn(item) {
    const updatedItem = this.inventory.filter(f => f.item === item)[0];

    updatedItem.checked = 0;
    updatedItem.name = '';
    updatedItem.reason = '';
    updatedItem.date = new Date();

    this.updateInventory(updatedItem);
  }

  sendIt(data) {
    if (this.userExists) {
      // update existing user
      this.userService.updateUser(data)
        .then(res => {
          this.submitting = false;
          this.startScanning = false;
          this.success = true;
        })
        .catch(() => {
          this.showError('Could not update user');
        });
    } else {
      // create new user
      this.userService.createUser(data)
        .then(res => {
          this.submitting = false;
          this.startScanning = false;
          this.success = true;
        })
        .catch(() => {
          this.showError('Could not create user');
        });
    }
  }

  submit() {
    this.submitting = true;

    if (this.scannedItems.length) {
      if (this.checkOut) {
        // check-out submit
        if (this.reasonFormControl.valid) {
          this.scannedItems.forEach(i => {
            this.checkItemOut(i);
          });
          this.user.items = this.userItems.concat(this.scannedItems);

          this.user.date = new Date();

          // console.log('Submitting: ', this.user);
          this.sendIt(this.user);
        } else {
          this.submitting = false;
          this.reasonFormControl.markAsTouched();
        }
      } else {
        // check-in submit
        this.scannedItems.forEach(i => {
          this.checkItemIn(i);
        });
        this.user.items = this.userItems.filter(i => this.scannedItems.indexOf(i) === -1);

        this.user.date = new Date();

        // console.log('Submitting: ', this.user);
        this.sendIt(this.user);
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
    this.userItems = this.user.items;
    this.scannedItems = [];
    this.userExists = true;
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
