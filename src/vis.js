const sheets = require('./sheets.js');
const utils = require('./utils.js');
const geom = require('./geometry.js');
const notes = require('./notes.js');
const colors = require('./colors.js');
const library = require('./library.js');

function getDim(p5) {return Math.min(p5.windowWidth / 2,p5.windowHeight)};

let p5;
function draw(pfive) {
  p5 = pfive;
  //draw the two black boxes
  p5.fill(255);
  p5.stroke(0);
  p5.rect(0,0,getDim(p5)*2-1,getDim(p5)-1);
  p5.line(getDim(p5),0,getDim(p5),getDim(p5));
  p5.fill(0);

  if (!(Object.keys(insturmentInfo).length === sheets.pointSheet.length)) {
    init();
  } else {
    play();
  }
}

function drawLine(p1,p2){
  p5.line(normalize(p1.x),normalize(p1.y),normalize(p2.x),normalize(p2.y));
}
function normalize(v){return p5.map(v,0,100,0,getDim(p5));}

const insturmentInfo = {};

function play() {
  p5.ellipse(100,100,200,200)

  Object.keys(insturmentInfo).forEach(insturment => {
    
  })
}

function init() {
  const insturment = Object.keys(sheets.pointSheet)[Object.keys(insturmentInfo).length];
  const point = sheets.pointSheet[insturment];
  //draw the point
  p5.ellipse(normalize(point.x),normalize(point.y),point.size*4);

  //randomize the line sheets array
  //TODO rotate and flip the sheets
  utils.shuffle(sheets.lineSheets);

  const notesForThisInsturment = [];

  //we work with a number of sheets equal to the size of the point
  sheets.lineSheets.slice(0,point.size).forEach(sheet => {
    const lineInfo = getLineInfo(point,sheet);

    Object.keys(lineInfo).forEach(key => {
      //draw the line
      p5.stroke(0).strokeWeight(1);
      drawLine(lineInfo[key].end1,lineInfo[key].end2);
      //and drop a perpindicular from the point
      p5.stroke(colors[key]).strokeWeight(2);
      drawLine(point,lineInfo[key].intersection);
    });

    const noteInfo = notes.getNoteInfo(insturment,lineInfo);

    //finally, add the note to our running list of notes
    notesForThisInsturment.push(noteInfo);
  });

  insturmentInfo[insturment] = notesForThisInsturment;

  //add text describing the note we built
  p5.strokeWeight(1).text(textStr,getDim(p5) * 1.1,getDim(p5) * 0.1,getDim(p5) * 0.8,getDim(p5) * 0.8)

  insturmentInfo.push(notesForThisPoint);
}

function getLineInfo(point,sheet) {
  //randomize the order of lines in the sheet
  utils.shuffle(sheet);

  return {
    lowestFreq: getLineDetails(sheet[0]),
    overtone: getLineDetails(sheet[1]),
    amplitude: getLineDetails(sheet[2]),
    duration: getLineDetails(sheet[3]),
    occurence: getLineDetails(sheet[4])
  }

  function getLineDetails(lineEnds){
    const line = geom.getLine(lineEnds[0],lineEnds[1]);

    return {
      end1: lineEnds[0],
      end2: lineEnds[1],
      distance: geom.distanceFrom(point,line),
      intersection: geom.perpindicularIntersectionPoint(point,line)
    }
  }
}

exports.getDim = getDim;
exports.draw = draw;
