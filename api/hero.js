const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  try {
    const p1 = fs.readFileSync(path.join(process.cwd(), 'assets', 'hero-1.b64'), 'utf8');
    const p2 = fs.readFileSync(path.join(process.cwd(), 'assets', 'hero-2.b64'), 'utf8');
    const clean = (s) => s.replace(/\s+/g, '').replace(/^data:image\/webp;base64,/, '');
    const image = Buffer.from(clean(p1) + clean(p2), 'base64');
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.statusCode = 200;
    res.end(image);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('No se pudo generar la imagen hero');
  }
};
