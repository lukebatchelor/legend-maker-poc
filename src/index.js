import fetch from "unfetch";
import style from "./main.css";
import generatePreview from './preview';

let imgsData;
let actualImages;
let listName = 'Water';

fetch("imgs/imgs.json")
  .then(resp => resp.json())
  .then(imgsNames => preLoadAllImages(imgsNames))
  .then(loadedImgs => {
    imgsData = loadedImgs;
    setLegendTypeSelector(imgsData)
    setOptionsList();
    generatePreview(imgsData);
    document.querySelector('#column-input')
      .addEventListener('change', () => generatePreview(imgsData));
  })


function preLoadAllImages(imgsNames) {
  const imgs = {};
  const imgLists = Object.keys(imgsNames);

  return new Promise(resolve => {
    imgLists.forEach(imgList => {
      imgs[imgList] = {};
      const imgNames = Object.keys(imgsNames[imgList]);
  
      imgNames.forEach(imgName => {
        const encodedImgName = imgsNames[imgList][imgName];
        const imgObj = {}
        imgObj.name = imgName;
        imgObj.encodedImgName = encodedImgName;
        imgObj.url = `imgs/${imgList}/${encodedImgName}`;
        imgObj.loaded = false;
        imgObj.image = new Image();
        imgObj.image.onload = () => {
          imgObj.loaded = true;
          if (isAllImagesLoaded(imgs)) {
            resolve(imgs);
          } 
        };
        imgObj.image.src = imgObj.url;
        imgs[imgList][imgName] = imgObj;
      });
    })
  });
  
  function isAllImagesLoaded(imgs) {
    let allLoaded = true
    imgLists.forEach(imgList => {
      const imgNames = Object.keys(imgs[imgList]);

      imgNames.forEach(imgName => {
        if (!imgs[imgList][imgName].loaded) {
          allLoaded = false
        }
      });
    });
    return allLoaded;
  }
}

function setOptionsList() {
  const selectedList = document.querySelector('#legend-type-input').value;
  const optionsListEl = document.querySelector('#select-items-column .options-list');

  const imgNames = Object.keys(imgsData[selectedList]);
  let newOptionsListStr = imgNames.map((imgName, idx) => `
    <li>
      <input type="checkbox" id="option-${idx}" class="option" value="${btoa(imgName)}" checked>
      <label for="option-${idx}">
        ${imgName}
      </label>
    </li> 
  `).join('');
  optionsListEl.innerHTML = newOptionsListStr;
  const options = document.querySelectorAll('#select-items-column .option');
  options.forEach(option => {
    option.addEventListener('change', () => generatePreview(imgsData));
  });
}

function setLegendTypeSelector(imgsData) {
  const legendSelectElem = document.querySelector('#legend-type-input');
  const legendTypes = Object.keys(imgsData);
  const optionsStr = legendTypes.map(type => `
    <option value="${type}">${type}</option>
  `).join('');
  legendSelectElem.innerHTML = optionsStr;
  legendSelectElem.addEventListener('change', (e) => {
    setOptionsList();
    generatePreview(imgsData);
  });
}