const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  try {
    // hero-1.b64 is already a complete WebP file (the RIFF header
    // declares a 10,708-byte payload). hero-2.b64 is not a continuation
    // of that binary and must not be concatenated with it.
    const source = fs.readFileSync(path.join(process.cwd(), 'assets', 'hero-1.b64'), 'utf8');
    const clean = (s) => s.replace(/\s+/g, '').replace(/^data:image\/webp;base64,/, '');
    const image = Buffer.from(clean(source), 'base64');

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.statusCode = 200;
    res.end(image);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('No se pudo generar la imagen hero');
  }
};
