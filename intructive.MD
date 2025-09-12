# Documentación Técnica: Sistema de Hospital con DDD y Arquitectura Hexagonal

## 📋 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Contextos Delimitados (Bounded Contexts)](#contextos-delimitados)
3. [Agregados y Entidades](#agregados-y-entidades)
4. [Value Objects](#value-objects)
5. [Servicios de Dominio](#servicios-de-dominio)
6. [Eventos de Dominio](#eventos-de-dominio)
7. [Sistema de Autenticación](#sistema-de-autenticación)
8. [Estructura del Proyecto](#estructura-del-proyecto)

---

## 🏗️ Arquitectura General

**Arquitectura Hexagonal con DDD** organizada en módulos por contexto delimitado.

```
src/
├── core/                          # Dominio Principal (Core Domain)
├── support/                       # Subdominios de Soporte
├── shared/                        # Kernel Compartido
└── apps/                          # Puntos de Entrada
```

---

## 🧭 Contextos Delimitados

### 1. **Gestión de Citas (Appointment Management)**
- **Responsabilidad**: Programación y gestión de citas médicas
- **Agregado Principal**: `Appointment`
- **Lenguaje Ubicuo**: Cita, Programación, Disponibilidad

### 2. **Urgencias y Emergencias (Emergency Care)**
- **Responsabilidad**: Atención de casos urgentes y triaje
- **Agregado Principal**: `EmergencyEpisode`
- **Lenguaje Ubicuo**: Triaje, Episodio, Urgencia

### 3. **Historia Clínica (Medical Records)**
- **Responsabilidad**: Gestión integral de historiales médicos
- **Agregado Principal**: `MedicalRecord`
- **Lenguaje Ubicuo**: Diagnóstico, Tratamiento, Historial

### 4. **Gestión de Recursos (Resource Management)**
- **Responsabilidad**: Administración de habitaciones, camas y personal
- **Agregados Principales**: `Room`, `Bed`, `Doctor`, `Nurse`
- **Lenguaje Ubicuo**: Habitación, Cama, Turno, Especialidad

### 5. **Facturación (Billing)**
- **Responsabilidad**: Gestión de facturas y pagos
- **Agregado Principal**: `Invoice`
- **Lenguaje Ubicuo**: Factura, Pago, Concepto

### 6. **Autenticación y Autorización (Auth)**
- **Responsabilidad**: Gestión de usuarios y permisos
- **Agregados Principales**: `User`, `Role`, `Permission`
- **Lenguaje Ubicuo**: Usuario, Rol, Permiso, Autenticación

---

## 🧩 Agregados y Entidades

### Core Domain
| Entidad | Contexto | Responsabilidad |
|---------|----------|-----------------|
| `Patient` | Todos | Representa a un paciente del sistema |
| `Appointment` | Citas | Gestiona las citas programadas |
| `EmergencyEpisode` | Urgencias | Maneja episodios de emergencia |
| `MedicalRecord` | Historia Clínica | Contiene el historial médico completo |

### Support Subdomains
| Entidad | Contexto | Responsabilidad |
|---------|----------|-----------------|
| `Doctor` | Recursos | Personal médico con especialidades |
| `Nurse` | Recursos | Personal de enfermería |
| `Room` | Recursos | Habitaciones del hospital |
| `Bed` | Recursos | Camas asignables |
| `Invoice` | Facturación | Facturas y cargos |

### Authentication
| Entidad | Contexto | Responsabilidad |
|---------|----------|-----------------|
| `User` | Auth | Usuarios del sistema |
| `Role` | Auth | Roles de permisos |
| `Permission` | Auth | Permisos específicos |

---

## 🎯 Value Objects

### Identificadores
- `PatientId`, `AppointmentId`, `EmergencyEpisodeId`, `MedicalRecordId`
- `DoctorId`, `NurseId`, `RoomId`, `BedId`, `InvoiceId`
- `UserId`, `RoleId`, `PermissionId`

### Datos Personales
- `FullName` (Nombre + Apellido)
- `DateOfBirth` (Fecha nacimiento)
- `DNI` (Documento identidad)
- `ContactInfo` (Email + Teléfono)
- `Address` (Dirección completa)

### Médicos
- `AppointmentStatus` (Programada/Confirmada/Cancelada/Completada)
- `TimeSlot` (Franja horaria)
- `AppointmentType` (Tipo de cita)
- `TriageLevel` (Nivel de urgencia)
- `PainScale` (Escala dolor 0-10)
- `VitalSigns` (Signos vitales)
- `BloodType` (Grupo sanguíneo)
- `Allergies` (Alergias)

### Recursos
- `Specialty` (Especialidad médica)
- `Shift` (Turno de trabajo)
- `LicenseNumber` (Número colegiado)
- `RoomNumber` (Número habitación)
- `RoomType` (Tipo habitación)
- `RoomStatus` (Estado habitación)

### Facturación
- `InvoiceStatus` (Estado factura)
- `Currency` (Moneda)
- `InvoiceItem` (Concepto factura)
- `Money` (Cantidad + moneda)

### Autenticación
- `Username` (Nombre usuario)
- `PasswordHash` (Hash contraseña)
- `JWTToken` (Token JWT)
- `RefreshToken` (Token refresco)

---

## ⚙️ Servicios de Dominio

### Gestión de Citas
- `AppointmentSchedulerService`: Coordina la programación de citas

### Urgencias
- `TriageService`: Gestiona el proceso de triaje
- `EmergencyCoordinatorService`: Coordina recursos en urgencias

### Historia Clínica
- `MedicalRecordService`: Gestiona historiales médicos

### Recursos
- `RoomAssignmentService`: Asigna habitaciones y camas
- `StaffAssignmentService`: Gestiona asignación de personal

### Facturación
- `BillingService`: Genera y gestiona facturas
- `PaymentProcessingService`: Procesa pagos

### Autenticación
- `AuthenticationService`: Gestiona autenticación
- `AuthorizationService`: Gestiona autorización
- `PasswordService`: Gestiona contraseñas
- `TokenService`: Gestiona tokens JWT

---

## 📢 Eventos de Dominio

### Pacientes y Citas
- `PatientRegisteredEvent`
- `AppointmentScheduledEvent`
- `AppointmentCancelledEvent`

### Urgencias
- `EmergencyAdmissionEvent`
- `TriageCompletedEvent`
- `DiagnosisMadeEvent`
- `TreatmentPrescribedEvent`

### Tratamientos
- `MedicationAdministeredEvent`
- `LabResultsReadyEvent`
- `PatientDischargedEvent`

### Recursos
- `RoomAssignedEvent`
- `SurgeryScheduledEvent`

### Facturación
- `InvoiceGeneratedEvent`
- `PaymentReceivedEvent`

### Autenticación
- `UserRegisteredEvent`
- `UserLoggedInEvent`
- `UserPasswordChangedEvent`
- `RoleAssignedEvent`

---

## 🔐 Sistema de Autenticación

### Entidades
- `User`: Usuarios del sistema
- `Role`: Roles de permisos
- `Permission`: Permisos específicos

### Value Objects
- `UserId`, `RoleId`, `PermissionId`
- `Username`, `PasswordHash`, `Email`
- `JWTToken`, `RefreshToken`

### Servicios
- `AuthenticationService`: Login/logout
- `AuthorizationService`: Control de acceso
- `PasswordService`: Hashing de contraseñas
- `TokenService`: Gestión de tokens

### Eventos
- `UserRegisteredEvent`
- `UserLoggedInEvent`
- `UserPasswordChangedEvent`
- `RoleAssignedEvent`
- `PermissionGrantedEvent`

### Políticas
- `PasswordComplexityPolicy`: Reglas complejidad contraseñas
- `TokenExpirationPolicy`: Expiración de tokens
- `RoleBasedAccessPolicy`: Control acceso por roles

---

## 📁 Estructura del Proyecto

```
src/
├── core/
│   ├── appointment/               # Contexto: Citas
│   ├── emergency/                 # Contexto: Urgencias
│   ├── medical-record/           # Contexto: Historia Clínica
│   └── patient/                  # Contexto: Pacientes
├── support/
│   ├── billing/                  # Contexto: Facturación
│   ├── resource/                 # Contexto: Recursos
│   └── auth/                     # Contexto: Autenticación
├── shared/
│   ├── domain/                   # VO compartidos
│   ├── infrastructure/           # Utilidades compartidas
│   └── kernel/                   # Kernel compartido
└── apps/
    ├── api/                      # API REST
    ├── worker/                   # Background workers
    └── cli/                      # Herramientas CLI
```

---

## 🚀 Próximos Pasos para Desarrollo

1. **Configurar estructura de proyectos** con los módulos descritos
2. **Implementar Shared Kernel** con VOs base
3. **Cear contextos delimitados** como módulos independientes
4. **Implementar agregados principales** (Patient, Appointment, etc.)
5. **Desarrollar servicios de dominio** para cada contexto
6. **Configurar sistema de eventos** entre contextos
7. **Implementar autenticación** como contexto separado
8. **Crear APIs** para cada contexto delimitado

Cada contexto debe ser desarrollado como un módulo independiente con su propia capa de aplicación, dominio e infraestructura.