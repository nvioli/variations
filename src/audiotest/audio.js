const audioUtils = require('./audioUtils.js');

function preloadNote(p5,instrument,note,cb) {
  const nearestSample = audioUtils.getNearestSample(instrument,note);
  note.pitchAdjust = audioUtils.getPlaybackRate(audioUtils.getNoteDistance(note,nearestSample));

  note.sample = p5.loadSound(nearestSample.file, cb);

  note.sample.playMode('restart');
}

function playNote(note,delay,rate) {
  note.envelope.setADSR(delay + 0.001, 0.2, note.amplitude, note.duration);
  note.envelope.setRange(note.amplitude, 0);

  note.sample.play(delay,(rate || 1) * note.pitchAdjust);
  note.envelope.play(note.sample);
}

exports.preloadNote = preloadNote;
exports.playNote = playNote;
