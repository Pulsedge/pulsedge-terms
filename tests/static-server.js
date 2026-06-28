// Servidor estático mínimo (sem dependências) que imita o roteamento de cleanUrls do vercel.json,
// para os testes navegarem pelas mesmas rotas usadas em produção (/home, /termos, /privacidade, /assinar).
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

const routes = {
    '/': 'home.html',
    '/home': 'home.html',
    '/termos': 'termos.html',
    '/privacidade': 'privacidade.html',
    '/assinar': 'assinar.html',
};

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.png': 'image/png',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    const relative = routes[pathname] || pathname.replace(/^\//, '');
    const filePath = path.join(root, relative);

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not found');
            return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

const port = process.env.PORT || 4173;
server.listen(port, () => {
    console.log(`Static server running on http://localhost:${port}`);
});
