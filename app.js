const screen = document.querySelector(".openfullscreen");
const inputs = document.querySelectorAll(".filters input");
const outputs = document.querySelectorAll(".filters output");
const resetBtn = document.querySelector(".btn-reset");
const nextPicture = document.querySelector(".btn-next");
const image = document.querySelector(".editor img");
const fileInput = document.querySelector(".btn-load--input");
const imageContainer = document.querySelector(".img__container");
const canvas = document.querySelector('canvas');
const saveBtn = document.querySelector('.btn-save');
const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
const date = new Date();
const time = `${date.getHours()}.${date.getMinutes()}`
let timesOfDay = ''
if (time >= 0.0 && time < 6.0) {
  timesOfDay = 'night'
} else if (time >= 6 && time < 12) {
  timesOfDay = 'morning'
} else if (time >= 12 && time < 18) {
  timesOfDay = 'day'
} else if (time >= 18 && time < 24) {
  timesOfDay = 'evening'
}
const base = `https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timesOfDay}/`;
const filterValues = {
  blur: '0',
  invert: '0',
  sepia: '0',
  saturate: '100',
  hue: '0',
  grayscale: '0',
  opacity: '100',
  brightness: '100',
  contrast: '100',
}
let number = 0;
let loadPictureLink = '';

inputs.forEach(el => el.addEventListener('mousemove', handleUpdate))
function handleUpdate() {
  const suffix = this.dataset.sizing || '';
  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix)
  for (let i = 0; i < outputs.length; i++) {
    outputs[i].value = inputs[i].value
  }
  filterValues[`${this.name}`] = this.value
  drawImage()
}

screen.onclick = () => {
  if (document.fullscreenElement === null) {
    document.documentElement.requestFullscreen();
    document.querySelector(".img").src = "./assets/svg/fullscreen-exit.svg";
  } else if (document.fullscreenElement) {
    document.exitFullscreen();
    document.querySelector(".img").src = "./assets/svg/fullscreen-open.svg";
  }
};

resetBtn.onclick = () => {
  filterValues.blur = '0';
  filterValues.invert = '0';
  filterValues.sepia = '0';
  filterValues.saturate = '100';
  filterValues.hue = '0';
  filterValues.grayscale = '0';
  filterValues.opacity = '100'
  filterValues.brightness = '100';
  filterValues.contrast = '100';
  for (let i = 0; i < outputs.length; i++) {
    const suffix = inputs[i].dataset.sizing || '';
    document.documentElement.style.setProperty(`--${inputs[i].name}`, i === 3 || i === 6 || i === 7 || i === 8 ? inputs[i].min = 100 + suffix : inputs[i].min = 0 + suffix)
    i === 3 || i === 6 || i === 7 || i === 8 ? inputs[i].value = 100 : inputs[i].value = 0;
    i === 3 || i === 6 || i === 7 || i === 8 ? outputs[i].value = 100 : outputs[i].value = 0;
    drawImage();
  }
}
nextPicture.onclick = () => {
  image.style.display = 'block';
  imageContainer.style.display = 'none';
  fileInput.value = null;
  image.src = `${base}${images[number]}`
  number++
  if (number === 20) {
    number = 0
  }
  loadPictureLink = ''
  drawImage();
}

fileInput.addEventListener('change', loadImg)
function loadImg() {
  imageContainer.style.display = 'block';
  image.style.display = 'none';
  const file = fileInput.files[0]
  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.src = reader.result;
    imageContainer.innerHTML = '';
    imageContainer.append(img);
    loadPictureLink = img.src;
    drawImage();
  }
  reader.readAsDataURL(file);
}

function drawImage() {
  const img = new Image();
  img.setAttribute('crossOrigin', 'anonymous');
  img.src = loadPictureLink === '' ? number === 0 ? "assets/img/img.jpg" : `${base}${images[number - 1]}` : loadPictureLink;
  img.onload = function () {
    canvas.width = img.width;
    canvas.height = img.height;
    const objFilterVal = Object.values(filterValues);
    const filtersString = `
    blur(${canvas.width >= canvas.height ? canvas.width / 670 * objFilterVal[0] : canvas.height / 520 * objFilterVal[0]}px)
    invert(${objFilterVal[1]}%)
    sepia(${objFilterVal[2] / 100})
    saturate(${objFilterVal[3]}%)
    hue-rotate(${objFilterVal[4]}deg)
    grayscale(${objFilterVal[5]}%)
    opacity(${objFilterVal[6]}%)
    brightness(${objFilterVal[7]}%)
    contrast(${objFilterVal[8]}%)
  `
    const ctx = canvas.getContext("2d");
    ctx.filter = filtersString;
    ctx.drawImage(img, 0, 0);
  };
}
saveBtn.onclick = () => {
  var link = document.createElement('a');
  link.download = 'download.png';
  link.href = canvas.toDataURL();
  link.click();
  link.delete;
};

drawImage()
