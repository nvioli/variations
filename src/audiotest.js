const P5 = require('p5');
const audio = require('./audio.js');
const audioUtils = require('./audioUtils.js');
const library = require('./library.js');

require('../node_modules/p5/lib/addons/p5.sound.js');

function sketch(p5) {
  p5.setup = () => {
    p5.noLoop();

    Object.keys(library.samples).forEach(instrument => {
      const opt = document.createElement('option');
      opt.value = instrument;
      opt.innerHTML = instrument;
      document.getElementById('instruments').appendChild(opt);
    });

    document.getElementById('playScale').addEventListener(
      'click',
      () => preloadAndPlayScale(p5),
      false
    );

    document.getElementById('playOvertone').addEventListener(
      'click',
      () => preloadAndPlayOvertone(p5),
      false
    );
  };
}

function preloadAndPlayScale(p5) {
  let notesLoaded = 0;
  const scale = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  const instrument = document.getElementById('instruments').value;
  const octave = document.getElementById('octave').value;

  const scaleWithNoteDetails = [];
  scale.forEach(pitch => {
    const note = {};
    note.pitch = pitch;
    note.octave = octave;
    note.duration = 1;
    note.amplitude = 50;

    scaleWithNoteDetails.push(note);
    audio.preloadNote(p5,instrument,note,() => {
      if (++notesLoaded === scale.length) {
        playScale(scaleWithNoteDetails);
      }
    });
  });
}

function playScale(scaleWithNoteDetails) {
  let noteNum = 0;
  scaleWithNoteDetails.forEach(note => {
    setTimeout(() => {
      document.getElementById('scaleInfo').innerHTML = note.pitch + note.octave;
    },noteNum * 1000);
    audio.playNote(note,noteNum++);
  });
}

function preloadAndPlayOvertone(p5) {
  const instrument = document.getElementById('instruments').value;
  const pitch = document.getElementById('pitch').value;
  const octave = document.getElementById('octave').value;
  const overtoneNumber = document.getElementById('overtone').value;

  const note = {pitch, octave, duration: 1, amplitude: 1};
  const overtone = audioUtils.getOvertone(note,overtoneNumber);
  document.getElementById('overtoneInfo').innerHTML =
    `${overtoneNumber}${nth(overtoneNumber)} overtone of ${note.pitch}${note.octave}
    is ${overtone.pitch}${overtone.octave}`;

  audio.preloadNote(p5,instrument,note,() => audio.playNote(note));
  // audio.preloadNote(p5,instrument,overtone,() => audio.playNote(overtone,1));
}

function nth(d) {
  // https://stackoverflow.com/a/15397495/1712343
  if (d > 3 && d < 21) {
    return 'th';
  }
  switch (d % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

new P5(sketch);
