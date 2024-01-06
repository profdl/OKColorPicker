app = require('photoshop').app;
var fg = app.foregroundColor;




totalX = 50;
totalY = 1;
let grid;
const satGrid = document.getElementById("saturation-grid");
const lightGrid = document.getElementById("lightness-grid");
const hueGrid = document.getElementById("hue-grid");
let lightnessValue;
let saturationValue;
let hueValue;


let gridDetail = document.getElementById("gridDetail");
let gridDetailValue = document.getElementById("gridDetail").value;






// Get sliders and update values
let lightnessSlider = document.getElementById("lightness-slider");
lightnessValue = lightnessSlider.value*0.01;
let saturationSlider = document.getElementById("saturation-slider");
saturationValue = saturationSlider.value*0.01;
let hueSlider = document.getElementById("hue-slider");
hueValue = hueSlider.value;

updateSliderNumbers(lightnessValue, saturationValue, hueValue);
//get labels for sliders and update values
function updateSliderNumbers(lightnessValue, saturationValue, hueValue){
let lightnessNumber = document.getElementById("lightness-number");
lightnessNumber.innerHTML = Math.round(lightnessValue * 100) + "%";
let saturationNumber = document.getElementById("saturation-number");
saturationNumber.innerHTML = Math.floor(saturationValue * 400) + "%";
let hueNumber = document.getElementById("hue-number");
hueNumber.innerHTML = Math.floor(hueValue * 1) / 1 + "°";
};

updatePreview(lightnessValue, saturationValue, hueValue);
function updatePreview(lightnessValue, saturationValue, hueValue) {
  let previewColor = document.getElementById("current-color");
  previewColor.style.backgroundColor = chroma.oklch(
    lightnessValue,
    saturationValue,
    hueValue
  );

  // Update Value Preview
  let valuePreview = document.getElementById("current-value");
  valuePreview.style.backgroundColor = chroma.oklch(
    lightnessValue,
    0,
    0
  ).hex();

  // Update preview-holder
  let previewHolder = document.getElementById("preview-holder");
  previewHolder.style.backgroundColor = chroma.oklch(
    lightnessValue,
    0,
    0
  ).hex();



  // Update Hex input
  let hexInput = document.getElementById("hex-input");
  hexInput.value = chroma.oklch(
    lightnessValue,
    saturationValue,
    hueValue
  ).hex();

  // Update Color Name input
  let colorNameInput = document.getElementById("color-name");
  hex = hexInput.value
  const colors = colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});const nearest = nearestColor.from(colors);
  colorNameInput.value = (nearest(hex).name);




  // Update Photoshop Color
  fgRGB = chroma.oklch(
    lightnessValue,
    saturationValue,
    hueValue
  ).rgb();

  setFG(fgRGB[0], fgRGB[1], fgRGB[2]);
}




lightnessSlider.addEventListener("change", (e) => {
  lightnessValue = e.target.value*0.01;
  clearGrid();
  createLightGrid(lightnessValue, saturationValue, hueValue);
  createSatGrid(lightnessValue, saturationValue, hueValue);
  createHueGrid(lightnessValue, saturationValue, hueValue);
  updatePreview(lightnessValue, saturationValue, hueValue);
  updateSliderNumbers(lightnessValue, saturationValue, hueValue);
});

saturationSlider.addEventListener("change", (e) => {
  saturationValue = e.target.value*0.01;
  clearGrid();
  createLightGrid(lightnessValue, saturationValue, hueValue);
  createSatGrid(lightnessValue, saturationValue, hueValue);
  createHueGrid(lightnessValue, saturationValue, hueValue);
  updatePreview(lightnessValue, saturationValue, hueValue);
  updateSliderNumbers(lightnessValue, saturationValue, hueValue);
});

hueSlider.addEventListener("change", (e) => {
  hueValue = e.target.value;
  clearGrid();
  createLightGrid(lightnessValue, saturationValue, hueValue);
  createSatGrid(lightnessValue, saturationValue, hueValue);
  createHueGrid(lightnessValue, saturationValue, hueValue);
  updatePreview(lightnessValue, saturationValue, hueValue);
  updateSliderNumbers(lightnessValue, saturationValue, hueValue);
});



//HUE GRID
function createHueGrid(lightnessValue, saturationValue, hueValue) {
  for (let i = 0; i < totalY; i++) {
    for (let j = 0; j < totalX; j++) {
      hueValue = j * (360 / totalX);
      grid = document.getElementById("hue-grid");
      //Create a div and add it to the grid
      let box = document.createElement("div");
      box.classList.add("color-box");
      box.style.backgroundColor = chroma.oklch(
        lightnessValue,
        saturationValue,
        hueValue
      );
      grid.appendChild(box);
      box.style.width = 100 / totalX + "%";
      box.style.height = 100 / totalY + "%";

      //Set if of box
      let jString = j.toString();
      box.id = jString;
    }
  }
}

//SATURATION GRID
function createSatGrid(lightnessValue, saturationValue, hueValue) {
  for (let i = 0; i < totalY; i++) {
    for (let j = 0; j < totalX; j++) {
      saturationValue = j * (0.3 / totalX);
      grid = document.getElementById("saturation-grid");

      //Create a div and add it to the grid
      let box = document.createElement("div");
      box.classList.add("color-box");
      box.style.backgroundColor = chroma.oklch(
        lightnessValue,
        saturationValue,
        hueValue
      );
      grid.appendChild(box);
      box.style.width = 100 / totalX + "%";
      box.style.height = 100 / totalY + "%";

  
      //Set if of box
      let jString = j.toString();
      box.id = jString;


    }
  }
}

//LIGHTNESS GRID
function createLightGrid(lightnessValue, saturationValue, hueValue) {
  for (let i = 0; i < totalY; i++) {
    for (let j = 0; j < totalX; j++) {
      lightnessValue = j * (1 / totalX);
      grid = document.getElementById("lightness-grid");

      //Create a div and add it to the grid
      let box = document.createElement("div");
      box.classList.add("color-box");
      box.style.backgroundColor = chroma.oklch(
        lightnessValue,
        saturationValue,
        hueValue
      );
      grid.appendChild(box);
      box.style.width = 100 / totalX + "%";
      box.style.height = 100 / totalY + "%";

      //Set if of box
      let jString = j.toString();
      box.id = jString;
    }
  }
}

//CLEAR GRIDS FUNCTION ========================================
function clearGrid() {
  while (satGrid.firstChild) {
    satGrid.removeChild(satGrid.firstChild);
  }
  while (lightGrid.firstChild) {
    lightGrid.removeChild(lightGrid.firstChild);
  }
  while (hueGrid.firstChild) {
    hueGrid.removeChild(hueGrid.firstChild);
  }
}



//Add event listener to gridDetail
gridDetail.addEventListener("change", (e) => {
  gridDetailValue = e.target.value;

  clearGrid();
  if (gridDetailValue == "a") {
    totalX = 10;
    totalY = 1;
  } else if (gridDetailValue == "b") {
    totalX = 20;
    totalY = 1;
  } else if (gridDetailValue == "c") {
    totalX = 50;
    totalY = 1;
  }

  clearGrid();
  createLightGrid(lightnessValue, saturationValue, hueValue);
  createSatGrid(lightnessValue, saturationValue, hueValue);
  createHueGrid(lightnessValue, saturationValue, hueValue);

});








// FUNCTION TO SET FOREGROUND COLOR IN PHOTOSHOP
async function setFG(fgR, fgG, fgB) {
  const batchCommands = {
    _obj: "set",
    _target: [
      {
        _ref: "color",
        _property: "foregroundColor",
      },
    ],
    to: {
      _obj: "RGBColor",
      red: fgR,
      grain: fgG,
      blue: fgB,
    },
    source: "photoshopPicker",
    _options: {
      dialogOptions: "dontDisplay",
    },
  };
  return await require("photoshop").core.executeAsModal(async () => {
    await require("photoshop").action.batchPlay([batchCommands], {});
  });
}

// GET FOREGROUND COLOR 
function getFGColor() {
  const HSBToRGB = (h, s, b) => {
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [255 * f(5), 255 * f(3), 255 * f(1)];
  };
  
    var fg = app.foregroundColor;
    let fgRGB = HSBToRGB(fg.hsb.hue, fg.hsb.saturation, fg.hsb.brightness);

    // Convert RGB to OKLCH
    let fgOK = chroma.rgb(fgRGB[0], fgRGB[1], fgRGB[2]).oklch();
    console.log(fgOK);

    // Set sliders to current foreground color
    clearGrid();
    createLightGrid(fgOK[0], fgOK[1], fgOK[2]);
    createSatGrid(fgOK[0], fgOK[1], fgOK[2]);
    createHueGrid(fgOK[0], fgOK[1], fgOK[2]);
    updatePreview(fgOK[0], fgOK[1], fgOK[2]);
    updateSliderNumbers(fgOK[0], fgOK[1], fgOK[2]);
    lightnessSlider.value = fgOK[0]*100;
    saturationSlider.value = fgOK[1]*100;
    hueSlider.value = fgOK[2];

    //Set Values
    lightnessValue = fgOK[0];
    saturationValue = fgOK[1];
    hueValue = fgOK[2];

}

//Listen for click on fgColor
fgColorButton = document.getElementById("fgColor-button");
fgColorButton.addEventListener("click", (e) => {
  getFGColor();
});


createLightGrid(lightnessValue, saturationValue, hueValue);
createSatGrid(lightnessValue, saturationValue, hueValue);
createHueGrid(lightnessValue, saturationValue, hueValue);




