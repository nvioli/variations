const P5 = require('p5');
const vis = require('./vis.js');

function sketch(p5) {
  p5.setup = () => {
    p5.createCanvas(vis.getDim(p5) * 2,vis.getDim(p5));
    p5.noLoop();
  };

  p5.windowResized = () => {
    p5.resizeCanvas(vis.getDim(p5) * 2,vis.getDim(p5));
  }

  p5.draw = () => vis.draw(p5);

  //used in the init phase
  p5.mouseClicked = () => p5.redraw();
};

new P5(sketch);
