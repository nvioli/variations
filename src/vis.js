const P5 = require('p5');
const colors = require('./colors.js');
const audio = require('./audio.js');
const text = require('./text.js');

require('../node_modules/p5/lib/addons/p5.sound.js');
require('../node_modules/p5/lib/addons/p5.dom.js');

let introStep = -1 * text.intro.length;
let p5;
let score;

const introImgPaths = [
  "score.jpg",
  "transparency.jpg",
  "cage.jpg",
  "transparency.jpg",
  "example.png",
  "example.png"
];

const preloadedImgs = [];

function init(theScore) {
  score = theScore;
  new P5(sketch,'container');
}

function sketch(thep5) {
  p5 = thep5;

  p5.preload = preloadImgs;

  p5.setup = () => {
    resize();

    p5.createCanvas();
    p5.noLoop();
    p5.colorMode("hsb");

    audio.preloadScore(p5,score);

    // lazy way to fix sizing problems due to FOIT from font loading:
    setTimeout(resize,500);
  };

  p5.windowResized = resize;

  p5.draw = draw;

  // used in the intro phase
  p5.mouseClicked = () => {
    introStep++;
    p5.redraw();
  };
}

function preloadImgs() {
  introImgPaths.forEach((path,idx) => {
    p5.loadImage(path,preloadedImg => {
      preloadedImgs[idx] = preloadedImg;
    });
  });
}

function getDim() {
  const maxHeight = p5.windowHeight - p5.select('header').height - p5.select('footer').height;
  return Math.min(p5.select('#container').width / 2,maxHeight);
}

function resize() {
  p5.select('#text').size(getDim(),getDim())
    .style('font-size',getDim() / 22)
    .style('padding',getDim() / 20);
  p5.resizeCanvas(getDim(),getDim());
}

function setupEventHandlers() {
  const skipTextElt = p5.select('#skipText').elt;
  skipTextElt.innerHTML = "Skip intro text";
  skipTextElt.addEventListener(
    'click',
    () => {
      // we really want zero, but the mouseClicked handler also fires and increments.
      introStep = Math.max(introStep,-1);
    },
    false
  );

  const skipNotesElt = p5.select('#skipNotes').elt;
  skipNotesElt.innerHTML = "Skip note calculations";
  skipNotesElt.addEventListener(
    'click',
    () => {
      introStep = Math.max(introStep,Object.keys(score).length - 1);
    },
    false
  );
}
let done = false;
function draw() {
  p5.background(colors.background);
  if (done) {
    showFinishedState();
  } else if (introStep > Object.keys(score).length + 1) {
    drawLiveScore();
  } else if (introStep < 0) {
    textIntro();
  } else if (introStep < Object.keys(score).length) {
    noteIntro();
  } else if (introStep === Object.keys(score).length) {
    readyToPlay();
  } else {
    introStep++;
    p5.loop();
    startScore();
  }
}

function startScore() {
  audio.playScore(p5,score);
  setTimeout(
    () => {
      done = true;
      p5.noLoop();
    },
    audio.getScoreDuration(score) * 1000
  );
}

function textIntro() {
  const introIndex = introStep + preloadedImgs.length;
  p5.image(preloadedImgs[introIndex],0,0,getDim(),getDim());

  p5.select('#text').html(text.getIntroText(introStep));
}

function normalize(v) {
  return p5.map(v,0,100,0,getDim());
}

function drawLine(p1,p2) {
  p5.line(normalize(p1.x),normalize(p1.y),normalize(p2.x),normalize(p2.y));
}

function drawLines(note) {
  Object.keys(note.lines).forEach(noteAttribute => {
    p5.stroke(colors.foreground).strokeWeight(1);
    drawLine(note.lines[noteAttribute].end1,note.lines[noteAttribute].end2);
  });
}

function drawNote(instrument,note,attrColors,liveUpdate) {
  Object.keys(note.lines).forEach(noteAttribute => {
    if (attrColors) {
      p5.stroke(colors[noteAttribute]);
    } else {
      p5.stroke(colors.getNoteHueValue(note),100,100,note.amplitude);
    }
    if (liveUpdate) {
      p5.strokeWeight(note.curAmplitude.getLevel() * 100);
    } else {
      p5.strokeWeight(note.amplitude * 20);
    }
    // and drop a perpindicular from the point
    drawLine(score[instrument].point,note.lines[noteAttribute].intersection);
  });
}

function noteIntro() {
  p5.stroke(colors.foreground).fill(colors.foreground);
  // draw the point sheet
  Object.keys(score).forEach(instrument => {
    const point = score[instrument].point;
    p5.strokeWeight(point.size * 4);
    p5.ellipse(normalize(point.x),normalize(point.y),point.size * 4);
  });

  const instrument = Object.keys(score)[introStep];

  let textStr = `<div style="text-align:center">${instrument} (instrument ${introStep + 1}
    of ${Object.keys(score).length}) to ${instrument.includes("Chorus") ? "sing" : "play"}:
    </div><ul>
  `;

  let delay = 0;
  score[instrument].notes.forEach(note => {
    audio.playNoteAndOvertones(note,delay);
    delay += note.duration;
    textStr += text.getNoteIntroText(note);
    drawNote(instrument,note,true,false);
    drawLines(note);
  });

  textStr += `</ul>${text.clickToContinue}`;

  // add text describing the notes we built
  p5.select('#text').html(textStr);
}

function readyToPlay() {
  p5.select('#text').html(text.readyToPlay(score));
}

function showFinishedState() {
  p5.select('#text').html(text.finished());
  Object.keys(score).forEach(instrument => {
    score[instrument].notes.forEach(note => {
      drawNote(instrument,note,false,false);
    });
  });
}

function drawLiveScore() {
  let activeNoteText = "";
  Object.keys(score).forEach(instrument => {
    const notesNeedingText = new Set();
    score[instrument].notes.forEach(note => {
      if (note.isActive) {
        notesNeedingText.add(note);
        drawNote(instrument,note,false,true);
      }
      note.overtones.forEach(overtone => {
        if (overtone.isActive) {
          notesNeedingText.add(note);
          drawNote(instrument,overtone,false,true);
        }
      });
    });
    notesNeedingText.forEach(note => {
      activeNoteText += text.getActiveNoteText(instrument,note);
    });
  });
  addTimeline();
  p5.select('#text').html(activeNoteText);
}

function addTimeline() {
  p5.stroke(colors.timeLineColor).strokeWeight(4);
  drawLine({x: 0, y: 99.5},{x: audio.getPercentDone(score),y: 99.5});
}

exports.init = init;
exports.setupEventHandlers = setupEventHandlers;
