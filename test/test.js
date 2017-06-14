let assert = require('assert');
let geom = require('../src/geometry.js');

console.log(new Date());

describe('geometry', () => {
  let p1 = geom.getPoint(2,3);
  let p2 = geom.getPoint(4,4);
  let p3 = geom.getPoint(2,4);

  let l1 = geom.getLine(p1,p2);
  let l2 = geom.getLine(p1,p3);
  let l3 = geom.getLine(p2,p3);

  describe('#getPoint()', () => {
    it('should return a point when given x and y coordinates', () => {
      assert.equal(2,p1.x);
      assert.equal(3,p1.y);
    });
  });

  describe('#getLine()', () => {
    it('should return a line when given two points', () => {
      assert.equal(0.5,l1.slope);
      assert.equal(2,l1.ymin);
      assert.equal(undefined,l2.slope);
      assert.equal(undefined,l2.ymin);
      assert.equal(0,l3.slope);
      assert.equal(4,l3.ymin);
      //TODO check xmax and ymax
    });
  });

  describe('#getDistanceFrom()', () => {
    it('should return the distance between a point and a line', () => {
      assert.equal(2 / Math.sqrt(5),geom.distanceFrom(p3,l1));
      assert.equal(2,geom.distanceFrom(p2,l2));
      assert.equal(1,geom.distanceFrom(p1,l3));
    });
  });
});
