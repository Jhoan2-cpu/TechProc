# Guía Completa: Migración de TechProc React a Laravel

## Índice
1. [Preparación del Proyecto Laravel](#1-preparación-del-proyecto-laravel)
2. [Configuración de Vite y React](#2-configuración-de-vite-y-react)
3. [Migración del Frontend React](#3-migración-del-frontend-react)
4. [Creación de Modelos y Migraciones](#4-creación-de-modelos-y-migraciones)
5. [Implementación de Autenticación](#5-implementación-de-autenticación)
6. [Creación de APIs](#6-creación-de-apis)
7. [Autorización y Permisos](#7-autorización-y-permisos)
8. [Configuración de Rutas](#8-configuración-de-rutas)
9. [Migración de Servicios](#9-migración-de-servicios)
10. [Testing y Debugging](#10-testing-y-debugging)

---

## 1. Preparación del Proyecto Laravel

### 1.1 Instalar Dependencias de Node.js

```bash
cd tu-proyecto-laravel

# Instalar React y dependencias principales
npm install react@18.2.0 react-dom@18.2.0
npm install react-router-dom@6.20.0
npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core

# Instalar dependencias de desarrollo
npm install -D @vitejs/plugin-react
npm install -D typescript @types/react @types/react-dom
npm install -D tailwindcss postcss autoprefixer
```

### 1.2 Configurar TypeScript

Crear `tsconfig.json` en la raíz:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./resources/js/*"]
    }
  },
  "include": ["resources/js/**/*"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Crear `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### 1.3 Configurar Vite

Editar `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
});
```

### 1.4 Configurar Tailwind CSS

```bash
npx tailwindcss init -p
```

Editar `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.tsx",
    "./resources/**/*.ts",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        accent: {
          50: '#fdf4ff',
          100: '#fae8ff',
          200: '#f5d0fe',
          300: '#f0abfc',
          400: '#e879f9',
          500: '#d946ef',
          600: '#c026d3',
          700: '#a21caf',
          800: '#86198f',
          900: '#701a75',
        },
      },
      fontFamily: {
        heading: ['Rubik', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 2. Configuración de Vite y React

### 2.1 Estructura de Carpetas

Crear la siguiente estructura en `resources/js/`:

```
resources/
├── css/
│   └── app.css
├── js/
│   ├── app.tsx                 # Punto de entrada
│   ├── App.tsx                 # Componente principal
│   ├── modules/
│   │   ├── analytics/
│   │   ├── lms/
│   │   ├── security/
│   │   ├── tickets/
│   │   ├── infrastructure/
│   │   ├── users/
│   │   └── web/
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── ProfilePage.tsx
│   ├── services/
│   │   └── api.ts
│   ├── shared/
│   │   ├── components/
│   │   ├── types/
│   │   └── utils/
│   └── types/
│       └── global.d.ts
└── views/
    └── app.blade.php
```

### 2.2 Crear Punto de Entrada

`resources/js/app.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import '../css/app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
```

### 2.3 Configurar CSS Principal

`resources/css/app.css`:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@layer base {
  * {
    box-sizing: border-box;
    font-family: 'Rubik', system-ui, sans-serif;
  }

  body {
    @apply bg-secondary-50 text-secondary-900 antialiased;
    margin: 0;
    padding: 0;
    font-family: 'Rubik', system-ui, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Rubik', sans-serif;
  }

  input, textarea, select, button {
    font-family: 'Rubik', system-ui, sans-serif;
  }

  /* Scrollbar personalizado */
  * {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }

  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 10px;
  }

  *::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #cbd5e1 0%, #94a3b8 100%);
    border-radius: 10px;
    border: 2px solid #f1f5f9;
  }
}

@layer components {
  .btn {
    @apply px-6 py-3 rounded-lg font-medium transition-all duration-300;
  }

  .btn-primary {
    @apply bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg;
  }

  .btn-secondary {
    @apply bg-secondary-600 text-white hover:bg-secondary-700 hover:shadow-lg;
  }

  .card {
    @apply bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300;
  }

  .input {
    @apply w-full px-4 py-3 rounded-lg border border-secondary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all;
  }

  .select {
    @apply w-full px-4 py-3 rounded-lg border border-secondary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none bg-white;
  }
}
```

### 2.4 Vista Blade Principal

`resources/views/app.blade.php`:

```php
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'TechProc') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

    <!-- Vite -->
    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="antialiased">
    <div id="root"></div>
</body>
</html>
```

---

## 3. Migración del Frontend React

### 3.1 Copiar Archivos React

Copiar todos los archivos desde tu proyecto actual:

```bash
# Desde tu proyecto React actual
cp -r src/modules resources/js/
cp -r src/pages resources/js/
cp -r src/shared resources/js/
cp -r src/services resources/js/
cp src/App.tsx resources/js/
```

### 3.2 Actualizar Imports

Necesitas actualizar las importaciones en todos los archivos que usen rutas absolutas:

**Antes:**
```typescript
import { User } from './shared/types/auth';
import { authService } from './services/authService';
```

**Después:**
```typescript
import { User } from '@/shared/types/auth';
import { authService } from '@/services/authService';
```

### 3.3 Script para Actualizar Imports Automáticamente

Crear un archivo `update-imports.js` en la raíz:

```javascript
const fs = require('fs');
const path = require('path');

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Reemplazar imports relativos a absolutos con @
  content = content.replace(/from ['"]\.\.\/\.\.\//g, "from '@/");
  content = content.replace(/from ['"]\.\.\//g, "from '@/");
  content = content.replace(/from ['"]\.\//g, "from '@/");

  fs.writeFileSync(filePath, content);
  console.log(`✓ Updated: ${filePath}`);
}

function traverseDirectory(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      traverseDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      updateImportsInFile(filePath);
    }
  });
}

// Ejecutar
traverseDirectory('./resources/js');
console.log('✓ All imports updated!');
```

Ejecutar:
```bash
node update-imports.js
```

---

## 4. Creación de Modelos y Migraciones

### 4.1 Modelo User (Extender el existente)

Editar `app/Models/User.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'status',
        'registration_status',
        'company',
        'phone',
        'country',
        'profile_picture',
        'last_login',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login' => 'datetime',
        'password' => 'hashed',
    ];

    // Relaciones
    public function enrolledCourses()
    {
        return $this->belongsToMany(Course::class, 'enrollments')
            ->withPivot('enrollment_date', 'progress', 'status', 'completion_date')
            ->withTimestamps();
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'requester_id');
    }

    public function assignedTickets()
    {
        return $this->hasMany(Ticket::class, 'assigned_to');
    }

    public function securityIncidents()
    {
        return $this->hasMany(SecurityIncident::class, 'affected_user_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }

    // Métodos de ayuda
    public function hasAccess($module)
    {
        $rolePermissions = [
            'super_admin' => ['users', 'lms', 'support', 'security', 'infrastructure', 'web', 'analytics'],
            'admin' => ['users', 'lms', 'support', 'web', 'analytics'],
            'instructor' => ['lms', 'support'],
            'analyst' => ['analytics', 'support'],
            'student' => ['lms'],
            'developer' => ['infrastructure', 'security', 'support', 'web'],
            'support' => ['support', 'users'],
        ];

        return in_array($module, $rolePermissions[$this->role] ?? []);
    }

    public function isAdmin()
    {
        return in_array($this->role, ['super_admin', 'admin']);
    }
}
```

### 4.2 Migración de Users

`database/migrations/xxxx_xx_xx_update_users_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'super_admin',
                'admin',
                'instructor',
                'student',
                'analyst',
                'developer',
                'support'
            ])->default('student')->after('email');

            $table->enum('status', ['active', 'inactive', 'suspended'])
                ->default('active')->after('role');

            $table->enum('registration_status', ['approved', 'pending', 'rejected'])
                ->default('approved')->after('status');

            $table->string('company')->nullable()->after('registration_status');
            $table->string('phone')->nullable()->after('company');
            $table->string('country')->nullable()->after('phone');
            $table->string('profile_picture')->nullable()->after('country');
            $table->timestamp('last_login')->nullable()->after('profile_picture');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role',
                'status',
                'registration_status',
                'company',
                'phone',
                'country',
                'profile_picture',
                'last_login'
            ]);
        });
    }
};
```

### 4.3 Crear Modelos Adicionales

#### Modelo Course

```bash
php artisan make:model Course -m
```

`app/Models/Course.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'thumbnail',
        'instructor_id',
        'category',
        'level',
        'duration_hours',
        'price',
        'status',
        'enrollment_count',
        'rating',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'price' => 'decimal:2',
        'rating' => 'decimal:1',
    ];

    public function instructor()
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot('enrollment_date', 'progress', 'status', 'completion_date')
            ->withTimestamps();
    }

    public function modules()
    {
        return $this->hasMany(CourseModule::class);
    }

    public function reviews()
    {
        return $this->hasMany(CourseReview::class);
    }
}
```

Migración `database/migrations/xxxx_create_courses_table.php`:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description');
            $table->string('thumbnail')->nullable();
            $table->foreignId('instructor_id')->constrained('users')->onDelete('cascade');
            $table->string('category');
            $table->enum('level', ['principiante', 'intermedio', 'avanzado']);
            $table->integer('duration_hours')->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->integer('enrollment_count')->default(0);
            $table->decimal('rating', 2, 1)->default(0);
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
```

#### Modelo Ticket

```bash
php artisan make:model Ticket -m
```

`app/Models/Ticket.php`:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'title',
        'description',
        'requester_id',
        'assigned_to',
        'category',
        'priority',
        'status',
        'escalation_level',
        'resolution',
        'resolved_at',
        'closed_at',
    ];

    protected $casts = [
        'resolved_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    public function requester()
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function assignedUser()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function comments()
    {
        return $this->hasMany(TicketComment::class);
    }

    public function attachments()
    {
        return $this->hasMany(TicketAttachment::class);
    }

    public function escalations()
    {
        return $this->hasMany(TicketEscalation::class);
    }
}
```

Migración:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number')->unique();
            $table->string('title');
            $table->text('description');
            $table->foreignId('requester_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('category', ['tecnico', 'academico', 'administrativo', 'otro']);
            $table->enum('priority', ['baja', 'media', 'alta', 'urgente'])->default('media');
            $table->enum('status', ['abierto', 'en_progreso', 'resuelto', 'cerrado', 'escalado'])->default('abierto');
            $table->integer('escalation_level')->default(0);
            $table->text('resolution')->nullable();
            $table->timestamp('resolved_at')->nullable();
            $table->timestamp('closed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tickets');
    }
};
```

### 4.4 Lista de Todos los Modelos Necesarios

Crear estos modelos adicionales:

```bash
# Módulo LMS
php artisan make:model CourseModule -m
php artisan make:model Lesson -m
php artisan make:model Enrollment -m
php artisan make:model CourseReview -m

# Módulo Tickets
php artisan make:model TicketComment -m
php artisan make:model TicketAttachment -m
php artisan make:model TicketEscalation -m

# Módulo Security
php artisan make:model SecurityIncident -m
php artisan make:model ActiveSession -m
php artisan make:model BlockedIP -m
php artisan make:model Backup -m

# Módulo Infrastructure
php artisan make:model Server -m
php artisan make:model License -m
php artisan make:model Storage -m
php artisan make:model Software -m
php artisan make:model Resource -m

# Módulo Web
php artisan make:model News -m
php artisan make:model Alert -m
php artisan make:model Announcement -m
php artisan make:model ContactForm -m
php artisan make:model ChatbotFAQ -m

# Módulo Analytics
php artisan make:model StudentAttendance -m
php artisan make:model StudentProgress -m
php artisan make:model StudentPerformance -m
php artisan make:model DropoutPrediction -m
php artisan make:model Report -m
```

---

## 5. Implementación de Autenticación

### 5.1 Instalar Laravel Sanctum

```bash
php artisan install:api
```

### 5.2 Configurar Sanctum

`config/sanctum.php`:

```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),
```

### 5.3 Controlador de Autenticación

`app/Http/Controllers/AuthController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        if ($user->status !== 'active') {
            throw ValidationException::withMessages([
                'email' => ['Tu cuenta está inactiva. Contacta al administrador.'],
            ]);
        }

        // Actualizar último login
        $user->update(['last_login' => now()]);

        // Crear token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'profile_picture' => $user->profile_picture,
            ],
            'token' => $token,
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'company' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company' => $validated['company'] ?? null,
            'phone' => $validated['phone'] ?? null,
            'country' => $validated['country'] ?? null,
            'role' => 'student',
            'status' => 'active',
            'registration_status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Registro exitoso. Tu cuenta está pendiente de aprobación.',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'status' => $user->status,
            'company' => $user->company,
            'phone' => $user->phone,
            'country' => $user->country,
            'profile_picture' => $user->profile_picture,
            'last_login' => $user->last_login,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'company' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'current_password' => 'required_with:new_password',
            'new_password' => 'sometimes|string|min:8|confirmed',
        ]);

        // Verificar contraseña actual si se intenta cambiar
        if (isset($validated['new_password'])) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['La contraseña actual es incorrecta.'],
                ]);
            }
            $user->password = Hash::make($validated['new_password']);
        }

        // Actualizar otros campos
        if (isset($validated['name'])) $user->name = $validated['name'];
        if (isset($validated['email'])) $user->email = $validated['email'];
        if (isset($validated['company'])) $user->company = $validated['company'];
        if (isset($validated['phone'])) $user->phone = $validated['phone'];
        if (isset($validated['country'])) $user->country = $validated['country'];

        $user->save();

        return response()->json([
            'message' => 'Perfil actualizado exitosamente',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'company' => $user->company,
                'phone' => $user->phone,
                'country' => $user->country,
            ],
        ]);
    }
}
```

### 5.4 Migrar authService.ts

`resources/js/services/authService.ts`:

```typescript
import axios from 'axios';
import type { User } from '@/shared/types/auth';

// Configurar axios
axios.defaults.baseURL = '/api';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;

// Interceptor para agregar token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de autenticación
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string): Promise<User> {
    try {
      // Obtener CSRF cookie primero
      await axios.get('/sanctum/csrf-cookie');

      const response = await axios.post('/login', { email, password });

      // Guardar token
      localStorage.setItem('auth_token', response.data.token);

      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  },

  async register(data: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    company?: string;
    phone?: string;
    country?: string;
  }): Promise<void> {
    try {
      await axios.get('/sanctum/csrf-cookie');
      await axios.post('/register', data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  },

  async logout(): Promise<void> {
    try {
      await axios.post('/logout');
      localStorage.removeItem('auth_token');
    } catch (error) {
      // Limpiar token incluso si falla
      localStorage.removeItem('auth_token');
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;

      const response = await axios.get('/me');
      return response.data;
    } catch (error) {
      localStorage.removeItem('auth_token');
      return null;
    }
  },

  async updateProfile(data: {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    country?: string;
    current_password?: string;
    new_password?: string;
    new_password_confirmation?: string;
  }): Promise<User> {
    try {
      const response = await axios.put('/profile', data);
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar perfil');
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};
```

---

## 6. Creación de APIs

### 6.1 Estructura de Controladores

Crear controladores para cada módulo:

```bash
# Módulo Users
php artisan make:controller Api/UserController --api

# Módulo LMS
php artisan make:controller Api/CourseController --api
php artisan make:controller Api/EnrollmentController
php artisan make:controller Api/LessonController

# Módulo Tickets
php artisan make:controller Api/TicketController --api
php artisan make:controller Api/TicketCommentController

# Módulo Security
php artisan make:controller Api/SecurityIncidentController --api
php artisan make:controller Api/ActiveSessionController
php artisan make:controller Api/BlockedIPController --api

# Módulo Infrastructure
php artisan make:controller Api/ServerController --api
php artisan make:controller Api/LicenseController --api
php artisan make:controller Api/StorageController --api

# Módulo Web
php artisan make:controller Api/NewsController --api
php artisan make:controller Api/AlertController --api
php artisan make:controller Api/AnnouncementController --api
php artisan make:controller Api/ContactFormController --api
php artisan make:controller Api/ChatbotFAQController --api

# Módulo Analytics
php artisan make:controller Api/AnalyticsController
```

### 6.2 Ejemplo: UserController

`app/Http/Controllers/Api/UserController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        // Ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate($request->get('per_page', 15));

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:super_admin,admin,instructor,student,analyst,developer,support',
            'status' => 'sometimes|in:active,inactive,suspended',
            'company' => 'nullable|string',
            'phone' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        $user = User::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'status' => $validated['status'] ?? 'active',
            'registration_status' => 'approved',
        ]);

        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        $user->load(['enrolledCourses', 'tickets', 'assignedTickets']);
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            'role' => 'sometimes|in:super_admin,admin,instructor,student,analyst,developer,support',
            'status' => 'sometimes|in:active,inactive,suspended',
            'company' => 'nullable|string',
            'phone' => 'nullable|string',
            'country' => 'nullable|string',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    public function destroy(User $user)
    {
        // Verificar que no sea el usuario actual
        if ($user->id === auth()->id()) {
            return response()->json([
                'message' => 'No puedes eliminar tu propia cuenta'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Usuario eliminado exitosamente'
        ]);
    }

    public function pendingRegistrations()
    {
        $users = User::where('registration_status', 'pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($users);
    }

    public function approveRegistration(User $user)
    {
        $user->update([
            'registration_status' => 'approved',
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Registro aprobado',
            'user' => $user,
        ]);
    }

    public function rejectRegistration(Request $request, User $user)
    {
        $user->update([
            'registration_status' => 'rejected',
            'status' => 'inactive',
        ]);

        // Aquí puedes enviar un email al usuario notificando el rechazo

        return response()->json([
            'message' => 'Registro rechazado',
        ]);
    }
}
```

### 6.3 Ejemplo: TicketController

`app/Http/Controllers/Api/TicketController.php`:

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TicketController extends Controller
{
    public function index(Request $request)
    {
        $query = Ticket::with(['requester', 'assignedUser']);

        // Filtros
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        if ($request->has('assigned_to')) {
            if ($request->assigned_to === 'me') {
                $query->where('assigned_to', auth()->id());
            } elseif ($request->assigned_to === 'unassigned') {
                $query->whereNull('assigned_to');
            }
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('ticket_number', 'like', '%' . $request->search . '%');
            });
        }

        $tickets = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        return response()->json($tickets);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:tecnico,academico,administrativo,otro',
            'priority' => 'sometimes|in:baja,media,alta,urgente',
        ]);

        $ticket = Ticket::create([
            ...$validated,
            'ticket_number' => 'TKT-' . strtoupper(Str::random(8)),
            'requester_id' => auth()->id(),
            'status' => 'abierto',
            'priority' => $validated['priority'] ?? 'media',
        ]);

        $ticket->load(['requester', 'assignedUser']);

        return response()->json($ticket, 201);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load([
            'requester',
            'assignedUser',
            'comments.user',
            'attachments',
            'escalations'
        ]);

        return response()->json($ticket);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|in:tecnico,academico,administrativo,otro',
            'priority' => 'sometimes|in:baja,media,alta,urgente',
            'status' => 'sometimes|in:abierto,en_progreso,resuelto,cerrado,escalado',
            'assigned_to' => 'sometimes|nullable|exists:users,id',
            'resolution' => 'sometimes|nullable|string',
        ]);

        // Si se marca como resuelto, agregar timestamp
        if (isset($validated['status']) && $validated['status'] === 'resuelto') {
            $validated['resolved_at'] = now();
        }

        // Si se cierra, agregar timestamp
        if (isset($validated['status']) && $validated['status'] === 'cerrado') {
            $validated['closed_at'] = now();
        }

        $ticket->update($validated);
        $ticket->load(['requester', 'assignedUser']);

        return response()->json($ticket);
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return response()->json([
            'message' => 'Ticket eliminado exitosamente'
        ]);
    }

    public function assignToMe(Ticket $ticket)
    {
        $ticket->update([
            'assigned_to' => auth()->id(),
            'status' => 'en_progreso',
        ]);

        $ticket->load(['requester', 'assignedUser']);

        return response()->json($ticket);
    }

    public function escalate(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'reason' => 'required|string',
        ]);

        $ticket->update([
            'status' => 'escalado',
            'escalation_level' => $ticket->escalation_level + 1,
        ]);

        // Crear registro de escalación
        $ticket->escalations()->create([
            'escalated_by' => auth()->id(),
            'reason' => $validated['reason'],
            'escalation_level' => $ticket->escalation_level,
        ]);

        return response()->json($ticket);
    }
}
```

### 6.4 Crear Service API para React

`resources/js/services/api.ts`:

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Users API
export const usersApi = {
  getAll: (params?: any) => api.get('/users', { params }),
  getOne: (id: number) => api.get(`/users/${id}`),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  delete: (id: number) => api.delete(`/users/${id}`),
  getPending: () => api.get('/users/pending-registrations'),
  approve: (id: number) => api.post(`/users/${id}/approve`),
  reject: (id: number) => api.post(`/users/${id}/reject`),
};

// Tickets API
export const ticketsApi = {
  getAll: (params?: any) => api.get('/tickets', { params }),
  getOne: (id: number) => api.get(`/tickets/${id}`),
  create: (data: any) => api.post('/tickets', data),
  update: (id: number, data: any) => api.put(`/tickets/${id}`, data),
  delete: (id: number) => api.delete(`/tickets/${id}`),
  assignToMe: (id: number) => api.post(`/tickets/${id}/assign-to-me`),
  escalate: (id: number, reason: string) => api.post(`/tickets/${id}/escalate`, { reason }),
  addComment: (id: number, comment: string) => api.post(`/tickets/${id}/comments`, { comment }),
};

// Courses API
export const coursesApi = {
  getAll: (params?: any) => api.get('/courses', { params }),
  getOne: (id: number) => api.get(`/courses/${id}`),
  create: (data: any) => api.post('/courses', data),
  update: (id: number, data: any) => api.put(`/courses/${id}`, data),
  delete: (id: number) => api.delete(`/courses/${id}`),
  enroll: (id: number) => api.post(`/courses/${id}/enroll`),
  unenroll: (id: number) => api.post(`/courses/${id}/unenroll`),
};

// Security API
export const securityApi = {
  getIncidents: (params?: any) => api.get('/security/incidents', { params }),
  getSessions: () => api.get('/security/sessions'),
  terminateSession: (id: number) => api.delete(`/security/sessions/${id}`),
  getBlockedIPs: () => api.get('/security/blocked-ips'),
  blockIP: (ip: string, reason: string) => api.post('/security/blocked-ips', { ip, reason }),
  unblockIP: (id: number) => api.delete(`/security/blocked-ips/${id}`),
  getBackups: () => api.get('/security/backups'),
  createBackup: () => api.post('/security/backups'),
};

// Infrastructure API
export const infrastructureApi = {
  getServers: () => api.get('/infrastructure/servers'),
  getLicenses: () => api.get('/infrastructure/licenses'),
  getStorage: () => api.get('/infrastructure/storage'),
  getSoftware: () => api.get('/infrastructure/software'),
  getResources: () => api.get('/infrastructure/resources'),
};

// Web API
export const webApi = {
  getNews: (params?: any) => api.get('/web/news', { params }),
  createNews: (data: any) => api.post('/web/news', data),
  updateNews: (id: number, data: any) => api.put(`/web/news/${id}`, data),
  deleteNews: (id: number) => api.delete(`/web/news/${id}`),

  getAlerts: () => api.get('/web/alerts'),
  createAlert: (data: any) => api.post('/web/alerts', data),
  updateAlert: (id: number, data: any) => api.put(`/web/alerts/${id}`, data),
  deleteAlert: (id: number) => api.delete(`/web/alerts/${id}`),

  getAnnouncements: () => api.get('/web/announcements'),
  getContacts: (params?: any) => api.get('/web/contacts', { params }),
  respondContact: (id: number, response: string) => api.post(`/web/contacts/${id}/respond`, { response }),

  getFAQs: () => api.get('/web/chatbot/faqs'),
  createFAQ: (data: any) => api.post('/web/chatbot/faqs', data),
  updateFAQ: (id: number, data: any) => api.put(`/web/chatbot/faqs/${id}`, data),
  deleteFAQ: (id: number) => api.delete(`/web/chatbot/faqs/${id}`),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getAttendance: (params?: any) => api.get('/analytics/attendance', { params }),
  getProgress: (params?: any) => api.get('/analytics/progress', { params }),
  getPerformance: (params?: any) => api.get('/analytics/performance', { params }),
  getDropoutPredictions: () => api.get('/analytics/dropout'),
  getReports: () => api.get('/analytics/reports'),
  generateReport: (data: any) => api.post('/analytics/reports', data),
  downloadReport: (id: number) => api.get(`/analytics/reports/${id}/download`, { responseType: 'blob' }),
};

export default api;
```

---

## 7. Autorización y Permisos

### 7.1 Crear Policies

```bash
php artisan make:policy UserPolicy --model=User
php artisan make:policy TicketPolicy --model=Ticket
php artisan make:policy CoursePolicy --model=Course
```

### 7.2 Ejemplo: UserPolicy

`app/Policies/UserPolicy.php`:

```php
<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasAccess('users');
    }

    public function view(User $user, User $model): bool
    {
        return $user->hasAccess('users') || $user->id === $model->id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin']);
    }

    public function update(User $user, User $model): bool
    {
        // Super admin puede actualizar a todos
        if ($user->role === 'super_admin') {
            return true;
        }

        // Admin puede actualizar a usuarios no-admin
        if ($user->role === 'admin' && !in_array($model->role, ['super_admin', 'admin'])) {
            return true;
        }

        // Usuarios pueden actualizar su propio perfil
        return $user->id === $model->id;
    }

    public function delete(User $user, User $model): bool
    {
        // No puede eliminarse a sí mismo
        if ($user->id === $model->id) {
            return false;
        }

        // Solo super_admin y admin pueden eliminar
        if (in_array($user->role, ['super_admin', 'admin'])) {
            // Admin no puede eliminar super_admin
            if ($user->role === 'admin' && $model->role === 'super_admin') {
                return false;
            }
            return true;
        }

        return false;
    }

    public function approveRegistrations(User $user): bool
    {
        return in_array($user->role, ['super_admin', 'admin', 'support']);
    }
}
```

### 7.3 Registrar Policies

`app/Providers/AuthServiceProvider.php`:

```php
<?php

namespace App\Providers;

use App\Models\User;
use App\Models\Ticket;
use App\Models\Course;
use App\Policies\UserPolicy;
use App\Policies\TicketPolicy;
use App\Policies\CoursePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        User::class => UserPolicy::class,
        Ticket::class => TicketPolicy::class,
        Course::class => CoursePolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
```

### 7.4 Middleware de Acceso a Módulos

`app/Http/Middleware/CheckModuleAccess.php`:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckModuleAccess
{
    public function handle(Request $request, Closure $next, string $module): Response
    {
        if (!$request->user()->hasAccess($module)) {
            return response()->json([
                'message' => 'No tienes acceso a este módulo'
            ], 403);
        }

        return $next($request);
    }
}
```

Registrar en `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'module.access' => \App\Http\Middleware\CheckModuleAccess::class,
    ]);
})
```

---

## 8. Configuración de Rutas

### 8.1 Rutas de API

`routes/api.php`:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\SecurityIncidentController;
use App\Http\Controllers\Api\ActiveSessionController;
use App\Http\Controllers\Api\BlockedIPController;
use App\Http\Controllers\Api\ServerController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\AlertController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\ContactFormController;
use App\Http\Controllers\Api\ChatbotFAQController;
use App\Http\Controllers\Api\AnalyticsController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);

    // Users Module
    Route::middleware('module.access:users')->group(function () {
        Route::apiResource('users', UserController::class);
        Route::get('users/pending-registrations', [UserController::class, 'pendingRegistrations']);
        Route::post('users/{user}/approve', [UserController::class, 'approveRegistration']);
        Route::post('users/{user}/reject', [UserController::class, 'rejectRegistration']);
    });

    // LMS Module
    Route::middleware('module.access:lms')->group(function () {
        Route::apiResource('courses', CourseController::class);
        Route::post('courses/{course}/enroll', [CourseController::class, 'enroll']);
        Route::post('courses/{course}/unenroll', [CourseController::class, 'unenroll']);
        Route::get('courses/{course}/students', [CourseController::class, 'students']);
        Route::get('courses/{course}/modules', [CourseController::class, 'modules']);
    });

    // Support Module
    Route::middleware('module.access:support')->group(function () {
        Route::apiResource('tickets', TicketController::class);
        Route::post('tickets/{ticket}/assign-to-me', [TicketController::class, 'assignToMe']);
        Route::post('tickets/{ticket}/escalate', [TicketController::class, 'escalate']);
        Route::post('tickets/{ticket}/comments', [TicketController::class, 'addComment']);
        Route::get('tickets/{ticket}/comments', [TicketController::class, 'getComments']);
    });

    // Security Module
    Route::middleware('module.access:security')->prefix('security')->group(function () {
        Route::apiResource('incidents', SecurityIncidentController::class);
        Route::get('sessions', [ActiveSessionController::class, 'index']);
        Route::delete('sessions/{session}', [ActiveSessionController::class, 'destroy']);
        Route::apiResource('blocked-ips', BlockedIPController::class);
        Route::apiResource('blocked-users', UserController::class)->only(['index', 'show']);
        Route::get('backups', [BackupController::class, 'index']);
        Route::post('backups', [BackupController::class, 'store']);
    });

    // Infrastructure Module
    Route::middleware('module.access:infrastructure')->prefix('infrastructure')->group(function () {
        Route::apiResource('servers', ServerController::class);
        Route::apiResource('licenses', LicenseController::class);
        Route::apiResource('storage', StorageController::class);
        Route::apiResource('software', SoftwareController::class);
        Route::apiResource('resources', ResourceController::class);
    });

    // Web Module
    Route::middleware('module.access:web')->prefix('web')->group(function () {
        Route::apiResource('news', NewsController::class);
        Route::apiResource('alerts', AlertController::class);
        Route::apiResource('announcements', AnnouncementController::class);
        Route::apiResource('contacts', ContactFormController::class);
        Route::post('contacts/{contact}/respond', [ContactFormController::class, 'respond']);
        Route::apiResource('chatbot/faqs', ChatbotFAQController::class);
    });

    // Analytics Module
    Route::middleware('module.access:analytics')->prefix('analytics')->group(function () {
        Route::get('dashboard', [AnalyticsController::class, 'dashboard']);
        Route::get('attendance', [AnalyticsController::class, 'attendance']);
        Route::get('progress', [AnalyticsController::class, 'progress']);
        Route::get('performance', [AnalyticsController::class, 'performance']);
        Route::get('dropout', [AnalyticsController::class, 'dropout']);
        Route::get('reports', [AnalyticsController::class, 'reports']);
        Route::post('reports', [AnalyticsController::class, 'generateReport']);
        Route::get('reports/{report}/download', [AnalyticsController::class, 'downloadReport']);
    });
});
```

### 8.2 Rutas Web

`routes/web.php`:

```php
<?php

use Illuminate\Support\Facades\Route;

// SPA catch-all route
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
```

---

## 9. Migración de Servicios

### 9.1 Reemplazar Mock Data

En tus componentes React, reemplaza los datos mock por llamadas a la API:

**Antes (UsersPage.tsx):**
```typescript
const mockUsers: User[] = [
  // ... datos mock
];

const [users, setUsers] = useState<User[]>(mockUsers);
```

**Después:**
```typescript
import { usersApi } from '@/services/api';

const [users, setUsers] = useState<User[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll({ status: filterStatus });
      setUsers(response.data.data); // Laravel pagination
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [filterStatus]);
```

### 9.2 Manejo de Estados de Carga

Crear un hook personalizado para manejar estados:

`resources/js/shared/hooks/useApi.ts`:

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
  initialData?: T;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction(...args);
        const responseData = response.data;
        setData(responseData);
        options.onSuccess?.(responseData);
        return responseData;
      } catch (err: any) {
        setError(err);
        options.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  return { data, loading, error, execute };
}

// Hook para fetch automático
export function useApiFetch<T>(
  apiFunction: () => Promise<any>,
  dependencies: any[] = [],
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiFunction();
        const responseData = response.data;
        setData(responseData);
        options.onSuccess?.(responseData);
      } catch (err: any) {
        setError(err);
        options.onError?.(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => {} };
}
```

Uso:

```typescript
import { useApiFetch } from '@/shared/hooks/useApi';
import { usersApi } from '@/services/api';

function UsersPage() {
  const { data: users, loading, error } = useApiFetch(
    () => usersApi.getAll(),
    []
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {users?.data.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

---

## 10. Testing y Debugging

### 10.1 Compilar Assets

```bash
# Desarrollo
npm run dev

# Producción
npm run build
```

### 10.2 Ejecutar Migraciones

```bash
php artisan migrate:fresh --seed
```

### 10.3 Crear Seeders

`database/seeders/DatabaseSeeder.php`:

```php
<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@techproc.com',
            'password' => Hash::make('password'),
            'role' => 'super_admin',
            'status' => 'active',
            'registration_status' => 'approved',
        ]);

        // Admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin2@techproc.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
            'registration_status' => 'approved',
        ]);

        // Instructor
        User::create([
            'name' => 'Instructor Demo',
            'email' => 'instructor@techproc.com',
            'password' => Hash::make('password'),
            'role' => 'instructor',
            'status' => 'active',
            'registration_status' => 'approved',
        ]);

        // Student
        User::create([
            'name' => 'Student Demo',
            'email' => 'student@techproc.com',
            'password' => Hash::make('password'),
            'role' => 'student',
            'status' => 'active',
            'registration_status' => 'approved',
        ]);

        $this->call([
            CourseSeeder::class,
            TicketSeeder::class,
            // ... otros seeders
        ]);
    }
}
```

### 10.4 Verificar Funcionamiento

```bash
# Iniciar servidor
php artisan serve

# En otra terminal, iniciar Vite
npm run dev
```

Visitar: http://localhost:8000

### 10.5 Debugging Común

**Problema: CORS errors**
```php
// config/cors.php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:8000'],
```

**Problema: 419 CSRF token mismatch**
```typescript
// Asegurarse de llamar csrf-cookie antes del login
await axios.get('/sanctum/csrf-cookie');
```

**Problema: Assets no cargan**
```bash
# Limpiar cache
php artisan optimize:clear
npm run build
```

---

## Checklist de Migración

- [ ] 1. Instalar dependencias Node.js
- [ ] 2. Configurar TypeScript y Vite
- [ ] 3. Configurar Tailwind CSS
- [ ] 4. Copiar archivos React a resources/js/
- [ ] 5. Actualizar imports a usar @/
- [ ] 6. Crear vista Blade principal
- [ ] 7. Actualizar migraciones de users
- [ ] 8. Crear todos los modelos necesarios
- [ ] 9. Crear migraciones para cada módulo
- [ ] 10. Instalar Laravel Sanctum
- [ ] 11. Crear AuthController
- [ ] 12. Migrar authService.ts
- [ ] 13. Crear todos los controladores API
- [ ] 14. Crear Policies para autorización
- [ ] 15. Configurar rutas API
- [ ] 16. Configurar rutas Web (catch-all)
- [ ] 17. Crear service api.ts para React
- [ ] 18. Reemplazar mock data con API calls
- [ ] 19. Crear hooks personalizados (useApi)
- [ ] 20. Crear seeders para testing
- [ ] 21. Ejecutar migraciones
- [ ] 22. Compilar assets
- [ ] 23. Testing de autenticación
- [ ] 24. Testing de cada módulo
- [ ] 25. Optimización y deployment

---

## Comandos Útiles

```bash
# Crear modelo con migración, factory y seeder
php artisan make:model NombreModelo -mfs

# Crear controlador API
php artisan make:controller Api/NombreController --api

# Crear policy
php artisan make:policy NombrePolicy --model=Modelo

# Ejecutar migraciones
php artisan migrate
php artisan migrate:fresh --seed

# Limpiar cache
php artisan optimize:clear

# Compilar assets
npm run dev      # Desarrollo con HMR
npm run build    # Producción

# Ejecutar tests
php artisan test
npm run test
```

---

## Próximos Pasos

1. **Implementar todos los modelos y migraciones**
2. **Crear controladores para cada módulo**
3. **Migrar componentes React paulatinamente**
4. **Testing exhaustivo de cada módulo**
5. **Optimización de queries (Eager Loading)**
6. **Implementar caché para mejorar performance**
7. **Configurar queues para tareas pesadas**
8. **Implementar logging y monitoreo**
9. **Configurar CI/CD**
10. **Deployment a producción**

---

## Recursos Adicionales

- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Vite Laravel Plugin](https://laravel.com/docs/vite)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Notas Finales:**

Esta migración requiere tiempo y paciencia. Se recomienda migrar módulo por módulo, empezando por el más simple (por ejemplo, Users) y avanzar hacia los más complejos. Mantén el proyecto React original funcionando mientras migras para poder hacer comparaciones y testing.
