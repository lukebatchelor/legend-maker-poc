const fs = require("fs");
const path = require("path");

/*
  This script is used to build the imgs.json file into public/imgs/imgs/json
  It stores img information in the following format
  {
    "Air_Side": {
      "ATTENUATOR": "QVRURU5VQVRPUg==.png",
      "ELECTRIC DUCT HEATER": "RUxFQ1RSSUMgRFVDVCBIRUFURVI=.png",
      ...
    },
    "Water_Side": {
      "2 WAY CONTROL VALVE": "MiBXQVkgQ09OVFJPTCBWQUxWRQ==.png",
      "3 WAY CONTROL VALVE": "MyBXQVkgQ09OVFJPTCBWQUxWRQ==.png",
      ...
    }
  }
*/

const imgsDir = path.join(__dirname, "..", "public", "imgs");

const imgsJson = {};

function atob(a) {
  return new Buffer(a, "base64").toString("binary");
}

const legendTypes = fs
  .readdirSync(imgsDir)
  .filter(file => fs.lstatSync(path.join(imgsDir, file)).isDirectory());

legendTypes.forEach(legendType => {
  imgsJson[legendType] = {};
  const imgsPath = path.join(imgsDir, legendType);
  const imgNames = fs.readdirSync(imgsPath)
    .filter(imgName => imgName.includes('.png'));

  imgNames.forEach(imgName => {
    const withoutExtension = path.parse(imgName).name;
    const decodedName = atob(withoutExtension);
    imgsJson[legendType][decodedName] = imgName;
  });
});

const outputFileName = "imgs.json";
const outputFilePath = path.join(imgsDir, outputFileName);

fs.writeFileSync(outputFilePath, JSON.stringify(imgsJson));
