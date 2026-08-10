const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  try {
    const clean = (s) => s.replace(/\s+/g, '').replace(/^data:image\/webp;base64,/, '');
    const readPart = (name) => {
      const source = fs.readFileSync(path.join(process.cwd(), 'assets', name), 'utf8');
      return Buffer.from(clean(source), 'base64');
    };

    // The hero WebP is stored as two independently base64-encoded binary
    // fragments. Decode each fragment first, then concatenate the bytes.
    // Concatenating the base64 strings before decoding corrupts the WebP at
    // the fragment boundary and produces an incomplete image.
    const image = Buffer.concat([
      readPart('hero-1.b64'),
      readPart('hero-2.b64')
    ]);

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Content-Length', image.length);
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.statusCode = 200;
    res.end(image);
  } catch (error) {
    console.error('Error generando la imagen hero:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('No se pudo generar la imagen hero');
  }
};
