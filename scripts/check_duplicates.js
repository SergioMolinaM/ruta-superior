const fs = require('fs');
const data = JSON.parse(fs.readFileSync('constants/carreras.json', 'utf8'));
const ids = new Set();
const duplicates = [];
data.forEach(c => {
    if (ids.has(c.id)) {
        duplicates.push(c.id);
    }
    ids.add(c.id);
});
console.log('Total records:', data.length);
console.log('Duplicate IDs found:', duplicates.length);
if (duplicates.length > 0) {
    console.log('First 10 duplicates:', duplicates.slice(0, 10));
}
const periodismo = data.filter(c => c.nombre.includes('PERIODISMO'));
console.log('Periodismo records:', periodismo.length);
if (periodismo.length > 0) {
    console.log('Sample Periodismo:', JSON.stringify(periodismo[0], null, 2));
}
