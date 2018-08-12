function generatePreview(imgsData) {
  const selectedList = document.querySelector('#legend-type-input').value;
  const selectedOptionEls = document.querySelectorAll('#select-items-column .option:checked');
  const numColumns = document.querySelector('#column-input').value;
  const selectedNames = Array.from(selectedOptionEls).map(el => atob(el.value));
  const canvas = document.querySelector('.preview-canvas');
  const ctx = canvas.getContext('2d');
  const filteredImgsData = selectedNames.map(name => imgsData[selectedList][name]);
  const labelPadding = 10;


  // Split image data into correct number of columns
  const columns = [];
  for (let i = 0; i < numColumns; i++) {
    columns.push({
      imgs: [],
      height: 0,
      width: 0,
    });
  }
  filteredImgsData.forEach((img, idx) => {
    columns[idx % numColumns].imgs.push(img);
  });
  columns.forEach(column => {
    const columnSize = getColumnSize(column.imgs, ctx, labelPadding);
    column.height = columnSize.height;
    column.width = columnSize.width;
  });
  
  canvas.height = columns.reduce((max, next) => Math.max(max, next.height), 0);
  canvas.width = columns.reduce((sum, next) => sum + next.width, 0);

  clearCanvas(canvas, ctx);
  let yOffset = 0;
  let xOffset = 0;

  columns.forEach(column => {
    yOffset = 0;
    const maxImgWidth = column.imgs.reduce((max, next) => Math.max(next.image.width, max), 0);

    column.imgs.forEach(imgData => {
      const imgXOffset = xOffset + ((maxImgWidth - imgData.image.width) / 2);
      const imgYOffset = yOffset;
      ctx.drawImage(imgData.image, imgXOffset, imgYOffset);
  
      const labelXOffset = xOffset + maxImgWidth + labelPadding;
      const labelYOffset = yOffset + (imgData.image.height / 2);
      ctx.fillText(imgData.name, labelXOffset, labelYOffset);
      yOffset += imgData.image.height;
    });

    xOffset += column.width + labelPadding;
  });
}

function getColumnSize(imgDatas, ctx, labelPadding) {
  const maxImgWidth = imgDatas.reduce((max, next) => Math.max(next.image.width, max), 0);
  const maxLabelWidth = imgDatas.reduce((max, next) => Math.max(max, ctx.measureText(next.name).width), 0);
  const sumImageHeights = imgDatas.reduce((sum, next) => sum + next.image.height, 0);

  return {
    height: sumImageHeights,
    width: maxImgWidth + maxLabelWidth + 2 * labelPadding
  };
}

function clearCanvas(canvas, ctx) {
  ctx.save();
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}
module.exports = generatePreview;