# Hono - Clean Architecture (Boilerplate)

Modern REST API built with Hono.js, PostgreSQL, and Clean Architecture principles.

## 🚀 Features

- **Modern Tech Stack**: Hono.js, PostgreSQL, Drizzle ORM
- **Clean Architecture**: Layered architecture with dependency injection
- **Type Safety**: Full TypeScript support
- **Database**: PostgreSQL with Drizzle ORM migrations
- **Search**: MeiliSearch integration for full-text search (haven't implement yet)
- **Storage**: MinIO object storage (haven't implement yet)
- **Documentation**: Auto-generated OpenAPI/Swagger docs
- **Logging**: Structured logging with Pino
- **Development**: Hot reload with Bun

## 🏗️ Architecture

```
src/
├── api/
│   ├── handlers/        # HTTP Controllers
│   ├── services/        # Business Logic
│   │   └── [domain]/
│   │       ├── command/ # Write operations
│   │       ├── query/   # Read operations
│   │       └── [domain].ts
│   └── repositories/    # Data Access Layer
├── const/
│   ├── types/          # Type definitions
│   └── enum/           # Constants & error codes
├── infra/
│   ├── database/       # Database connection & entities
│   ├── di/            # Dependency injection
│   ├── meilisearch/   # Search client
│   └── minio/         # Object storage
└── swagger/           # API documentation
```

## 📋 Prerequisites

- [Bun](https://bun.sh/) >= 1.0
- [Docker](https://www.docker.com/) & Docker Compose
- [Node.js](https://nodejs.org/) >= 18 (for some tooling)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd hono-clean-architecture-boilerplate
```

### 2. Install dependencies

```bash
bun install
```

### 3. Environment setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
```

### 4. Start infrastructure services

```bash
# Start PostgreSQL, MinIO, and MeiliSearch
docker-compose up -d
```

### 5. Run database migrations

```bash
# Generate migrations (if needed)
bun run drizzle-kit generate

# Apply migrations
bun run drizzle-kit migrate
```

## 🚀 Running the Application

### Development

```bash
# Start with hot reload
bun run dev
```

### Production

```bash
# Build and start
bun run build
bun start
```

The API will be available at:

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/v1/health
- **API Documentation**: http://localhost:3000/docs
- **OpenAPI Spec**: http://localhost:3000/openapi.json

## 🐳 Docker Services

The project includes the following services via Docker Compose:

| Service     | Port       | Purpose          |
| ----------- | ---------- | ---------------- |
| PostgreSQL  | 5432       | Primary database |
| MinIO       | 9000, 9001 | Object storage   |
| MeiliSearch | 7700       | Full-text search |

### Service URLs:

- **MinIO Console**: http://localhost:9001
- **MeiliSearch**: http://localhost:7700

## 📚 API Documentation

### Available Endpoints

#### Health Check

```http
GET /api/v1/health
```

#### Users

```http
GET    /api/v1/users      # Get all users
```

### Interactive Documentation

Visit http://localhost:3000/docs for interactive API documentation with Swagger UI.

## 🔧 Development

### Project Structure

- **Handlers**: HTTP request/response handling
- **Services**: Business logic (separated into Query/Command)
- **Repositories**: Database access layer
- **Types**: TypeScript type definitions
- **Entities**: Database schema definitions

### Adding New API Endpoints

See the comprehensive guide: [API Development Guide](./docs/api-development-guide.md)

### Database Operations

```bash
# Generate migration
bun run drizzle-kit generate

# Apply migrations
bun run drizzle-kit migrate

# View database
bun run drizzle-kit studio
```

### Code Quality

```bash
# Type checking
bun run tsc --noEmit

# Linting
bun run eslint src/

# Formatting
bun run prettier --write src/
```

## 🧪 Testing

### Manual Testing with curl

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Get users
curl http://localhost:3000/api/v1/users

# Create user
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

## 📝 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DB=
POSTGRES_USER=
POSTGRES_PASSWORD=
DATABASE_URL=

# MinIO
MINIO_ROOT_USER=
MINIO_ROOT_PASSWORD=
MINIO_ENDPOINT=
MINIO_PORT=

# MeiliSearch
MEILI_MASTER_KEY=
MEILI_ENV=
MEILI_HOST=

# Application
PORT=3000
NODE_ENV=development
```

## 🚀 Deployment

### Docker Production Build

```bash
# Build production image
docker build -t hono-clean-architecture-boilerplate .

# Run container
docker run -p 3000:3000 --env-file .env hono-clean-architecture-boilerplate
```

### Environment-specific Deployment

- **Development**: Use `bun run dev` with hot reload
- **Staging**: Use Docker with staging environment variables
- **Production**: Use Docker with production optimizations

## 🛡️ Security Considerations

- Environment variables for sensitive data
- Input validation on all endpoints
- Error handling without information leakage
- Database connection pooling
- Rate limiting (to be implemented)
- Authentication/Authorization (to be implemented)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the [API Development Guide](./docs/api-development-guide.md)
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Development Guidelines

- Follow the existing architecture patterns
- Use TypeScript strictly
- Write meaningful commit messages
- Update documentation when needed
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [API Development Guide](./docs/api-development-guide.md)
- **Issues**: Create an issue in the repository
- **Architecture Questions**: Refer to the code structure and patterns

## 🔄 Changelog

### v1.0.0

- Initial release with Hono.js
- Clean Architecture implementation
- PostgreSQL with Drizzle ORM
- Docker Compose setup
- OpenAPI documentation
- MeiliSearch and MinIO integration
