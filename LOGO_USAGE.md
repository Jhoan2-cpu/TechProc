# Guía de Uso del Logo en TechProc

## Ubicación de los Archivos

Coloca tus archivos de logo en el directorio `public/`:

```
TechProc/
├── public/
│   ├── logo.png              # Logo con fondo
│   ├── logo-transparent.png  # Logo sin fondo (RECOMENDADO)
│   └── favicon.ico           # También puedes agregar el favicon aquí
├── src/
└── ...
```

## ¿Por qué en `public/`?

- Los archivos en `public/` son accesibles directamente mediante rutas absolutas
- No pasan por el bundler de Vite, se sirven tal cual
- Son accesibles como `/logo.png`, `/logo-transparent.png`, etc.
- Útil para imágenes estáticas que no cambian

## Uso en el Proyecto

### 1. Sidebar (App.tsx)

**Ubicación:** `src/App.tsx` línea 217-229

```tsx
<div className="p-6 border-b border-secondary-200 flex-shrink-0">
  <div className="flex items-center gap-3">
    <img
      src="/logo-transparent.png"
      alt="TechProc Logo"
      className="h-10 w-auto"
    />
    <div>
      <h1 className="text-2xl font-heading font-bold text-gradient">TechProc</h1>
      <p className="text-sm text-secondary-600 mt-1">Sistema Modular</p>
    </div>
  </div>
</div>
```

**Características:**
- Tamaño: `h-10` (40px de altura)
- Logo sin fondo (transparente)
- Alineado con el texto

### 2. Login Page - Selección de Perfil

**Ubicación:** `src/pages/LoginPage.tsx` línea 197-212

```tsx
<div className="text-center mb-12 animate-slide-down">
  <div className="inline-block mb-6">
    <img
      src="/logo-transparent.png"
      alt="TechProc Logo"
      className="h-24 w-auto mx-auto"
    />
  </div>
  <h1 className="text-5xl font-heading font-bold text-gradient mb-4">
    TechProc
  </h1>
  <p className="text-secondary-600 text-lg font-medium">
    Sistema de Gestión Modular
  </p>
  <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full"></div>
</div>
```

**Características:**
- Tamaño: `h-24` (96px de altura)
- Logo sin fondo (transparente)
- Centrado con `mx-auto`

### 3. Login Page - Formulario

**Ubicación:** `src/pages/LoginPage.tsx` línea 286-301

```tsx
<div className="text-center mb-8 animate-slide-down">
  <div className="inline-block mb-6">
    <img
      src="/logo-transparent.png"
      alt="TechProc Logo"
      className="h-20 w-auto mx-auto"
    />
  </div>
  <h1 className="text-5xl font-heading font-bold text-gradient mb-4">
    TechProc
  </h1>
  <p className="text-secondary-600 text-lg font-medium">
    Sistema de Gestión Modular
  </p>
  <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto mt-4 rounded-full"></div>
</div>
```

**Características:**
- Tamaño: `h-20` (80px de altura)
- Logo sin fondo (transparente)
- Centrado con `mx-auto`

### 4. Register Page

**Ubicación:** `src/pages/RegisterPage.tsx` línea 190-203

```tsx
<div className="text-center mb-8 animate-slide-down">
  <div className="inline-block mb-4">
    <img
      src="/logo-transparent.png"
      alt="TechProc Logo"
      className="h-16 w-auto mx-auto"
    />
  </div>
  <h1 className="text-4xl font-heading font-bold text-gradient mb-2">
    Registro de Usuario
  </h1>
  <p className="text-secondary-600">
    Complete el formulario para solicitar acceso al sistema
  </p>
</div>
```

**Características:**
- Tamaño: `h-16` (64px de altura)
- Logo sin fondo (transparente)
- Centrado con `mx-auto`

## Favicon (index.html)

También puedes actualizar el favicon en `index.html`:

```html
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <!-- O usar PNG -->
  <link rel="icon" type="image/png" href="/logo-transparent.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <!-- ... -->
</head>
```

## Tamaños Recomendados para los Logos

Para mejor rendimiento y calidad visual:

### Logo Transparente (logo-transparent.png)
- **Resolución recomendada:** 512x512px o superior
- **Formato:** PNG con transparencia
- **Uso:** Toda la aplicación

### Logo con Fondo (logo.png)
- **Resolución recomendada:** 512x512px o superior
- **Formato:** PNG o JPG
- **Uso:** Emails, documentos, presentaciones

### Favicon
- **Tamaños múltiples recomendados:**
  - 16x16px
  - 32x32px
  - 48x48px
  - 64x64px
- **Formato:** ICO o PNG

## Crear Favicon desde PNG

Si tienes un PNG, puedes convertirlo a favicon.ico usando:

### Online:
- https://www.favicon-generator.org/
- https://realfavicongenerator.net/

### Comando (si tienes ImageMagick):
```bash
convert logo-transparent.png -resize 32x32 favicon.ico
```

## Variantes del Logo

Puedes agregar más variantes según necesites:

```
public/
├── logo-transparent.png      # Logo sin fondo (principal)
├── logo-white.png           # Logo blanco (para fondos oscuros)
├── logo-dark.png            # Logo oscuro (para fondos claros)
├── logo-full.png            # Logo con nombre completo
├── logo-icon.png            # Solo el ícono sin texto
└── favicon.ico              # Favicon
```

## Ejemplo de Uso con Logo con Fondo

Si quieres usar el logo con fondo en alguna parte:

```tsx
<img
  src="/logo.png"
  alt="TechProc Logo"
  className="h-12 w-auto"
/>
```

## Responsive - Ajustar Tamaño según Pantalla

```tsx
<img
  src="/logo-transparent.png"
  alt="TechProc Logo"
  className="h-8 md:h-10 lg:h-12 w-auto"
/>
```

Esto hace que el logo sea:
- 32px en móvil (h-8)
- 40px en tablet (md:h-10)
- 48px en desktop (lg:h-12)

## Animaciones del Logo

Puedes agregar animaciones al logo:

### Fade In
```tsx
<img
  src="/logo-transparent.png"
  alt="TechProc Logo"
  className="h-10 w-auto animate-fade-in"
/>
```

### Bounce on Hover
```tsx
<img
  src="/logo-transparent.png"
  alt="TechProc Logo"
  className="h-10 w-auto hover:scale-110 transition-transform duration-300"
/>
```

### Spin (para loaders)
```tsx
<img
  src="/logo-transparent.png"
  alt="TechProc Logo"
  className="h-10 w-auto animate-spin"
/>
```

## Usar el Logo en Componentes

Si quieres crear un componente reutilizable para el logo:

### `src/shared/components/Logo.tsx`

```tsx
interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'transparent' | 'full';
  className?: string;
}

export const Logo = ({ size = 'md', variant = 'transparent', className = '' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-24',
  };

  const logoSrc = variant === 'transparent' ? '/logo-transparent.png' : '/logo.png';

  return (
    <img
      src={logoSrc}
      alt="TechProc Logo"
      className={`w-auto ${sizeClasses[size]} ${className}`}
    />
  );
};
```

### Uso del Componente

```tsx
import { Logo } from '@/shared/components/Logo';

// En tu componente
<Logo size="lg" variant="transparent" />
<Logo size="md" />
<Logo size="xl" className="hover:scale-110 transition-transform" />
```

## Formato de Imagen Optimizado

Para mejor rendimiento, considera usar formatos modernos:

### WebP (mejor compresión)
```tsx
<picture>
  <source srcSet="/logo-transparent.webp" type="image/webp" />
  <img src="/logo-transparent.png" alt="TechProc Logo" className="h-10 w-auto" />
</picture>
```

### Lazy Loading
```tsx
<img
  src="/logo-transparent.png"
  alt="TechProc Logo"
  className="h-10 w-auto"
  loading="lazy"
/>
```

## Consideraciones de Accesibilidad

- Siempre incluye el atributo `alt` descriptivo
- Usa `alt=""` solo si el logo es decorativo
- Para logos que son enlaces, asegúrate de que el texto alternativo sea descriptivo

```tsx
<a href="/" aria-label="Ir a la página de inicio">
  <img
    src="/logo-transparent.png"
    alt="TechProc - Sistema de Gestión Modular"
    className="h-10 w-auto"
  />
</a>
```

## Verificar que Funciona

1. Coloca tus archivos PNG en `public/`
2. Reinicia el servidor de desarrollo (npm run dev)
3. Visita http://localhost:5173
4. Verifica que el logo aparece en:
   - Página de login (selección de perfil)
   - Página de login (formulario)
   - Página de registro
   - Sidebar de la aplicación

## Troubleshooting

### El logo no aparece

**Problema:** Ruta incorrecta
**Solución:** Asegúrate de usar `/logo-transparent.png` (con `/` al inicio)

**Problema:** Archivo no encontrado
**Solución:** Verifica que el archivo esté en `public/` (no en `src/`)

**Problema:** Cache del navegador
**Solución:** Refresca con Ctrl+Shift+R (Windows/Linux) o Cmd+Shift+R (Mac)

### El logo se ve pixelado

**Problema:** Imagen muy pequeña
**Solución:** Usa una imagen de al menos 512x512px

**Problema:** Formato incorrecto
**Solución:** Usa PNG con transparencia y alta resolución

### El logo no se centra

**Problema:** Falta clase de alineación
**Solución:** Agrega `mx-auto` para centrar horizontalmente

```tsx
<img
  src="/logo-transparent.png"
  alt="TechProc Logo"
  className="h-10 w-auto mx-auto"
/>
```

---

## Resumen Rápido

✅ **Ubicación:** `public/logo-transparent.png`
✅ **Acceso:** `/logo-transparent.png` (con `/` al inicio)
✅ **Formato:** PNG con transparencia
✅ **Resolución:** 512x512px o superior
✅ **Ubicaciones en el código:** App.tsx (sidebar), LoginPage.tsx (2 lugares), RegisterPage.tsx

**¡Listo para usar! Solo coloca tus archivos PNG en `public/` y reinicia el servidor.**
