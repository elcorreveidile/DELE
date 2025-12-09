import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 1. Crear nivel C2
  console.log('Creating C2 level...')
  const levelC2 = await prisma.level.upsert({
    where: { code: 'C2' },
    update: {},
    create: {
      code: 'C2',
      name: 'Nivel C2 - Maestría',
      description: 'Nivel de maestría del Marco Común Europeo de Referencia (MCER). El estudiante es capaz de comprender con facilidad prácticamente todo lo que oye o lee.',
      order: 6
    }
  })

  console.log(`✓ Level C2 created: ${levelC2.id}`)

  // 2. Crear curso C2
  console.log('Creating C2 course...')
  const courseC2 = await prisma.course.upsert({
    where: { levelId: levelC2.id },
    update: {},
    create: {
      levelId: levelC2.id,
      title: 'Preparación DELE C2',
      description: 'Curso completo de preparación para el examen DELE C2 con 9 módulos especializados, tutorización con IA y contenido original alineado con las especificaciones del Instituto Cervantes.',
      hoursRecommendedMin: 160,
      hoursRecommendedMax: 200,
      isFreemiumUnitId: null // Se asignará después de crear el módulo 1
    }
  })

  console.log(`✓ Course C2 created: ${courseC2.id}`)

  // 3. Crear módulos
  console.log('Creating 9 modules...')

  const modules = [
    {
      order: 1,
      title: 'Módulo 1: Léxico y estructuras',
      description: 'Desarrollo de vocabulario sofisticado y dominio de estructuras gramaticales complejas necesarias para las tareas de comprensión lectora de la Prueba 1.',
      objectives: [
        'Dominar léxico con distinciones sutiles de significado',
        'Identificar y usar estructuras gramaticales complejas',
        'Comprender mecanismos de cohesión y coherencia textual',
        'Aplicar estrategias de identificación de sinónimos contextual'
      ],
      skills: ['CL'],
      deleTaskTypes: ['P1_T1', 'P1_T2', 'P1_T3'],
      hoursMin: 20,
      hoursMax: 25,
      isFreemium: true
    },
    {
      order: 2,
      title: 'Módulo 2: Comprensión auditiva',
      description: 'Desarrollo de la capacidad de comprensión de audios complejos, identificación de matices, ideas implícitas y actitudes de los hablantes.',
      objectives: [
        'Comprender audios con matices y detalles específicos',
        'Identificar ideas implícitas y conclusiones no expresadas',
        'Detectar actitudes, opiniones y emociones de los hablantes',
        'Procesar información de textos orales complejos en diferentes variedades del español'
      ],
      skills: ['CA'],
      deleTaskTypes: ['P1_T4', 'P1_T5', 'P1_T6', 'P1_T7'],
      hoursMin: 20,
      hoursMax: 25,
      isFreemium: false
    },
    {
      order: 3,
      title: 'Módulo 3: Mediación escrita multimodal',
      description: 'Práctica intensiva de mediación escrita integrando múltiples fuentes (textos y gráficos) para producir textos coherentes y bien estructurados.',
      objectives: [
        'Integrar información de múltiples fuentes escritas y gráficas',
        'Reformular y sintetizar información compleja',
        'Adaptar registro y tono según destinatario y género textual',
        'Producir textos de 500-650 palabras con estructura clara'
      ],
      skills: ['ME'],
      deleTaskTypes: ['P2_T1'],
      hoursMin: 25,
      hoursMax: 30,
      isFreemium: false
    },
    {
      order: 4,
      title: 'Módulo 4: Expresión escrita formal',
      description: 'Dominio de géneros textuales formales (cartas, ensayos, artículos, informes) con corrección gramatical y riqueza léxica de nivel C2.',
      objectives: [
        'Dominar géneros textuales formales (carta, ensayo, artículo, informe)',
        'Producir textos de 200-250 palabras con precisión',
        'Aplicar cohesión y coherencia en textos breves',
        'Usar vocabulario especializado y estructuras sofisticadas'
      ],
      skills: ['EE'],
      deleTaskTypes: ['P2_T2', 'P2_T3'],
      hoursMin: 20,
      hoursMax: 25,
      isFreemium: false
    },
    {
      order: 5,
      title: 'Módulo 5: Mediación oral',
      description: 'Desarrollo de la capacidad de exposición oral basada en fuentes escritas y gráficas, con integración de información y expresión clara.',
      objectives: [
        'Integrar oralmente información de fuentes escritas y gráficas',
        'Realizar exposiciones de 5-6 minutos con estructura clara',
        'Usar vocabulario especializado en contexto oral',
        'Gestionar tiempo de preparación eficazmente (20 minutos)'
      ],
      skills: ['MO'],
      deleTaskTypes: ['P3_T1'],
      hoursMin: 20,
      hoursMax: 25,
      isFreemium: false
    },
    {
      order: 6,
      title: 'Módulo 6: Interacción: entrevista',
      description: 'Práctica de interacción oral formal en contextos de entrevista, con desarrollo de temas complejos y respuestas matizadas.',
      objectives: [
        'Participar en entrevistas formales con fluidez',
        'Desarrollar temas complejos con detalle y matices',
        'Responder a preguntas de profundización',
        'Mantener conversación formal durante 5-6 minutos'
      ],
      skills: ['IO'],
      deleTaskTypes: ['P3_T2'],
      hoursMin: 15,
      hoursMax: 20,
      isFreemium: false
    },
    {
      order: 7,
      title: 'Módulo 7: Negociación y acuerdo',
      description: 'Desarrollo de habilidades de negociación en contextos formales, con argumentación, contrargumentación y búsqueda de consenso.',
      objectives: [
        'Negociar y llegar a acuerdos en situaciones complejas',
        'Argumentar y contraargumentar con eficacia',
        'Gestionar conflictos de intereses',
        'Alcanzar consenso en 5-6 minutos de interacción'
      ],
      skills: ['IO'],
      deleTaskTypes: ['P3_T3'],
      hoursMin: 15,
      hoursMax: 20,
      isFreemium: false
    },
    {
      order: 8,
      title: 'Módulo 8: Simulacros parciales',
      description: 'Realización de simulacros parciales (una prueba completa por simulacro) en condiciones similares al examen oficial.',
      objectives: [
        'Practicar cada prueba completa en tiempo real',
        'Familiarizarse con formato y duración del examen',
        'Identificar áreas de mejora específicas',
        'Desarrollar estrategias de gestión del tiempo'
      ],
      skills: ['CL', 'CA', 'EE', 'ME', 'EO', 'MO', 'IO'],
      deleTaskTypes: [
        'P1_T1', 'P1_T2', 'P1_T3', 'P1_T4', 'P1_T5', 'P1_T6', 'P1_T7',
        'P2_T1', 'P2_T2', 'P2_T3',
        'P3_T1', 'P3_T2', 'P3_T3'
      ],
      hoursMin: 12,
      hoursMax: 15,
      isFreemium: false
    },
    {
      order: 9,
      title: 'Módulo 9: Simulacros completos',
      description: 'Exámenes completos de práctica con las tres pruebas en un mismo día, simulando las condiciones reales del DELE C2.',
      objectives: [
        'Realizar exámenes completos (3 pruebas) en condiciones reales',
        'Gestionar resistencia mental y física del examen completo',
        'Aplicar todas las estrategias aprendidas',
        'Obtener retroalimentación integral antes del examen oficial'
      ],
      skills: ['CL', 'CA', 'EE', 'ME', 'EO', 'MO', 'IO'],
      deleTaskTypes: [
        'P1_T1', 'P1_T2', 'P1_T3', 'P1_T4', 'P1_T5', 'P1_T6', 'P1_T7',
        'P2_T1', 'P2_T2', 'P2_T3',
        'P3_T1', 'P3_T2', 'P3_T3'
      ],
      hoursMin: 12,
      hoursMax: 15,
      isFreemium: false
    }
  ]

  for (const moduleData of modules) {
    const module = await prisma.module.create({
      data: {
        courseId: courseC2.id,
        ...moduleData
      }
    })
    console.log(`✓ Module ${module.order} created: ${module.title}`)

    // Actualizar el freemium module ID si es el módulo 1
    if (moduleData.isFreemium) {
      await prisma.course.update({
        where: { id: courseC2.id },
        data: { isFreemiumUnitId: module.id }
      })
      console.log(`✓ Set module 1 as freemium`)
    }
  }

  // 4. Crear planes de pago
  console.log('Creating payment plans...')

  const monthlyPlan = await prisma.paymentPlan.upsert({
    where: { stripePriceId: 'price_monthly_c2' },
    update: {},
    create: {
      name: 'Plan Mensual C2',
      description: 'Acceso completo al curso DELE C2 con renovación mensual',
      price: 2900, // 29€
      currency: 'EUR',
      interval: 'MONTHLY',
      accessScope: ['C2'],
      features: [
        'Acceso completo a los 9 módulos',
        'Feedback ilimitado del tutor IA',
        'Simulacros parciales y completos',
        'Seguimiento de progreso detallado',
        'Actualizaciones de contenido'
      ],
      stripePriceId: 'price_monthly_c2',
      isActive: true
    }
  })

  const annualPlan = await prisma.paymentPlan.upsert({
    where: { stripePriceId: 'price_annual_c2' },
    update: {},
    create: {
      name: 'Plan Anual C2',
      description: 'Acceso completo al curso DELE C2 por un año (ahorra 20%)',
      price: 27900, // 279€ (20% descuento)
      currency: 'EUR',
      interval: 'YEARLY',
      accessScope: ['C2'],
      features: [
        'Acceso completo a los 9 módulos',
        'Feedback ilimitado del tutor IA',
        'Simulacros parciales y completos',
        'Seguimiento de progreso detallado',
        'Actualizaciones de contenido',
        'Ahorra 20% vs plan mensual',
        'Evaluación oral con profesor (1 sesión)'
      ],
      stripePriceId: 'price_annual_c2',
      isActive: true
    }
  })

  console.log(`✓ Payment plans created`)

  console.log('\n✅ Seeding completed successfully!')
  console.log(`\nCreated:`)
  console.log(`  - 1 Level (C2)`)
  console.log(`  - 1 Course`)
  console.log(`  - 9 Modules`)
  console.log(`  - 2 Payment Plans (${monthlyPlan.name}, ${annualPlan.name})`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
