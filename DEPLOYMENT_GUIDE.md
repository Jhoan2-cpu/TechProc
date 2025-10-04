# TechProc - Guía de Deployment

## ✅ Problemas Resueltos

Se corrigieron los siguientes errores de TypeScript que impedían el build:

### 1. Error en App.tsx (Línea 241)
**Problema:** Prop `onRegisterClick` inexistente en LoginPage

**Solución:**
```typescript
// Antes (❌)
<LoginPage onLogin={handleLogin} onRegisterClick={() => {}} />

// Después (✅)
<LoginPage onLogin={handleLogin} />
```

### 2. Error en ViewCourseModal.tsx (Línea 12)
**Problema:** Import `faChartLine` no utilizado

**Solución:**
```typescript
// Removido de imports
// faChartLine, ❌
```

---

## 🚀 Deployment a Firebase Hosting

### Prerequisitos

✅ Node.js instalado (v16+)
✅ Firebase CLI instalado
✅ Proyecto Firebase configurado (`hirelink-2025`)

### Pasos para Deploy

#### 1. Verificar que estás logueado en Firebase
```bash
firebase login
```

#### 2. Build del proyecto
```bash
npm run build
```

**Output esperado:**
```
✓ built in ~11s
dist/index.html                   0.46 kB
dist/assets/index-DQRjK9Cd.css   43.15 kB
dist/assets/index-DEr-gy49.js   573.72 kB
```

#### 3. Deploy a Firebase Hosting
```bash
firebase deploy --only hosting
```

#### 4. Verificar deployment
Después del deploy exitoso, Firebase te dará una URL:
```
✔ Deploy complete!

Project Console: https://console.firebase.google.com/project/hirelink-2025/overview
Hosting URL: https://hirelink-2025.web.app
```

---

## 📁 Configuración de Firebase

### firebase.json
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### .firebaserc
```json
{
  "projects": {
    "default": "hirelink-2025"
  }
}
```

---

## ⚙️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Build
npm run build        # Compila TypeScript + Build de producción
npm run preview      # Preview del build local

# Deploy
firebase deploy --only hosting  # Deploy a Firebase Hosting
```

---

## 🔧 Solución de Problemas

### Error: "Property does not exist"
**Causa:** Props incorrectas en componentes
**Solución:** Verificar interfaces de TypeScript y props pasadas

### Error: "is declared but never read"
**Causa:** Imports no utilizados
**Solución:** Remover imports innecesarios

### Error: Build falla con errores de TypeScript
```bash
# Limpiar y reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Warning: "chunks larger than 500 kB"
**Nota:** Esto es solo una advertencia, no impide el deployment.

**Optimización (opcional):**
1. Implementar code-splitting con lazy loading
2. Configurar `manualChunks` en vite.config.ts
3. Considerar dividir módulos grandes

```typescript
// Ejemplo de lazy loading
const LMSMainPage = lazy(() => import('./modules/lms/pages/LMSMainPage'));
```

---

## 🌐 Configuración de Dominio Personalizado

### En Firebase Console

1. Ve a `Hosting` > `Add custom domain`
2. Ingresa tu dominio: `techproc.com` o `app.techproc.com`
3. Sigue las instrucciones para configurar DNS
4. Firebase configurará SSL automáticamente

### Configuración DNS (ejemplo)
```
Type: A
Name: @
Value: (IPs proporcionadas por Firebase)

Type: A
Name: www
Value: (IPs proporcionadas por Firebase)
```

---

## 📊 Monitoreo Post-Deployment

### Verificar funcionalidad:

- [ ] Login funciona correctamente
- [ ] Navegación entre módulos
- [ ] LMS carga datos
- [ ] Modales se abren correctamente
- [ ] Responsive design en móvil
- [ ] Performance (Lighthouse > 90)

### Comandos útiles:

```bash
# Ver logs de Firebase
firebase hosting:channel:list

# Rollback a versión anterior
firebase hosting:clone SOURCE:DEST

# Ver uso y estadísticas
firebase hosting:channel:deploy preview
```

---

## 🔐 Variables de Entorno (Futuro)

Cuando conectes el API backend:

### Crear archivo `.env.production`
```env
VITE_API_BASE_URL=https://api.techproc.com/v1
VITE_ENVIRONMENT=production
```

### Actualizar en código
```typescript
// src/services/api.config.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
```

---

## 📝 Checklist Pre-Deployment

- [x] Build exitoso sin errores
- [x] TypeScript sin errores
- [x] Firebase configurado
- [ ] Variables de entorno configuradas (si aplica)
- [ ] Tests pasando (cuando se implementen)
- [ ] README actualizado
- [ ] Changelog actualizado

---

## 🆘 Soporte

### Errores Comunes

| Error | Solución |
|-------|----------|
| `firebase: command not found` | `npm install -g firebase-tools` |
| `Error: HTTP Error: 403` | Re-autenticar: `firebase login --reauth` |
| `Build failed` | Verificar errores TypeScript con `npm run build` |
| `Module not found` | `npm install` |

### Contactos

- **Documentación Firebase:** https://firebase.google.com/docs/hosting
- **Documentación Vite:** https://vitejs.dev/guide/
- **Proyecto:** hirelink-2025

---

## 🎯 Próximos Pasos

1. ✅ **Deployment exitoso a Firebase**
2. ⏳ **Configurar dominio personalizado** (opcional)
3. ⏳ **Conectar API backend** (cambiar `USE_MOCK = false`)
4. ⏳ **Configurar CI/CD** (GitHub Actions)
5. ⏳ **Implementar Analytics** (Google Analytics / Firebase Analytics)
6. ⏳ **Optimizar performance** (code-splitting, lazy loading)

---

**Última actualización:** 2025-01-10
**Versión:** 1.0.0
**Estado:** ✅ Listo para producción
