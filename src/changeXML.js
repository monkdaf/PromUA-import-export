"use strict";

const fs = require('fs');
// import * as fs from 'fs';
const xml2js = require('xml2js');

const optWriteFile = {
  encoding: 'utf-8',
    flag: 'w'
};

const paramItemNew = { _: 'Новое', '$': { name: 'Состояние' } };
const paramItemStock = { _: 'Б/У', '$': { name: 'Состояние' } };


let parser = new xml2js.Parser();

fs.readFile(__dirname + '/yandex_market.xml', function(err, data) {
  parser.parseString(data, function (err, result) {
    //const mappedItems = result.yml_catalog.shop[0].offers[0].offer.map(changeOffer);

    for (let i = 0; i < result.yml_catalog.shop[0].offers[0].offer.length; i++) {
      // console.log(`vendorCode=${result.yml_catalog.shop[0].offers[0].offer[i].vendorCode}`);
      // console.log(`hasParamState=${hasParamState(result.yml_catalog.shop[0].offers[0].offer[i].param)}`);
      // console.log(`hasParam=${result.yml_catalog.shop[0].offers[0].offer[i].param}`);
      if ((typeof result.yml_catalog.shop[0].offers[0].offer[i].vendorCode !== 'undefined')
        && !hasParamState(result.yml_catalog.shop[0].offers[0].offer[i].param)
        // && hasParam(result.yml_catalog.shop[0].offers[0].offer[i].param)
      ) {
        // console.log(`i=${i}`);
        if(isNew(result.yml_catalog.shop[0].offers[0].offer[i].vendorCode)) {
          // result.yml_catalog.shop[0].offers[0].offer[i].param.push(paramItemNew);
          addParam(result.yml_catalog.shop[0].offers[0].offer[i], paramItemNew);
        } else {
          // result.yml_catalog.shop[0].offers[0].offer[i].param.push(paramItemStock);
          addParam(result.yml_catalog.shop[0].offers[0].offer[i], paramItemStock);
        }
      }
    }
    let builder = new xml2js.Builder();
    let xml = builder.buildObject(result);
    fs.writeFile('.\\yandex_market_new.xml', xml, optWriteFile);

    /*const INDEX = 1;//result.yml_catalog.shop[0].offers[0].offer.length-5;

    console.log(`prop=${hasParamState(result.yml_catalog.shop[0].offers[0].offer[INDEX].param)}`)
    if (isNew(result.yml_catalog.shop[0].offers[0].offer[INDEX].vendorCode)) {
      result.yml_catalog.shop[0].offers[0].offer[INDEX].param.push(paramItemNew);
    } else {
      result.yml_catalog.shop[0].offers[0].offer[INDEX].param.push(paramItemStock);
    };

    console.log(`prop=${hasParamState(result.yml_catalog.shop[0].offers[0].offer[INDEX].param)}`)

      console.dir(result.yml_catalog.shop[0].offers[0].offer[INDEX].vendorCode);
      // console.dir(result.yml_catalog.shop[0].offers[0].offer[INDEX].param);
      //result.yml_catalog.shop[0].offers[0].offer[INDEX].param.push(paramItemNew);
      console.dir(result.yml_catalog.shop[0].offers[0].offer[INDEX].param);*/

      console.log('Done');
  });
});

const changeOffer = (offer) => {
  if ((typeof offer.vendorCode !== 'undefined') && !hasParamState(offer.param) && hasParam(offer.param)) {
    if(isNew(offer.vendorCode)) {
      // offer.param.push(paramItemNew);
      addParam(item, paramItemNew);
    } else {
      // offer.param.push(paramItemStock);
      addParam(item, paramItemStock);
    }
  }
  return offer;
};

const isNew = (vendorCode) => {
  // console.log(`vendorCode=${vendorCode}`);
  const strVendorCode = vendorCode.toString();
  // console.log(`strItem=${strItem}`);
  return !((strVendorCode.indexOf('a') !== -1) ||
  (strVendorCode.indexOf('A') !== -1) ||
  (strVendorCode.indexOf('а') !== -1) ||
  (strVendorCode.indexOf('А') !== -1));
};

const hasParamState = (params) => {
  if (typeof params === 'undefined') return false;
  const filteredParams = params.filter((param) => (param.$.name === 'Состояние') );
  return (filteredParams.length > 0);
};

const hasParam = (params) => (typeof params !== 'undefined');

const addParam = (item, param) => {
  if (hasParam(item.param)) {
    item.param.push(param);
  } else {
    item.param = [param];
  }
};