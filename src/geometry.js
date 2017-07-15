function getPoint(x,y,size) {
  return {x, y, size};
}

function getLine(p1,p2) {
  if (p1.x === p2.x) {
    return {slope: undefined, ymin: undefined, xmin: p1.x};
  }
  const slope = (p1.y - p2.y) / (p1.x - p2.x);
  const ymin = (p1.y + p2.y - slope * (p1.x + p2.x)) / 2;
  return {
    slope, ymin, xmin: -ymin / slope};
}

function distanceFrom(p,l) {
  if (l.slope === undefined) {
    return Math.abs(p.x - l.xmin);
  }
  return Math.abs(p.y - l.slope * p.x - l.ymin) / Math.sqrt(Math.pow(l.slope,2) + 1);
}

function perpindicularIntersectionPoint(p,l) {
  const xval = (p.y + p.x * 1 / l.slope - l.ymin) / (l.slope + 1 / l.slope);
  const yval = l.slope * xval + l.ymin;
  return getPoint(xval,yval);
}

function rotate(sheet,angle) {
  sheet.forEach(lineEnds => {
    lineEnds.forEach(point => {
      rotatePoint(point,angle);
    });
  });
}

function reflect(sheet){
  sheet.forEach(lineEnds => {
    lineEnds.forEach(point => {
      reflectPoint(point);
    });
  });
}

function rotatePoint(p,angle) {
  // https://stackoverflow.com/a/2259502
  const s = Math.sin(angle);
  const c = Math.cos(angle);

  // translate point back to origin:
  p.x -= 50;
  p.y -= 50;

  // rotate point
  const xnew = p.x * c - p.y * s;
  const ynew = p.x * s + p.y * c;

  // translate point back:
  p.x = xnew + 50;
  p.y = ynew + 50;
}

function reflectPoint(p) {
  p.x = 100 - p.x;
}

exports.getPoint = getPoint;
exports.getLine = getLine;
exports.distanceFrom = distanceFrom;
exports.perpindicularIntersectionPoint = perpindicularIntersectionPoint;
exports.rotate = rotate;
exports.reflect = reflect;
