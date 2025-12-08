# Plataforma DELE (BlablaELE / La Wikiclase)

Arquitectura inicial para una plataforma de preparación DELE (A1–C2) con rutas personalizadas, cursos completos, simulacros y tutor virtual IA.

## Objetivos
- Autoestudio guiado para adultos y universitarios, con apoyo de sesiones online semanales y tutor IA.
- Variedad peninsular del español como referencia.
- Experiencia bilingüe (español base, inglés opcional) y diseño minimalista.

## Stack propuesto
- **Frontend:** Next.js + TypeScript (UI responsive, i18n preparada).
- **Backend/API:** API Routes Next.js o servicios en Railway/Vercel; PostgreSQL administrado.
- **Autenticación:** email/password, Magic Link, OAuth (Google/Apple) y RRSS (via Auth provider tipo Auth.js/Supabase/Auth0).
- **Pagos:** Stripe (suscripción + pago por curso, con acceso freemium a una unidad por nivel).
- **Infra inicial:** Vercel (frontend + API) o Railway (API/DB). Backup y logs centralizados.

## Directorios
- `docs/` documentación funcional y técnica.
- `documentos/` materiales de examen y guías oficiales (mantener con marca de agua BlablaELE / La Wikiclase para descargas).

## Desarrollo rápido
1. Configurar entorno Node.js 20+ y pnpm/npm.
2. Inicializar Next.js con TypeScript en `/app` (pendiente):
   ```bash
   npx create-next-app@latest app --ts
   ```
3. Instalar dependencias clave (Auth, Prisma, Stripe, i18n, UI): ver `docs/architecture.md`.
4. Configurar variables de entorno: DB_URL, AUTH_SECRET, STRIPE_KEYS, NEXTAUTH_URL, etc.
5. Ejecutar en dev:
   ```bash
   cd app
   pnpm dev
   ```
6. Ejecutar migraciones/seed (cuando se añada Prisma):
   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed
   ```

## Próximos pasos
- Crear app Next.js con modelos y rutas descritos en `docs/architecture.md`.
- Cargar estructura de cursos y vínculos a tareas según `docs/course-structure.md`.
- Implementar motor de rutas de aprendizaje (`docs/learning-path-engine.md`).

## Testing
- Estrategia de pruebas descrita en `docs/testing.md`.
- Se añadió un comando provisional `npm test` que indica que aún no hay suites automáticas; una vez se inicialice la app Next.js, reemplázalo por las pruebas reales (`pnpm lint`, `pnpm test`, `pnpm type-check`).

## Copiar el proyecto a otra carpeta local
- Desde la máquina donde ya existe el repo (por ejemplo en `/workspace/DELE`), copia todo a otra ruta con:
  ```bash
  cp -R /workspace/DELE ~/DELE
  ```
- Si necesitas clonar desde GitHub, usa `git clone https://github.com/elcorreveidile/DELE.git` en la carpeta destino (no uses `cp` sobre la URL; `cp` solo funciona con rutas locales).

## Licencias y uso de materiales
- PDFs oficiales y recursos del autor solo para estudiantes registrados.
- Descarga permitida con marca de agua "BlablaELE / La Wikiclase".
- No redistribuir externamente.
