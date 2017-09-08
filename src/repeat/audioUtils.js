// see Samples/samplesInfo.txt for information about serving the audio files yourself
const localSampleLibrary = false;

// based on
// https://teropa.info/blog/2016/07/28/javascript-systems-music.html#building-a-simple-sampler
const LIBRARY = require('./library.js');
const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function noteToValue(note) {
  return note.octave * 12 + OCTAVE.indexOf(note.pitch);
}

function valueToNote(value) {
  return {octave: Math.floor(value / 12), pitch: OCTAVE[value % 12]};
}

function getNoteDistance(note1, note2) {
  return noteToValue(note1) - noteToValue(note2);
}

function getFullSamplePath(note) {
  if (localSampleLibrary) {
    return note.file;
  } else {
    return `https://nvioli.github.io/${note.file}?raw=true`;
  }
}

function getNearestSample(instrument, note) {
  let sortedBank = LIBRARY.samples[instrument].slice().sort((sampleA, sampleB) => {
    let distanceToA =
      Math.abs(getNoteDistance(note, sampleA));
    let distanceToB =
      Math.abs(getNoteDistance(note, sampleB));
    return distanceToA - distanceToB;
  });
  return sortedBank[0];
}

function getSampleRange(instrument) {
  let sortedBank = LIBRARY.samples[instrument].slice().sort(
    (sampleA, sampleB) => getNoteDistance(sampleA,sampleB)
  );
  return [sortedBank[0],sortedBank[sortedBank.length - 1]];
}

function getOvertone(note,overtone) {
  const overtoneInterval = Math.round(Math.log(1 * overtone + 1) / Math.log(Math.pow(2,1 / 12)));
  const overtoneValue = noteToValue(note) + overtoneInterval;
  return valueToNote(overtoneValue);
}

function getPlaybackRate(noteDistance) {
  return Math.pow(2, noteDistance / 12);
}

exports.noteToValue = noteToValue;
exports.valueToNote = valueToNote;
exports.getNoteDistance = getNoteDistance;
exports.getNearestSample = getNearestSample;
exports.getFullSamplePath = getFullSamplePath;
exports.getSampleRange = getSampleRange;
exports.getOvertone = getOvertone;
exports.getPlaybackRate = getPlaybackRate;
