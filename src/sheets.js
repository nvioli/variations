const geom = require('./geometry.js');

const pointSheet = [
  geom.getPoint(68.8859067754834,29.5557868214931,4),
  geom.getPoint(84.9756257873692,76.4556060689051,4),
  geom.getPoint(95.7769622610506,36.8187544503478,3),
  geom.getPoint(34.1951032480692,91.0226214602618,2),
  geom.getPoint(76.1516130799145,62.6088623541655,2),
  geom.getPoint(17.9547570794764,19.2090704935093,2),
  geom.getPoint(56.6385495974147,16.8127293640795,2),
  geom.getPoint(45.1498055540341,9.73873035000274,1),
  geom.getPoint(85.8876047543408,10.3467163279838,1),
  geom.getPoint(58.9582078107027,32.4834310127622,1),
  geom.getPoint(12.0967300213617,35.4138138796078,1),
  geom.getPoint(30.848441693597,57.6655529385989,1),
  geom.getPoint(40.7377992003067,59.8318453196034,1),
  geom.getPoint(57.3588212740319,84.2909568932464,1),
  geom.getPoint(86.763980938818,45.6838472914499,1)
];

const lineSheets = [
  [
    [geom.getPoint(0,37.2330444106872),geom.getPoint(100.,51.5347153963006)],
    [geom.getPoint(43.0632630410655,0),geom.getPoint(37.7500177108178,100)],
    [geom.getPoint(66.3494462417645,0),geom.getPoint(44.277044418731,100)],
    [geom.getPoint(100.,17.6235367706192),geom.getPoint(36.4063570028574,100)],
    [geom.getPoint(20.6295605355751,100),geom.getPoint(0,55.7233491198284)]
  ],[
    [geom.getPoint(71.4335292212299,0),geom.getPoint(0,56.8762741100831)],
    [geom.getPoint(0,29.1852416048747),geom.getPoint(45.7591041599186,100)],
    [geom.getPoint(0,54.3246936535317),geom.getPoint(100.,86.496113264186)],
    [geom.getPoint(0,63.5654920585139),geom.getPoint(100.,35.0030242612962)],
    [geom.getPoint(97.8483179862107,0),geom.getPoint(65.3926241266022,100)]
  ],[
    [geom.getPoint(0,3.90816919022734),geom.getPoint(64.5165091560416,100)],
    [geom.getPoint(0,39.3608468444325),geom.getPoint(27.4634111852184,0)],
    [geom.getPoint(0,75.8676135602305),geom.getPoint(100,58.9642235026129)],
    [geom.getPoint(62.7489335627254,0),geom.getPoint(37.8402583017134,100)],
    [geom.getPoint(67.9196813650397,0),geom.getPoint(6.77570644104546,100)]
  ],[
    [geom.getPoint(27.9283267702775,0),geom.getPoint(100.,44.0041198685566)],
    [geom.getPoint(55.2088915814246,0),geom.getPoint(93.333644010532,100)],
    [geom.getPoint(0,31.1295306292609),geom.getPoint(30.549665633665,100)],
    [geom.getPoint(0,68.3236058659081),geom.getPoint(100.,55.8928834175291)],
    [geom.getPoint(0,94.4479866594732),geom.getPoint(100.,78.1328167148953)]
  ]
];

exports.pointSheet = pointSheet;
exports.lineSheets = lineSheets;
