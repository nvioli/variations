const P5 = require('p5');
const colors = require('./colors.js');
const audio = require('./audio.js');
const text = require('./text.js');

require('../../node_modules/p5/lib/addons/p5.sound.js');
require('../../node_modules/p5/lib/addons/p5.dom.js');

let p5;
let score;

function init(theScore) {
  score = theScore;
  new P5(sketch,'container');
}

let isPlaying = false;
function sketch(thep5) {
  p5 = thep5;

  p5.setup = () => {
    resize();

    p5.createCanvas();
    p5.colorMode("hsb");

    audio.preloadScore(p5,score);

    // lazy way to fix sizing problems due to FOIT from font loading:
    setTimeout(resize,500);
  };

  p5.windowResized = resize;

  p5.draw = draw;

  p5.mouseClicked = () => {
    if (isPlaying) {
      audio.stopScore();
    } else {
      startScore();
    }
    isPlaying = !isPlaying;
  };
}

function getDim() {
  return Math.max(p5.windowWidth,p5.windowHeight);
}

function resize() {
  // p5.select('#text').size(getDim(),getDim())
  //   .style('font-size',getDim() / 22)
  //   .style('padding',getDim() / 20);
  p5.resizeCanvas(getDim(),getDim());
}

let done = false;
let started = false;
function draw() {
  p5.background(colors.background);
  if (done) {
    window.location.reload(false);
  } else if (started) {
    drawLiveScore();
  } else {
    // p5.select('#text').html("loading");
  }
}

function startScore() {
  started = true;
  audio.playScore(p5,score);
  setTimeout(
    () => {
      done = true;
      p5.noLoop();
    },
    audio.getScoreDuration(score) * 1000
  );
}

function normalize(v) {
  return p5.map(v,0,100,0,getDim());
}

function drawLine(p1,p2) {
  p5.line(normalize(p1.x),normalize(p1.y),normalize(p2.x),normalize(p2.y));
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
  // p5.select('#text').html(activeNoteText);
}

function addTimeline() {
  p5.stroke(colors.timeLineColor).strokeWeight(4);
  drawLine({x: 0, y: 99.5},{x: audio.getPercentDone(score),y: 99.5});
}

exports.init = init;
exports.startScore = startScore;
