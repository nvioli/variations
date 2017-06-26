const vis = require('./vis.js');
const sheets = require('./sheets.js');
const utils = require('./utils.js');
const geom = require('./geometry.js');
const notes = require('./notes.js');
const sampler = require('./sampler.js');

//The score object will hold all the information we generate about the various insturments' parts.
//{
//  "Cello": {
//    //added in the sheets module:
//    point: {x: 50, y: 50},
//    //added in the index module:
//    notes: [
//      {
//        lines: {
//          end1: {x: 0, y: 10},
//          end2: {x: 100, y: 50},
//          distance: 40,
//          intersection: {x: 20, y: 20}
//        },
//        text: "  * note C in octave 3",
//        note: C,
//        octave: 3
//      },
//      ...
//    ],
//    //added in the vis module
//  }
//}
const score = sheets.pointSheet;

Object.keys(score).forEach(insturment => {
  const point = score[insturment].point;
  const notesForThisInsturment = [];

  //randomize the line sheets array
  //TODO rotate and flip the sheets
  utils.shuffle(sheets.lineSheets);

  //each insturment plays a number of notes equal to its size, and we need one sheet per note,
  //so we work with the number of sheets equal to the point's size
  sheets.lineSheets.slice(0,point.size).forEach(sheet => {
    notesForThisInsturment.push(getNoteInfo(insturment,point,sheet));
  });

  score[insturment]['notes'] = notesForThisInsturment;
});

function getNoteInfo(insturment,point,sheet) {
  const lines = getLines(point,sheet);
  const noteInfo = getNote(insturment,lines.lowestFreq.distance);
    let textStr = '\n  * note ' + noteInfo.note + ' in octave ' + noteInfo.octave
      // + ' and ' + noteInfo.overtone.distance
      + ' at amplitude of ' + lines.amplitude.distance.toFixed(0) + '%'
    //   ' for ' + noteInfo.duration.distance
      + ' starting at ' + lines.occurence.distance.toFixed(2) + 's.'
    return {
      lines: lines,
      text: textStr,
      note: noteInfo.note,
      octave: noteInfo.octave,
      delay: lines.occurence.distance,
      amplitude: lines.amplitude.distance / 100
    }
}

function getLines(point,sheet) {
  //randomize the order of lines in the sheet
  utils.shuffle(sheet);

  return {
    lowestFreq: getLineDetails(sheet[0]),
    overtone: getLineDetails(sheet[1]),
    amplitude: getLineDetails(sheet[2]),
    duration: getLineDetails(sheet[3]),
    occurence: getLineDetails(sheet[4])
  }

  function getLineDetails(lineEnds){
    const line = geom.getLine(lineEnds[0],lineEnds[1]);

    return {
      end1: lineEnds[0],
      end2: lineEnds[1],
      distance: geom.distanceFrom(point,line),
      intersection: geom.perpindicularIntersectionPoint(point,line)
    }
  }
}

function getNote(insturment,dist) {
  const [lowestNote,highestNote] = sampler.getSampleRange(insturment);
  const insturmentRange = sampler.getNoteDistance(highestNote.note,highestNote.octave,lowestNote.note,lowestNote.octave);
  //Most pairs of points won't have distance over 100, so while that's not the actual maximum distance possible,
  // it should provide us with more-or-less well-distributed notes (I think).
  // Worst case scenario is we end up with a note higher than the top sample,
  // but we can always pitch bend to approximate it.
  const proportionOfRange = insturmentRange * dist / 100;

  return sampler.valueToNote(Math.floor(sampler.noteToValue(lowestNote.note,lowestNote.octave) + proportionOfRange))
}

vis.init(score);
