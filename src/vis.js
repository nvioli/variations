const P5 = require('p5');
const colors = require('./colors.js');
const audio = require('./audio.js');

require('../node_modules/p5/lib/addons/p5.sound.js');
require('../node_modules/p5/lib/addons/p5.dom.js');

let introStep = 0;
let p5;
let score;

function init(theScore) {
  score = theScore;
  new P5(sketch);
}

function sketch(thep5) {
  p5 = thep5;

  p5.preload = () => {
    audio.preloadScore(p5,score);
  };

  p5.setup = () => {
    p5.createCanvas(getDim(),getDim());
    p5.noLoop();
    p5.colorMode("hsb");
    resizeTextDiv();
  };

  p5.windowResized = () => {
    p5.resizeCanvas(getDim(),getDim());
    resizeTextDiv();
  };

  p5.draw = draw;

  // used in the init phase
  p5.mouseClicked = () => {
    if (introStep >= 0) {
      introStep++;
      p5.redraw();
    }
  };
}

function getDim() {
  return Math.min(p5.windowWidth / 2,p5.windowHeight);
}

function resizeTextDiv() {
  p5.select('#text').size(getDim(),getDim())
    .style('font-size',getDim() / 20)
    .style('padding',getDim() / 20);
}

function draw() {
  p5.background(colors.background);

  if (introStep === -1) {
    drawActiveNotes();
  } else if (introStep < Object.keys(score).length) {
    intro();
  } else if (introStep === Object.keys(score).length) {
    introStep = -1;
    audio.playScore(p5,score,drawActiveNotes);
    p5.loop();
  }
}

function intro() {
  const insturment = Object.keys(score)[introStep];

  let textStr = `${insturment} to play:`;

  let noteNum = 0;
  score[insturment].notes.forEach(note => {
    audio.playNote(note,noteNum++);
    textStr +=
      `<br/>  * <span style="color:${colors.lowestFreq}">${note.pitch}${note.octave}</span>
      at <span style="color:${colors.amplitude}">${(note.amplitude * 100).toFixed(0)}%</span>
      for <span style="color:${colors.duration}">${note.duration}s</span>
      starting at <span style="color:${colors.occurence}">${note.delay.toFixed(2)}s</span>.`;
          // + ' and ' + noteInfo.overtone.distance
        //   ' for ' + noteInfo.duration.distance
    drawNote(insturment,note,true);
  });

  drawInsturment(insturment);

  // add text describing the notes we built
  p5.select('#text').html(textStr);
}

function normalize(v) {
  return p5.map(v,0,100,0,getDim());
}

function drawLine(p1,p2) {
  p5.line(normalize(p1.x),normalize(p1.y),normalize(p2.x),normalize(p2.y));
}

function drawInsturment(insturment) {
  const point = score[insturment].point;
  // draw the point
  p5.stroke(colors.foreground).fill(colors.foreground).strokeWeight(point.size * 4);
  p5.ellipse(normalize(point.x),normalize(point.y),point.size * 4);
}

function drawNote(insturment,note,isIntro) {
  const point = score[insturment].point;
  Object.keys(note.lines).forEach(noteAttribute => {
    if (isIntro) {
      // draw the line
      p5.stroke(colors.foreground).strokeWeight(1);
      drawLine(note.lines[noteAttribute].end1,note.lines[noteAttribute].end2);
      p5.stroke(colors[noteAttribute]);
      p5.strokeWeight(note.amplitude * 20);
    } else {
      p5.stroke(audio.getNoteHueValue(p5,note),100,100,note.amplitude);
      p5.strokeWeight(note.curAmplitude.getLevel() * 100);
      if (note.curAmplitude === undefined) {
        console.log(note);
      }
    }
    // and drop a perpindicular from the point
    drawLine(point,note.lines[noteAttribute].intersection);
  });
}

function drawActiveNotes() {
  let text = "";
  Object.keys(score).forEach(insturment => {
    score[insturment].notes.forEach(note => {
      if (note.isActive) {
        text +=
          `<span style='color:hsl(${audio.getNoteHueValue(p5,note)},100%,50%)'>
            ${insturment}${insturment.includes("Chorus") ? " singing " : " playing "}
            ${note.pitch}${note.octave}
            for ${note.duration}s
            at ${(note.amplitude * 100).toFixed(0)}%.
          </span><br/>`;
        drawNote(insturment,note,false);
      }
    });
  });
  p5.select('#text').html(text);
}

exports.init = init;
