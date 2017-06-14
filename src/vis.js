const sheets = require('./sheets.js');
const utils = require('./utils.js');

const getDim = p5 => Math.min(p5.windowWidth / 2,p5.windowHeight);

const drawFrames = p5 => p5.fill(255).stroke(0)
  .rect(0,0,getDim(p5)*2-1,getDim(p5)-1)
  .line(getDim(p5),0,getDim(p5),getDim(p5));

const draw = p5 => {
  const normalize = v => p5.map(v,0,100,0,getDim(p5));

  drawFrames(p5);
  p5.fill(0);

  // let isFirstPoint = true;
  sheets.pointSheet.forEach(p => {
    // isFirstPoint = false;

    //draw the point
    p5.ellipse(normalize(p.x),normalize(p.y),p.size*4);

    //randomize the line sheets array
    utils.shuffle(sheets.lineSheets);

    //we work with a number of sheets equal to the size of the point
    sheets.lineSheets.slice(0,p.size).forEach(sheet => {
      //for each of the sheet's lines:
      sheet.forEach(l => {
        //draw the line
        p5.line(normalize(l[0].x),normalize(l[0].y),normalize(l[1].x),normalize(l[1].y));
        //and drop a perpindicular
        // geom.
      })
    })
  })

  // sheets.lineSheet0.forEach(l => p5.line(normalize(l[0].x),normalize(l[0].y),normalize(l[1].x),normalize(l[1].y)));
  // sheets.lineSheet1.forEach(l => p5.line(normalize(l[0].x),normalize(l[0].y),normalize(l[1].x),normalize(l[1].y)));
  // sheets.lineSheet2.forEach(l => p5.line(normalize(l[0].x),normalize(l[0].y),normalize(l[1].x),normalize(l[1].y)));
  // sheets.lineSheet3.forEach(l => p5.line(normalize(l[0].x),normalize(l[0].y),normalize(l[1].x),normalize(l[1].y)));
  // sheets.lineSheet4.forEach(l => p5.line(normalize(l[0].x),normalize(l[0].y),normalize(l[1].x),normalize(l[1].y)));
}

exports.getDim = getDim;
exports.draw = draw;
