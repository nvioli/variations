const audioUtils = require('./audioUtils.js');

exports.lowestFreq = 'red';
exports.overtone = 'green';
exports.amplitude = 'lightskyblue';
exports.duration = 'orange';
exports.occurence = 'purple';

exports.foreground = '#828282';
exports.background = '#332d2d';

exports.timeLineColor = 'orange';

function getNoteHueValue(note) {
  // utility for converting a note to a color (hue) value.
  // using the below code, I determined that the lowest sampled note has a value of 10,
  // and the highest sampled note has a value of 96.
  // So we just map our note's value's place in that range to the range [0,360]
  // for input into HSV functions.
  // However, using a linear mapping (return p5.map(audioUtils.noteToValue(note),10,96,0,360);)
  // produces a very green-centric palate since many notes are in the middle of the range.
  // Instead we use a sigmoid to stretch the ends where there are fewer notes

  // let lowestSample = 1000;
  // let highestSample = 0;
  // Object.keys(LIBRARY.samples).forEach(instrument => {
  //   [l,h] = getSampleRange(instrument);
  //   if (noteToValue(l) < lowestSample){lowestSample = noteToValue(l)}
  //   if (noteToValue(h) > highestSample){highestSample = noteToValue(h)}
  // })
  // console.log(lowestSample)
  // console.log(highestSample)
  // return p5.map(audioUtils.noteToValue(note),10,96,0,360);
  return 360 / (1 + Math.pow(Math.E,(43 - audioUtils.noteToValue(note)) / 10));
}

exports.getNoteHueValue = getNoteHueValue;
