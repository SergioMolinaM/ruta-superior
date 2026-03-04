const fs = require('fs');
const iconv = require('iconv-lite');

const file = "c:\\Users\\molin\\OneDrive\\Documentos\\Escritorio\\Bases de datos INGRESO\\maestro_final_app.csv";
const buffer = fs.readFileSync(file);
let content = iconv.decode(buffer, 'latin1');
const lines = content.split('\n');
const header = lines[0].split(';');

console.log('--- MASTER HEADER ---');
header.forEach((h, i) => console.log(`${i}: ${h.trim()}`));
console.log('--- END ---');
