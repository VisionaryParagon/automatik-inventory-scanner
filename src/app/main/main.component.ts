import { Component, OnInit, ViewChild } from '@angular/core';

import { Contact, User } from '../services/classes';
import { ContactService } from '../services/contact.service';
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
  selectedContact: Contact;
  user: User = new User();
  selectedUser: User;
  sortOptions = [
    'first_name'
  ];
  anyVal: any;
  error = false;

  @ViewChild('scanner')
  scanner;

  hasCameras = false;
  hasPermission: boolean;
  qrResultString: string;

  availableDevices: MediaDeviceInfo[];
  selectedDevice: MediaDeviceInfo;

  constructor(
    private contactService: ContactService,
    private userService: UserService,
    private sortService: SortService
  ) { }

  ngOnInit() {
    this.contactService.getContacts()
    .then(res => {
      this.contacts = this.sortService.sort(res.filter(c => c.last_name.length > 1), this.sortOptions);
    })
    .catch(() => {
      this.error = true;
    });
  }

  setUser(user) {
    this.userService.setCurrentUser(user);
    this.selectedUser = this.userService.getCurrentUser();
  }

  initScanner() {
    this.scanner.camerasFound.subscribe((devices: MediaDeviceInfo[]) => {
      this.hasCameras = true;

      console.log('Devices: ', devices);
      this.availableDevices = devices;

      // selects the devices's back camera by default
      // for (const device of devices) {
      //     if (/back|rear|environment/gi.test(device.label)) {
      //         this.scanner.changeDevice(device);
      //         this.selectedDevice = device;
      //         break;
      //     }
      // }
    });

    this.scanner.camerasNotFound.subscribe((devices: MediaDeviceInfo[]) => {
      console.error('An error has occurred when trying to enumerate your video-stream-enabled devices.');
    });

    this.scanner.permissionResponse.subscribe((answer: boolean) => {
      this.hasPermission = answer;
    });
  }

  checkItems(contact) {
    console.log('checking items...', contact);
    this.user.name = contact.first_name + ' ' + contact.last_name;
  }

  setCheckOut() {
    this.setUser(this.user);
    console.log('setting check-out...', this.selectedUser);
    this.initScanner();
  }

  setCheckIn() {
    this.setUser(this.user);
    console.log('setting check-in...', this.selectedUser);
    this.initScanner();
  }

  handleQrCodeResult(resultString: string) {
    console.log('Result: ', resultString);
    this.qrResultString = resultString;
  }

  onDeviceSelectChange(selectedValue: string) {
    console.log('Selection changed: ', selectedValue);
    this.selectedDevice = this.scanner.getDeviceById(selectedValue);
  }
}
