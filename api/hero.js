const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  try {
    const p1 = fs.readFileSync(path.join(process.cwd(), 'assets', 'hero-1.b64'), 'utf8');
    const p2 = fs.readFileSync(path.join(process.cwd(), 'assets', 'hero-2.b64'), 'utf8');
    const clean = (s) => s.replace(/\s+/g, '').replace(/^data:image\/webp;base64,/, '');
    const b64 = clean(p1) + clean(p2);
    const image = Buffer.from(b64, 'base64');

    // The WebP RIFF header declares the total file size as 8 + the
    // 32-bit little-endian value at bytes 4..7. If the split base64
    // chunks leave the final byte out, pad the response to that size.
    let output = image;
    if (image.length >= 12 && image.toString('ascii', 0, 4) === 'RIFF') {
      const declaredLength = image.readUInt32LE(4) + 8;
      if (declaredLength > image.length && declaredLength - image.length <= 16) {
        output = Buffer.concat([image, Buffer.alloc(declaredLength - image.length)]);
      }
    }

    res.setHeader('Content-Type', 'image/webp');
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.statusCode = 200;
    res.end(output);
  } catch (error) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('No se pudo generar la imagen hero');
  }
};
