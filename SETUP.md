# Guía de Configuración del Entorno - DELE C2

Esta guía te ayudará a configurar el proyecto en tu entorno local.

## ✅ Pasos Completados

- [x] Estructura del proyecto creada
- [x] Dependencias definidas en package.json
- [x] Esquema Prisma completo
- [x] Scripts de seed
- [x] Configuración de Next.js, TypeScript y Tailwind

## 🚀 Configuración en Tu Máquina Local

### 1. Clonar el Repositorio (si aún no lo has hecho)

```bash
git clone https://github.com/elcorreveidile/DELE.git
cd DELE
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar PostgreSQL

Tienes varias opciones:

#### Opción A: PostgreSQL Local

```bash
# En macOS con Homebrew
brew install postgresql@14
brew services start postgresql@14

# En Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Crear base de datos
createdb dele_c2

# O usar psql
psql postgres
CREATE DATABASE dele_c2;
\q
```

#### Opción B: PostgreSQL en Docker

```bash
# Crear y ejecutar contenedor de PostgreSQL
docker run --name dele-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=dele_c2 \
  -p 5432:5432 \
  -d postgres:14

# Verificar que está corriendo
docker ps
```

#### Opción C: Servicio Cloud (Recomendado para desarrollo rápido)

**Supabase (Gratis):**
1. Ir a [supabase.com](https://supabase.com)
2. Crear cuenta y nuevo proyecto
3. Copiar la "Connection string" (modo directo)
4. Usar esa URL en tu `.env`

**Neon (Gratis):**
1. Ir a [neon.tech](https://neon.tech)
2. Crear cuenta y nuevo proyecto
3. Copiar la connection string
4. Usar en tu `.env`

### 4. Configurar Variables de Entorno

Edita el archivo `.env` que ya existe:

```bash
# .env

# Database - IMPORTANTE: Actualiza con tus credenciales reales
DATABASE_URL="postgresql://usuario:password@localhost:5432/dele_c2?schema=public"

# NextAuth - Ya configurado
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dele-c2-secret-key-change-in-production"

# Anthropic API - NECESARIO para el Tutor IA
# Obtén tu API key en: https://console.anthropic.com/
ANTHROPIC_API_KEY="sk-ant-api03-..."

# Stripe - Opcional por ahora (para pagos)
# Obtén tus keys en: https://dashboard.stripe.com/test/apikeys
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Storage S3 - Opcional por ahora (para audios/gráficos)
S3_BUCKET_NAME=""
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID=""
S3_SECRET_ACCESS_KEY=""
S3_ENDPOINT=""

NODE_ENV="development"
```

### 5. Generar Cliente de Prisma

**NOTA**: Si tienes problemas descargando los binarios de Prisma (403 Forbidden), usa el método alternativo con SQL directo (ver más abajo).

```bash
npm run db:generate
```

Este comando genera el cliente TypeScript de Prisma basado en tu schema.

### 6. Crear Tablas en la Base de Datos

#### Método Principal (con Prisma)

```bash
npm run db:push
```

#### Método Alternativo (SQL directo - si Prisma falla)

Si tienes restricciones de red que impiden descargar los binarios de Prisma, usa el script SQL manual:

```bash
PGPASSWORD=dele_password psql -U dele_user -h localhost -d dele_c2 -f prisma/manual_migration.sql
```

Este script:
- Crea todos los tipos ENUM (17 enums)
- Crea todas las tablas (21 tablas)
- Añade índices y restricciones
- Es equivalente a `prisma db push`

### 7. Poblar con Datos Iniciales

#### Método Principal (con Prisma)

```bash
npm run db:seed
```

#### Método Alternativo (SQL directo - si Prisma falla)

```bash
PGPASSWORD=dele_password psql -U dele_user -h localhost -d dele_c2 -f prisma/seed.sql
```

Ambos métodos crearán:
- 1 nivel (C2)
- 1 curso ("Preparación DELE C2")
- 9 módulos completos
- 2 planes de pago (Mensual 29€, Anual 279€)

### 8. Ejecutar el Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔍 Verificación

### Verificar que Prisma funciona:

```bash
# Abrir Prisma Studio (interfaz visual de la BD)
npx prisma studio
```

Esto abre una interfaz web en `http://localhost:5555` donde puedes ver todos los datos.

### Verificar que la base de datos tiene los datos:

```bash
# Conectar a PostgreSQL
psql dele_c2

# Ver tablas
\dt

# Ver nivel C2
SELECT * FROM "Level";

# Ver módulos
SELECT order, title FROM "Module" ORDER BY order;

# Salir
\q
```

## 🐛 Solución de Problemas

### Error: "Connection refused" al conectar a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
# En macOS:
brew services list

# En Linux:
sudo systemctl status postgresql

# Si está detenido, iniciarlo:
brew services start postgresql@14
# o
sudo systemctl start postgresql
```

### Error: "Database does not exist"

```bash
# Crear la base de datos manualmente
createdb dele_c2

# O con psql:
psql postgres
CREATE DATABASE dele_c2;
\q
```

### Error: "Authentication failed"

Verifica que las credenciales en `DATABASE_URL` coincidan con tu configuración de PostgreSQL.

Por defecto, PostgreSQL crea un usuario `postgres`. Puedes crear uno nuevo:

```bash
psql postgres
CREATE USER tuusuario WITH PASSWORD 'tupassword';
ALTER USER tuusuario CREATEDB;
\q
```

### Error con binarios de Prisma

Si tienes problemas descargando binarios de Prisma (403 Forbidden o errores de red):

```bash
# Opción 1: Usar scripts SQL directos (recomendado)
PGPASSWORD=dele_password psql -U dele_user -h localhost -d dele_c2 -f prisma/manual_migration.sql
PGPASSWORD=dele_password psql -U dele_user -h localhost -d dele_c2 -f prisma/seed.sql

# Opción 2: Intentar con variables de entorno
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npm run db:generate

# Opción 3: Limpiar caché y reinstalar
npm uninstall prisma @prisma/client
npm install -D prisma
npm install @prisma/client
npm run db:generate
```

**Nota**: Los scripts SQL en `prisma/manual_migration.sql` y `prisma/seed.sql` son equivalentes completos a los comandos de Prisma y funcionan sin necesidad de descargar binarios.

## 📝 Scripts Útiles

```bash
# Desarrollo
npm run dev                  # Servidor de desarrollo

# Base de datos
npm run db:generate          # Generar cliente Prisma
npm run db:push              # Sincronizar schema (desarrollo)
npm run db:migrate           # Crear migración (producción)
npm run db:seed              # Poblar datos iniciales
npx prisma studio            # Interfaz visual de BD

# Producción
npm run build                # Build optimizado
npm run start                # Servidor de producción

# Utilidades
npm run lint                 # Revisar código con ESLint
npm test                     # Ejecutar tests
```

## 🔑 APIs Necesarias

### Anthropic (Tutor IA) - PRIORITARIO

El tutor IA es una funcionalidad central. Necesitas una API key:

1. Ir a [console.anthropic.com](https://console.anthropic.com/)
2. Crear cuenta (gratis con créditos iniciales)
3. Generar API key
4. Agregar a `.env`: `ANTHROPIC_API_KEY="sk-ant-api03-..."`

**Costo estimado**: ~1€ por estudiante completo (~100 análisis)

### Stripe (Pagos) - OPCIONAL AL INICIO

Solo necesario cuando implementes pagos:

1. Ir a [dashboard.stripe.com](https://dashboard.stripe.com/)
2. Crear cuenta
3. Activar modo test
4. Copiar las keys de test a `.env`

### S3 Storage (Audios/Gráficos) - OPCIONAL AL INICIO

Para desarrollo, puedes usar el sistema de archivos local. Cuando quieras almacenamiento en la nube:

**Opciones:**
- AWS S3
- Supabase Storage (incluido en plan gratuito)
- Cloudflare R2
- Backblaze B2

## 📊 Próximos Pasos Después de la Configuración

Una vez que tengas todo funcionando:

1. **Implementar API del Tutor IA**
   - Crear `/app/api/tutor/feedback/route.ts`
   - Ver guía completa en `docs/c2-tutor-ia.md`

2. **Crear componentes de UI**
   - TaskSubmission (envío de tareas)
   - FeedbackDisplay (mostrar feedback)
   - Ver ejemplos en `docs/c2-tutor-ia.md`

3. **Configurar autenticación**
   - NextAuth.js con email/password
   - OAuth (Google, etc.)

4. **Generar contenido inicial**
   - Scripts en `docs/c2-content-generator.md`
   - Primeros 20-30 textos para práctica

## 🆘 ¿Necesitas Ayuda?

Si encuentras problemas:

1. Revisa los logs: `npm run dev` mostrará errores detallados
2. Verifica Prisma Studio: `npx prisma studio`
3. Revisa la documentación en `/docs`
4. Crea un issue en GitHub

## ✅ Checklist de Configuración Completa

- [ ] Node.js 20+ instalado
- [ ] PostgreSQL instalado y corriendo
- [ ] Base de datos `dele_c2` creada
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` configurado
- [ ] Cliente Prisma generado (`npm run db:generate`)
- [ ] Tablas creadas (`npm run db:push`)
- [ ] Datos iniciales cargados (`npm run db:seed`)
- [ ] Servidor corriendo (`npm run dev`)
- [ ] API key de Anthropic configurada (para tutor IA)
- [ ] Prisma Studio funciona (`npx prisma studio`)

¡Una vez completado todo esto, estarás listo para desarrollar! 🚀
