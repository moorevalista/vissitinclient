// eslint-disable-next-line
import React from 'react';
import DataSheetBase from './DataSheetBase.js';

export default class DataSheet_jam extends DataSheetBase {

  constructor(id, updateCb) {
    super(id, updateCb);
    this.requestedKeyPath = "";  // this value can be specified in the React Studio data sheet UI
  }

  makeDefaultItems() {
    // eslint-disable-next-line no-unused-vars
    let key = 1;
    // eslint-disable-next-line no-unused-vars
    let item;
    
    item = {};
    this.items.push(item);
    item['jam'] = "06.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "07.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "08.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "09.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "10.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "11.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "12.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "13.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "14.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "15.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "16.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "17.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "18.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "19.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "20.00";
    item.key = key++;
    
    item = {};
    this.items.push(item);
    item['jam'] = "21.00";
    item.key = key++;
  }

}
