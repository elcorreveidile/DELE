import { PrismaClient, Role, DeleLevel, EnrollmentStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes
  await prisma.chatMessage.deleteMany()
  await prisma.chatSessionPersonal.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.lessonProgress.deleteMany()
  await prisma.enrollment.deleteMany()
  await prisma.lessonFile.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.courseFile.deleteMany()
  await prisma.course.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.studentProfile.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.user.deleteMany()

  console.log('✅ Datos anteriores eliminados')

  // 1. CREAR USUARIOS
  console.log('👥 Creando usuarios...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const teacherPassword = await bcrypt.hash('teacher123', 10)
  const studentPassword = await bcrypt.hash('student123', 10)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@dele.com',
      name: 'Admin DELE',
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  })

  const teacher = await prisma.user.create({
    data: {
      email: 'profesor@dele.com',
      name: 'Prof. María García',
      password: teacherPassword,
      role: Role.TEACHER,
      emailVerified: new Date(),
    },
  })

  const student = await prisma.user.create({
    data: {
      email: 'estudiante@dele.com',
      name: 'Juan Pérez',
      password: studentPassword,
      role: Role.STUDENT,
      emailVerified: new Date(),
      studentProfile: {
        create: {
          currentLevel: DeleLevel.A2,
          targetLevel: DeleLevel.B2,
          examDate: new Date('2025-05-15'),
          learningGoals: 'Mejorar comprensión auditiva y expresión oral para aprobar el DELE B2',
          weakAreas: ['comprension_auditiva', 'expresion_oral'],
          strengths: ['gramatica', 'comprension_lectora'],
          studyHoursPerWeek: 10,
          preferredStudyTime: 'tarde',
        },
      },
    },
  })

  console.log('✅ 3 usuarios creados:', {
    admin: admin.email,
    teacher: teacher.email,
    student: student.email,
  })

  // 2. CREAR CURSOS
  console.log('📚 Creando cursos...')

  const courseB1 = await prisma.course.create({
    data: {
      title: 'Preparación DELE B1 - Curso Completo',
      slug: 'preparacion-dele-b1-completo',
      description: 'Curso completo para aprobar el examen DELE nivel B1. Incluye todas las destrezas: comprensión lectora, comprensión auditiva, expresión e interacción escritas, y expresión e interacción orales.',
      level: DeleLevel.B1,
      price: 199.00,
      published: true,
      featured: true,
      duration: 2400, // 40 horas
      whatYouLearn: [
        'Dominarás la gramática del nivel B1',
        'Mejorarás tu comprensión auditiva con ejercicios reales',
        'Aprenderás técnicas de expresión escrita efectivas',
        'Practicarás conversación con simulacros de examen',
        'Conocerás el formato exacto del examen DELE B1',
      ],
      requirements: [
        'Nivel A2 completado o equivalente',
        'Dedicación de 5-10 horas semanales',
        'Ganas de aprender y compromiso con el estudio',
      ],
    },
  })

  const courseB2 = await prisma.course.create({
    data: {
      title: 'DELE B2 - Curso Intensivo Premium',
      slug: 'dele-b2-curso-intensivo',
      description: 'Prepárate para el DELE B2 con nuestro curso intensivo. Enfoque práctico con simulacros reales y corrección personalizada.',
      level: DeleLevel.B2,
      price: 299.00,
      published: true,
      featured: true,
      duration: 3600, // 60 horas
      whatYouLearn: [
        'Técnicas avanzadas de comprensión lectora',
        'Expresión oral fluida y natural',
        'Redacción de textos formales e informales',
        'Estrategias específicas para el día del examen',
        'Vocabulario avanzado por temas',
      ],
      requirements: [
        'Nivel B1 aprobado o equivalente',
        'Dedicación de 10-15 horas semanales',
        'Motivación para alcanzar un nivel avanzado',
      ],
    },
  })

  console.log('✅ 2 cursos creados:', {
    courseB1: courseB1.title,
    courseB2: courseB2.title,
  })

  // 3. CREAR LECCIONES PARA CURSO B1
  console.log('📖 Creando lecciones para B1...')

  await prisma.lesson.createMany({
    data: [
      {
        courseId: courseB1.id,
        title: 'Introducción al DELE B1',
        slug: 'introduccion-dele-b1',
        description: 'Conoce la estructura del examen, los criterios de evaluación y consejos generales para prepararte con éxito.',
        content: `# Introducción al DELE B1

## ¿Qué es el DELE B1?

El DELE B1 certifica que el estudiante es capaz de:
- Comprender los puntos principales de textos claros en lengua estándar
- Desenvolverse en situaciones de viaje
- Producir textos sencillos sobre temas conocidos
- Describir experiencias, acontecimientos y proyectos

## Estructura del examen

El examen consta de 4 pruebas:

### 1. Comprensión de lectura (70 min)
- Tarea 1: Identificar información en textos
- Tarea 2: Relacionar textos con enunciados
- Tarea 3: Comprensión detallada
- Tarea 4: Gramática y vocabulario

### 2. Comprensión auditiva (40 min)
- Tarea 1: Conversaciones cortas
- Tarea 2: Monólogos
- Tarea 3: Entrevistas
- Tarea 4: Anuncios

### 3. Expresión e interacción escritas (60 min)
- Tarea 1: Correo electrónico
- Tarea 2: Redacción

### 4. Expresión e interacción orales (15 min + 15 min preparación)
- Tarea 1: Presentación
- Tarea 2: Descripción de fotografía
- Tarea 3: Conversación

## Puntuación

- Necesitas 30 puntos de 50 para aprobar
- Cada prueba vale 25 puntos
- Debes aprobar ambos grupos (lectura+escritura y oral+auditiva)`,
        order: 1,
        duration: 45,
        published: true,
        isFree: true,
      },
      {
        courseId: courseB1.id,
        title: 'Comprensión Lectora: Estrategias y Técnicas',
        slug: 'comprension-lectora-estrategias',
        description: 'Aprende a analizar textos de forma eficiente, identificar ideas principales y responder correctamente.',
        content: `# Comprensión Lectora B1

## Estrategias clave

### 1. Lectura rápida (skimming)
Identifica rápidamente de qué trata el texto...

### 2. Búsqueda específica (scanning)
Localiza información concreta sin leer todo...

### 3. Lectura detallada
Comprende cada frase y su relación con el resto...`,
        order: 2,
        duration: 90,
        published: true,
        isFree: false,
      },
      {
        courseId: courseB1.id,
        title: 'Comprensión Auditiva: Ejercicios Prácticos',
        slug: 'comprension-auditiva-ejercicios',
        description: 'Practica con audios reales del examen y aprende a captar la información esencial.',
        content: `# Comprensión Auditiva B1

## Tipos de audios

### Conversaciones informales
- Entre amigos
- Situaciones cotidianas
- Planes y propuestas

### Monólogos
- Anuncios públicos
- Presentaciones
- Descripciones

### Entrevistas
- Formato pregunta-respuesta
- Temas variados
- Opiniones personales`,
        order: 3,
        duration: 75,
        published: true,
        isFree: false,
      },
    ],
  })

  // 4. CREAR LECCIONES PARA CURSO B2
  console.log('📖 Creando lecciones para B2...')

  await prisma.lesson.createMany({
    data: [
      {
        courseId: courseB2.id,
        title: 'Introducción al DELE B2',
        slug: 'introduccion-dele-b2',
        description: 'Todo lo que necesitas saber sobre el examen DELE B2.',
        content: '# Introducción al DELE B2\n\nContenido detallado...',
        order: 1,
        duration: 45,
        published: true,
        isFree: true,
      },
      {
        courseId: courseB2.id,
        title: 'Expresión Oral Avanzada',
        slug: 'expresion-oral-avanzada',
        description: 'Técnicas para hablar con fluidez y naturalidad.',
        content: '# Expresión Oral B2\n\nTécnicas avanzadas...',
        order: 2,
        duration: 120,
        published: true,
        isFree: false,
      },
    ],
  })

  console.log('✅ Lecciones creadas')

  // 5. MATRICULAR AL ESTUDIANTE EN CURSO B1
  console.log('🎓 Creando matrícula...')

  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: courseB1.id,
      status: EnrollmentStatus.ACTIVE,
      progress: 25,
    },
  })

  console.log('✅ Estudiante matriculado en curso B1')

  // 6. CREAR POST DE BLOG
  console.log('📝 Creando post de blog...')

  await prisma.blogPost.create({
    data: {
      title: '10 Consejos para Aprobar el DELE B2 a la Primera',
      slug: '10-consejos-aprobar-dele-b2',
      excerpt: 'Descubre las estrategias clave que te ayudarán a superar el examen DELE B2 con éxito en tu primer intento.',
      content: `# 10 Consejos para Aprobar el DELE B2

## 1. Planifica tu estudio

Crear un plan de estudio realista es fundamental...

## 2. Practica con exámenes reales

Los modelos de examen oficial son tu mejor aliado...

## 3. Mejora tu comprensión auditiva

Escucha podcasts, series y noticias en español...

## 4. Lee variedad de textos

Artículos, novelas, ensayos... amplía tu vocabulario...

## 5. Escribe regularmente

Practica los dos tipos de textos del examen...

## 6. Habla todo lo que puedas

Busca intercambios de idiomas o clases de conversación...

## 7. Conoce el formato del examen

Familiarízate con cada tarea y sus tiempos...

## 8. Gestiona tu tiempo

Practica con cronómetro para acostumbrarte...

## 9. Cuida tu salud

Duerme bien, come sano y haz ejercicio...

## 10. Mantén la confianza

Tu actitud es clave para el éxito...`,
      published: true,
      featured: true,
      tags: ['consejos', 'estrategias', 'examen', 'preparacion'],
      level: DeleLevel.B2,
      metaTitle: '10 Consejos para Aprobar el DELE B2 | DELE Platform',
      metaDescription: 'Guía completa con 10 consejos prácticos y efectivos para aprobar el examen DELE B2 en tu primer intento.',
      publishedAt: new Date(),
    },
  })

  console.log('✅ Post de blog creado')

  // 7. CREAR SESIÓN DE CHAT DE EJEMPLO
  console.log('💬 Creando sesión de chat...')

  const chatSession = await prisma.chatSessionPersonal.create({
    data: {
      userId: student.id,
      title: 'Ayuda con tiempos verbales',
      messages: {
        create: [
          {
            role: 'user',
            content: 'Hola, tengo dudas sobre cuándo usar el pretérito perfecto y el indefinido',
          },
          {
            role: 'assistant',
            content: `¡Hola Juan! Es una duda muy común. Te explico:

**Pretérito Perfecto**: Se usa para acciones pasadas relacionadas con el presente o en un tiempo no terminado.
- Hoy he estudiado mucho
- Esta semana he ido al gimnasio

**Pretérito Indefinido**: Para acciones pasadas en un tiempo específico y terminado.
- Ayer estudié tres horas
- La semana pasada fui al gimnasio

¿Te ha quedado claro?`,
            model: 'gpt-4',
            tokens: 150,
          },
        ],
      },
    },
  })

  console.log('✅ Sesión de chat creada')

  console.log('\n🎉 ¡Seed completado con éxito!')
  console.log('\n📊 Resumen:')
  console.log('  - 3 usuarios (admin, teacher, student)')
  console.log('  - 2 cursos (B1 y B2)')
  console.log('  - 5 lecciones')
  console.log('  - 1 matrícula activa')
  console.log('  - 1 post de blog')
  console.log('  - 1 sesión de chat')
  console.log('\n🔐 Credenciales de acceso:')
  console.log('  Admin:    admin@dele.com / admin123')
  console.log('  Teacher:  profesor@dele.com / teacher123')
  console.log('  Student:  estudiante@dele.com / student123')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })