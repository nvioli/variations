const P5 = require('p5');
const p5Sound = require('../node_modules/p5/lib/addons/p5.sound.js');
const sheets = require('./sheets.js');
const utils = require('./utils.js');
const geom = require('./geometry.js');
const notes = require('./notes.js');
const colors = require('./colors.js');
const sampler = require('./sampler.js');

let introStep = 0;
let p5;
let score;
// let introPart = new P5.Part(4);

function init(theScore){
  score = theScore;
  new P5(sketch);
}

function getDim() {return Math.min(p5.windowWidth / 2,p5.windowHeight)};

function sketch(thep5) {
  p5 = thep5;

  p5.preload = () => {
    // preload the samples and create the Parts
      preloadSamples();
  }

  p5.setup = () => {
    p5.createCanvas(getDim() * 2,getDim());
    p5.noLoop();
  };

  p5.windowResized = () => p5.resizeCanvas(getDim() * 2,getDim());

  p5.draw = draw;

  //used in the init phase
  p5.mouseClicked = () => {
    introStep++;
    p5.redraw();
  }
};

function draw() {
  //draw the two black boxes
  p5.fill(255).stroke(0);
  p5.rect(0,0,getDim()*2-1,getDim()-1);
  p5.line(getDim(),0,getDim(),getDim());
  p5.fill(0);

  // if (Object.keys(score).length !== introStep) {
  //   intro();
  // } else {
    play();
  // }
}

function play() {
  p5.ellipse(100,100,200,200);
  const playPart = new P5.Part(16);
  playPart.loop();
  playPart.onStep(() => {
    console.log('step');
  });
  Object.keys(score).forEach(insturment => {
    score[insturment]['notes'].forEach(note => {
      const pattern = [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      playPart.addPhrase(getPhrase(insturment,note,pattern))
    })
  });
  p5.masterVolume(0.5);
  playPart.start();
}

function intro() {
  const insturment = Object.keys(score)[introStep];
  drawInsturment(insturment);

  let textStr = insturment + " to play: ";
  // const phrases = [];
  let noteNum = 0;
  score[insturment].notes.forEach(note => {
    drawNote(insturment,note);

    textStr += note.text

    note.sample.play(noteNum++,getPlaybackRate(note.sampleDist),note.amplitude / 100,0,2);
  });

  //add text describing the notes we built
  p5.strokeWeight(1).text(textStr,getDim() * 1.1,getDim() * 0.1,getDim() * 0.8,getDim() * 0.8)

}

function drawLine(p1,p2){
  p5.line(normalize(p1.x),normalize(p1.y),normalize(p2.x),normalize(p2.y));
}

function normalize(v){return p5.map(v,0,100,0,getDim());}

function drawInsturment(insturment){
  const point = score[insturment].point;
  //draw the point
  p5.ellipse(normalize(point.x),normalize(point.y),point.size*4);
}

function drawNote(insturment,note){
  const point = score[insturment].point;
  Object.keys(note.lines).forEach(noteAttribute => {
    //draw the line
    p5.stroke(0).strokeWeight(1);
    drawLine(note.lines[noteAttribute].end1,note.lines[noteAttribute].end2);
    //and drop a perpindicular from the point
    p5.stroke(colors[noteAttribute]).strokeWeight(2);
    drawLine(point,note.lines[noteAttribute].intersection);
  });
}

function preloadSamples(){
  Object.keys(score).forEach(insturment => {
    score[insturment].notes.forEach(note => {
      const nearestSample = sampler.getNearestSample(insturment,note.note,note.octave);
      note['sample'] = p5.loadSound(nearestSample.file);
      note['sampleDist'] = sampler.getNoteDistance(note.note,note.octave,nearestSample.note,nearestSample.octave);
    });
  });
}

function getPhrase(insturment,note,pattern){
  return new P5.Phrase(
    insturment + note.note + note.octave,
    (time,playbackRate) => {
      console.log(name);
      note.isActive = true;
      note.sample.onended(() => note.isActive = false);
      drawActiveNotes();
      note.sample.play(time + note.delay,getPlaybackRate(note.sampleDist),note.amplitude);
    },
    pattern
  );
}

function drawActiveNotes(){
  p5.background(255);
  Object.keys(score).forEach(insturment => {
    score[insturment].notes.forEach(note => {
      if (note.isActive) {
        drawInsturment(insturment);
        drawNote(insturment,note);
      }
    })
  })
}

function getPlaybackRate(noteDistance){ return Math.pow(2, noteDistance / 12); }

exports.init = init;
