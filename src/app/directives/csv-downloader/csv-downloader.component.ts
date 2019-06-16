import { Component, Input, Renderer } from '@angular/core';

import { Item } from '../../services/classes';

@Component({
  selector: 'csv-downloader',
  templateUrl: './csv-downloader.component.html',
  styleUrls: ['./csv-downloader.component.scss']
})
export class CsvDownloaderComponent {
  @Input() data: any[] = [];
  inventory = [];
  headers = [];
  fileName = 'inventory-data-' + Date.now() + '.csv';
  csvLoading = false;
  temp: Item;

  constructor(
    private renderer: Renderer
  ) { }

  private construct(): string {
    let tabText = '';
    const headerObj = {
      item: '',
      checked: '',
      name: '',
      reason: '',
      date: ''
    };
    const keys = Object.keys(headerObj);
    this.headers = [
      'Item',
      'Status',
      'Checked Out By',
      'Reason for Check-Out',
      'Modified Date'
    ];

    this.headers.forEach(h => {
      tabText += '"' + h + '",';
    });

    if (tabText.length > 0) {
      tabText = tabText.slice(0, -1);
      tabText += '\r\n';
    }

    this.inventory.reverse().forEach(d => {
      keys.forEach(k => {
        if (d.hasOwnProperty(k) && d[k] != null) {
          tabText += '"' + d[k] + '",';
        } else {
          tabText += '"",';
        }
      });

      tabText = tabText.slice(0, -1);
      tabText += '\r\n';
    });

    return tabText;
  }

  private buildDownloader(data) {
    const bomData = '\ufeff' + data;
    const csvData = new Blob([bomData], {type: 'text/csv;charset=UTF-8'});
    const csvUrl = window.URL.createObjectURL(csvData);
    const anchor = this.renderer.createElement(document.body, 'a');

    this.renderer.setElementStyle(anchor, 'visibility', 'hidden');
    this.renderer.setElementAttribute(anchor, 'href', csvUrl);
    this.renderer.setElementAttribute(anchor, 'target', '_blank');
    this.renderer.setElementAttribute(anchor, 'download', this.fileName);
    this.renderer.invokeElementMethod(anchor, 'click');
    this.renderer.invokeElementMethod(anchor, 'remove');
    this.csvLoading = false;
  }

  private setData(info) {
    let i = 0;
    const l = info.length;
    const dataset = [];

    for (i; i < l; i++) {
      this.temp = new Item();

      this.temp = {
        item: info[i].item,
        checked: info[i].checked,
        name: info[i].name,
        reason: info[i].reason,
        date: info[i].date
      };

      dataset.push(this.temp);
    }

    this.inventory = dataset;

    this.buildDownloader(this.construct());
  }

  build() {
    this.csvLoading = true;

    if (!this.data.length) {
      console.error('Data not available.');
      alert('Data not available.');
      this.csvLoading = false;
      return;
    }

    this.setData(this.data);
  }
}
