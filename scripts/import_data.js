const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const csvCarrerasPath = 'c:\\Users\\molin\\OneDrive\\Documentos\\Escritorio\\Bases de datos INGRESO\\maestro_final_app.csv';
const csvEmpPath = 'c:\\Users\\molin\\OneDrive\\Documentos\\Escritorio\\Bases de datos INGRESO\\Archivos v8\\Buscador_Empleabilidad_ingresos_2025_2026_SIES carreras.csv';
const csvArancelesUnivPath = 'c:\\Users\\molin\\OneDrive\\Documentos\\Escritorio\\Bases de datos INGRESO\\anexo_1_aranceles_de_referencia_2026_becas Universidades.csv';
const csvArancelesCFTPath = 'c:\\Users\\molin\\OneDrive\\Documentos\\Escritorio\\Bases de datos INGRESO\\anexo_1_aranceles_de_referencia_2026_becas CFT.csv';
const csvInstPath = 'c:\\Users\\molin\\OneDrive\\Documentos\\Escritorio\\Bases de datos INGRESO\\maestro_instituciones.csv';

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

function parseIngreso(texto) {
    if (!texto || texto === 's/i') return null;
    const t = texto.toLowerCase().trim();
    const extraerMonto = (str) => {
        const millonMatch = str.match(/(\d+)\s*millon(?:es)?(?:\s+(\d+)\s*mil)?/);
        const soloMilMatch = str.match(/(\d+)\s*mil/);
        if (millonMatch) {
            const base = parseInt(millonMatch[1]) * 1000000;
            const extra = millonMatch[2] ? parseInt(millonMatch[2]) * 1000 : 0;
            return base + extra;
        } else if (soloMilMatch) {
            return parseInt(soloMilMatch[1]) * 1000;
        }
        return null;
    };
    const partes = t.split(/\ba\b/);
    if (partes.length === 2) {
        const v1 = extraerMonto(partes[0]);
        const v2 = extraerMonto(partes[1]);
        if (v1 && v2) return (v1 + v2) / 2;
        if (v1) return v1;
    }
    return extraerMonto(t);
}

function readCSV(filePath, delimiter = ';', encoding = 'utf-8') {
    if (!fs.existsSync(filePath)) return [];
    const buffer = fs.readFileSync(filePath);
    let content = iconv.decode(buffer, encoding);
    if (content.startsWith('\ufeff')) content = content.slice(1);
    const lines = content.split(/\r?\n/);
    if (lines.length === 0) return [];

    // Support for CSV with quotes
    const parseLine = (line) => {
        const results = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') inQuotes = !inQuotes;
            else if (line[i] === delimiter && !inQuotes) {
                results.push(current.trim());
                current = '';
            } else current += line[i];
        }
        results.push(current.trim());
        return results;
    };

    const headers = parseLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = parseLine(line);
        const row = {};
        headers.forEach((h, idx) => {
            row[h] = (cols[idx] || '').trim();
        });
        data.push(row);
    }
    return data;
}

try {
    console.log('Loading datasets for ULTIMATE enrichment...');

    const empData = readCSV(csvEmpPath, ';', 'utf-8');
    const empMap = new Map();
    empData.forEach(row => { if (row['Código']) empMap.set(row['Código'], row); });

    const arancelesUniv = readCSV(csvArancelesUnivPath, ';', 'utf-8');
    const arancelesCFT = readCSV(csvArancelesCFTPath, ';', 'utf-8');
    const arancelMap = new Map();
    [...arancelesUniv, ...arancelesCFT].forEach(row => {
        if (row['CODIGO UNICO']) arancelMap.set(row['CODIGO UNICO'], row);
    });

    const instData = readCSV(csvInstPath, ',', 'latin1');
    const instMap = new Map();
    instData.forEach(row => { if (row['id_institucion']) instMap.set(String(row['id_institucion']), row); });

    const careerRows = readCSV(csvCarrerasPath, ';', 'utf-8');
    const results = [];

    careerRows.forEach(row => {
        const id = row['CODIGO UNICO'];
        if (!id) return;

        const codInst = String(row['Código institución'] || '').split('.')[0];
        const instExtra = instMap.get(codInst) || {};

        const empInfo = empMap.get(id) || {};
        const arancelInfo = arancelMap.get(id) || {};

        const arancelReal = parseFloat(row['Arancel Anual 2026']) || parseFloat(arancelInfo[' ARANCEL ANUAL 2026']) || 0;
        const arancelRef = parseFloat(arancelInfo[' Arancel de Referencia 2026 Final Becas (incremento = 0)']) || 0;
        const brecha = Math.max(0, arancelReal - arancelRef);

        const ingreso4 = empInfo['Ingreso Promedio al 4° año'] || row['Ingreso Promedio al 4° año'];
        const ingresoMensual = parseIngreso(ingreso4) || parseFloat(row['ingreso_mensual_estimado']) || null;

        let roiAlerta = 'SIN_DATOS_MERCADO';
        if (ingresoMensual && arancelReal > 0) {
            const ingresoAnual = ingresoMensual * 12;
            if (arancelReal > (ingresoAnual * 0.20)) {
                roiAlerta = 'RIESGO_RETORNO_NEGATIVO';
            } else {
                roiAlerta = 'ESTABLE';
            }
        }

        const acredRaw = instExtra['nivel_acreditacion'] || row['Acreditación institución (al 31 de octubre 2025)'] || '';
        let acredNum = 0;
        if (acredRaw.includes('Excelencia') || acredRaw.includes('7') || acredRaw.includes('6')) acredNum = 7;
        else if (acredRaw.includes('Avanzado') || acredRaw.includes('5') || acredRaw.includes('4')) acredNum = 5;
        else if (acredRaw.includes('Básico') || acredRaw.includes('3')) acredNum = 3;

        results.push({
            id: id,
            nombre: row['Nombre carrera'],
            nombre_search: normalizeStr(row['Nombre carrera']),
            area: classifyArea(row['Nombre carrera']),
            institucion: instExtra['nombre_institucion'] || row['Nombre institución'],
            inst_search: normalizeStr(instExtra['nombre_institucion'] || row['Nombre institución']),
            tipo: row['Tipo de institución'].includes('IP') ? 'IP' : (row['Tipo de institución'].includes('CFT') ? 'CFT' : 'Universidad'),
            region: 'Metropolitana',
            vacantes: 0,
            corte2024: 0,
            corte2023: 0,
            coeficientes: { nem: 0.2, ranking: 0.2, lc: 0.2, m1: 0.2, m2: 0, ciencias: 0.1, historia: 0.1 },
            duracion: (row['Duración Formal (semestres)'] || '0') + ' semestres',
            grado: 'Título Profesional',
            arancel: arancelReal,
            arancelReferencia: arancelRef,
            arancel_ref_becas: arancelRef,
            brecha_becas: brecha,
            acreditacion: acredNum,
            gratuidad: instExtra['gratuidad_sn'] === 'Sí' || true,
            sede: row['NOMBRE DE LA SEDE'],
            sede_search: normalizeStr(row['NOMBRE DE LA SEDE']),
            jornada: row['JORNADA'],
            alerta_fne: row['alerta_fne'] || roiAlerta,
            empleabilidad_1: empInfo['Empleabilidad 1er año'] || 's/i',
            empleabilidad_2: empInfo['Empleabilidad 2° año'] || 's/i',
            ingreso_4: ingreso4 || 's/i',
            retencion_1: empInfo['Retención 1er\xA0año'] || 's/i',
            roi_alerta: roiAlerta,
            ingreso_mensual_num: ingresoMensual
        });
    });

    console.log(`Saving ${results.length} enriched records with Institutional & ROI analysis...`);
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log('Done!');
} catch (err) {
    console.error('Error:', err);
}
