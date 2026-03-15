# SWAPI Favorites - Gestor de Personajes Favoritos de Star Wars

## 📋 Descripción

SWAPI Favorites permite buscar personajes del universo Star Wars utilizando la API SWAPI, guardar tus favoritos en una base de datos, y gestionarlos con paginación.

![Tests](https://github.com/Denwort/swapi_aws/actions/workflows/test.yml/badge.svg)

## 🛠️ Tecnologías Utilizadas

### Backend
- **Python 3.11** - Lenguaje de programación
- **AWS SAM** - Framework serverless para Lambda
- **AWS Lambda** - Funciones serverless
- **API Gateway** - Gestión de endpoints REST
- **PyMySQL** - Driver de base de datos

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server

### Base de Datos
- **MariaDB** - Base de datos relacional

## ⚙️ Requisitos Previos

Antes de comenzar, tener instalado:

- **Python 3.11 o superior**
- **Node.js 18 o superior**
- **MariaDB o MySQL**
- **AWS SAM CLI**
- **Git**

## 📦 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Denwort/swapi_aws/
cd swapi_aws
```

### 2. Configurar Base de Datos

```bash
# Crear MariaDB como Docker
docker run --name mariadb -e MARIADB_ROOT_PASSWORD=mypass -p 3306:3306 -d docker.io/library/mariadb:latest

# Ejecutar el script de creación de base de datos
docker exec -i mariadb mariadb -uroot -pmypass < database\schema.sql
```

### 3. Configurar Backend

```bash
cd backend

# Editar sección de Parameters en template.yaml con tus credenciales de DB:
# DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT

# Compilar el proyecto
sam build --use-container --no-cached

# Iniciar servidor local
sam local start-api
```

El backend estará disponible en `http://localhost:3000`

### 4. Configurar Frontend

```bash
# En otra terminal
cd frontend

# Instalar dependencias
npm i

# De ser necesario, modificar las variables de entorno: VITE_API_BASE_URL apunte a http://localhost:3000
# cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🚀 Ejecución

### Local

**Terminal 1 - Backend:**
```bash
cd backend
sam build --use-container --no-cached
sam local start-api
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Cloud

**Terminal 1 - Backend:**
```bash
cd backend
sam build --use-container --no-cached
sam deploy --guided
# Responde las preguntas:
# - Stack Name: backend
# - DB_HOST: ? (especificar variables de entorno para la base de datos)
# - Allow SAM CLI IAM role creation: y
# - Confirm changes: y

# Al final te dará una URL:
# https://9p06rg2kr8.execute-api.us-east-2.amazonaws.com/Prod/
```

**Terminal 2 - Frontend:**
```bash
cd frontend
# Actualizar frontend/.env con la ruta previa de Lambda

npm run build

netlify init
# - Team: david's team
# - Project name: frontend
netlify deploy
# - build command: npm run build

# Al final te dará una URL:
# https://699218820daa0f1126996ca7--benevolent-nasturtium-778a5a.netlify.app
```

Abrir el navegador en `http://localhost:5173`

## 🧪 Pruebas

### Backend (Python)

```bash
cd backend

# Instalar dependencias
pip install -r layers/dependencies/requirements.txt

# Ejecutar tests
pytest
```

### Frontend (React)

```bash
cd frontend

# Instalar dependencias
npm i

# Ejecutar tests
npm test
```


## ☁️ Despliegue

**MariaDB(AWS):** 

database-1.c5igsk4iutw7.us-east-2.rds.amazonaws.com

**Backend (AWS):** 

https://9p06rg2kr8.execute-api.us-east-2.amazonaws.com/Prod/

**Frontend(Netlify):** 

https://699218820daa0f1126996ca7--benevolent-nasturtium-778a5a.netlify.app


## 📁 Estructura del Proyecto

```
swapi_aws/
├── backend/
│   ├── functions/               # Funciones Lambda
│   │   ├── get_characters/      # Búsqueda de personajes
│   │   ├── add_favorite/        # Agregar favorito
│   │   ├── get_favorites/       # Listar favoritos
│   │   └── delete_favorite/     # Eliminar favorito
│   ├── layers/                  # Layers de las funciones
│   │   ├── common/              # Código compartido
│   │   ├── dependencies/        # Dependencias compartidaas
│   ├── tests/                  # Pruebas unitarias
│   └── template.yaml           # Configuración SAM
├── frontend/
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── __test__/         # Pruebas unitarias
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # Servicios API
│   │   └── types/              # Definiciones TypeScript
│   └── package.json
├── database/
│   └── schema.sql              # Script de base de datos
└── docs/                        # Documentación
```

## 📚 Documentación Adicional

- [Decisiones Técnicas](docs/decisiones-tecnicas.md)
- [Documentación API](backend/openapi.yaml)

---
