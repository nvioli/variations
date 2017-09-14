const P5 = require('p5');
const colors = require('./colors.js');
const audio = require('./audio.js');

require('../../node_modules/p5/lib/addons/p5.sound.js');
require('../../node_modules/p5/lib/addons/p5.dom.js');

let introStep = -1;
let p5;
let score;

function init(theScore) {
  score = theScore;
  new P5(sketch,'container');
}

function sketch(thep5) {
  p5 = thep5;

  p5.setup = () => {
    // resize();

    audio.preloadScore(p5,score);
    p5.createCanvas();
    p5.noLoop();
    p5.colorMode("hsb");


    // lazy way to fix sizing problems due to FOIT from font loading:
    setTimeout(resize,500);
  };

  p5.windowResized = resize;

  p5.draw = noteIntro;

  // used in the intro phase
  p5.mouseClicked = () => {
    introStep++;
    p5.redraw();
  };
}

function getDim() {
  return Math.min(p5.windowWidth / 2,p5.windowHeight);
}

function resize() {
  p5.select('#text').size(getDim(),getDim())
    .style('font-size',getDim() / 22)
    .style('padding',getDim() / 20);
  p5.resizeCanvas(getDim(),getDim());
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

function drawNote(instrument,note) {
  Object.keys(note.lines).forEach(noteAttribute => {
    p5.stroke(colors[noteAttribute]);
    p5.strokeWeight(note.amplitude * 20);
    drawLine(score[instrument].point,note.lines[noteAttribute].intersection);
  });
}

function noteIntro() {
  if (introStep !== -1) {
    p5.background(colors.background);
    p5.stroke(colors.foreground).fill(colors.foreground);
    const instrument = Object.keys(score)[introStep];

    let textStr = `<div style="text-align:center">${instrument} (instrument ${introStep + 1}
      of ${Object.keys(score).length}) to ${instrument.includes("Chorus") ? "sing" : "play"}:
      </div><ul>
    `;

    let delay = 0;
    score[instrument].notes.forEach(note => {
      audio.playNote(note,delay);
      delay += note.duration;
      textStr += getNoteIntroText(note);
      drawNote(instrument,note,true,false);
      drawLines(note);
    });

    textStr += `</ul>`;

    // add text describing the notes we built
    p5.select('#text').html(textStr);

    // draw the point sheet
    Object.keys(score).forEach(inst => {
      const point = score[inst].point;
      p5.strokeWeight(point.size * 4);
      p5.ellipse(normalize(point.x),normalize(point.y),point.size * 4);
    });
  }
}

function getNoteIntroText(note) {
  return `<li style='font-weight:${Math.max(0.1,note.amplitude.toFixed(1)) * 1000}'>
    <span style="color:${colors.lowestFreq}">${note.pitch}${note.octave}</span>
    at <span style="color:${colors.amplitude}">${(note.amplitude * 100).toFixed(0)}%</span>
    for <span style="color:${colors.duration}">${note.duration.toFixed(1)}s</span>
    starting at <span style="color:${colors.occurence}">${note.delay.toFixed(1)}s</span>.
  </li>`;
}

exports.init = init;
