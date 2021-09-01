
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const validBarcode = require("barcode-validator")

rl.question('barcode?', function (barcode) {
  let addedZero = false;
  if (!validBarcode(barcode))
  {
    barcode = "0"+barcode;
    addedZero = true;
  }

  rl.write(validBarcode(barcode) ? "Good" : "Bad")
  rl.write(addedZero ? "Added 0" : "")
  rl.close();
})