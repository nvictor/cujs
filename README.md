# Critical User Journeys (CUJ) Lab

An interactive Progressive Web App (PWA) that teaches Critical User Journeys (CUJs) using concepts from the Google SRE Workbook chapter [Implementing SLOs](https://sre.google/workbook/implementing-slos/).

The app includes:
- CUJ concept cards rooted in workbook guidance
- A critical-activity identification exercise based on the online shopping example
- A CUJ-to-SLI mapping exercise
- A priority grading interaction to practice importance classification
- Offline support via service worker and a web app manifest

## Local development

```bash
npm run dev
```

Serves the project at [http://localhost:4183](http://localhost:4183).

## Build

```bash
npm run build
```

Outputs static assets to `dist/`.

## Preview build

```bash
npm run preview
```

Serves `dist/` at [http://localhost:4184](http://localhost:4184).
