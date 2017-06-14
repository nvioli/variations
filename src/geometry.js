let getPoint = (xval,yval,size) => ({x: xval, y: yval, size: size});

let getLine = (p1,p2) => {
  if (p1.x === p2.x) {
    return {slope: undefined, ymin: undefined, xmin: p1.x};
  }
  let slope = (p1.y - p2.y) / (p1.x - p2.x);
  let ymin = (p1.y + p2.y - slope * (p1.x + p2.x)) / 2;
  //all points and lines are normed to [0,100], so max and min refer to those bounds
  return {
    slope: slope,
    ymin: ymin,
    xmin: -ymin / slope,
    ymax: (100 - ymin) / slope,
    xmax: 100 * slope + ymin
  };
};

let distanceFrom = (p,l) => {
  if (l.slope === undefined){
    return Math.abs(p.x - l.xmin);
  }
  return Math.abs(p.y - l.slope * p.x - l.ymin) / Math.sqrt(Math.pow(l.slope,2) + 1);
}

exports.getPoint = getPoint;
exports.getLine = getLine;
exports.distanceFrom = distanceFrom;
