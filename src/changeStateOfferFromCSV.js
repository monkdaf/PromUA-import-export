/**
 * Created by daf on 24.10.2016.
 *
 * Для Prom.ua
 * В зависимости от ID товара (столбец 0) (если в конце "a" - то б/у)
 * необходимо добавить новый параметр:
 *  "Сосотояние" - "новое" или "б/у"
 *
 * Характеристики начинаются с 32 и до 82 столбца
 * 32: Название_Характеристики
 * 33: Измерение_Характеристики
 * 34: Значение_Характеристики
 */

const fs = require('fs');

const optReadFile = {
  encoding: 'utf-8',
  flag: 'r',
};

const fileIn = 'export-products.csv';
const fileOut = 'export-products_out.csv';
const startParam = 32;

let dataOut = '';
let arrRow = [];

/**
 * Выводит в консоль нумерованый список элементов массива row
 * @param row массив элементов
 */
const printNumberedListFromArray = (row) => {
  row.forEach((item, index) => {
    console.log(`${index}: ${item}`);
  });
};

/**
 * Проверяет по коду товара новый этот товар или б/у
 * @param vendorCode код товара
 * @returns {boolean} true если новое
 */
const isNew = (vendorCode) => {
  const strVendorCode = vendorCode.toString();
  return !((strVendorCode.indexOf('a') !== -1) ||
  (strVendorCode.indexOf('A') !== -1) ||
  (strVendorCode.indexOf('а') !== -1) ||
  (strVendorCode.indexOf('А') !== -1));
};

/**
 * Проверяет присутствует ли характеристика "Состояние"
 * @param params массив характеристик (параметров товара)
 * @returns {boolean} true если такой параметр присутствует
 */
const hasParamState = (params) => {
  const filteredParams = params.filter(param => param === 'Состояние');
  return (filteredParams.length > 0);
};

fs.readFile(fileIn, optReadFile, (err, data) => {
  if (err) {
    console.log(`Ошибка ${err}`);
  } else {
    arrRow = data.split('\r\n');
    arrSubRow = arrRow[0].split('","');
    dataOut = arrRow[0] + '\r\n';
    const arrRowWithData = arrRow.slice(1, -1);
    for (const row of arrRowWithData) {
      const columns = row.split('","');
      const params = columns.splice(startParam);
      if ((columns[0].toString() !== '"') &&
        (columns[0].toString() !== '"0000') &&
        !hasParamState(params)) {
        const state = isNew(columns[0]) ? 'Новое' : 'Б/У';
        const fullState = `"Состояние","","${state}"`;
        dataOut += `${row},${fullState}\r\n`;
        console.log(`<${columns[0].toString()}> : ${fullState}`);
      }
      // dataOut += '\r\n';
    }
  }
  fs.writeFile(fileOut, dataOut);
});

