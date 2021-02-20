require('dotenv').config()
const os = require('os')
const fs = require('fs').promises
const parse = require('csv-parse/lib/sync');
const axios = require('axios');

(async function () {
  // Prepare the dataset
  await fs.writeFile(`${os.tmpdir()}/input.csv`, [
    '\ufeff', // BOM
    'a,1\n',  // First record
    'b,2\n'  // Second record
  ].join(''), {encoding: 'utf8'})
  // Read the content
  const content = await fs.readFile(`csv/example.csv`)
  // Parse the CSV content
  const records = parse(content, {
    bom: true
  })

  const shopifyRecords = [
    [
      'Handle',
      'Title',
      'Body (HTML)',
      'Vendor',
      'Type',
      'Tags',
      'Published',
      'Option1 Name',
      'Option1 Value',
      'Option2 Name',
      'Option2 Value',
      'Option3 Name',
      'Option3 Value',
      'Variant SKU',
      'Variant Grams',
      'Variant Inventory Tracker',
      'Variant Inventory Qty',
      'Variant Inventory Policy',
      'Variant Fulfillment Service',
      'Variant Price',
      'Variant Compare At Price',
      'Variant Requires Shipping',
      'Variant Taxable',
      'Variant Barcode',
      'Image Src',
      'Image Position',
      'Image Alt Text',
      'Gift Card',
      'SEO Title',
      'SEO Description',
      'Google Shopping / Google Product Category',
      'Google Shopping / Gender',
      'Google Shopping / Age Group',
      'Google Shopping / MPN',
      'Google Shopping / AdWords Grouping',
      'Google Shopping / AdWords Labels',
      'Google Shopping / Condition',
      'Google Shopping / Custom Product',
      'Google Shopping / Custom Label 0',
      'Google Shopping / Custom Label 1',
      'Google Shopping / Custom Label 2',
      'Google Shopping / Custom Label 3',
      'Google Shopping / Custom Label 4',
      'Variant Image',
      'Variant Weight Unit',
      'Variant Tax Code',
      'Cost per item',
      'Status'
    ]
  ]


  const updatedRecordsPromises = records.flatMap(async (record) => {
    const upc = record[0]
    const productInfo = await axios.get(`https://api.barcodelookup.com/v2/products?barcode=${upc}&formatted=y&key=${process.env.UPCKEY}`)
    shopifyRecords.push(record)

  })

  await Promise.all(updatedRecordsPromises)
  console.log(shopifyRecords)


  // Write a file with one JSON per line for each record
  const json = shopifyRecords.map(JSON.stringify).join('\n')
  const items = shopifyRecords
  const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
  const header = Object.keys(items[0])
  let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',').replace(/\\"/g, '""'))

  //csv.unshift(header.join(','))
  csv = csv.join('\r\n')

  fs.writeFile(`output.json`, json)
  fs.writeFile(`output.csv`, csv)
})()