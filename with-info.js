require('dotenv').config()
const os = require('os')
const fs = require('fs').promises
const parse = require('csv-parse/lib/sync')
const axios = require('axios')
const convertWeight = require("./utils/convertWeight")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

(async function () {
  // Prepare the dataset
  await fs.writeFile(`${os.tmpdir()}/input.csv`, [
    '\ufeff', // BOM
    'a,1\n',  // First record
    'b,2\n'  // Second record
  ].join(''), {encoding: 'utf8'})
  // Read the content
  //const content = await fs.readFile(`csv/with-info-example.csv`)

  const content = await fs.readFile(`csv/health-and-beauty.csv`)
  // Parse the CSV content
  const records = parse(content, {
    bom: true
  })

  function stringToHandle(string) {
    return string.replace(/[^a-z0-9\s]/gi, '').replace(/\s/gi, '-').replace(/(.)\1+/g, '$1')
  }

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

  let missingInfo = [
    shopifyHeader
  ]

  function getIndexByLabel(label) {
    return shopifyRecords[0].indexOf(label)
  }

  const dummyProduct = {
    products: [
      {
        barcode_number: "018788801603",
        barcode_type: "UPC",
        barcode_formats: "UPC 018788801603, EAN 0018788801603",
        mpn: "157160",
        model: "",
        asin: "",
        product_name: "Kosher Real Sea Salt Pouch 16 OZ by Redmond RealSalt",
        title: "",
        category: "Food, Beverages & Tobacco > Food Items > Seasonings & Spices > Salt",
        manufacturer: "Real Salt",
        brand: "Redmond RealSalt",
        label: "",
        author: "",
        publisher: "",
        artist: "",
        actor: "",
        director: "",
        studio: "",
        genre: "",
        audience_rating: "Adult",
        ingredients: "100% Real Salt.",
        nutrition_facts: "Protein 0 G, Total lipid (fat) 0 G, Carbohydrate, by difference 0 G, Fiber, total dietary 0 G, Calcium, Ca 0 MG, Iron, Fe 0 MG, Iodine, I 1071 UG, Vitamin A, IU 0 IU, Vitamin C, total ascorbic acid 0 MG, Cholesterol 0 MG, Fatty acids, total saturated 0 G, Energy 0 KCAL, Sodium, Na 37857 MG",
        color: "",
        format: "",
        package_quantity: "",
        size: "16 OZ",
        length: "",
        width: "",
        height: "",
        weight: "1.2 lb",
        release_date: "",
        description: "Natures First Sea Salt For Culinary Use.",
        features: [],
        images: [
          "https://images.barcodelookup.com/1031/10319275-1.jpg"
        ],
        stores: [
          {
            store_name: "Vitacost.com",
            store_price: "6.59",
            product_url: "http://clickserve.dartsearch.net/link/click?lid=43700049338235428&ds_s_kwgid=58700005420260494&ds_url_v=2&ds_dest_",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "LuckyVitamin.com",
            store_price: "8.26",
            product_url: "https://www.luckyvitamin.com/p-169519-real-salt-nature-s-first-sea-salt-kosher-salt-16-oz?site=google_base",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "HerbsPro",
            store_price: "7.70",
            product_url: "https://www.herbspro.com/collections/redmond-realsalt/products/kosher-real-sea-salt-pouch-109585",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "Herbspro - Basic",
            store_price: "9.01",
            product_url: "https://www.herbspro.com/collections/redmond-realsalt/products/kosher-real-sea-salt-pouch-109585",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "Well.ca",
            store_price: "11.00",
            product_url: "http://well.ca/products/redmond-real-salt-ancient-kosher-sea_15739.html",
            currency_code: "CAD",
            currency_symbol: "$"
          },
          {
            store_name: "MassGenie",
            store_price: "11.99",
            product_url: "https://www.massgenie.com/real-salt-gourmet-kosher-sea-salt-16-oz-case-of-6-zkrvfsqrxm6o05wj?utm_campaign=productdatafeed&utm_medium=cpc&utm_source=google&intsrc=CATF_4980",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "House of Nutrition",
            store_price: "13.46",
            product_url: "http://www.houseofnutrition.com/redmond-trading-company-kosher-salt-pouch-16-oz/",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "GoVets",
            store_price: "14.00",
            product_url: "https://www.govets.com/food-and-beverage/redmond-trading-food-018788801603-274-157160",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "Walmart",
            store_price: "48.87",
            product_url: "https://www.walmart.com/ip/RealSalt-Real-Salt-Kosher-Sea-Salt-Pouch-16-Ounce/26960105",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "Newegg Business",
            store_price: "50.22",
            product_url: "https://www.neweggbusiness.com/Product/Product.aspx?Item=9SIV19P7EV1063",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "UnbeatableSale.com",
            store_price: "51.77",
            product_url: "http://www.boncui.com/sum10093.html",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "OnBuy.com",
            store_price: "62.48",
            product_url: "https://www.onbuy.com/gb/minerals-and-salts/real-salt-gourmet-kosher-sea-salt-16-oz-case-of-6~c10246~p5044734/?exta=cjunct&stat=eyJpcCI6IjYyLjQ4IiwiZHAiOjAsImxpZCI6IjYzODQ3NDYiLCJzIjoiMyIsInQiOjE1ODE4NzU2NDQsImJtYyI6MH0=",
            currency_code: "GBP",
            currency_symbol: "£"
          },
          {
            store_name: "Rakuten.com",
            store_price: "80.96",
            product_url: "https://www.rakuten.com/shop/bitstoreusa/product/eca-855703000113065/?sku=eca-855703000113065&scid=af_feed",
            currency_code: "USD",
            currency_symbol: "$"
          },
          {
            store_name: "OnBuy.com UK",
            store_price: "101.78",
            product_url: "https://www.onbuy.com/gb/real-salt-gourmet-kosher-sea-salt-16-oz-case-of-6~c10246~p5044734/?exta=cjunct&stat=eyJpcCI6IjEwMS43OCIsImRwIjowLCJsaWQiOiI2Mzg0NzQ2IiwicyI6IjMiLCJ0IjoxNTkyMTE0MTU0LCJibWMiOjB9",
            currency_code: "GBP",
            currency_symbol: "£"
          }
        ],
        reviews: []
      }
    ]
  }


  const updatedRecordsPromises = records.flatMap(async (record) => {
    if (record[getIndexByLabel("Variant Barcode")] < 99999999999) {
      record[getIndexByLabel("Variant Barcode")] = "0" + record[getIndexByLabel("Variant Barcode")]
    }
    const upc = record[getIndexByLabel("Variant Barcode")]

    try {
      const productReq = await axios.get(`https://api.barcodelookup.com/v2/products?barcode=${upc}&formatted=y&key=${process.env.UPCKEY}`)
      const productInfo = await productReq.data.products[0]
      //console.log(productInfo)
      //const productInfo = dummyProduct.products[0]
      let row = []

      const descIndex = getIndexByLabel("Body (HTML)")
      const correctWeight = convertWeight.convertWeight(record[getIndexByLabel("Variant Weight Unit")])

      record[getIndexByLabel("Handle")] = stringToHandle(record[getIndexByLabel("Title")])
      //record[1] = productInfo.product_name
      record[descIndex] = productInfo.description

      record[descIndex] += productInfo.ingredients ? "<br><h3>Ingredients:</h3> " + productInfo.ingredients + "<br>" : ""
      record[descIndex] += productInfo.nutrition_facts ? "<h3>Nutrition Facts:</h3>" + productInfo.nutrition_facts + "<br>" : ""
      productInfo.features.forEach(item => {
        record[descIndex] += item
      })
      //record[3] = productInfo.manufacturer
      //record[4] = productInfo.category
      record[getIndexByLabel("Published")] = "FALSE"
      record[getIndexByLabel("Variant Grams")] = correctWeight.weight
      record[getIndexByLabel("Variant Weight Unit")] = correctWeight.unit
      record[getIndexByLabel("Variant Inventory Tracker")] = "shopify"
      if (record[getIndexByLabel("Variant Inventory Policy")] === "") {
        record[getIndexByLabel("Variant Inventory Policy")] = "continue"
      }
      //record[17] = "deny"
      record[getIndexByLabel("Variant Fulfillment Service")] = "manual"
      //record[23] = productInfo.barcode_number
      record[getIndexByLabel("Variant Image")] = productInfo.images[0]
      record[getIndexByLabel("Status")] = "draft"

      shopifyRecords.push(record)
    } catch (e) {
      //console.log(e)
      const correctWeight = convertWeight.convertWeight(record[getIndexByLabel("Variant Weight Unit")])

      record[getIndexByLabel("Handle")] = stringToHandle(record[getIndexByLabel("Title")])
      //record[1] = productInfo.product_name

      //record[3] = productInfo.manufacturer
      //record[4] = productInfo.category
      record[getIndexByLabel("Published")] = "FALSE"
      record[getIndexByLabel("Variant Grams")] = correctWeight.weight
      record[getIndexByLabel("Variant Weight Unit")] = correctWeight.unit
      record[getIndexByLabel("Variant Inventory Tracker")] = "shopify"
      //record[17] = "deny"
      record[getIndexByLabel("Variant Fulfillment Service")] = "manual"
      //record[23] = productInfo.barcode_number
      record[getIndexByLabel("Status")] = "draft"

      missingInfo.push(record)
    }

  })

  await Promise.all(updatedRecordsPromises)
  //console.log(shopifyRecords)
  //console.log(missingInfo)

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

  rl.question('Please Enter Your file name \nFiles will be formatted like this: (?)-output.csv (?)-missing.csv where (?) is your file name: \n', function (name) {
    arrayToCsv(shopifyRecords, 'outputs/'+name + '-output.csv');
    arrayToCsv(missingInfo, 'outputs/'+name + 'missing.csv');
    rl.close();
  })


})()