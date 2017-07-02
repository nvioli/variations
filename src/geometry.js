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

function getMidwayPoint(p1,p2,pct) {
  return getPoint(p1.x * pct + p2.x * (1 - pct),p1.y * pct + p2.y * (1 - pct));
}

exports.getPoint = getPoint;
exports.getLine = getLine;
exports.distanceFrom = distanceFrom;
exports.perpindicularIntersectionPoint = perpindicularIntersectionPoint;
exports.getMidwayPoint = getMidwayPoint;
