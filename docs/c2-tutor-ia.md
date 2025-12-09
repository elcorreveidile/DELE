# Guía de Implementación del Tutor IA - DELE C2

## Visión General

El Tutor IA es el sistema de feedback automatizado que proporciona retroalimentación formativa a los estudiantes en sus tareas escritas y orales del nivel C2. Este documento describe su arquitectura, prompts, criterios de evaluación y limitaciones.

**Principio fundamental**: El Tutor IA proporciona **feedback formativo y orientativo**, no calificaciones oficiales. Su objetivo es ayudar al estudiante a mejorar, identificando fortalezas y áreas de desarrollo según los criterios del DELE C2.

---

## Arquitectura del Sistema

### 1. Componentes principales

```
┌─────────────────────────────────────────────────────────┐
│                    ESTUDIANTE                           │
│         (Envía tarea escrita/oral)                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              API ENDPOINT                               │
│         /api/tutor/feedback                             │
│                                                         │
│  1. Validar entrada                                    │
│  2. Cargar contexto del estudiante                     │
│  3. Construir prompt para IA                           │
│  4. Llamar a Claude/GPT                                │
│  5. Parsear respuesta                                  │
│  6. Guardar en BD (Attempt + Evaluation)              │
│  7. Enviar feedback al estudiante                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│           MODELO DE IA                                  │
│     Claude 3.5 Sonnet / GPT-4                          │
│                                                         │
│  - Analiza producción del estudiante                   │
│  - Evalúa por criterios (Bandas 0-3)                   │
│  - Genera feedback estructurado                        │
│  - Proporciona ejemplos y recomendaciones              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│         RESPUESTA ESTRUCTURADA                          │
│                                                         │
│  {                                                      │
│    evaluacion: {                                        │
│      cohesionBand: "BAND_2",                           │
│      correccionBand: "BAND_2",                         │
│      alcanceBand: "BAND_3",                            │
│      cumplimientoBand: "BAND_2"                        │
│    },                                                   │
│    feedback: {                                          │
│      fortalezas: [...],                                │
│      debilidades: [...],                               │
│      recomendaciones: [...]                            │
│    },                                                   │
│    ejemplos: [...]                                      │
│  }                                                      │
└─────────────────────────────────────────────────────────┘
```

### 2. Stack tecnológico

**Modelo de IA recomendado:**
- **Principal**: Claude 3.5 Sonnet (Anthropic)
  - Ventajas: Excelente en español, análisis matizado, instrucciones complejas
  - Coste: ~$3 por 1M tokens de entrada, $15 por 1M tokens de salida
- **Alternativa**: GPT-4o (OpenAI)
  - Ventajas: Rápido, buen rendimiento general
  - Coste: Similar a Claude

**Librerías:**
```json
{
  "@anthropic-ai/sdk": "^0.24.0",
  "openai": "^4.20.0",
  "zod": "^3.22.0",
  "langchain": "^0.1.0" // Opcional, para cadenas complejas
}
```

---

## Sistema de Prompts

### Prompt Base - Estructura

Todos los prompts del Tutor IA siguen esta estructura:

```xml
<role>
[Definición del rol del asistente]
</role>

<context>
[Contexto del estudiante y la tarea]
</context>

<evaluation_criteria>
[Criterios específicos de evaluación DELE C2]
</evaluation_criteria>

<student_production>
[Texto u oral del estudiante]
</student_production>

<task>
[Instrucciones específicas para el análisis]
</task>

<output_format>
[Formato JSON esperado]
</output_format>

<constraints>
[Limitaciones y advertencias]
</constraints>
```

### Prompt Template - Prueba 2 (Tareas Escritas)

```typescript
// prompts/p2-written-feedback.ts

export const P2_WRITTEN_FEEDBACK_PROMPT = `
<role>
Eres un evaluador experto de DELE C2 (Diploma de Español como Lengua Extranjera, nivel C2 del MCER). Tu especialidad es proporcionar feedback formativo y detallado a estudiantes que preparan el examen DELE C2, específicamente en las tareas escritas de la Prueba 2.

Tu objetivo es ayudar al estudiante a mejorar identificando fortalezas y áreas de desarrollo según los cuatro criterios oficiales:
1. Cohesión y coherencia
2. Corrección (gramatical y léxica)
3. Alcance (léxico y gramatical)
4. Cumplimiento de tarea / Mediación

NO proporcionas una calificación oficial, sino feedback orientativo.
</role>

<context>
**Estudiante**: {{studentName}}
**Nivel estimado actual**: {{currentLevel}}
**Nivel objetivo**: C2
**Historial reciente**: {{recentPerformance}}
**Debilidades identificadas**: {{knownWeaknesses}}

**Tarea DELE**: {{taskType}}
**Instrucciones de la tarea**:
{{taskInstructions}}

**Extensión requerida**: {{wordCountMin}}-{{wordCountMax}} palabras
**Género textual**: {{textGenre}}
**Registro**: {{register}}
</context>

<evaluation_criteria>
Evalúa la producción del estudiante según estos criterios, usando el sistema de bandas del DELE C2:

**BANDA 3** - Consecución sobrada (Supera claramente el nivel C2)
**BANDA 2** - Nivel C2 / APTO (Equivalente a la descripción del nivel C2 del MCER)
**BANDA 1** - No consecución (Por debajo del nivel C2)
**BANDA 0** - Marcadamente inferior (Muy por debajo del C2)

---

## Criterio 1: COHESIÓN Y COHERENCIA

### BANDA 2 (C2 - APTO):
- Produce textos claros y fluidos con estructura lógica eficaz
- Uso apropiado y variado de estructuras organizativas y conectores
- El lector sigue el hilo argumentativo sin esfuerzo
- Progresión temática bien gestionada
- Párrafos bien articulados con transiciones naturales

### BANDA 3 (Consecución sobrada):
- Demuestra dominio completo de recursos cohesivos sofisticados
- Organización textual impecable y elegante
- Uso magistral de mecanismos de referencia y elipsis
- Conectores muy variados y precisos (no obstante, por ende, a tenor de, en virtud de)

### BANDA 1 (No consecución):
- Estructura organizativa poco clara o repetitiva
- Uso limitado o inadecuado de conectores
- Saltos lógicos que dificultan la comprensión
- Párrafos mal articulados

### BANDA 0 (Marcadamente inferior):
- Carencia de organización textual clara
- Ausencia de conectores o uso erróneo
- Texto incoherente o fragmentado

---

## Criterio 2: CORRECCIÓN (Gramatical y Léxica)

### BANDA 2 (C2 - APTO):
- Mantiene consistentemente un alto grado de corrección gramatical
- Errores escasos y difíciles de detectar
- Ortografía y puntuación correctas (pueden aparecer descuidos ocasionales)
- Colocaciones léxicas apropiadas
- Control de estructuras complejas (subjuntivo, condicionales, pasivas)

### BANDA 3 (Consecución sobrada):
- Prácticamente sin errores gramaticales
- Dominio completo de ortografía y puntuación
- Uso preciso de léxico especializado
- Control absoluto de estructuras complejas

### BANDA 1 (No consecución):
- Errores gramaticales frecuentes que pueden dificultar la comprensión
- Problemas de concordancia, tiempos verbales, preposiciones
- Errores ortográficos notorios
- Colocaciones léxicas inadecuadas

### BANDA 0 (Marcadamente inferior):
- Errores gramaticales sistemáticos que impiden la comunicación
- Ortografía muy deficiente
- Léxico inapropiado o erróneo

---

## Criterio 3: ALCANCE (Léxico y Gramatical)

### BANDA 2 (C2 - APTO):
- Buen dominio de un repertorio léxico amplio, incluyendo expresiones idiomáticas y coloquiales
- Uso apropiado de vocabulario especializado según el ámbito
- Variedad gramatical: estructuras complejas, subordinadas múltiples, pasivas, perífrasis verbales
- Capacidad para reformular y evitar repeticiones

### BANDA 3 (Consecución sobrada):
- Dominio de un repertorio léxico muy amplio y sofisticado
- Uso preciso de vocabulario técnico y académico
- Gran variedad de estructuras gramaticales complejas usadas con naturalidad
- Riqueza expresiva notable

### BANDA 1 (No consecución):
- Repertorio léxico limitado para el nivel C2
- Vocabulario básico o repetitivo
- Estructuras gramaticales simples predominantes
- Dificultad para expresar matices

### BANDA 0 (Marcadamente inferior):
- Repertorio léxico muy limitado
- Estructuras gramaticales muy básicas
- Incapacidad para matizar o expresar ideas complejas

---

## Criterio 4: CUMPLIMIENTO DE TAREA / MEDIACIÓN

Para P2_T1 (Mediación escrita multimodal):

### BANDA 2 (C2 - APTO):
- Integra eficazmente información de las fuentes proporcionadas (textos + gráficos)
- Reformula y sintetiza información de múltiples fuentes
- Adapta el registro y tono al destinatario y género textual
- Cumple con la extensión requerida (500-650 palabras)
- Desarrolla todos los puntos solicitados en las instrucciones

### BANDA 3 (Consecución sobrada):
- Integración magistral de fuentes con valor añadido
- Reformulación sofisticada que demuestra comprensión profunda
- Adaptación perfecta al contexto comunicativo
- Desarrollo completo y equilibrado de todos los puntos

Para P2_T2 y P2_T3 (Expresión escrita):

### BANDA 2 (C2 - APTO):
- Desarrolla adecuadamente el tema según el género (carta, ensayo, artículo, informe)
- Cumple la extensión (200-250 palabras)
- Se ajusta al registro y tono requeridos
- Presenta argumentación coherente (si aplica)
- Incluye todos los elementos del género textual

### BANDA 1 (No consecución):
- Integración parcial o inadecuada de fuentes (P2_T1)
- No se ajusta al género textual o registro
- Extensión insuficiente o excesiva (±20%)
- Desarrolla solo parcialmente los puntos solicitados

### BANDA 0 (Marcadamente inferior):
- No integra las fuentes o lo hace de forma incomprensible
- Incumplimiento claro de las instrucciones
- Extensión muy inadecuada
- No se corresponde con el género textual solicitado

</evaluation_criteria>

<student_production>
**Extensión**: {{wordCount}} palabras

{{studentText}}
</student_production>

<task>
Analiza la producción escrita del estudiante siguiendo estos pasos:

1. **Lectura completa**: Lee el texto completo una vez para comprensión global

2. **Evaluación por criterios**: Evalúa cada uno de los 4 criterios asignando una banda (0, 1, 2 o 3)

3. **Identificación de fortalezas**: Identifica 3-5 aspectos positivos específicos del texto

4. **Identificación de debilidades**: Identifica 3-5 áreas de mejora específicas

5. **Errores específicos**: Si hay errores gramaticales o léxicos, señala 3-5 ejemplos concretos con corrección

6. **Recomendaciones**: Proporciona 3-5 recomendaciones prácticas y accionables para mejorar

7. **Ejemplos de reformulación**: Selecciona 2-3 fragmentos del texto del estudiante y ofrece versiones mejoradas explicando por qué son mejores

Recuerda: Tu feedback debe ser **constructivo, específico y orientado a la mejora**. No uses un tono condescendiente. Reconoce el nivel avanzado del estudiante (está preparando C2).
</task>

<output_format>
Responde ÚNICAMENTE con un objeto JSON válido con esta estructura exacta:

{
  "evaluacion": {
    "cohesionBand": "BAND_0" | "BAND_1" | "BAND_2" | "BAND_3",
    "cohesionJustificacion": "Explicación de 2-3 frases",
    "correccionBand": "BAND_0" | "BAND_1" | "BAND_2" | "BAND_3",
    "correccionJustificacion": "Explicación de 2-3 frases",
    "alcanceBand": "BAND_0" | "BAND_1" | "BAND_2" | "BAND_3",
    "alcanceJustificacion": "Explicación de 2-3 frases",
    "cumplimientoBand": "BAND_0" | "BAND_1" | "BAND_2" | "BAND_3",
    "cumplimientoJustificacion": "Explicación de 2-3 frases"
  },
  "feedback": {
    "resumenGeneral": "Resumen del análisis en 3-4 frases",
    "fortalezas": [
      "Fortaleza específica 1 con ejemplo del texto",
      "Fortaleza específica 2 con ejemplo del texto",
      "Fortaleza específica 3 con ejemplo del texto"
    ],
    "debilidades": [
      "Debilidad específica 1 con ejemplo del texto",
      "Debilidad específica 2 con ejemplo del texto",
      "Debilidad específica 3 con ejemplo del texto"
    ],
    "erroresEspecificos": [
      {
        "tipo": "gramatical" | "lexico" | "ortografico" | "puntuacion",
        "error": "Fragmento con error del texto del estudiante",
        "correccion": "Versión corregida",
        "explicacion": "Por qué es incorrecto y regla aplicable"
      }
    ],
    "recomendaciones": [
      "Recomendación práctica 1 para mejorar",
      "Recomendación práctica 2 para mejorar",
      "Recomendación práctica 3 para mejorar"
    ]
  },
  "ejemplosReformulacion": [
    {
      "original": "Fragmento del texto del estudiante",
      "mejorado": "Versión mejorada del mismo fragmento",
      "explicacion": "Por qué la versión mejorada es mejor (cohesión, léxico, gramática, etc.)"
    }
  ],
  "nivelEstimado": "B2" | "C1" | "C2",
  "probabilidadApto": "baja" | "media" | "alta",
  "siguientesPasos": [
    "Acción concreta 1 para el estudiante",
    "Acción concreta 2 para el estudiante"
  ]
}
</output_format>

<constraints>
IMPORTANTE - Limitaciones del feedback:

1. **NO proporciones calificación numérica oficial** (ej: "20/33.33 puntos")
2. **Marca claramente que esto es feedback formativo**, no evaluación certificadora
3. **Sé específico**: Siempre cita ejemplos concretos del texto del estudiante
4. **Sé constructivo**: Incluso al señalar errores, mantén un tono alentador
5. **Sé realista**: Si el nivel es claramente inferior a C2, indícalo honestamente
6. **No inventes errores**: Solo señala problemas reales
7. **Respeta el español**: El estudiante está en nivel avanzado, evita explicaciones demasiado básicas
8. **Variedad dialectal**: Acepta variedades del español (no marcar como error usos dialectales válidos)

Al final de tu feedback, incluye SIEMPRE este aviso:

"⚠️ Este feedback es orientativo y formativo. NO constituye una evaluación oficial del examen DELE C2. Solo examinadores certificados del Instituto Cervantes pueden proporcionar calificaciones oficiales."
</constraints>
`;
```

### Prompt Template - Prueba 3 (Tareas Orales)

```typescript
// prompts/p3-oral-feedback.ts

export const P3_ORAL_FEEDBACK_PROMPT = `
<role>
Eres un evaluador experto de DELE C2 especializado en expresión, mediación e interacción orales (Prueba 3). Proporcionas feedback formativo a estudiantes basándote en transcripciones de sus producciones orales.

**IMPORTANTE**: En esta versión del sistema, trabajas con TRANSCRIPCIONES, no con audio directo. Por tanto, no puedes evaluar pronunciación, entonación o fluidez oral directamente. Te centras en:
- Contenido y estructura del discurso
- Riqueza léxica y gramatical (visible en transcripción)
- Cohesión y coherencia del mensaje
- Cumplimiento de la tarea

Para una evaluación completa de la Prueba 3, se requiere revisión humana por un evaluador que escuche el audio.
</role>

<context>
**Estudiante**: {{studentName}}
**Tarea DELE**: {{taskType}}
**Duración de la grabación**: {{durationMinutes}} minutos
**Transcripción de la producción oral del estudiante**:

{{transcription}}

**Instrucciones de la tarea**:
{{taskInstructions}}

{{#if sourceTexts}}
**Fuentes proporcionadas** (para P3_T1 - Mediación oral):
{{sourceTexts}}
{{/if}}
</context>

<evaluation_criteria>
[MISMOS CRITERIOS QUE P2, ADAPTADOS PARA ORAL]

Evalúa según estos criterios (Bandas 0-3):

1. **Cohesión y coherencia**: Estructura del discurso, conectores orales, progresión lógica
2. **Corrección**: Gramática y léxico (visible en transcripción)
3. **Alcance**: Variedad léxica y gramatical
4. **Cumplimiento de tarea**: Desarrollo del tema, integración de fuentes (P3_T1)

**NOTA SOBRE FLUIDEZ**: Aunque no puedes evaluar fluidez oral directamente, puedes inferir problemas de reformulación o autocorrecciones excesivas si están reflejadas en la transcripción (ej: "Yo creo que... bueno, no, es decir...").

**ESCALA HOLÍSTICA** (40% de la nota en P3): Basándote en la impresión global de la producción oral (visible a través de la transcripción), asigna también una banda holística considerando:
- Eficacia comunicativa general
- Naturalidad del discurso (aunque no oigas el audio)
- Adecuación al contexto
- Capacidad para desarrollar ideas complejas

</evaluation_criteria>

<task>
Analiza la transcripción de la producción oral del estudiante:

1. Lee la transcripción completa
2. Evalúa los 4 criterios analíticos (Bandas 0-3)
3. Asigna banda holística (Banda 0-3)
4. Identifica fortalezas y debilidades del discurso
5. Proporciona recomendaciones específicas para mejorar la expresión oral

**Limitaciones de tu análisis**:
- Solo analizas el CONTENIDO (no pronunciación, entonación, ritmo)
- Indicas claramente que se requiere evaluación humana del audio para feedback completo
- Si la transcripción es de mala calidad o incompleta, indícalo
</task>

<output_format>
{
  "evaluacion": {
    "cohesionBand": "BAND_0" | "BAND_1" | "BAND_2" | "BAND_3",
    "cohesionJustificacion": "...",
    "correccionBand": "BAND_0" | "BAND_1" | "BAND_2" | "BAND_3",
    "correccionJustificacion": "...",
    "alcanceBand": "BAND_0" | "BAND_1" | "BAND_2" | "BAND_3",
    "alcanceJustificacion": "...",
    "cumplimientoBand": "BAND_0" | "BAND_1" | "BAND_2" | "BAND_3",
    "cumplimientoJustificacion": "...",
    "holisticBand": "BAND_0" | "BAND_1" | "BAND_2" | "BAND_3",
    "holisticJustificacion": "Impresión global basada en transcripción"
  },
  "feedback": {
    "resumenGeneral": "...",
    "fortalezas": [...],
    "debilidades": [...],
    "erroresEspecificos": [...],
    "recomendaciones": [...]
  },
  "advertencias": [
    "Este análisis se basa ÚNICAMENTE en la transcripción del audio.",
    "NO incluye evaluación de pronunciación, entonación, ritmo o fluidez oral.",
    "Para una evaluación completa de la Prueba 3 se requiere revisión humana del audio por un evaluador certificado."
  ],
  "requiereEvaluacionHumana": true,
  "aspectosNoEvaluados": [
    "Pronunciación y articulación",
    "Entonación y prosodia",
    "Ritmo y pausas",
    "Fluidez oral (solo inferida parcialmente)"
  ]
}
</output_format>

<constraints>
1. **Marca claramente las limitaciones** de tu análisis (solo transcripción)
2. **Recomienda evaluación humana** para feedback completo de Prueba 3
3. **No evalúes aspectos que no puedas ver en la transcripción** (pronunciación, entonación)
4. **Sé honesto** sobre la calidad de la transcripción si es deficiente
5. Si detectas errores de transcripción evidentes (ej: palabras sin sentido), indícalo

Aviso obligatorio:
"⚠️ Este análisis se basa únicamente en la transcripción escrita de tu producción oral. Para una evaluación completa de la Prueba 3 (incluyendo pronunciación, entonación, fluidez y ritmo), se requiere revisión humana del audio por un evaluador certificado del Instituto Cervantes."
</constraints>
`;
```

---

## Implementación en Next.js

### API Endpoint - Feedback Escrito

```typescript
// app/api/tutor/feedback/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { z } from 'zod';
import { P2_WRITTEN_FEEDBACK_PROMPT } from '@/prompts/p2-written-feedback';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Schema de validación
const FeedbackRequestSchema = z.object({
  taskId: z.string().cuid(),
  studentText: z.string().min(50).max(5000),
  taskType: z.enum(['P2_T1', 'P2_T2', 'P2_T3'])
});

export async function POST(request: NextRequest) {
  try {
    // 1. Autenticación
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // 2. Validar entrada
    const body = await request.json();
    const { taskId, studentText, taskType } = FeedbackRequestSchema.parse(body);

    // 3. Cargar contexto
    const [task, user, recentAttempts] = await Promise.all([
      prisma.task.findUnique({ where: { id: taskId } }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        include: { profile: true }
      }),
      prisma.attempt.findMany({
        where: { userId: session.user.id },
        include: { evaluation: true },
        orderBy: { completedAt: 'desc' },
        take: 5
      })
    ]);

    if (!task) {
      return NextResponse.json({ error: 'Tarea no encontrada' }, { status: 404 });
    }

    // 4. Construir prompt
    const prompt = buildPrompt(P2_WRITTEN_FEEDBACK_PROMPT, {
      studentName: user?.name || 'Estudiante',
      currentLevel: user?.levelEstimated || 'B2',
      recentPerformance: summarizeRecentPerformance(recentAttempts),
      knownWeaknesses: extractWeaknesses(recentAttempts),
      taskType: task.taskType,
      taskInstructions: task.instructions,
      wordCountMin: task.wordCountMin || 200,
      wordCountMax: task.wordCountMax || 650,
      textGenre: task.textGenre || 'ensayo',
      register: 'formal',
      studentText: studentText,
      wordCount: countWords(studentText)
    });

    // 5. Llamar a Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.3, // Baja temperatura para mayor consistencia
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    // 6. Parsear respuesta
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const feedback = parseAIResponse(responseText);

    // 7. Guardar en BD
    const attempt = await prisma.attempt.create({
      data: {
        userId: session.user.id,
        taskId: taskId,
        submissionText: studentText,
        durationSeconds: 0, // Desconocido para ahora
        aiFeedback: JSON.stringify(feedback.feedback),
        aiAnalysis: JSON.stringify(feedback),
        evaluation: {
          create: {
            prueba: 'PRUEBA_2',
            taskType: taskType as C2TaskType,
            cohesionBand: feedback.evaluacion.cohesionBand,
            cohesionComment: feedback.evaluacion.cohesionJustificacion,
            correccionBand: feedback.evaluacion.correccionBand,
            correccionComment: feedback.evaluacion.correccionJustificacion,
            alcanceBand: feedback.evaluacion.alcanceBand,
            alcanceComment: feedback.evaluacion.alcanceJustificacion,
            cumplimientoBand: feedback.evaluacion.cumplimientoBand,
            cumplimientoComment: feedback.evaluacion.cumplimientoJustificacion,
            evaluatedBy: 'AI',
            finalScore: calculateScore(feedback.evaluacion, 'PRUEBA_2'),
            weightsUsed: { cohesion: 0.25, correccion: 0.25, alcance: 0.25, cumplimiento: 0.25 }
          }
        }
      },
      include: { evaluation: true }
    });

    // 8. Actualizar progreso del estudiante
    await updateStudentProgress(session.user.id, task.skill, attempt.evaluation!);

    // 9. Retornar feedback
    return NextResponse.json({
      attemptId: attempt.id,
      feedback: feedback.feedback,
      evaluacion: feedback.evaluacion,
      ejemplos: feedback.ejemplosReformulacion,
      nivelEstimado: feedback.nivelEstimado,
      probabilidadApto: feedback.probabilidadApto,
      siguientesPasos: feedback.siguientesPasos
    });

  } catch (error) {
    console.error('Error en Tutor IA:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error al procesar feedback' },
      { status: 500 }
    );
  }
}

// Helpers

function buildPrompt(template: string, variables: Record<string, any>): string {
  let prompt = template;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    prompt = prompt.replace(regex, String(value));
  }

  return prompt;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

function summarizeRecentPerformance(attempts: any[]): string {
  if (attempts.length === 0) return 'Sin intentos previos';

  const avgBands = calculateAverageBands(attempts);
  return `Promedio reciente - Cohesión: ${avgBands.cohesion.toFixed(1)}, Corrección: ${avgBands.correccion.toFixed(1)}, Alcance: ${avgBands.alcance.toFixed(1)}`;
}

function extractWeaknesses(attempts: any[]): string {
  const weaknesses = new Set<string>();

  attempts.forEach(attempt => {
    if (attempt.evaluation) {
      if (bandToNumber(attempt.evaluation.cohesionBand) < 2) {
        weaknesses.add('Cohesión y coherencia');
      }
      if (bandToNumber(attempt.evaluation.correccionBand) < 2) {
        weaknesses.add('Corrección gramatical');
      }
      if (bandToNumber(attempt.evaluation.alcanceBand) < 2) {
        weaknesses.add('Alcance léxico');
      }
    }
  });

  return weaknesses.size > 0 ? Array.from(weaknesses).join(', ') : 'Ninguna identificada';
}

function bandToNumber(band: string): number {
  const mapping: Record<string, number> = {
    'BAND_0': 0,
    'BAND_1': 1,
    'BAND_2': 2,
    'BAND_3': 3
  };
  return mapping[band] || 0;
}

function calculateAverageBands(attempts: any[]): Record<string, number> {
  const totals = { cohesion: 0, correccion: 0, alcance: 0, count: 0 };

  attempts.forEach(attempt => {
    if (attempt.evaluation) {
      totals.cohesion += bandToNumber(attempt.evaluation.cohesionBand);
      totals.correccion += bandToNumber(attempt.evaluation.correccionBand);
      totals.alcance += bandToNumber(attempt.evaluation.alcanceBand);
      totals.count++;
    }
  });

  return totals.count > 0 ? {
    cohesion: totals.cohesion / totals.count,
    correccion: totals.correccion / totals.count,
    alcance: totals.alcance / totals.count
  } : { cohesion: 0, correccion: 0, alcance: 0 };
}

function parseAIResponse(text: string): any {
  // Extraer JSON de la respuesta (puede estar envuelto en markdown)
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No se pudo parsear la respuesta de la IA');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error parseando JSON:', error);
    throw new Error('Respuesta de IA en formato inválido');
  }
}

function calculateScore(evaluacion: any, prueba: string): number {
  const bands = [
    bandToNumber(evaluacion.cohesionBand),
    bandToNumber(evaluacion.correccionBand),
    bandToNumber(evaluacion.alcanceBand),
    bandToNumber(evaluacion.cumplimientoBand)
  ];

  const avgBand = bands.reduce((a, b) => a + b, 0) / bands.length;
  const criteriaScore = (avgBand / 3) * 100;

  if (prueba === 'PRUEBA_2') {
    return (criteriaScore / 3) * 33.33;
  } else if (prueba === 'PRUEBA_3' && evaluacion.holisticBand) {
    const holisticScore = bandToNumber(evaluacion.holisticBand) * 33.33;
    const combined = (criteriaScore * 0.6) + (holisticScore * 0.4);
    return (combined / 100) * 33.34;
  }

  return 0;
}

async function updateStudentProgress(
  userId: string,
  skill: string,
  evaluation: any
): Promise<void> {
  const progress = await prisma.progress.findUnique({
    where: {
      userId_skill_levelId: {
        userId,
        skill: skill as Skill,
        levelId: 'c2-level-id' // Obtener dinámicamente
      }
    }
  });

  const newAvgBands = {
    cohesion: bandToNumber(evaluation.cohesionBand),
    correccion: bandToNumber(evaluation.correccionBand),
    alcance: bandToNumber(evaluation.alcanceBand),
    cumplimiento: bandToNumber(evaluation.cumplimientoBand)
  };

  if (progress) {
    // Actualizar promedios
    await prisma.progress.update({
      where: { id: progress.id },
      data: {
        attemptsCount: { increment: 1 },
        avgCohesionBand: progress.avgCohesionBand
          ? (progress.avgCohesionBand * progress.attemptsCount + newAvgBands.cohesion) / (progress.attemptsCount + 1)
          : newAvgBands.cohesion,
        avgCorreccionBand: progress.avgCorreccionBand
          ? (progress.avgCorreccionBand * progress.attemptsCount + newAvgBands.correccion) / (progress.attemptsCount + 1)
          : newAvgBands.correccion,
        avgAlcanceBand: progress.avgAlcanceBand
          ? (progress.avgAlcanceBand * progress.attemptsCount + newAvgBands.alcance) / (progress.attemptsCount + 1)
          : newAvgBands.alcance,
        avgCumplimientoBand: progress.avgCumplimientoBand
          ? (progress.avgCumplimientoBand * progress.attemptsCount + newAvgBands.cumplimiento) / (progress.attemptsCount + 1)
          : newAvgBands.cumplimiento
      }
    });
  } else {
    // Crear progreso nuevo
    await prisma.progress.create({
      data: {
        userId,
        skill: skill as Skill,
        levelId: 'c2-level-id',
        attemptsCount: 1,
        avgCohesionBand: newAvgBands.cohesion,
        avgCorreccionBand: newAvgBands.correccion,
        avgAlcanceBand: newAvgBands.alcance,
        avgCumplimientoBand: newAvgBands.cumplimiento
      }
    });
  }
}
```

---

## Componente Frontend - Enviar tarea

```typescript
// components/TaskSubmission.tsx

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface TaskSubmissionProps {
  taskId: string;
  taskType: 'P2_T1' | 'P2_T2' | 'P2_T3';
  wordCountMin: number;
  wordCountMax: number;
  instructions: string;
}

export function TaskSubmission({
  taskId,
  taskType,
  wordCountMin,
  wordCountMax,
  instructions
}: TaskSubmissionProps) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  const handleSubmit = async () => {
    if (wordCount < wordCountMin || wordCount > wordCountMax) {
      setError(`La extensión debe estar entre ${wordCountMin} y ${wordCountMax} palabras`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tutor/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, studentText: text, taskType })
      });

      if (!response.ok) {
        throw new Error('Error al procesar el feedback');
      }

      const data = await response.json();
      setFeedback(data);
    } catch (err) {
      setError('Hubo un error al procesar tu tarea. Por favor, inténtalo de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-2">Instrucciones</h3>
        <p className="text-gray-700">{instructions}</p>
        <p className="text-sm text-gray-500 mt-2">
          Extensión requerida: {wordCountMin}-{wordCountMax} palabras
        </p>
      </Card>

      {/* Editor de texto */}
      <div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu respuesta aquí..."
          rows={15}
          className="w-full"
          disabled={loading || feedback !== null}
        />

        <div className="flex justify-between items-center mt-2">
          <span className={`text-sm ${
            wordCount < wordCountMin || wordCount > wordCountMax
              ? 'text-red-600'
              : 'text-green-600'
          }`}>
            {wordCount} palabras
            {wordCount < wordCountMin && ` (mínimo: ${wordCountMin})`}
            {wordCount > wordCountMax && ` (máximo: ${wordCountMax})`}
          </span>

          <Button
            onClick={handleSubmit}
            disabled={loading || wordCount === 0 || feedback !== null}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? 'Analizando...' : 'Enviar para feedback'}
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        </Card>
      )}

      {/* Feedback */}
      {feedback && (
        <FeedbackDisplay feedback={feedback} />
      )}
    </div>
  );
}
```

```typescript
// components/FeedbackDisplay.tsx

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Lightbulb, ArrowRight } from 'lucide-react';

interface FeedbackDisplayProps {
  feedback: any;
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const bandColors = {
    BAND_0: 'bg-red-100 text-red-800',
    BAND_1: 'bg-orange-100 text-orange-800',
    BAND_2: 'bg-green-100 text-green-800',
    BAND_3: 'bg-blue-100 text-blue-800'
  };

  const bandLabels = {
    BAND_0: 'Banda 0',
    BAND_1: 'Banda 1',
    BAND_2: 'Banda 2 (C2)',
    BAND_3: 'Banda 3'
  };

  return (
    <div className="space-y-6">
      {/* Resumen */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-lg mb-2">Resumen del análisis</h3>
        <p className="text-gray-800">{feedback.feedback.resumenGeneral}</p>

        <div className="mt-4 flex gap-4">
          <div>
            <span className="text-sm text-gray-600">Nivel estimado:</span>
            <Badge className="ml-2">{feedback.nivelEstimado}</Badge>
          </div>
          <div>
            <span className="text-sm text-gray-600">Probabilidad de APTO:</span>
            <Badge className={`ml-2 ${
              feedback.probabilidadApto === 'alta' ? 'bg-green-500' :
              feedback.probabilidadApto === 'media' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}>
              {feedback.probabilidadApto}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Evaluación por criterios */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Evaluación por criterios</h3>

        <div className="space-y-4">
          {/* Cohesión */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Cohesión y coherencia</span>
              <Badge className={bandColors[feedback.evaluacion.cohesionBand]}>
                {bandLabels[feedback.evaluacion.cohesionBand]}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{feedback.evaluacion.cohesionJustificacion}</p>
          </div>

          {/* Corrección */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Corrección</span>
              <Badge className={bandColors[feedback.evaluacion.correccionBand]}>
                {bandLabels[feedback.evaluacion.correccionBand]}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{feedback.evaluacion.correccionJustificacion}</p>
          </div>

          {/* Alcance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Alcance</span>
              <Badge className={bandColors[feedback.evaluacion.alcanceBand]}>
                {bandLabels[feedback.evaluacion.alcanceBand]}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{feedback.evaluacion.alcanceJustificacion}</p>
          </div>

          {/* Cumplimiento */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Cumplimiento de tarea</span>
              <Badge className={bandColors[feedback.evaluacion.cumplimientoBand]}>
                {bandLabels[feedback.evaluacion.cumplimientoBand]}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{feedback.evaluacion.cumplimientoJustificacion}</p>
          </div>
        </div>
      </Card>

      {/* Fortalezas */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center mb-3">
          <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
          <h3 className="font-semibold">Fortalezas</h3>
        </div>
        <ul className="space-y-2">
          {feedback.feedback.fortalezas.map((fortaleza: string, idx: number) => (
            <li key={idx} className="text-gray-800 flex">
              <span className="mr-2">•</span>
              <span>{fortaleza}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Áreas de mejora */}
      <Card className="p-6 bg-orange-50 border-orange-200">
        <div className="flex items-center mb-3">
          <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
          <h3 className="font-semibold">Áreas de mejora</h3>
        </div>
        <ul className="space-y-2">
          {feedback.feedback.debilidades.map((debilidad: string, idx: number) => (
            <li key={idx} className="text-gray-800 flex">
              <span className="mr-2">•</span>
              <span>{debilidad}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Errores específicos */}
      {feedback.feedback.erroresEspecificos && feedback.feedback.erroresEspecificos.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Errores específicos</h3>
          <div className="space-y-4">
            {feedback.feedback.erroresEspecificos.map((error: any, idx: number) => (
              <div key={idx} className="border-l-4 border-red-400 pl-4">
                <div className="flex items-start gap-2 mb-1">
                  <Badge variant="outline">{error.tipo}</Badge>
                </div>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="font-medium text-red-600">Error:</span>
                    <span className="ml-2 line-through">{error.error}</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-600">Corrección:</span>
                    <span className="ml-2">{error.correccion}</span>
                  </div>
                  <p className="text-gray-600 italic">{error.explicacion}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Ejemplos de reformulación */}
      {feedback.ejemplos && feedback.ejemplos.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold mb-3">Ejemplos de mejora</h3>
          <div className="space-y-4">
            {feedback.ejemplos.map((ejemplo: any, idx: number) => (
              <div key={idx} className="space-y-2">
                <div className="bg-gray-100 p-3 rounded">
                  <span className="text-xs text-gray-500 uppercase">Original:</span>
                  <p className="text-gray-800 mt-1">{ejemplo.original}</p>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>

                <div className="bg-green-100 p-3 rounded">
                  <span className="text-xs text-green-700 uppercase">Mejorado:</span>
                  <p className="text-gray-800 mt-1">{ejemplo.mejorado}</p>
                </div>

                <p className="text-sm text-gray-600 italic pl-3">{ejemplo.explicacion}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recomendaciones */}
      <Card className="p-6 bg-purple-50 border-purple-200">
        <div className="flex items-center mb-3">
          <Lightbulb className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="font-semibold">Recomendaciones para mejorar</h3>
        </div>
        <ul className="space-y-2">
          {feedback.feedback.recomendaciones.map((rec: string, idx: number) => (
            <li key={idx} className="text-gray-800 flex">
              <span className="mr-2">{idx + 1}.</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Siguientes pasos */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="font-semibold mb-3">Siguientes pasos</h3>
        <ul className="space-y-2">
          {feedback.siguientesPasos.map((paso: string, idx: number) => (
            <li key={idx} className="text-gray-800 flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <span>{paso}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Aviso legal */}
      <Card className="p-4 bg-yellow-50 border-yellow-200">
        <p className="text-sm text-yellow-900">
          ⚠️ Este feedback es orientativo y formativo. NO constituye una evaluación oficial del examen DELE C2. Solo examinadores certificados del Instituto Cervantes pueden proporcionar calificaciones oficiales.
        </p>
      </Card>
    </div>
  );
}
```

---

## Costes y Límites

### Estimación de costes con Claude 3.5 Sonnet

**Por análisis de tarea escrita:**
- Prompt: ~3,500 tokens (instrucciones + contexto + texto estudiante)
- Respuesta: ~2,000 tokens (evaluación + feedback detallado)
- **Total**: ~5,500 tokens por análisis
- **Coste**: $0.0105 por análisis (~0.01€)

**Para un estudiante completo (160h de curso):**
- ~100 tareas escritas analizadas durante el curso
- **Coste total en IA**: ~$1.05 (1€) por estudiante

**Límites de rate limiting:**
- Claude API: 50,000 tokens/min (tier 1), 5,000 requests/min
- Suficiente para ~500 análisis simultáneos/minuto

### Variables de entorno necesarias

```env
# .env.local

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-api03-...

# Alternativa: OpenAI
OPENAI_API_KEY=sk-proj-...

# Configuración del tutor
TUTOR_MODEL=claude-3-5-sonnet-20241022
TUTOR_MAX_TOKENS=4000
TUTOR_TEMPERATURE=0.3

# Límites
MAX_FEEDBACK_REQUESTS_PER_DAY=20 # Por usuario
MAX_TEXT_LENGTH=5000 # Caracteres
```

---

## Testing del Tutor IA

### Test de consistencia

```typescript
// tests/tutor-consistency.test.ts

import { describe, it, expect } from 'vitest';
import { generateFeedback } from '@/lib/tutor-ia';

describe('Tutor IA - Consistencia', () => {
  const sampleText = `
    La transformación digital en las aulas universitarias ha experimentado
    un cambio radical en los últimos años. No obstante, persisten desafíos
    significativos en cuanto a la formación del profesorado y la infraestructura
    tecnológica necesaria...
  `;

  it('debería asignar la misma banda para el mismo texto (±1 banda)', async () => {
    const results = [];

    for (let i = 0; i < 5; i++) {
      const feedback = await generateFeedback({
        text: sampleText,
        taskType: 'P2_T2'
      });
      results.push(feedback.evaluacion);
    }

    // Verificar consistencia en bandas (máximo ±1 de diferencia)
    const cohesionBands = results.map(r => bandToNumber(r.cohesionBand));
    const maxDiff = Math.max(...cohesionBands) - Math.min(...cohesionBands);

    expect(maxDiff).toBeLessThanOrEqual(1);
  });

  it('debería identificar errores gramaticales evidentes', async () => {
    const textWithErrors = `
      La universidad tiene muchos problemas con la tecnología. Los profesores
      no saben usar los programas. *Ellos necesitan aprender más mejor.
    `;

    const feedback = await generateFeedback({
      text: textWithErrors,
      taskType: 'P2_T2'
    });

    expect(feedback.feedback.erroresEspecificos.length).toBeGreaterThan(0);
    expect(feedback.evaluacion.correccionBand).not.toBe('BAND_2');
  });

  it('debería asignar BAND_2 o superior a texto de nivel C2', async () => {
    const c2Text = `
      La hibridación de modalidades pedagógicas constituye, sin lugar a dudas,
      uno de los paradigmas más relevantes en el ámbito de la educación superior
      contemporánea. No obstante, su implementación efectiva requiere no solo
      de infraestructura tecnológica adecuada, sino también de una profunda
      transformación en las competencias docentes...
    `;

    const feedback = await generateFeedback({
      text: c2Text,
      taskType: 'P2_T2'
    });

    expect(['BAND_2', 'BAND_3']).toContain(feedback.evaluacion.alcanceBand);
  });
});
```

---

## Mejoras Futuras

### Versión 2.0: Análisis de audio directo

Integración con Whisper API para transcripción + análisis de prosodia:

```typescript
// V2: Análisis de audio con prosodia

import { WhisperAPI } from 'openai';

async function analyzeOralProduction(audioFile: File) {
  // 1. Transcribir con Whisper
  const transcription = await WhisperAPI.transcribe(audioFile, {
    language: 'es',
    response_format: 'verbose_json', // Incluye timestamps
    timestamp_granularities: ['word']
  });

  // 2. Analizar prosodia (pausas, velocidad, entonación)
  const prosodyAnalysis = analyzeProsody(transcription.words);

  // 3. Combinar análisis de contenido + prosodia
  const contentFeedback = await generateFeedback(transcription.text, 'P3_T1');
  const prosodyFeedback = generateProsodyFeedback(prosodyAnalysis);

  return { contentFeedback, prosodyFeedback };
}
```

### Versión 2.1: Fine-tuning específico DELE

Entrenar modelo fine-tuned en evaluaciones reales de DELE C2 (con permiso del Cervantes):

```python
# Fine-tuning con datos reales (requiere dataset del Cervantes)

from anthropic import Anthropic

client = Anthropic()

# Dataset: pares de (texto estudiante, evaluación oficial)
training_data = [
  {
    "input": "...",
    "output": {"cohesionBand": "BAND_2", ...}
  },
  # ... más ejemplos
]

# Fine-tune
fine_tuned_model = client.fine_tuning.create(
  model="claude-3-5-sonnet",
  training_data=training_data,
  validation_split=0.2
)
```

### Versión 3.0: Feedback adaptativo

Sistema que ajusta el tipo de feedback según el nivel del estudiante:

```typescript
function adaptFeedbackToLevel(level: string, feedback: any) {
  if (level === 'B2') {
    // Más explicaciones gramaticales básicas
    return expandGrammarExplanations(feedback);
  } else if (level === 'C2') {
    // Feedback más sofisticado, menos explicaciones básicas
    return condenseFeedback(feedback);
  }
  return feedback;
}
```

---

## Resumen de Implementación

### Checklist de implementación

- [ ] Configurar API key de Anthropic/OpenAI
- [ ] Crear prompts base para P2 y P3
- [ ] Implementar endpoint `/api/tutor/feedback`
- [ ] Crear helpers de cálculo de puntuación
- [ ] Implementar sistema de actualización de progreso
- [ ] Crear componentes de frontend (TaskSubmission, FeedbackDisplay)
- [ ] Añadir rate limiting (20 requests/día por usuario)
- [ ] Implementar tests de consistencia
- [ ] Documentar uso para estudiantes
- [ ] Configurar monitoring de costes de API

### Próximos pasos

1. ✅ Guía del tutor IA creada
2. **Commit y push de documentación**: Subir archivos al repositorio
3. **Implementar código**: API endpoints y componentes frontend
4. **Testing con textos reales**: Validar consistencia del tutor
5. **Ajustar prompts**: Iterar según resultados de testing
6. **Deploy en staging**: Probar con estudiante real

---

**Fin de la guía del Tutor IA v1.0**
