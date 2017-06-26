let assert = require('assert');
let geom = require('../src/geometry.js');
let sampler = require('../src/sampler.js');

describe('sampler', () => {
  const library = require('../src/library.js');
  describe('#getSampleRange', () => {
    it('should return an array containing the lowest and highest sampled notes', () => {
      const celliSampleRange = sampler.getSampleRange("Celli");
      assert.equal(celliSampleRange[0].note,"C")
      assert.equal(celliSampleRange[0].octave,2)
      assert.equal(celliSampleRange[1].note,"C")
      assert.equal(celliSampleRange[1].octave,5)
    });
  });

  describe('#valueToNote', () => {
    it('should return the note for a given numeric value', () => {
      assert.equal(sampler.valueToNote(0).note,"C");
      assert.equal(sampler.valueToNote(0).octave,"1");
      assert.equal(sampler.valueToNote(12).note,"C");
      assert.equal(sampler.valueToNote(12).octave,"2");
      assert.equal(sampler.valueToNote(19).note,"G");
      assert.equal(sampler.valueToNote(19).octave,"2");
    });
  })
})

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
