const fs = require("fs");
const path = require("path");

const imgsDir = path.join(__dirname, "..", "public", "imgs");
const outputFileName = "imgs.json";

const imgsJson = {};

function atob(a) {
  return new Buffer(a, "base64").toString("binary");
}

const legendTypes = fs.readdirSync(imgsDir);
legendTypes.forEach(legendType => {
  imgsJson[legendType] = {};
  const imgsPath = path.join(imgsDir, legendType);
  const imgNames = fs.readdirSync(imgsPath);

  imgNames.forEach(imgName => {
    const withoutExtension = path.parse(imgName).name;
    const decodedName = atob(withoutExtension);
    console.log(imgName, withoutExtension, decodedName);
    imgsJson[legendType][decodedName] = imgName;
  });
});

fs.writeFile(path.join(imgsDir, outputFileName), JSON.stringify(imgsJson));
