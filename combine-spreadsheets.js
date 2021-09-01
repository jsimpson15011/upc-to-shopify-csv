(async function () {
  require('dotenv').config()
  const os = require('os')
  const fs = require('fs').promises
  const parse = require('csv-parse/lib/sync')

  try {
    await fs.writeFile(`${os.tmpdir()}/input.csv`, [
      '\ufeff', // BOM
      'a,1\n',  // First record
      'b,2\n'  // Second record
    ].join(''), {encoding: 'utf8'})
    const shopifyHeader = [
      'Handle',
      'Title',
      'Body (HTML)',
      'Vendor',
      'Type',
      'Collection',
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
      'Variant Inventory Policy',
      'Variant Fulfillment Service',
      'Variant Inventory Qty',
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

    const shopifyRecords = [
      shopifyHeader
    ]

    function getIndexByLabel(label) {
      return shopifyRecords[0].indexOf(label)
    }

    function stringToHandle(string) {
      return string.replace(/[^a-z0-9\s]/gi, '').replace(/\s/gi, '-').replace(/(.)\1+/g, '$1').toLowerCase()
    }

    let prevRecord = "";

    const files = await fs.readdir('./csv-to-combine')
    for (const file of files) {


      const content = await fs.readFile('./csv-to-combine/' + file)
      // Parse the CSV content
      console.log(file)
      const records = parse(content, {
        bom: true
      })

      for (let i = 0; i < records.length; i++) {
        const currRecord = records[i]

        const descIndex = getIndexByLabel('Body (HTML)')
        const priceIndex = getIndexByLabel('Variant Price')
        const barcodeIndex = getIndexByLabel('Variant Barcode')
        const tagsIndex = getIndexByLabel('Tags')
        const titleIndex = getIndexByLabel('Title')
        if(currRecord[getIndexByLabel("Title")] !== "Title")
        {
          currRecord[getIndexByLabel("Handle")] = currRecord[getIndexByLabel("Title")] ? stringToHandle(currRecord[getIndexByLabel("Title")]) : prevRecord[getIndexByLabel("Handle")]
        }


        const recordIsFilled = (currRecord[titleIndex].length !== 0 || currRecord[priceIndex].length !== 0 || currRecord[barcodeIndex].length !== 0 || currRecord[tagsIndex].length !== 0)

        console.log(recordIsFilled);
        if (records[i][0].toLowerCase() !== 'handle' && recordIsFilled) {
          records[i][descIndex] = records[i][descIndex].replace(/\n/g, '<br/>')
          records[i][descIndex] = records[i][descIndex].replace(/\r/g, '')

          shopifyRecords.push(records[i])
          prevRecord = currRecord
        }
      }
    }

    function arrayToCsv(arr, fileName) {
      // Write a file with one JSON per line for each record
      //const json = arr.map(JSON.stringify).join('\n')
      const items = arr
      const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
      const header = Object.keys(items[0])
      let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',').replace(/\\"/g, '""'))

      //csv.unshift(header.join(','))
      csv = csv.join('\r\n')
      fs.writeFile(fileName, csv)
    }

    arrayToCsv(shopifyRecords, 'combined.csv')

  } catch (err) {
    console.error(err)
  }


})()
