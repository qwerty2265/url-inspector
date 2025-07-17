# URL Inspector

## Project Structure

```
url-inspector/
├── url-inspector-backend/         # Backend (Go)
│   ├── .env
│   ├── go.mod
│   ├── go.sum
│   ├── app/                       # App initialization and router
│   │   ├── init.go
│   │   └── router.go
│   ├── cmd/
│   │   └── server/
│   │       └── main.go            # Server entry point
│   ├── internal/
│   │   ├── auth/                  # Authentication logic
│   │   │   ├── handler.go
│   │   │   ├── router.go
│   │   │   ├── service.go
│   │   │   └── validation.go
│   │   ├── common/                # Utilities, middleware, DB
│   │   │   ├── db/                # Database connection and migrations
│   │   │   │   ├── db.go
│   │   │   │   └── migrate.go
│   │   │   ├── middleware/        # HTTP middlewares
│   │   │   │   ├── auth_middleware.go
│   │   │   │   └── error_middleware.go
│   │   │   ├── util/              # Helper utilities
│   │   │   │   ├── cookie.go
│   │   │   │   ├── json.go
│   │   │   │   └── jwt.go
│   │   │   └── response.go        # Standardized API responses
│   │   ├── url/                   # URL analysis logic
│   │   │   ├── analyze.go
│   │   │   ├── handler.go
│   │   │   ├── model.go
│   │   │   ├── repository.go
│   │   │   ├── router.go
│   │   │   ├── service.go
│   │   │   └── worker.go
│   │   └── user/                  # User logic
│   │       ├── model.go
│   │       ├── repository.go
│   │       └── service.go
├── url-inspector-frontend/        # Frontend (React + TypeScript)
│   ├── .env
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   ├── tsconfig.node.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── eslint.config.js
│   ├── src/
│   │   ├── App.tsx                # Main React component
│   │   ├── main.tsx               # Entry point for React app
│   │   ├── index.css              # Global styles
│   │   ├── setupTests.ts          
│   │   ├── vite-env.d.ts          
│   │   ├── api/                   # API clients and types
│   │   │   ├── auth/              # Authentication API logic
│   │   │   │   └── auth-api.ts
│   │   │   ├── url/               # URL analysis API logic
│   │   │   │   ├── url-api.ts
│   │   │   │   └── url-types.ts
│   │   │   └── types/             # Shared API types
│   │   │       └── common.d.ts
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── SignInForm.tsx
│   │   │   ├── SignUpForm.tsx
│   │   │   ├── TablePagination.tsx
│   │   │   ├── TableSearch.tsx
│   │   │   ├── UrlHistoryTable.tsx
│   │   │   ├── UrlInput.tsx
│   │   │   └── __test__/          # Component unit tests
│   │   │       └── ...
│   │   ├── constants/             # App-wide constants and endpoints
│   │   │   ├── endpoints.ts
│   │   │   └── index.ts
│   │   ├── pages/                 # Application pages (routes)
│   │   │   ├── HomePage.tsx
│   │   │   ├── NotFoundPage.tsx
│   │   │   ├── SignInPage.tsx
│   │   │   ├── SignUpPage.tsx
│   │   │   └── UrlStatsPage.tsx
│   │   └── store/                 # Zustand stores for state management
│   │       ├── authStore.ts
│   │       └── urlStore.ts
│   │  
├── .gitignore
├── README.md
```

## Installation

### 1. Backend setup

Go to the backend folder:

```sh
cd url-inspector-backend
```

Create a `.env` file with your environment variables:

```
SERVER_PORT=8080
DB_USER={your_db_user}
DB_PASS={your_db_password}
DB_HOST={your_db_host}
DB_PORT={your_db_port}
DB_NAME={your_db_name}
JWT_SECRET={your_jwt_secret}
CGO_ENABLED=1
```

Install (Go v1.24.4)[https://go.dev/dl/], then run the server:

```sh
go mod tidy
go run cmd/server/main.go
```

### 2. Frontend setup

Go to the frontend folder:

```sh
cd ../url-inspector-frontend
```

Create a `.env` file:

```
VITE_BASE_URL={your_base_url}
```

Install [NodeJs v20.17.0](https://nodejs.org/en/download)
Install dependencies and start the dev server:

```sh
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

- `npm run dev` — start frontend in development mode
- `npm run build` — build frontend
- `npm run test` — run frontend tests
- `go run cmd/server/main.go` — start backend

## API Endpoints

- `/api/auth/register` — register
- `/api/auth/login` — login
- `/api/auth/logout` — logout
- `/api/auth/check` — check authentication
- `/api/url/analyze` — analyze URL
- `/api/url/all` — get user's URLs
- `/api/url/{id}` — get URL details
- `/api/url/stop/{id}` — stop analysis
- `/api/url/resume/{id}` — resume analysis
- `/api/url/delete/{id}` — delete URL

## Technologies

- **Backend:** Go, Chi, GORM, MySQL
- **Frontend:** React, TypeScript, Zustand, TailwindCSS, Vite, Vitest

## Notes

- MySQL is required