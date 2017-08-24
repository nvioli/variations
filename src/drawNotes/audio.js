const P5 = require('p5');
const audioUtils = require('./audioUtils.js');

function getNoteFromDistance(instrument,dist) {
  const [lowestNote,highestNote] = audioUtils.getSampleRange(instrument);
  const instrumentRange = audioUtils.getNoteDistance(highestNote,lowestNote);
  /* Most pairs of points won't have distance over 100, so while that's not the
     actual maximum distance possible, it should provide us with more-or-less
     well-distributed notes (I think). Worst case scenario is we end up with a
     note higher than the top sample, but we can always pitch bend to
     approximate it.
  */
  const proportion = instrumentRange * dist / 100;
  const returnVal = Math.floor(audioUtils.noteToValue(lowestNote) + proportion);
  return audioUtils.valueToNote(returnVal);
}

function preloadNote(p5,instrument,note) {
  const nearestSample = audioUtils.getNearestSample(instrument,note);
  note.pitchAdjust = audioUtils.getPlaybackRate(audioUtils.getNoteDistance(note,nearestSample));

  note.sample = p5.loadSound(nearestSample.file, () => {
    setupNote(note);
  });

  note.sample.playMode('restart');
}

function setupNote(note) {
  note.duration = Math.min(note.duration,note.sample.duration() * 1 / note.pitchAdjust);

  const env = new P5.Env();
  note.sample.amp(env);
  note.envelope = env;

  const amp = new P5.Amplitude();
  amp.setInput(note.sample);
  note.curAmplitude = amp;
}

function preloadScore(p5,score) {
  Object.keys(score).forEach(instrument => {
    score[instrument].notes.forEach(note => {
      preloadNote(p5,instrument,note);
    });
  });
}

function playNote(note,delay,rate) {
  note.envelope.setADSR(delay + 0.001, 0.2, note.amplitude, note.duration);
  note.envelope.setRange(note.amplitude, 0);

  note.sample.play(delay,(rate || 1) * note.pitchAdjust);
  note.envelope.play(note.sample);

  setTimeout(
    () => {
      note.isActive = true;
    },
    delay * 1000
  );

  setTimeout(
    () => {
      note.isActive = false;
    },
    (delay + note.duration) * 1000
  );
}

exports.getNoteFromDistance = getNoteFromDistance;
exports.preloadNote = preloadNote;
exports.preloadScore = preloadScore;
exports.setupNote = setupNote;
exports.playNote = playNote;
