# Decisiones Técnicas - SWAPI Favorites

**Documento de arquitectura y decisiones técnicas para el challenge SEIDOR**

## 1. Backend: Python + AWS SAM

**Decisión:** Python 3.11 con AWS SAM en lugar de Node.js o Serverless Framework.

**Razones:**
- **Simplicidad:** Python es más directo y legible que TypeScript para Lambda
- **SAM oficial:** Herramienta de primera parte de AWS, soporte garantizado
- **Un comando para todo:** `sam local start-api` para desarrollo, `sam deploy` para producción

**Alternativas consideradas:** Serverless Framework (más complejo)

## 2. Frontend: React + TypeScript + Vite

**Decisión:** React 18 con TypeScript y Vite como build tool.

**Razones:**
- **TypeScript:** Previene errores en tiempo de compilación, mejora DX
- **React:** Ecosistema maduro, component-driven development
- **Vite:** Dev server instantáneo, HMR ultra-rápido vs Create React App
- **Custom Hooks:** Reutilización de lógica (useDebounce, useFavorites, useCharacterSearch)

## 3. Frontend: Despliegue en Netlify

**Razones:**
- **Entrega rápida:** Reduce configuración operativa sin añadir complejidad innecesaria en AWS para un proyecto simple.
- **Hosting especializado:** Netlify está optimizado para SPAs estáticas, con CDN y HTTPS automáticos


## 4. Base de Datos: MariaDB con tabla simple

**Decisión:** Tabla normalizada `favorites` con constraints UNIQUE e índices.

**Schema:**
```sql
CREATE TABLE favorites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  character_id VARCHAR(10) UNIQUE,  -- Previene duplicados
  -- ... campos del personaje
  INDEX idx_character_id (character_id),
  INDEX idx_created_at (created_at)
);
```

**Razones:**
- **UNIQUE constraint:** Previene agregar el mismo favorito dos veces a nivel de DB
- **Índices:** Optimiza queries frecuentes (búsqueda por ID, ordenamiento por fecha)
- **Desnormalización controlada:** Guardamos datos del personaje para evitar llamadas a SWAPI al listar

**Trade-off:** Datos pueden desincronizarse si SWAPI los actualiza vs performance y disponibilidad

## 5. Seguridad

**Decisión:** Queries parametrizadas, validación de entrada, CORS configurado.

## 6. UX: Silent Refresh Pattern

**Decisión:** Al agregar/eliminar favoritos, no recargar toda la página sino hacer "silent refresh".

**Razón:** Evita que desaparezca todo el contenido, mejor UX, más fluido

## 7. Testing: Básico pero Efectivo

**Decisión:** Tests unitarios para funciones altamente usadas (transforms, responses, components clave).

**Backend:** pytest para servicios y responses
**Frontend:** Vitest + React Testing Library para componentes

**Razón:** Balance entre pruebas unitarias basicas y tiempo de desarrollo. Tests de integración quedan fuera del scope inicial.
