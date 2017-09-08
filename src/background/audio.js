const P5 = require('p5');
const audioUtils = require('./audioUtils.js');

let startTime;

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

  note.sample = p5.loadSound(audioUtils.getFullSamplePath(nearestSample), () => {
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

      note.overtones.forEach(overtone => {
        preloadNote(p5,instrument,overtone);
      });
    });
  });
}


function playNoteAndOvertones(note,delay,rate) {
  playNote(note,delay,rate);
  let overtoneDelay = 0;
  note.overtones.forEach(overtone => {
    overtoneDelay += note.duration / (note.overtones.length + 1);
    playNote(overtone,delay + overtoneDelay,rate);
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

let playPart;
function playScore(p5,score) {
  // p5.select('#text').html('');
  playPart = new P5.Part(16);
  playPart.loop();
  playPart.setBPM(10);

  const zeroPattern = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  let noteOffset = 0;

  Object.keys(score).forEach(instrument => {
    score[instrument].notes.forEach(note => {
      const pattern = zeroPattern.slice();
      pattern[noteOffset % 16] = 1;
      console.log("adding " + getPhraseName(instrument,note) + " at offset " + noteOffset % 16);
      setTimeout(
        () => {
          playPart.addPhrase(getPhrase(instrument,note,pattern));
        },
        note.delay * 1000
      );
      noteOffset++;
    });
  });
  Object.keys(score).forEach(instrument => {
    score[instrument].notes.forEach(note => {
      setTimeout(
        () => {
          // remove the parts in the reverse order they were added
          playPart.removePhrase(getPhraseName(instrument,note));
        },
        (getScoreDuration(score) - note.delay) * 1000
      );
    });
  });

  startTime = new Date();
  playPart.start();
}

function stopScore() {
  playPart.stop();
}

function getPhrase(instrument,note,pattern) {
  return new P5.Phrase(
    getPhraseName(instrument,note),
    (time,rate) => {
      playNoteAndOvertones(note,time,rate);
    },
    pattern
  );
}

function getPhraseName(instrument,note) {
  return instrument + note.pitch + note.octave + note.amplitude;
}

function getScoreDuration(score) {
  let maxDelay = 0;
  Object.keys(score).forEach(instrument => {
    score[instrument].notes.forEach(note => {
      if (note.delay > maxDelay) {
        maxDelay = note.delay;
      }
    });
  });
  return maxDelay * 2;
}

function getPercentDone(score) {
  if (startTime === undefined) {
    return 0;
  }
  const now = new Date();
  return 100 * (now.getTime() - startTime.getTime()) / 1000 / getScoreDuration(score);
}

exports.getNoteFromDistance = getNoteFromDistance;
exports.preloadNote = preloadNote;
exports.preloadScore = preloadScore;
exports.setupNote = setupNote;
exports.playScore = playScore;
exports.stopScore = stopScore;
exports.playNote = playNote;
exports.playNoteAndOvertones = playNoteAndOvertones;
exports.getOvertone = audioUtils.getOvertone;
exports.getScoreDuration = getScoreDuration;
exports.getPercentDone = getPercentDone;
