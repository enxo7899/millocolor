const potrace = require('potrace');
const fs = require('fs');
const dir = process.argv[2];
const out = process.argv[3];
const opts = { threshold: 128, turdSize: 40, optCurve: true, optTolerance: 0.2, alphaMax: 1.0 };
const trace = (f) => new Promise((res, rej) => {
  const p = new potrace.Potrace(opts);
  p.loadImage(dir + '/' + f, (err) => err ? rej(err) : res(p.getPathTag('#000').match(/ d="([^"]+)"/)[1]));
});
(async () => {
  const blue = await trace('blue.png');
  const red = await trace('red.png');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2710 360"><path id="millo" fill="#2f50bd" d="${blue}"/><path id="color" fill="#c9404b" d="${red}"/></svg>`;
  fs.writeFileSync(out, svg);
  console.log('bytes', svg.length, 'blue segs', (blue.match(/[CL]/g) || []).length, 'red segs', (red.match(/[CL]/g) || []).length);
})();
