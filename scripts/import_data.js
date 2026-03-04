const fs = require('fs');
const path = require('path');

const csvPath = 'c:\\Users\\molin\\OneDrive\\Documentos\\Escritorio\\Bases de datos INGRESO\\maestro_final_app.csv';
const outputPath = path.join(__dirname, '..', 'constants', 'carreras.json');

function normalizeStr(str) {
    return String(str || '')
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function classifyArea(name) {
    const n = name.toUpperCase();
    if (n.includes('MEDICINA') || n.includes('ENFERMERIA') || n.includes('PSICOLOGIA') || n.includes('KINESIOLOGIA') || n.includes('ODONTOLOGIA') || n.includes('SALUD')) return 'Salud';
    if (n.includes('INGENIERIA') || n.includes('INFORMATICA') || n.includes('COMPUTACION') || n.includes('TECNOLOGIA') || n.includes('DIGITAL')) return 'Tecnología';
    if (n.includes('ADMINISTRACION') || n.includes('COMERCIAL') || n.includes('NEGOCIOS') || n.includes('CONTABILIDAD') || n.includes('FINANZAS')) return 'Negocios';
    if (n.includes('DERECHO') || n.includes('LEYES')) return 'Derecho';
    if (n.includes('PEDAGOGIA') || n.includes('EDUCACION') || n.includes('PARVULARIO')) return 'Educación';
    if (n.includes('SOCIAL') || n.includes('SOCIOLOGIA') || n.includes('PERIODISMO') || n.includes('COMUNICACION')) return 'Ciencias Sociales';
    return 'General';
}

try {
    console.log('Reading CSV...');
    const data = fs.readFileSync(csvPath, 'utf8');
    const lines = data.split('\n');
    const headers = lines[0].split(';');

    const hMap = {};
    headers.forEach((h, i) => hMap[h.trim()] = i);

    console.log('Parsing lines...');
    const results = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(';');

        const get = (key) => (cols[hMap[key]] || '').trim();
        const id = get('CODIGO UNICO');
        if (!id) continue; // Saltear filas sin ID

        const nombre = get('Nombre carrera');
        const inst = get('Nombre institución');
        const sede = get('NOMBRE DE LA SEDE');
        const tipoRaw = get('Tipo de institución');
        let tipo = 'Universidad';
        if (tipoRaw.includes('IP') || tipoRaw.includes('Profesional')) tipo = 'IP';
        else if (tipoRaw.includes('CFT') || tipoRaw.includes('Técnico')) tipo = 'CFT';

        const acredRaw = get('Acreditación institución (al 31 de octubre 2025)');
        let acred = 0;
        if (acredRaw.includes('Excelencia')) acred = 7;
        else if (acredRaw.includes('Avanzado')) acred = 5;
        else if (acredRaw.includes('Básico')) acred = 3;

        results.push({
            id: get('CODIGO UNICO'),
            nombre: nombre,
            nombre_search: normalizeStr(nombre),
            area: classifyArea(nombre),
            institucion: inst,
            inst_search: normalizeStr(inst),
            tipo: tipo,
            region: 'Metropolitana', // Default
            vacantes: 0,
            corte2024: 0,
            corte2023: 0,
            coeficientes: {
                nem: 0.2,
                ranking: 0.2,
                lc: 0.2,
                m1: 0.2,
                m2: 0,
                ciencias: 0.1,
                historia: 0.1
            },
            duracion: get('Duración Formal (semestres)') + ' semestres',
            grado: 'Título Profesional',
            arancel: parseFloat(get('Arancel Anual 2026')) || 0,
            arancelReferencia: parseFloat(get('Arancel de Referencia 2026 Final Becas (incremento = 0)')) || 0,
            acreditacion: acred,
            gratuidad: true,
            sede: sede,
            sede_search: normalizeStr(sede),
            jornada: get('JORNADA'),
            alerta_fne: get('alerta_fne')
        });
    }

    console.log(`Writing ${results.length} records to ${outputPath}...`);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log('Done!');

} catch (err) {
    console.error('Error:', err);
}
