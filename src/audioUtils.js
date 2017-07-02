// heavily based on
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

function getNearestSample(insturment, note) {
  let sortedBank = LIBRARY.samples[insturment].slice().sort((sampleA, sampleB) => {
    let distanceToA =
      Math.abs(getNoteDistance(note, sampleA));
    let distanceToB =
      Math.abs(getNoteDistance(note, sampleB));
    return distanceToA - distanceToB;
  });
  return sortedBank[0];
}

function getSampleRange(insturment) {
  let sortedBank = LIBRARY.samples[insturment].slice().sort(
    (sampleA, sampleB) => getNoteDistance(sampleA,sampleB)
  );
  return [sortedBank[0],sortedBank[sortedBank.length - 1]];
}

function flatToSharp(note) {
  switch (note) {
    case 'Bb': return 'A#';
    case 'Db': return 'C#';
    case 'Eb': return 'D#';
    case 'Gb': return 'F#';
    case 'Ab': return 'G#';
    default: return note;
  }
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
exports.getSampleRange = getSampleRange;
exports.flatToSharp = flatToSharp;
exports.getOvertone = getOvertone;
exports.getPlaybackRate = getPlaybackRate;
