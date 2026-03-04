const express = require('express');
const path = require('path');
const app = express();

const port = process.env.PORT || 3000;

// Servir archivos estáticos generados por expo export web
app.use(express.static(path.join(__dirname, 'dist')));

// Redirigir todas las rutas al index.html de React (para soportar navegación SPA)
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Aplicación Node.js sirviendo Expo Web en el puerto ${port}...`);
});
