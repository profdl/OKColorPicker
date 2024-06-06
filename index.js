const { converter, formatHex, okhsl, rgb, parse } = culori;

function toOKHSL(r, g, b) {
  return converter("okhsl")({ mode: "rgb", "r": r, "g": g, "b": b })
}

function toRGB(h, s, l) {
  return converter("rgb")({ mode: "okhsl", "h": h, "s": s, "l": l })
}


// id binder
const FILED_HEX_IN_OUT = "hex-in-output"
const FIELD_COLOR_NAME = "color-name"
const SLIDER_SATURATION = "slider_saturation"
const SLIDER_LIGHTNESS = "slider_lightness"
const SLIDER_HUE = "slider_hue"
const GRID_SATURATION = "grid_saturation"
const GRID_LIGHTNESS = "grid_lightness"
const GRID_HUE = "grid_hue"

const satSlider = document.getElementById(SLIDER_SATURATION);
const lightSlider = document.getElementById(SLIDER_LIGHTNESS);
const hueSlider = document.getElementById(SLIDER_HUE);

const satGrid = document.getElementById(GRID_SATURATION);
const lightGrid = document.getElementById(GRID_LIGHTNESS);
const hueGrid = document.getElementById(GRID_HUE);

// global values
let lightnessValue;
let saturationValue;
let hueValue;
app = require('photoshop').app;

// setup routine
getColorFromApp();
updatePreview(lightnessValue, saturationValue, hueValue);


function updatePreview() {
  //color
  let previewColor = document.getElementById("current-color");
  let color = toRGB(hueValue, saturationValue, lightnessValue);
  previewColor.style.backgroundColor = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
  // color value
  let previewValue = document.getElementById("current-value");
  color = toRGB(0, 0, lightnessValue);
  previewValue.style.backgroundColor = `rgb(${color.r * 255}, ${color.g * 255}, ${color.b * 255})`;
  // hex value
  let hexInput = document.getElementById(FILED_HEX_IN_OUT);
  color = toRGB(hueValue, saturationValue, lightnessValue);
  let hex = formatHex(color);
  hexInput.value = hex;
  //color name
  let colorNameInput = document.getElementById(FIELD_COLOR_NAME);
  const colors = colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});
  const nearest = nearestColor.from(colors);
  colorNameInput.value = (nearest(hex).name);

  setColorInApp();
}


// COLOR BANDS
function redrawColorBands() {
  clearGrid();
  createHueGrid(lightnessValue, saturationValue, hueValue);
  createLightGrid(lightnessValue, saturationValue, hueValue);
  createSatGrid(lightnessValue, saturationValue, hueValue);
  updatePreview(lightnessValue, saturationValue, hueValue);
}

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

// HUE GRID
function createHueGrid(lightness, saturation, hue) {
  const stops = new Array(16).fill(String()).map((_v, i) => {
    const oklab = { mode: 'okhsl', "h": (360 / 15) * i, "s": saturation, "l": lightness };
    return `${formatHex(oklab)}`;
  });
  createColorBand(stops, GRID_HUE);
}

// SATURATION GRID
function createSatGrid(lightness, saturation, hue) {
  const stops = new Array(16).fill(String()).map((_v, i) => {
    const oklab = { mode: 'okhsl', "h": hue, "s": (1 / 15) * i, "l": lightness };
    return `${formatHex(oklab)}`;
  });
  createColorBand(stops, GRID_SATURATION);
}

// LIGHTNESS GRID
function createLightGrid(lightness, saturation, hue) {
  const stops = new Array(16).fill(String()).map((_v, i) => {
    const oklab = { mode: 'okhsl', "h": hue, "s": saturation, "l": (1 / 15) * i };
    return `${formatHex(oklab)}`;
  });
  createColorBand(stops, GRID_LIGHTNESS);
}

function createColorBand(stops, grid) {
  let box = document.createElement("div");
  box.classList.add("color-band");
  box.style.background = `linear-gradient(to right, ${stops})`;
  grid = document.getElementById(grid);
  grid.appendChild(box);
}


// Event Listener
// HEX IN OUT
document.getElementById(FILED_HEX_IN_OUT).addEventListener('change', e => {
  getColorFromHex(e.target.value);
});

// Lightness / hue / saturation
document.getElementById(SLIDER_LIGHTNESS).addEventListener("input", e => {
  lightnessValue = e.target.value * 0.01;
  HandleSliderChange();
});
document.getElementById(SLIDER_SATURATION).addEventListener("input", e => {
  saturationValue = e.target.value * 0.01;
  HandleSliderChange();
});
document.getElementById(SLIDER_HUE).addEventListener("input", e => {
  hueValue = e.target.value;
  HandleSliderChange();
});

//Listen for click on fgColor
fgColorButton = document.getElementById("fgColor-button");
fgColorButton.addEventListener("click", (e) => {
  getColorFromApp();
});


async function setColorInApp() {
  rgbColor = toRGB(hueValue, saturationValue, lightnessValue);
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
      red: rgbColor.r * 255,
      grain: rgbColor.g * 255,
      blue: rgbColor.b * 255,
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


// get Colors 
function getColorFromHex(hex) {
  okColor = okhsl(hex);

  const parsedColor = parse(hex);
  if (parsedColor !== null && parsedColor !== undefined) {
    return;
  }
  setColorValues(okColor);
}


function getColorFromApp() {
  var foregroundColor = app.foregroundColor;
  fRGB = foregroundColor.rgb;

  okColor = toOKHSL(fRGB.red / 255, fRGB.green / 255, fRGB.blue / 255);
  setColorValues(okColor);
}

// set Color
function setColorValues(okColor) {
  lightnessValue = okColor.l;
  saturationValue = okColor.s;
  hueValue = okColor.h;
  redrawColorBands();

  lightSlider.value = Math.round(lightnessValue * 100);
  satSlider.value = Math.round(saturationValue * 100);
  hueSlider.value = Math.round(hueValue);
}

// Util
const throttledRedraw = throttle(redrawColorBands, 50);
function HandleSliderChange() {
  throttledRedraw();
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}




