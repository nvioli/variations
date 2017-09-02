const vis = require('./vis.js');
const sheets = require('./sheets.js');
const utils = require('./utils.js');
const geom = require('./geometry.js');
const audio = require('./audio.js');

// The score object will hold all the information we generate about the various instruments' parts.
// {
//   "Cello": {
//     // added in the sheets module:
//     point: {x: 50, y: 50, size: 2},
//     // added in the index module:
//     notes: [
//       {
//         lines: {
//           end1: {x: 0, y: 10},
//           end2: {x: 100, y: 50},
//           distance: 40,
//           intersection: {x: 20, y: 20}
//         },
//         pitch: C,
//         octave: 3,
//         delay: 15.5,
//         amplitude: 32.222,
//         overtones: [
//           // overtones have all the same keys as the parent notes (except their own overtones)
//         ]
//         // added in the index module, then adjusted in the audio module
//         duration: 1.5,
//
//         // added in the audio module (setupNote and preloadNote functions):
//         pitchAdjust:  1.05,
//         sample:       P5 SoundFile object,
//         curAmplitude: P5 Amplitude object,
//         envelope:     P5 Env object
//       },
//       ...
//     ],
//     //added in the vis module
//   }
// }
const score = sheets.pointSheet;
Object.keys(score).forEach(instrument => {
  const point = score[instrument].point;
  const notesForThisInstrument = [];

  // randomize the line sheets array
  utils.shuffle(sheets.lineSheets);
  // each instrument plays a number of notes equal to its size, and we need one sheet per note,
  // so we work with the number of sheets equal to the point's size
  sheets.lineSheets.slice(0,point.size).forEach(sheet => {
    // rotate and/or flip the sheet:
    const newSheet = permuteSheet(sheet);
    notesForThisInstrument.push(getNoteInfo(instrument,point,newSheet));
  });

  score[instrument].notes = notesForThisInstrument;
});

function permuteSheet(sheet) {
  // we need to return a new sheet here so we're not mucking with the objects
  // that other notes are pointing at. Note that sheet.slice() isn't good enough
  // because it maintains the pointers to the objects. So here's a nice solution from
  // https://stackoverflow.com/a/23481096

  const permutedSheet = JSON.parse(JSON.stringify(sheet));
  geom.rotate(permutedSheet,Math.PI / 2 * Math.floor(Math.random() * 4));

  if (Math.random() > 0.5) {
    geom.reflect(permutedSheet);
  }
  return permutedSheet;
}

function getNoteInfo(instrument,point,sheet) {
  const lines = getLines(point,sheet);
  const noteInfo = audio.getNoteFromDistance(instrument,lines.lowestFreq.distance);
  const overtones = [];
  for (let o = 1; o < Math.round(lines.overtone.distance / 20); o++) {
    const overtoneNote = audio.getOvertone({pitch: noteInfo.pitch,octave: noteInfo.octave},o);
    const overtone = getNoteAttributes(overtoneNote.pitch,overtoneNote.octave,lines);
    overtones.push(overtone);
  }
  return getNoteAttributes(noteInfo.pitch,noteInfo.octave,lines,overtones);
}

function getNoteAttributes(pitch,octave,lines,overtones) {
  return {
    lines,
    pitch,
    octave,
    delay: lines.occurence.distance,
    amplitude: lines.amplitude.distance / 100,
    duration: lines.duration.distance / 10,
    overtones
  };
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

vis.init(score);
