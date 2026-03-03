# IngresoALaU v2 — Instrucciones de instalación

## Qué incluye esta versión

- **Onboarding con registro explicado**: pantalla de bienvenida con formulario, explicación de por qué se piden los datos y para qué sirve el diagnóstico.
- **Dashboard personalizado**: diagnóstico de perfil, alerta FUAS, resumen de puntajes, vías de ingreso (PAES, PACE, admisión especial, IP/CFT).
- **Calculadora PAES**: puntaje ponderado por carrera con semáforo, + calculadora de brecha financiera (arancel real vs. de referencia).
- **Explorador de carreras**: 10 carreras representativas con filtros, semáforo de alcanzabilidad, coeficientes y datos de brecha.
- **Becas y beneficios**: 7 beneficios del brief (Gratuidad, Bicentenario, Nuevo Milenio, JGM, FSCU, CAE, BAES) con verificación automática de elegibilidad según RSH y puntajes.
- **Calendario 2026**: eventos categorizados con estado activo/pendiente/pasado, alerta FUAS en curso.
- **47 universidades + IPs y CFTs**: en `constants/data.ts`.

## Cómo instalar

1. Abre tu proyecto `C:\Users\molin\IngresoALaU` en VS Code.
2. Copia las carpetas de esta versión al proyecto:

```
IngresoALaU-v2/
  app/(tabs)/       → reemplaza app/(tabs)/
  components/       → crea esta carpeta en la raíz del proyecto
  constants/        → crea esta carpeta (o reemplaza si ya existe)
  types/            → crea esta carpeta en la raíz del proyecto
```

3. Instala dependencias si no las tienes:
```bash
npx expo install lucide-react-native
```

4. Inicia el servidor:
```bash
npx expo start
```

## Estructura del proyecto

```
app/
  (tabs)/
    _layout.tsx   ← oculta la tab bar de expo-router (la app usa su propio NavBar)
    index.tsx     ← punto de entrada: muestra onboarding o app principal

components/
  NavBar.tsx          ← barra de navegación inferior (5 tabs)
  WelcomeScreen.tsx   ← onboarding + formulario de registro
  Dashboard.tsx       ← home con diagnóstico y acciones rápidas
  PaesCalculator.tsx  ← calculadora puntaje ponderado + brecha financiera
  CarrerasExplorer.tsx ← explorador con filtros y semáforo
  BeneficiosScreen.tsx ← becas con elegibilidad automática
  CalendarioScreen.tsx ← fechas clave 2026

constants/
  data.ts    ← todos los datos (universidades, beneficios, calendario, carreras)
  theme.ts   ← colores, tipografía, espaciado

types/
  index.ts   ← interfaces TypeScript
```

## Datos a actualizar

- **Cortes de carrera**: los puntajes de corte son de proceso 2024. Actualizar cuando salgan los oficiales 2026.
- **Lista de carreras**: actualmente hay 10 carreras de muestra. Ampliar según necesidad.
- **Costos PAES**: verificados para 2026 ($16.650 / $30.475 / $44.300).
- **Montos de becas**: aproximados. Verificar en beneficiosestudiantiles.cl.

## Fuentes

- acceso.mineduc.cl
- demre.cl
- beneficiosestudiantiles.cl
- gratuidad.cl
- chileatiende.gob.cl
- Informe SIES 2024-2025
