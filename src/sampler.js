// heavily based on https://teropa.info/blog/2016/07/28/javascript-systems-music.html#building-a-simple-sampler
const SAMPLE_LIBRARY = require('./library.js');
const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// let audioContext = new AudioContext();

function fetchSample(path) {
  return fetch(encodeURIComponent(path))
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer));
}

function noteToValue(note, octave) {
  return octave * 12 + OCTAVE.indexOf(note);
}

function valueToNote(value) {
  return {octave: Math.floor(value / 12) + 1, note: OCTAVE[value % 12]}
}

function getNoteDistance(note1, octave1, note2, octave2) {
  return noteToValue(note1, octave1) - noteToValue(note2, octave2);
}

function getNearestSample(sampleBank, insturment, note, octave) {
  let sortedBank = sampleBank[insturment].slice().sort((sampleA, sampleB) => {
    let distanceToA =
      Math.abs(getNoteDistance(note, octave, sampleA.note, sampleA.octave));
    let distanceToB =
      Math.abs(getNoteDistance(note, octave, sampleB.note, sampleB.octave));
    return distanceToA - distanceToB;
  });
  return sortedBank[0];
}

function getSampleRange(sampleBank, insturment) {
  let sortedBank = sampleBank[insturment].slice().sort((sampleA, sampleB) => getNoteDistance(sampleA.note,sampleA.octave,sampleB.note,sampleB.octave));
  return [sortedBank[0],sortedBank[sortedBank.length - 1]];
}

function flatToSharp(note) {
  switch (note) {
    case 'Bb': return 'A#';
    case 'Db': return 'C#';
    case 'Eb': return 'D#';
    case 'Gb': return 'F#';
    case 'Ab': return 'G#';
    default:   return note;
  }
}

function getSample(instrument, noteAndOctave) {
  let [, requestedNote, requestedOctave] = /^(\w[b\#]?)(\d)$/.exec(noteAndOctave);
  requestedOctave = parseInt(requestedOctave, 10);
  requestedNote = flatToSharp(requestedNote);
  let sampleBank = SAMPLE_LIBRARY.samples[instrument];
  let sample = getNearestSample(sampleBank, requestedNote, requestedOctave);
  let distance =
    getNoteDistance(requestedNote, requestedOctave, sample.note, sample.octave);
  return fetchSample(sample.file).then(audioBuffer => ({
    audioBuffer: audioBuffer,
    distance: distance
  }));
}

function playSample(instrument, note) {
  getSample(instrument, note).then(({audioBuffer, distance}) => {
    let playbackRate = Math.pow(2, distance / 12);
    let bufferSource = audioContext.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.playbackRate.value = playbackRate;
    bufferSource.connect(audioContext.destination);
    bufferSource.start();
  });
}

// Temporary test code
// setTimeout(() => playSample('Grand Piano', 'F4'),  1000);
// setTimeout(() => playSample('Grand Piano', 'Ab4'), 2000);
// setTimeout(() => playSample('Grand Piano', 'C5'),  3000);
// setTimeout(() => playSample('Grand Piano', 'Db5'), 4000);
// setTimeout(() => playSample('Grand Piano', 'Eb5'), 5000);
// setTimeout(() => playSample('Grand Piano', 'F5'),  6000);
// setTimeout(() => playSample('Grand Piano', 'Ab5'), 7000);

exports.getSampleRange = getSampleRange;
exports.getNoteDistance = getNoteDistance;
exports.valueToNote = valueToNote;
exports.noteToValue = noteToValue;
