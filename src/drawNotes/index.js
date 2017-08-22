const vis = require('./vis.js');
const sheets = require('./sheets.js');
const utils = require('./utils.js');
const geom = require('./geometry.js');
const audio = require('./audio.js');

const score = sheets.pointSheet;

Object.keys(score).forEach(instrument => {
  const point = score[instrument].point;
  const notesForThisInstrument = [];

  // each instrument plays a number of notes equal to its size, and we need one sheet per note,
  // so we work with the number of sheets equal to the point's size
  sheets.lineSheets.slice(0,point.size).forEach(sheet => {
    // rotate and/or flip the sheet:
    notesForThisInstrument.push(getNoteInfo(instrument,point,sheet));
  });

  score[instrument].notes = notesForThisInstrument;
});

function getNoteInfo(instrument,point,sheet) {
  const lines = getLines(point,sheet);
  const noteInfo = audio.getNoteFromDistance(instrument,lines.lowestFreq.distance);

  return getNoteAttributes(noteInfo.pitch,noteInfo.octave,lines);
}

function getLines(point,sheet) {
  // randomize the order of lines in the sheet
  utils.shuffle(sheet);

  return {
    lowestFreq: getLineDetails(point,sheet[0]),
    overtone: getLineDetails(point,sheet[1]),
    amplitude: getLineDetails(point,sheet[2]),
    duration: getLineDetails(point,sheet[3]),
    occurence: getLineDetails(point,sheet[4])
  };
}

function getLineDetails(point,lineEnds) {
  const [end1,end2] = lineEnds.slice();
  const line = geom.getLine(end1,end2);

  return {
    end1,
    end2,
    distance: geom.distanceFrom(point,line),
    intersection: geom.perpindicularIntersectionPoint(point,line)
  };
}

function getNoteAttributes(pitch,octave,lines) {
  return {
    lines,
    pitch,
    octave,
    delay: lines.occurence.distance,
    amplitude: lines.amplitude.distance / 100,
    duration: lines.duration.distance / 10
  };
}

vis.init(score);
