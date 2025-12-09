# DELE C2 - Plataforma de Preparación

Plataforma de preparación para el examen DELE C2 con tutor IA y contenido original alineado con las especificaciones del Instituto Cervantes.

## 🎯 Características

- **13 tipos de tareas DELE C2** según especificaciones oficiales
- **Sistema de evaluación por bandas** (0-3) con 4 criterios
- **Tutor IA** con feedback formativo inmediato (Claude 3.5 Sonnet)
- **9 módulos estructurados** (160-200 horas de contenido)
- **Gestión de progreso** por destreza y criterio
- **Simulacros** parciales y completos
- **Contenido original** (textos, audios, gráficos)

## 📚 Documentación

La documentación técnica completa está en `/docs`:

- `c2-task-types.md` - Especificaciones de las 13 tareas
- `c2-evaluation-rubrics.md` - Sistema de bandas y criterios
- `c2-course-structure-detailed.md` - Estructura completa del curso
- `c2-database-schema.md` - Esquema de base de datos
- `c2-content-generator.md` - Sistema de generación de contenido
- `c2-tutor-ia.md` - Implementación del tutor IA

## 🚀 Setup

### Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm o pnpm

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/elcorreveidile/DELE.git
cd DELE
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dele_platform"
ANTHROPIC_API_KEY="sk-ant-api03-..."
NEXTAUTH_SECRET="your-secret-key"
# ... resto de variables
```

4. Configurar la base de datos:
```bash
# Generar cliente Prisma
npm run db:generate

# Crear base de datos y tablas
npm run db:push

# Poblar con datos iniciales (nivel C2, curso, módulos)
npm run db:seed
```

5. Ejecutar en desarrollo:
```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## 🗄️ Estructura de Base de Datos

El esquema incluye:

- **User, Profile, Account, Session** - Autenticación (NextAuth)
- **Level, Course, Module, Lesson, Task** - Estructura del curso
- **Attempt, Evaluation** - Intentos y evaluaciones
- **OralRecording** - Grabaciones de tareas orales
- **Progress** - Seguimiento por destreza
- **PaymentPlan, Subscription** - Pagos con Stripe
- **ContentPiece** - Gestión de contenido

### Sistema de Bandas

El sistema de evaluación usa **Bandas 0-3**:

- **Banda 3**: Consecución sobrada (supera C2)
- **Banda 2**: Nivel C2 / APTO ✓
- **Banda 1**: No consecución (por debajo de C2)
- **Banda 0**: Marcadamente inferior

**4 criterios** de evaluación:
1. Cohesión y coherencia
2. Corrección (gramatical y léxica)
3. Alcance (léxico y gramatical)
4. Cumplimiento de tarea / Mediación

**Puntuación mínima**: 20/33.33 por prueba (60%)

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Iniciar servidor de desarrollo

# Base de datos
npm run db:generate      # Generar cliente Prisma
npm run db:push          # Sincronizar esquema con BD (sin migraciones)
npm run db:migrate       # Crear migración
npm run db:seed          # Poblar BD con datos iniciales

# Producción
npm run build            # Build para producción
npm run start            # Iniciar servidor de producción

# Testing
npm test                 # Ejecutar tests (vitest)
npm run lint             # Linter (ESLint)
```

## 🏗️ Arquitectura

### Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js v4
- **Pagos**: Stripe
- **IA**: Anthropic Claude 3.5 Sonnet
- **Storage**: S3-compatible (audios, gráficos)

### Estructura de Directorios

```
/
├── app/                  # Next.js App Router
│   ├── api/             # API endpoints
│   │   └── tutor/       # Tutor IA
│   ├── layout.tsx       # Layout principal
│   └── page.tsx         # Página de inicio
├── components/          # Componentes React
├── lib/                 # Utilidades
│   └── prisma.ts       # Cliente Prisma
├── prisma/             # Base de datos
│   ├── schema.prisma   # Esquema
│   ├── seed.ts         # Datos iniciales
│   └── migrations/     # Migraciones
├── docs/               # Documentación técnica
├── documentos/         # Documentos oficiales del Cervantes
└── content/            # Contenido del curso (futuro)
```

## 🎓 Módulos del Curso

1. **Módulo 1**: Léxico y estructuras (P1: T1-T3) - 20-25h - **FREEMIUM**
2. **Módulo 2**: Comprensión auditiva (P1: T4-T7) - 20-25h
3. **Módulo 3**: Mediación escrita multimodal (P2: T1) - 25-30h
4. **Módulo 4**: Expresión escrita formal (P2: T2-T3) - 20-25h
5. **Módulo 5**: Mediación oral (P3: T1) - 20-25h
6. **Módulo 6**: Interacción: entrevista (P3: T2) - 15-20h
7. **Módulo 7**: Negociación y acuerdo (P3: T3) - 15-20h
8. **Módulo 8**: Simulacros parciales - 12-15h
9. **Módulo 9**: Simulacros completos - 12-15h

**Total**: 160-200 horas

## 🤖 Tutor IA

El tutor IA proporciona feedback formativo en tareas escritas:

- **Modelo**: Claude 3.5 Sonnet (Anthropic)
- **Evaluación**: Por bandas 0-3 en 4 criterios
- **Feedback**: Fortalezas, debilidades, errores específicos, recomendaciones
- **Coste**: ~0.01€ por análisis

Ver `docs/c2-tutor-ia.md` para implementación completa.

## 💰 Modelo de Negocio

- **Freemium**: Módulo 1 gratuito (demo)
- **Plan Mensual**: 29€/mes
- **Plan Anual**: 279€/año (ahorra 20%)

Integración con Stripe para pagos.

## 🔒 Seguridad

- Autenticación con NextAuth.js
- Contraseñas hasheadas con bcrypt
- Roles: STUDENT, TEACHER, ADMIN
- Middleware de autorización por ruta
- Variables de entorno para secretos

## 📊 Progreso del Proyecto

### ✅ Completado

- [x] Documentación técnica completa (6 documentos)
- [x] Esquema de base de datos (Prisma)
- [x] Estructura básica de Next.js
- [x] Scripts de seed (niveles, curso, módulos)
- [x] Sistema de bandas y evaluación

### 🚧 Próximos Pasos

- [ ] Instalar dependencias (`npm install`)
- [ ] Configurar PostgreSQL y variables de entorno
- [ ] Ejecutar seed para poblar datos iniciales
- [ ] Implementar API del tutor IA
- [ ] Crear componentes frontend (tareas, feedback)
- [ ] Sistema de autenticación
- [ ] Integración con Stripe

### 📋 Pendiente

- [ ] Generación de contenido inicial (50 textos)
- [ ] Grabación de audios (3 variedades del español)
- [ ] Diseño de gráficos e infografías
- [ ] Implementación de tareas P1, P2, P3
- [ ] Sistema de learning paths
- [ ] Dashboard de progreso
- [ ] Simulacros

## 📄 Licencia

Privado - Todos los derechos reservados

## 👤 Autor

**elcorreveidile**

- GitHub: [@elcorreveidile](https://github.com/elcorreveidile)

---

**Nota**: Este proyecto está en desarrollo. El contenido debe ser original y seguir las especificaciones del Instituto Cervantes sin copiar materiales oficiales.
