const fs = require('fs');
const path = require('path');

module.exports = function handler(req, res) {
  try {
    const clean = (s) => s.replace(/\s+/g, '').replace(/^data:image\/webp;base64,/, '');

    // The hero image was split as TWO CONTIGUOUS CHUNKS OF THE SAME BASE64
    // STRING. They must be joined first and decoded once. Decoding each chunk
    // separately creates a corrupt WebP at the split boundary.
    const part1 = clean(fs.readFileSync(path.join(process.cwd(), 'assets', 'hero-1.b64'), 'utf8'));
    const part2 = clean(fs.readFileSync(path.join(process.cwd(), 'assets', 'hero-2.b64'), 'utf8'));
    const image = Buffer.from(part1 + part2, 'base64');

    // Basic integrity check: WebP files are RIFF containers with a WEBP tag.
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
