# TABLAS DE BASE DE DATOS UTILIZADAS EN TECHPROC
## Instituto de Capacitación y Desarrollo Virtual (INCADEV)

**Versión:** 1.0
**Fecha:** 2025
**Base de Datos:** PostgreSQL

---

## ÍNDICE DE TABLAS POR MÓDULO

### 1. AUTENTICACIÓN Y USUARIOS
- `users` - Usuarios del sistema
- `active_sessions` - Sesiones activas de usuarios

### 2. MÓDULO ADMINISTRADOR
- `users` - Gestión de usuarios
- `employees` - Empleados del sistema
- `departments` - Departamentos organizacionales
- `positions` - Puestos de trabajo

### 3. MÓDULO GESTOR LMS
- `courses` - Cursos disponibles
- `categories` - Categorías de cursos
- `course_categories` - Relación cursos-categorías
- `course_contents` - Contenidos de cursos
- `course_instructors` - Asignación de instructores a cursos
- `course_previous_requirements` - Requisitos previos de cursos
- `instructors` - Instructores
- `instructor_applications` - Solicitudes para ser instructor
- `students` - Estudiantes
- `companies` - Empresas asociadas
- `academic_periods` - Períodos académicos
- `course_offerings` - Ofertas de cursos por período
- `enrollments` - Matrículas
- `enrollment_details` - Detalles de matrícula
- `groups` - Grupos/clases
- `group_participants` - Participantes de grupos
- `classes` - Clases programadas
- `attendances` - Asistencias a clases
- `evaluations` - Evaluaciones/exámenes
- `questions` - Preguntas de evaluaciones
- `attempts` - Intentos de evaluación
- `gradings` - Calificaciones de intentos
- `grade_configurations` - Configuración de calificaciones
- `grade_records` - Registro de notas
- `grade_changes` - Historial de cambios de notas
- `final_grades` - Notas finales
- `instructor_evaluations` - Evaluaciones a instructores
- `evaluation_criteria` - Criterios de evaluación
- `option_criteria` - Opciones de criterios
- `detail_evaluation_criteria` - Detalles de evaluación
- `evaluation_reports` - Reportes de evaluación
- `student_courses` - Cursos asignados a estudiantes
- `teacher_profiles` - Perfiles de profesores
- `teacher_applications` - Postulaciones de profesores
- `teacher_evaluations` - Evaluaciones a profesores
- `teacher_recruitments` - Convocatorias de profesores
- `certificates` - Certificados
- `diplomas` - Diplomas

### 4. MÓDULO SOPORTE TÉCNICO
- `tickets` - Tickets de soporte
- `ticket_trackings` - Seguimiento de tickets
- `escalations` - Escalaciones de tickets
- `employees` - Técnicos asignados

### 5. MÓDULO SOPORTE - SEGURIDAD
- `security_logs` - Logs de eventos de seguridad
- `blocked_ips` - IPs bloqueadas
- `active_sessions` - Sesiones activas
- `security_alerts` - Alertas de seguridad
- `incidents` - Incidentes de seguridad
- `security_configurations` - Configuraciones de seguridad

### 6. MÓDULO SOPORTE - INFRAESTRUCTURA
- `licenses` - Licencias de software
- `softwares` - Software instalado
- `employees` - Responsables de infraestructura

### 7. MÓDULO DEVELOPER WEB
- `news` - Noticias del sitio web
- `announcements` - Anuncios
- `alerts` - Alertas del sistema
- `chatbot_faqs` - Preguntas frecuentes del chatbot
- `chatbot_conversations` - Conversaciones del chatbot
- `chatbot_messages` - Mensajes del chatbot
- `contact_forms` - Formularios de contacto
- `employees` - Empleados asignados a responder

### 8. MÓDULO ANALISTA DE DATOS
**Todas las tablas del sistema para generar reportes:**
- `students` - Datos de estudiantes
- `courses` - Datos de cursos
- `enrollments` - Matrículas
- `enrollment_details` - Detalles de matrículas
- `attendances` - Asistencias
- `grade_records` - Calificaciones
- `final_grades` - Notas finales
- `invoices` - Facturas
- `payments` - Pagos
- `financial_transactions` - Transacciones financieras
- `revenue_sources` - Fuentes de ingresos
- `tickets` - Tickets de soporte
- `escalations` - Escalaciones
- `security_logs` - Logs de seguridad
- `security_alerts` - Alertas de seguridad
- `incidents` - Incidentes
- `blocked_ips` - IPs bloqueadas

---

## LISTADO COMPLETO DE TABLAS ORDENADAS ALFABÉTICAMENTE

1. **academic_periods** - Períodos académicos (ej: 2025-I, 2025-II)
2. **accounts** - Cuentas contables
3. **active_sessions** - Sesiones activas de usuarios
4. **activity_logs** - Logs de actividad del sistema
5. **agreements** - Acuerdos con entidades externas
6. **alerts** - Alertas del sistema web
7. **announcements** - Anuncios del sitio web
8. **attendances** - Asistencias a clases
9. **attempts** - Intentos de evaluación de estudiantes
10. **audit_logs** - Logs de auditoría
11. **blocked_ips** - Direcciones IP bloqueadas
12. **bot_flows** - Flujos del chatbot
13. **budgets** - Presupuestos
14. **campaigns** - Campañas de marketing
15. **campaign_metrics** - Métricas de campañas
16. **candidates** - Candidatos para vacantes
17. **categories** - Categorías de cursos
18. **certificates** - Certificados de cursos
19. **channels** - Canales de comunicación
20. **chatbot_conversations** - Conversaciones del chatbot
21. **chatbot_faqs** - Preguntas frecuentes del chatbot
22. **chatbot_messages** - Mensajes del chatbot
23. **chat_messages** - Mensajes de chat entre usuarios
24. **claims** - Reclamos y sugerencias
25. **classes** - Clases programadas
26. **companies** - Empresas asociadas
27. **contact_forms** - Formularios de contacto
28. **content_performance** - Rendimiento de contenidos
29. **contents** - Contenidos generados
30. **conversations** - Conversaciones con leads
31. **course_categories** - Relación cursos-categorías
32. **course_contents** - Contenidos de cursos
33. **course_instructors** - Asignación instructores-cursos
34. **course_offerings** - Ofertas de cursos por período
35. **course_previous_requirements** - Requisitos previos de cursos
36. **courses** - Cursos disponibles
37. **departments** - Departamentos organizacionales
38. **detail_evaluation_criteria** - Detalles de criterios de evaluación
39. **diplomas** - Diplomas otorgados
40. **documents** - Documentos del sistema
41. **document_versions** - Versiones de documentos
42. **employees** - Empleados del sistema
43. **enrollments** - Matrículas de estudiantes
44. **enrollment_details** - Detalles de matrículas
45. **enrollment_payments** - Pagos de matrículas
46. **escalations** - Escalaciones de tickets
47. **evaluation_criteria** - Criterios de evaluación
48. **evaluation_reports** - Reportes de evaluación
49. **evaluations** - Evaluaciones/exámenes
50. **final_grades** - Notas finales de estudiantes
51. **financial_transactions** - Transacciones financieras
52. **generation_logs** - Logs de generación de contenido
53. **grade_changes** - Cambios de calificaciones
54. **grade_configurations** - Configuración de calificaciones
55. **grade_records** - Registro de calificaciones
56. **gradings** - Calificaciones de evaluaciones
57. **graduates** - Graduados
58. **groups** - Grupos/clases de cursos
59. **group_participants** - Participantes de grupos
60. **incidents** - Incidentes de seguridad
61. **indicators** - Indicadores de gestión
62. **instructor_applications** - Solicitudes para instructor
63. **instructor_evaluations** - Evaluaciones a instructores
64. **instructors** - Instructores del LMS
65. **invoices** - Facturas
66. **job_applications** - Postulaciones a vacantes
67. **job_vacancies** - Vacantes laborales
68. **leads** - Leads/prospectos
69. **licenses** - Licencias de software
70. **locations** - Ubicaciones geográficas
71. **news** - Noticias del sitio web
72. **notifications** - Notificaciones de usuarios
73. **option_criteria** - Opciones de criterios de evaluación
74. **partners** - Socios/aliados
75. **payment_methods** - Métodos de pago
76. **payment_plans** - Planes de pago
77. **payments** - Pagos realizados
78. **positions** - Puestos de trabajo
79. **programs** - Programas académicos
80. **program_courses** - Cursos de programas
81. **questions** - Preguntas de evaluaciones
82. **revenue_sources** - Fuentes de ingresos
83. **roles** - Roles del sistema
84. **security_alerts** - Alertas de seguridad
85. **security_configurations** - Configuraciones de seguridad
86. **security_logs** - Logs de eventos de seguridad
87. **softwares** - Software instalado
88. **strategic_plans** - Planes estratégicos
89. **strategic_objectives** - Objetivos estratégicos
90. **student_courses** - Cursos de estudiantes
91. **student_profiles** - Perfiles de estudiantes
92. **students** - Estudiantes del LMS
93. **subjects** - Materias/asignaturas
94. **surveys** - Encuestas
95. **survey_questions** - Preguntas de encuestas
96. **survey_responses** - Respuestas de encuestas
97. **tasks** - Tareas del sistema
98. **teacher_applications** - Postulaciones de profesores
99. **teacher_evaluations** - Evaluaciones a profesores
100. **teacher_profiles** - Perfiles de profesores
101. **teacher_recruitments** - Convocatorias de profesores
102. **teams** - Equipos de trabajo
103. **tickets** - Tickets de soporte técnico
104. **ticket_trackings** - Seguimiento de tickets
105. **trainings** - Capacitaciones
106. **transactions** - Transacciones
107. **users** - Usuarios del sistema

---

## TABLAS PRINCIPALES POR FUNCIONALIDAD

### 🔐 AUTENTICACIÓN Y SEGURIDAD
```
users
active_sessions
security_logs
blocked_ips
security_alerts
incidents
security_configurations
```

### 📚 GESTIÓN ACADÉMICA (LMS)
```
courses
categories
course_categories
course_contents
course_instructors
instructors
students
enrollments
enrollment_details
academic_periods
course_offerings
groups
group_participants
classes
attendances
```

### 📝 EVALUACIONES Y CALIFICACIONES
```
evaluations
questions
attempts
gradings
grade_configurations
grade_records
grade_changes
final_grades
certificates
diplomas
```

### 🎫 SOPORTE TÉCNICO
```
tickets
ticket_trackings
escalations
employees
```

### 🖥️ INFRAESTRUCTURA
```
licenses
softwares
employees
```

### 🌐 GESTIÓN WEB
```
news
announcements
alerts
chatbot_faqs
chatbot_conversations
chatbot_messages
contact_forms
```

### 💰 FINANZAS
```
invoices
payments
payment_methods
payment_plans
financial_transactions
revenue_sources
accounts
budgets
transactions
```

### 👥 RECURSOS HUMANOS
```
employees
departments
positions
job_vacancies
job_applications
candidates
trainings
```

### 📊 ANALÍTICA Y REPORTES
```
Utiliza TODAS las tablas del sistema para generar reportes:
- students, courses, enrollments, attendances
- grade_records, final_grades
- invoices, payments, financial_transactions
- tickets, escalations
- security_logs, security_alerts
- etc.
```

---

## RELACIONES CLAVE ENTRE TABLAS

### Usuario → Estudiante → Matrícula → Curso
```
users (id)
  ↓
students (user_id)
  ↓
enrollments (student_id)
  ↓
enrollment_details (enrollment_id)
  ↓
course_offerings (course_offering_id)
  ↓
courses (course_id)
```

### Curso → Grupo → Clase → Asistencia
```
courses (id)
  ↓
groups (course_id)
  ↓
classes (group_id)
  ↓
attendances (class_id)
```

### Evaluación → Intento → Calificación
```
evaluations (id)
  ↓
attempts (evaluation_id)
  ↓
gradings (attempt_id)
  ↓
grade_records (evaluation_id, user_id)
  ↓
final_grades (user_id, group_id)
```

### Ticket → Seguimiento → Escalación
```
tickets (id)
  ↓
ticket_trackings (ticket_id)

tickets (id)
  ↓
escalations (ticket_id)
```

### Seguridad: IP Bloqueada → Alerta → Incidente
```
blocked_ips (id)
  ↓
security_alerts (blocked_ip_id)
  ↓
incidents (alert_id)
```

---

## TABLAS CON RELACIÓN A USUARIOS

**Tablas que tienen FK a `users(id)`:**
- active_sessions
- activity_logs
- alerts
- announcements
- audit_logs
- documents
- graduates
- instructors
- news
- notifications
- security_logs
- students
- tickets
- y muchas más...

---

## TOTAL DE TABLAS

**Tablas utilizadas en el proyecto:** ~107 tablas

**Distribución aproximada:**
- LMS/Académico: ~35 tablas
- Seguridad: ~8 tablas
- Soporte: ~5 tablas
- Infraestructura: ~3 tablas
- Web/Marketing: ~12 tablas
- Finanzas: ~10 tablas
- RRHH: ~8 tablas
- Gestión/Admin: ~15 tablas
- Otras (logs, auditoría, etc.): ~11 tablas

---

**NOTA:** Todas estas tablas están definidas en el archivo `dbpostgress.txt` del proyecto.
