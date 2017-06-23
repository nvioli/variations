const utils = require('./utils.js');
const geom = require('./geometry.js');
const library = require('./library.js');
const sampler = require('./sampler.js');

function getNoteInfo(insturment,distances) {
  const noteInfo = getNote(insturment,distances.lowestFreq.distance);
    let textStr = insturment + " to play:\n";
    textStr += '  * note ' + noteInfo.note + ' in octave ' + noteInfo.octave;
    //  + ' and ' + noteInfo.overtone.distance + ' at amplitude of ' + noteInfo.amplitude.distance +
    //   ' for ' + noteInfo.duration.distance + ' starting at ' + noteInfo.occurence.distance + '\n'
    return {
      text: textStr,
      note: noteInfo
    }
}

function getNote(insturment,dist) {
  const [lowestNote,highestNote] = sampler.getSampleRange(library.samples,insturment);
  const insturmentRange = sampler.getNoteDistance(highestNote.note,highestNote.octave,lowestNote.note,lowestNote.octave);
  //Most pairs of points won't have distance over 100, so while that's not the actual maximum distance possible,
  // it should provide us with more-or-less well-distributed notes (I think).
  // Worst case scenario is we end up with a note higher than the top sample,
  // but we can always pitch bend to approximate it.
  const proportionOfRange = insturmentRange * dist / 100;

  return sampler.valueToNote(Math.floor(sampler.noteToValue(lowestNote.note,lowestNote.octave) + proportionOfRange))
}
exports.getNoteInfo = getNoteInfo;
