import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Health check endpoint for Cloud Run
app.get('/_health', (req, res) => res.status(200).send('OK'));
app.get('/health', (req, res) => res.status(200).send('OK'));

// Serve static assets from dist if built, otherwise fallback to root/public
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// SPA Fallback
app.get('*', (req, res) => {
  if (fs.existsSync(path.join(distPath, 'index.html'))) {
    res.sendFile(path.join(distPath, 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, 'index.html'));
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio server actively running on http://0.0.0.0:${PORT}`);
});
