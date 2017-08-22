const P5 = require('p5');
const audio = require('./audio.js');
const audioUtils = require('./audioUtils.js');
const library = require('./library.js');

require('../../node_modules/p5/lib/addons/p5.sound.js');

function sketch(p5) {
  p5.setup = () => {
    p5.noLoop();

    // set up instrument selection
    Object.keys(library.samples).forEach(instrument => {
      const opt = document.createElement('option');
      opt.value = instrument;
      opt.innerHTML = instrument;
      document.getElementById('instruments').appendChild(opt);
    });

    // set up event handlers
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

  p5.draw = () => {
    console.log("nothing to draw");
  }
}

new P5(sketch);

function preloadAndPlayScale(p5) {
  let notesLoaded = 0;
  const scale = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

  const instrument = document.getElementById('instruments').value;
  const octave = document.getElementById('octave').value;

  const scaleWithNoteDetails = [];
  scale.forEach(pitch => {
    const note = {pitch, octave, duration: 1, amplitude: 50};

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
    setTimeout(() => printInfo(note),noteNum * 1000);
    audio.playNote(note,noteNum++);
  });
}

function printInfo(note) {
  const fileParts = note.sample.file.split('.')[0].split('-');
  const closestNote = fileParts[fileParts.length - 1].replace('%23','#');

  document.getElementById('scaleInfo').innerHTML = `
    ${note.pitch}${note.octave} is ${closestNote}
    at ${note.pitchAdjust.toFixed(2)} speed
  `;
}

function preloadAndPlayOvertone(p5) {
  const instrument = document.getElementById('instruments').value;
  const pitch = document.getElementById('pitch').value;
  const octave = document.getElementById('octave').value;
  const overtoneNumber = document.getElementById('overtone').value;

  const note = {pitch, octave, duration: 1, amplitude: 50};
  const overtone = audioUtils.getOvertone(note,overtoneNumber);
  overtone.duration = 1;
  overtone.amplitude = 50;

  document.getElementById('overtoneInfo').innerHTML =
    `overtone ${overtoneNumber} of ${note.pitch}${note.octave}
    is ${overtone.pitch}${overtone.octave}`;

  audio.preloadNote(p5,instrument,note,() => audio.playNote(note,0));
  audio.preloadNote(p5,instrument,overtone,() => audio.playNote(overtone,1));
}
