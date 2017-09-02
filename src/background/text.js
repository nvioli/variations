const colors = require('./colors.js');
const audio = require('./audio.js');

const intro = [
  // 0
  `
    <p>In 1958, John Cage wrote the piece <em>Variations I</em>, an early
    example of aleatoric (or "chance") music.</p>
    <p>In this style of composition, the composer sets up a
    system of rules which determine the parameters of the piece. The rules are
    implemented using a random process.</p>
    <p>Therefore, the parts the musicians play are determined by chance,
    not chosen beforehand by the composer.</p>
  `,
  // 1
  `
    <p>In <em>Variations I</em>, musicians are instructed to overlay a
    transparency containing dots with one or more transparencies containing
    lines.</p>
    <p>By measuring the distances from the dots to the lines, the musicians
    determine the pitch, volume, duration, first occurrence, and overtone
    structure they are to play.</p>
    <p>I wrote this program to create unique performances of Cage's piece.</p>
  `,
  // 2
  `
    <p>This program will randomly choose an ensemble, and use Cage's
    rules to determine what notes it will play.</p>
    <p>Because of the labor involved in calculating the piece's parameters,
    Cage could only have imagined that a small fraction of the
    possible performances would ever be played.</p>
    <p>Using this program, a new performance is generated
    each time it is loaded, with you as the only audience who will ever hear it!</p>
  `,
  // 3
  `
    <p>Here's how the program will calculate the piece's parameters:</p>
    <p>Each dot will be assigned an instrument. Some dots
    (the bigger ones) play more than one note.</p>
    <p>For each note the instrument will play, the program selects one of the four
    transparencies. Each line corresponds to a parameter of the note. The program
    measures the distance from the dot to the line to calculate the parameter.</p>
  `,
  // 4
  `
    <p>In the example at the right there are two notes. Each note has five parameters
    (volume, pitch, length, overtone structure, first occurrence).
      <ul>
        <li style="font-weight:600">One note is
          <span style="color:${colors.amplitude}">louder</span>,
          <span style="color:${colors.lowestFreq}">lower</span>,
          <span style="color:${colors.duration}">longer</span>, has
          <span style="color:${colors.overtone}">no overtones</span>, and starts
          <span style="color:${colors.occurence}">very early</span>.
        </li>
        <li style="font-weight:200">The other note is
          <span style="color:${colors.amplitude}">softer</span>,
          <span style="color:${colors.lowestFreq}">higher</span>,
          <span style="color:${colors.duration}">shorter</span> has
          <span style="color:${colors.overtone}">one overtone</span>, and starts
          <span style="color:${colors.occurence}">later</span>.
        </li>
      </ul>
    </p>
    <p>Got it? (It's ok if you don't.) Click one more time to create a unique piece.</p>
  `
];

const clickToContinue = `<p class="small secondary">Click anywhere to continue</p>`;

function getIntroText(introStep) {
  const introIndex = introStep + intro.length;
  return `
    <div style="text-align:center"><strong>
      Introduction ${introIndex + 1} of ${intro.length}
    </strong></div>
    ${intro[introIndex]}
    ${introIndex < intro.length - 1 ? clickToContinue : ""}`;
}

function getNoteIntroText(note) {
  return `<li style='font-weight:${Math.max(0.1,note.amplitude.toFixed(1)) * 1000}'>
    <span style="color:${colors.lowestFreq}">${note.pitch}${note.octave}</span>
    ${(note.overtones.length ?
      `and <span style='color:${colors.overtone}'>${note.overtones.length}
      overtone${(note.overtones.length > 1 ? "s" : "")}</span>` : ""
    )}
    at <span style="color:${colors.amplitude}">${(note.amplitude * 100).toFixed(0)}%</span>
    for <span style="color:${colors.duration}">${note.duration.toFixed(1)}s</span>
    starting at <span style="color:${colors.occurence}">${note.delay.toFixed(1)}s</span>.
  </li>`;
}

function getActiveNoteText(instrument,note) {
  return `<span style='font-weight:${Math.max(0.1,note.amplitude.toFixed(1)) * 1000}'>
      <span style='color:hsl(${colors.getNoteHueValue(note)},100%,50%)'>
        ${instrument}${instrument.includes("Chorus") ? " singing " : " playing "}
        ${note.pitch}${note.octave} ${overtoneText(note)}
        at ${(note.amplitude * 100).toFixed(0)}%.
      </span>
    </span><br/>`;
}

function overtoneText(note) {
  if (note.overtones.length) {
    let ret = [];
    note.overtones.forEach(overtone => {
      ret.push(`<span style="color:hsl(${colors.getNoteHueValue(overtone)},100%,50%)">
          ${overtone.pitch}${overtone.octave}
        </span>`);
    });
    return `(and ${ret.join(', ')})`;
  }
  return '';
}

function readyToPlay(score) {
  return `<div style="text-align:center"><strong>Ready to play!</strong></div>
    <p>Now that everything is set up, you're ready to hear your piece!</p>
    <p>Your piece is ${getLength(score)} long.</p>
    <p>Each note will be colored according to its pitch (lower notes closer to
    the red end of the spectrum, and higher notes closer to violet).</p>
    <p class="secondary">Click one more time to hear the creation built just for you!</p>`;
}

function getLength(score) {
  const minutes = Math.floor(audio.getScoreDuration(score) / 60);
  const seconds = Math.floor(audio.getScoreDuration(score) - minutes * 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function finished() {
  return `
    <div style="text-align:center"><strong>Thanks for listening</strong></div>
    <p>Read more about <a href="http://johncage.org/">John Cage</a> or
    <a href="https://en.wikipedia.org/wiki/Aleatoric_music">Aleatoric music</a>.</p>
    <p>This project was built using <a href="https://p5js.org/">p5.js</a>, and
    was inspired by
    <a href="https://teropa.info/blog/2016/07/28/javascript-systems-music.html">Javascript
    Systems Music</a> by <a href="https://teropa.info/">Tero Parviainen</a>.</p>
    <p>The code is available on <a href="https://github.com/nvioli/variations">github</a>.</p>
    <p>To create another piece,
    <a href="javascript:void(0)" onclick="location.reload();">refresh the page</a>.
    Note the links below to skip the introductory material.</p>
  `;
}

exports.intro = intro;
exports.getIntroText = getIntroText;
exports.getNoteIntroText = getNoteIntroText;
exports.getActiveNoteText = getActiveNoteText;
exports.readyToPlay = readyToPlay;
exports.clickToContinue = clickToContinue;
exports.finished = finished;
