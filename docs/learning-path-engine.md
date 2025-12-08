# Motor de rutas de aprendizaje

## Datos de entrada del estudiante
- Nivel estimado, nivel objetivo DELE, fecha de examen (opcional). 
- Horas semanales disponibles.
- Autoevaluación por destreza (CL, CA, EE, EO/mediación) y experiencia previa en exámenes. 
- Resultados de simulacros anteriores (cuando existan).

## Tipos de ruta
- **Estándar:** objetivo en 4–6 meses; 2–4 sesiones por semana; incluye práctica guiada + cronometrada + simulacros.
- **Intensiva:** 8–12 semanas (B1–B2) o 12–16 (C1–C2); más carga semanal, simulacros frecuentes.
- **Larga/Consolidación:** >6 meses; refuerzo de lagunas y profundización; más actividades de lengua y mediación.

## Generación inicial
1. Seleccionar curso por nivel objetivo (ajustar si nivel estimado < objetivo para incluir puente de refuerzo).
2. Calcular número de semanas según horas disponibles y tipo de ruta.
3. Distribuir módulos en semanas con sesiones (2–4) asignando peso a destrezas débiles.
4. Colocar **checkpoints**: simulacro parcial (mitad) y completo (final) + micro-evaluaciones por destreza.
5. Marcar actividades freemium vs. premium según plan Stripe.

## Reajuste dinámico
- Consumir resultados de `Attempt` y `Progress` para recalcular:
  - Priorización de módulos/actividades en destrezas bajas.
  - Repeticiones de tareas clave con variaciones.
  - Recomendaciones de tutor IA basadas en errores frecuentes (léxico, gramática, cohesión, registro).
- Detectar irregularidad (sesiones saltadas) y reagendar semanas.

## Salida (estructura)
```json
{
  "weeks": [
    {
      "week": 1,
      "sessions": [
        {"session": 1, "modules": ["A1-M1"], "tasks": ["CL-1", "EE-1"], "focus": "CL/EE"},
        {"session": 2, "modules": ["A1-M1"], "tasks": ["EO-1"], "focus": "EO"}
      ],
      "checkpoint": null
    }
  ],
  "next_review": "2024-09-15"
}
```

## IA en el ciclo de ruta
- El backend envía al modelo: perfil del estudiante, metas, resultados recientes, tarea seleccionada y fragmentos de especificaciones del nivel.
- Respuesta esperada: feedback por criterios, prioridad de mejoras, ejercicios adicionales sugeridos.
- Mensaje de seguridad: feedback orientativo, no calificación oficial.

## Métricas y analítica
- Progreso por destreza (porcentaje completado y variación de puntuación en simulacros).
- Adherencia al plan (sesiones completadas vs. planificadas).
- Conversión freemium → pago y retención por nivel/plan.
