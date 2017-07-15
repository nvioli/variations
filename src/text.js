const colors = require('./colors.js');
const audio = require('./audio.js');

const intro = [
  {
    text: `
    <p>In 1958, John Cage wrote the piece <em>Variations I</em>, an early
    example of aleatoric music.</p>
    <p>In this style of nondeterministic composition, the composer sets up a
    system of rules which determine the parameters of the piece.</p>
    <p>The parts the musicians play are determined by chance, usually at the
    time the piece is performed--not chosen beforehand by the composer.</p>
    `,
    img: "score.jpg"
  },
  {
    text: `
      <p>In <em>Variations I</em>, musicians are instructed to overlay a
      transparency containing dots with one or more transparencies containing
      lines.</p>
      <p>By measuring the distances from the dots to the lines, the musicians
      determine the pitch, volume, duration, first occurrence, and overtone
      structure they are to play.</p>
    `,
    img: "transparency.jpg"
  },
  {
    text: `
      <p>Because of the labor involved in calculating the piece's parameters,
      Cage could only have imagined that a small fraction of the near-limitless
      possible performances encoded in the piece's system would ever be performed.</p>
      <p>But by implementing the system on a computer, this website can (theoretically)
      generate all of them (well, all that include the available instruments).</p>
    `,
    img: "cage.jpg"
  },
  {
    text: `
      <p>After this introduction, a new piece will be generated and then played.</p>
      <p>First, each dot will be assigned an instrument, the distances from
      the dot to the various lines will be measured, and the notes' parameters
      will be calculated from those measurements.</p>
      <p>After all that has been done, the generated piece will play in full.</p>
    `,
    img: "transparency.jpg"
  },
  {
    text: `
      <p>Here's how we'll calculate the piece's parameters:</p>
      <p>Each dot, one at a time, will be assigned an instrument. Some dots
      (the bigger ones) play more than one note.</p>
      <p>For each note the instrument will play, we select a random transparency,
      choose a line to represent each parameter of the note, and measure to
      calculate the parameter.</p>
    `,
    img: "example.png"
  },
  {
    text: `
      <p>In the example at the right there are two notes:
        <ul>
          <li style="font-weight:600">a
            <span style="color:${colors.amplitude}">loud</span>,
            <span style="color:${colors.lowestFreq}">lower</span>,
            <span style="color:${colors.duration}">shorter</span> one with
            <span style="color:${colors.overtone}">one overtone</span>, which starts
            <span style="color:${colors.occurence}">later</span>
          </li>
          <li style="font-weight:100">and a
            <span style="color:${colors.amplitude}">very soft</span>,
            <span style="color:${colors.lowestFreq}">higher</span>,
            <span style="color:${colors.duration}">longer</span> one with
            <span style="color:${colors.overtone}">no overtones</span>, which starts
            <span style="color:${colors.occurence}">earlier</span>
          </li>
        </ul>
      </p>
      <p>Got it? Click one more time to create a unique piece</p>
    `,
    img: "example.png"
  }
];

function getIntroText(introStep) {
  const introIndex = introStep + intro.length;
  return `
    <div style="text-align:center"><strong>
      Introduction ${introIndex + 1} of ${intro.length}
    </strong></div>
    ${intro[introIndex].text}
    <p class="small secondary protected">Click anywhere to continue</p>
  `;
}

function getIntroImage(introStep) {
  const introIndex = introStep + intro.length;
  return intro[introIndex].img;
}

function getNoteIntroText(note) {
  return `<br/>  * <span style='font-weight:${Math.max(0.1,note.amplitude.toFixed(1)) * 1000}'>
    <span style="color:${colors.lowestFreq}">${note.pitch}${note.octave}</span>
    ${(note.overtones.length ?
      `and <span style='color:${colors.overtone}'>${note.overtones.length}
      overtone${(note.overtones.length > 1 ? "s" : "")}</span>` : ""
    )}
    at <span style="color:${colors.amplitude}">${(note.amplitude * 100).toFixed(0)}%</span>
    for <span style="color:${colors.duration}">${note.duration.toFixed(1)}s</span>
    starting at <span style="color:${colors.occurence}">${note.delay.toFixed(1)}s</span>.
  </span>`;
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
    <p>We'll switch the color scheme up a bit: now each note will be colored
    according to its pitch (lower notes closer to the red end of the spectrum,
    and higher notes closer to violet).</p>
    <p>Click one more time to hear your creation!</p>`;
}

function getLength(score) {
  const minutes = Math.floor(audio.getScoreDuration(score) / 60);
  const seconds = Math.floor(audio.getScoreDuration(score) - minutes * 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

exports.intro = intro;
exports.getIntroText = getIntroText;
exports.getIntroImage = getIntroImage;
exports.getNoteIntroText = getNoteIntroText;
exports.getActiveNoteText = getActiveNoteText;
exports.readyToPlay = readyToPlay;
