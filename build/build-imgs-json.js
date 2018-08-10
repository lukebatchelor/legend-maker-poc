const fs = require("fs");
const path = require("path");

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
  const imgNames = fs.readdirSync(imgsPath);

  imgNames.forEach(imgName => {
    const withoutExtension = path.parse(imgName).name;
    const decodedName = atob(withoutExtension);
    imgsJson[legendType][decodedName] = imgName;
  });
});

const outputFileName = "imgs.json";
const outputFilePath = path.join(imgsDir, outputFileName);

fs.writeFileSync(outputFilePath, JSON.stringify(imgsJson));
