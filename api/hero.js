const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  try {
    const clean = (s) => s.replace(/\s+/g, '').replace(/^data:image\/webp;base64,/, '');
    const raw = clean(fs.readFileSync(path.join(process.cwd(), 'assets', 'hero-final.webp.b64'), 'utf8'));
    const image = Buffer.from(raw, 'base64');
    if (image.length < 16 || image.toString('ascii', 0, 4) !== 'RIFF' || image.toString('ascii', 8, 12) !== 'WEBP') {
      throw new Error(`Hero WebP inválido (${image.length} bytes)`);
    }
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Length', image.length);
    res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
    res.statusCode = 200;
    res.end(image);
  } catch (error) {
    console.error('Error generando la imagen hero:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('No se pudo generar la imagen hero');
  }
};
