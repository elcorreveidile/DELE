-- Seed data for DELE C2 Platform

-- 1. Create Level C2
INSERT INTO "Level" (id, code, name, description, "order", "createdAt", "updatedAt")
VALUES (
  'clevel_c2_' || gen_random_uuid()::text,
  'C2',
  'Nivel C2 - Maestría',
  'Nivel de maestría del Marco Común Europeo de Referencia (MCER). El estudiante es capaz de comprender con facilidad prácticamente todo lo que oye o lee.',
  6,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT (code) DO NOTHING
RETURNING id;

-- Store the level ID for later use
\gset level_c2_

-- 2. Create Course C2
INSERT INTO "Course" (id, "levelId", title, description, "hoursRecommendedMin", "hoursRecommendedMax", "isFreemiumUnitId", "createdAt", "updatedAt")
SELECT
  'ccourse_c2_' || gen_random_uuid()::text,
  id,
  'Preparación DELE C2',
  'Curso completo de preparación para el examen DELE C2 con 9 módulos especializados, tutorización con IA y contenido original alineado con las especificaciones del Instituto Cervantes.',
  160,
  200,
  NULL,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Level" WHERE code = 'C2'
ON CONFLICT ("levelId") DO NOTHING
RETURNING id;

\gset course_c2_

-- 3. Create Modules
INSERT INTO "Module" ("id", "courseId", "order", title, description, objectives, skills, "deleTaskTypes", "hoursMin", "hoursMax", "isFreemium", "createdAt", "updatedAt")
SELECT
  'cmodule_01_' || gen_random_uuid()::text,
  id,
  1,
  'Módulo 1: Léxico y estructuras',
  'Desarrollo de vocabulario sofisticado y dominio de estructuras gramaticales complejas necesarias para las tareas de comprensión lectora de la Prueba 1.',
  ARRAY['Dominar léxico con distinciones sutiles de significado', 'Identificar y usar estructuras gramaticales complejas', 'Comprender mecanismos de cohesión y coherencia textual', 'Aplicar estrategias de identificación de sinónimos contextual'],
  ARRAY['CL']::"Skill"[],
  ARRAY['P1_T1', 'P1_T2', 'P1_T3']::"C2TaskType"[],
  20,
  25,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')
ON CONFLICT ("courseId", "order") DO NOTHING;

INSERT INTO "Module" ("id", "courseId", "order", title, description, objectives, skills, "deleTaskTypes", "hoursMin", "hoursMax", "isFreemium", "createdAt", "updatedAt")
SELECT
  'cmodule_02_' || gen_random_uuid()::text,
  id,
  2,
  'Módulo 2: Comprensión auditiva',
  'Desarrollo de la capacidad de comprensión de audios complejos, identificación de matices, ideas implícitas y actitudes de los hablantes.',
  ARRAY['Comprender audios con matices y detalles específicos', 'Identificar ideas implícitas y conclusiones no expresadas', 'Detectar actitudes, opiniones y emociones de los hablantes', 'Procesar información de textos orales complejos en diferentes variedades del español'],
  ARRAY['CA']::"Skill"[],
  ARRAY['P1_T4', 'P1_T5', 'P1_T6', 'P1_T7']::"C2TaskType"[],
  20,
  25,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')
ON CONFLICT ("courseId", "order") DO NOTHING;

INSERT INTO "Module" ("id", "courseId", "order", title, description, objectives, skills, "deleTaskTypes", "hoursMin", "hoursMax", "isFreemium", "createdAt", "updatedAt")
SELECT
  'cmodule_03_' || gen_random_uuid()::text,
  id,
  3,
  'Módulo 3: Mediación escrita multimodal',
  'Práctica intensiva de mediación escrita integrando múltiples fuentes (textos y gráficos) para producir textos coherentes y bien estructurados.',
  ARRAY['Integrar información de múltiples fuentes escritas y gráficas', 'Reformular y sintetizar información compleja', 'Adaptar registro y tono según destinatario y género textual', 'Producir textos de 500-650 palabras con estructura clara'],
  ARRAY['ME']::"Skill"[],
  ARRAY['P2_T1']::"C2TaskType"[],
  25,
  30,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')
ON CONFLICT ("courseId", "order") DO NOTHING;

INSERT INTO "Module" ("id", "courseId", "order", title, description, objectives, skills, "deleTaskTypes", "hoursMin", "hoursMax", "isFreemium", "createdAt", "updatedAt")
SELECT
  'cmodule_04_' || gen_random_uuid()::text,
  id,
  4,
  'Módulo 4: Expresión escrita formal',
  'Dominio de géneros textuales formales (cartas, ensayos, artículos, informes) con corrección gramatical y riqueza léxica de nivel C2.',
  ARRAY['Dominar géneros textuales formales (carta, ensayo, artículo, informe)', 'Producir textos de 200-250 palabras con precisión', 'Aplicar cohesión y coherencia en textos breves', 'Usar vocabulario especializado y estructuras sofisticadas'],
  ARRAY['EE']::"Skill"[],
  ARRAY['P2_T2', 'P2_T3']::"C2TaskType"[],
  20,
  25,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')
ON CONFLICT ("courseId", "order") DO NOTHING;

INSERT INTO "Module" ("id", "courseId", "order", title, description, objectives, skills, "deleTaskTypes", "hoursMin", "hoursMax", "isFreemium", "createdAt", "updatedAt")
SELECT
  'cmodule_05_' || gen_random_uuid()::text,
  id,
  5,
  'Módulo 5: Mediación oral',
  'Desarrollo de la capacidad de exposición oral basada en fuentes escritas y gráficas, con integración de información y expresión clara.',
  ARRAY['Integrar oralmente información de fuentes escritas y gráficas', 'Realizar exposiciones de 5-6 minutos con estructura clara', 'Usar vocabulario especializado en contexto oral', 'Gestionar tiempo de preparación eficazmente (20 minutos)'],
  ARRAY['MO']::"Skill"[],
  ARRAY['P3_T1']::"C2TaskType"[],
  20,
  25,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')
ON CONFLICT ("courseId", "order") DO NOTHING;

INSERT INTO "Module" ("id", "courseId", "order", title, description, objectives, skills, "deleTaskTypes", "hoursMin", "hoursMax", "isFreemium", "createdAt", "updatedAt")
SELECT
  'cmodule_06_' || gen_random_uuid()::text,
  id,
  6,
  'Módulo 6: Interacción: entrevista',
  'Práctica de interacción oral formal en contextos de entrevista, con desarrollo de temas complejos y respuestas matizadas.',
  ARRAY['Participar en entrevistas formales con fluidez', 'Desarrollar temas complejos con detalle y matices', 'Responder a preguntas de profundización', 'Mantener conversación formal durante 5-6 minutos'],
  ARRAY['IO']::"Skill"[],
  ARRAY['P3_T2']::"C2TaskType"[],
  15,
  20,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')
ON CONFLICT ("courseId", "order") DO NOTHING;

INSERT INTO "Module" ("id", "courseId", "order", title, description, objectives, skills, "deleTaskTypes", "hoursMin", "hoursMax", "isFreemium", "createdAt", "updatedAt")
SELECT
  'cmodule_07_' || gen_random_uuid()::text,
  id,
  7,
  'Módulo 7: Negociación y acuerdo',
  'Desarrollo de habilidades de negociación en contextos formales, con argumentación, contrargumentación y búsqueda de consenso.',
  ARRAY['Negociar y llegar a acuerdos en situaciones complejas', 'Argumentar y contraargumentar con eficacia', 'Gestionar conflictos de intereses', 'Alcanzar consenso en 5-6 minutos de interacción'],
  ARRAY['IO']::"Skill"[],
  ARRAY['P3_T3']::"C2TaskType"[],
  15,
  20,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')
ON CONFLICT ("courseId", "order") DO NOTHING;

INSERT INTO "Module" ("id", "courseId", "order", title, description, objectives, skills, "deleTaskTypes", "hoursMin", "hoursMax", "isFreemium", "createdAt", "updatedAt")
SELECT
  'cmodule_08_' || gen_random_uuid()::text,
  id,
  8,
  'Módulo 8: Simulacros parciales',
  'Realización de simulacros parciales (una prueba completa por simulacro) en condiciones similares al examen oficial.',
  ARRAY['Practicar cada prueba completa en tiempo real', 'Familiarizarse con formato y duración del examen', 'Identificar áreas de mejora específicas', 'Desarrollar estrategias de gestión del tiempo'],
  ARRAY['CL', 'CA', 'EE', 'ME', 'EO', 'MO', 'IO']::"Skill"[],
  ARRAY['P1_T1', 'P1_T2', 'P1_T3', 'P1_T4', 'P1_T5', 'P1_T6', 'P1_T7', 'P2_T1', 'P2_T2', 'P2_T3', 'P3_T1', 'P3_T2', 'P3_T3']::"C2TaskType"[],
  12,
  15,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')
ON CONFLICT ("courseId", "order") DO NOTHING;

INSERT INTO "Module" ("id", "courseId", "order", title, description, objectives, skills, "deleTaskTypes", "hoursMin", "hoursMax", "isFreemium", "createdAt", "updatedAt")
SELECT
  'cmodule_09_' || gen_random_uuid()::text,
  id,
  9,
  'Módulo 9: Simulacros completos',
  'Exámenes completos de práctica con las tres pruebas en un mismo día, simulando las condiciones reales del DELE C2.',
  ARRAY['Realizar exámenes completos (3 pruebas) en condiciones reales', 'Gestionar resistencia mental y física del examen completo', 'Aplicar todas las estrategias aprendidas', 'Obtener retroalimentación integral antes del examen oficial'],
  ARRAY['CL', 'CA', 'EE', 'ME', 'EO', 'MO', 'IO']::"Skill"[],
  ARRAY['P1_T1', 'P1_T2', 'P1_T3', 'P1_T4', 'P1_T5', 'P1_T6', 'P1_T7', 'P2_T1', 'P2_T2', 'P2_T3', 'P3_T1', 'P3_T2', 'P3_T3']::"C2TaskType"[],
  12,
  15,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')
ON CONFLICT ("courseId", "order") DO NOTHING;

-- Update Course with freemium module ID
UPDATE "Course"
SET "isFreemiumUnitId" = (
  SELECT m.id
  FROM "Module" m
  WHERE m."courseId" = "Course".id AND m."isFreemium" = true
  LIMIT 1
)
WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2');

-- 4. Create Payment Plans
INSERT INTO "PaymentPlan" (id, name, description, price, currency, interval, "accessScope", features, "stripePriceId", "isActive", "createdAt", "updatedAt")
VALUES (
  'cplan_monthly_' || gen_random_uuid()::text,
  'Plan Mensual C2',
  'Acceso completo al curso DELE C2 con renovación mensual',
  2900,
  'EUR',
  'MONTHLY',
  ARRAY['C2'],
  ARRAY[
    'Acceso completo a los 9 módulos',
    'Feedback ilimitado del tutor IA',
    'Simulacros parciales y completos',
    'Seguimiento de progreso detallado',
    'Actualizaciones de contenido'
  ],
  'price_monthly_c2',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("stripePriceId") DO NOTHING;

INSERT INTO "PaymentPlan" (id, name, description, price, currency, interval, "accessScope", features, "stripePriceId", "isActive", "createdAt", "updatedAt")
VALUES (
  'cplan_annual_' || gen_random_uuid()::text,
  'Plan Anual C2',
  'Acceso completo al curso DELE C2 por un año (ahorra 20%)',
  27900,
  'EUR',
  'YEARLY',
  ARRAY['C2'],
  ARRAY[
    'Acceso completo a los 9 módulos',
    'Feedback ilimitado del tutor IA',
    'Simulacros parciales y completos',
    'Seguimiento de progreso detallado',
    'Actualizaciones de contenido',
    'Ahorra 20% vs plan mensual',
    'Evaluación oral con profesor (1 sesión)'
  ],
  'price_annual_c2',
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
)
ON CONFLICT ("stripePriceId") DO NOTHING;

-- Display summary
\echo '✅ Seeding completed successfully!'
\echo ''
\echo 'Created:'
SELECT
  (SELECT COUNT(*) FROM "Level" WHERE code = 'C2') as levels,
  (SELECT COUNT(*) FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2')) as courses,
  (SELECT COUNT(*) FROM "Module" WHERE "courseId" = (SELECT id FROM "Course" WHERE "levelId" = (SELECT id FROM "Level" WHERE code = 'C2'))) as modules,
  (SELECT COUNT(*) FROM "PaymentPlan") as payment_plans;
