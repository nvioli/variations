var mic, fft, posMap, sound, colorScale, sizeScale, width, height, prevMin, prevMax;

//fft.analyze returns 1024 bands
var bands = 1024;

//circles must be a power of two so that it plays nice with the number of bands.
//but for some reason 512 doesn't work.
var circleCounts = [64,128,256,1024,2048];

//these are modifiable in the controls section
var circles,circleSize,cleanUp,bgHue,saturationMod;

function setup() {
  frameRate(15);
  width = window.innerWidth || d.documentElement.clientWidth || document.body.clientWidth;
  height = window.innerHeight|| d.documentElement.clientHeight|| document.body.clientHeight;
  createCanvas(width, height);
  colorMode(HSB);
  getBg();
  noStroke();
  updateInputs();

  posMap = getPosMap();

  prevMin = Array.apply(null, Array(circles)).map(Number.prototype.valueOf,0);
  prevMax = Array.apply(null, Array(circles)).map(Number.prototype.valueOf,0);

  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
}

function draw(){
  if (cleanUp) getBg();
  var spectrum = fft.analyze();
  for (var i = 1; i < circles; i++){
    var x = posMap[i][0];
    var y = posMap[i][1];
    
    sound = y*x*spectrum[i * bands / circles];

    prevMax[i] = max(prevMax[i],sound);
    prevMin[i] = min(prevMin[i],sound);

    colorScale = map(sound,prevMin[i],prevMax[i],0,255) || 0;
    sizeScale = map(sound,prevMin[i],prevMax[i],0,width * circleSize / sqrt(circles));
        
    fill(colorScale,colorScale+saturationMod,colorScale+70);
    ellipse(x, y, sizeScale / 2, sizeScale / 2);
  }
}

function getBg() {
  background(bgHue, 100, 240)
}

function updateInputs() {
  circles = circleCounts[document.getElementById('circleCount').value];
  circleSize = document.getElementById('circleSize').value;
  bgHue = document.getElementById('bg').value;
  saturationMod = Number(document.getElementById('color1').value);
  cleanUp = document.getElementById('cleanUp').checked;

  posMap = getPosMap();
}

function getPosMap(){
  var ret = {};
  var key = 1;
  //start in the center
  var dimn = sqrt(circles);
  var curx = width / 2;
  var cury = height / 2;

  var xstep = width / dimn;
  var ystep = height / dimn;

  ret[key] = [curx,cury];
  
  for (var grpSize = 1; grpSize <= dimn * 2; grpSize++){
    for (var j = 0; j < grpSize; j++){
      key++;
      curx += xstep;
      ret[key] = [curx,cury];
    }
    for (var j = 0; j < grpSize; j++){
      key++;
      cury += ystep;
      ret[key] = [curx,cury];
    }
    grpSize++;
    for (var j = 0; j < grpSize; j++){
      key++;
      curx -= xstep;
      ret[key] = [curx,cury];
    }
    for (var j = 0; j < grpSize; j++){
      key++;
      cury -= ystep;
      ret[key] = [curx,cury];
    }
  }
  return ret;
}
