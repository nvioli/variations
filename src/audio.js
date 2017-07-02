const P5 = require('p5');
const audioUtils = require('./audioUtils.js');

require('../node_modules/p5/lib/addons/p5.sound.js');

function getNoteFromDistance(insturment,dist) {
  const [lowestNote,highestNote] = audioUtils.getSampleRange(insturment);
  const insturmentRange = audioUtils.getNoteDistance(highestNote,lowestNote);
  /* Most pairs of points won't have distance over 100, so while that's not the
     actual maximum distance possible, it should provide us with more-or-less
     well-distributed notes (I think). Worst case scenario is we end up with a
     note higher than the top sample, but we can always pitch bend to
     approximate it.
  */
  const proportion = insturmentRange * dist / 100;
  const returnVal = Math.floor(audioUtils.noteToValue(lowestNote) + proportion);
  return audioUtils.valueToNote(returnVal);
}

function preloadNote(p5,insturment,note,cb) {
  const nearestSample = audioUtils.getNearestSample(insturment,note);
  note.pitchAdjust = audioUtils.getPlaybackRate(audioUtils.getNoteDistance(note,nearestSample));
  if (cb) {
    note.sample = p5.loadSound(nearestSample.file, cb);
  } else {
    note.sample = p5.loadSound(nearestSample.file);
  }
}

function preloadScore(p5,score) {
  Object.keys(score).forEach(insturment => {
    score[insturment].notes.forEach(note => preloadNote(p5,insturment,note));
  });
}

function playNote(note,delay) {
  note.duration = Math.min(note.duration,note.sample.duration()).toFixed(2);
  note.sample.play(delay,note.pitchAdjust,note.amplitude,0,note.duration);
}

function playScore(p5,score) {
  p5.select('#text').html('');
  const playPart = new P5.Part(16);
  playPart.loop();
  playPart.setBPM(10);
  let maxDelay = 0;

  Object.keys(score).forEach(insturment => {
    score[insturment].notes.forEach(note => {
      if (note.delay > maxDelay) {
        maxDelay = note.delay;
      }

      const amp = new P5.Amplitude();
      amp.setInput(note.sample);
      note.curAmplitude = amp;

      const pattern = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      playPart.addPhrase(getPhrase(insturment,note,pattern));
    });
  });
  Object.keys(score).forEach(insturment => {
    score[insturment].notes.forEach(note => {
      setTimeout(
        () => {
          // remove the parts in the reverse order they were added
          playPart.removePhrase(insturment + note.pitch + note.octave + note.amplitude);
        },
        (maxDelay * 2 - note.delay) * 1000
      );
    });
  });

  playPart.start();
}

function getPhrase(insturment,note,pattern) {
  return new P5.Phrase(
    insturment + note.pitch + note.octave + note.amplitude,
    (time,rate) => {
      setTimeout(
        () => {
          note.isActive = true;
          // visFn();
          note.sample.onended(() => {
            note.isActive = false;
            // visFn();
          });
        },
        note.delay * 1000
      );

      note.sample.play(time + note.delay,rate * note.pitchAdjust,note.amplitude,0,note.duration);
    },
    pattern
  );
}

function getNoteHueValue(p5,note) {
  // utility for converting a note to a color (hue) value.
  // using the below code, I determined that the lowest sampled note has a value of 10,
  // and the highest sampled note has a value of 96.
  // So we just map our note's value's place in that range to the range [0,360]
  // for input into HSV functions.
  // However, using a linear mapping (return p5.map(audioUtils.noteToValue(note),10,96,0,360);)
  // produces a very green-centric palate.
  // Instead we use a sigmoid to stretch the ends where there are fewer notes

  // let lowestSample = 1000;
  // let highestSample = 0;
  // Object.keys(LIBRARY.samples).forEach(insturment => {
  //   [l,h] = getSampleRange(insturment);
  //   if (noteToValue(l) < lowestSample){lowestSample = noteToValue(l)}
  //   if (noteToValue(h) > highestSample){highestSample = noteToValue(h)}
  // })
  // console.log(lowestSample)
  // console.log(highestSample)
  // return p5.map(audioUtils.noteToValue(note),10,96,0,360);
  return 360 / (1 + Math.pow(Math.E,(43 - audioUtils.noteToValue(note)) / 10));
}

exports.getNoteFromDistance = getNoteFromDistance;
exports.preloadNote = preloadNote;
exports.preloadScore = preloadScore;
exports.playScore = playScore;
exports.playNote = playNote;
exports.getNoteHueValue = getNoteHueValue;
