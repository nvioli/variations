const P5 = require('p5');
const audioUtils = require('./audioUtils.js');

require('../node_modules/p5/lib/addons/p5.sound.js');

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

function preloadNote(p5,instrument,note,cb) {
  const nearestSample = audioUtils.getNearestSample(instrument,note);
  note.pitchAdjust = audioUtils.getPlaybackRate(audioUtils.getNoteDistance(note,nearestSample));

  note.sample = p5.loadSound(nearestSample.file, cb);

  note.sample.playMode('restart');
}

function preloadScore(p5,score) {
  Object.keys(score).forEach(instrument => {
    score[instrument].notes.forEach(note => {
      preloadNote(p5,instrument,note,() => setupNote(note));

      note.overtones.forEach(overtone => {
        preloadNote(p5,instrument,overtone,() => setupNote(overtone));
      });
    });
  });
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

function getMinDelay(score) {
  let minDelay = 100;
  Object.keys(score).forEach(instrument => {
    score[instrument].notes.forEach(note => {
      if (note.delay < minDelay) {
        minDelay = note.delay;
      }
    });
  });
  return minDelay;
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

function playScore(p5,score) {
  p5.select('#text').html('');
  const playPart = new P5.Part(16);
  playPart.loop();
  playPart.setBPM(10);

  Object.keys(score).forEach(instrument => {
    score[instrument].notes.forEach(note => {
      playPart.addPhrase(getPhrase(instrument,note,[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]));
    });
  });
  Object.keys(score).forEach(instrument => {
    score[instrument].notes.forEach(note => {
      setTimeout(
        () => {
          // remove the parts in the reverse order they were added
          playPart.removePhrase(instrument + note.pitch + note.octave + note.amplitude);
        },
        (score.duration - note.delay) * 1000
      );
    });
  });

  playPart.start();
}

function getPhrase(instrument,note,pattern) {
  return new P5.Phrase(
    instrument + note.pitch + note.octave + note.amplitude,
    (time,rate) => {
      playNoteAndOvertones(note,time + note.delay,rate);
    },
    pattern
  );
}

exports.getNoteFromDistance = getNoteFromDistance;
exports.preloadNote = preloadNote;
exports.preloadScore = preloadScore;
exports.setupNote = setupNote;
exports.playScore = playScore;
exports.playNoteAndOvertones = playNoteAndOvertones;
exports.getOvertone = audioUtils.getOvertone;
exports.getScoreDuration = getScoreDuration;
exports.getMinDelay = getMinDelay;
