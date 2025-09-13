# คู่มือการสร้าง API เส้นใหม่

คู่มือนี้จะอธิบาย step by step วิธีการสร้าง API endpoint ใหม่ในโปรเจค hono-clean-architecture-boilerplate

## 🏗️ สถาปัตยกรรมของโปรเจค

โปรเจคนี้ใช้สถาปัตยกรรม Clean Architecture ร่วมกับ Dependency Injection Pattern:

```
src/
├── api/
│   ├── handlers/        # Controllers - จัดการ HTTP requests/responses
│   ├── services/        # Business Logic Layer
│   │   └── [domain]/
│   │       ├── command/ # Write operations (Create, Update, Delete)
│   │       ├── query/   # Read operations (Get, List, Search)
│   │       └── [domain].ts # Main service class
│   └── repositories/    # Data Access Layer
├── const/
│   ├── types/          # Type definitions
│   └── enum/
│       └── errorCodes/ # Error code definitions
├── infra/
│   ├── database/       # Database connection and entities
│   └── di/            # Dependency Injection setup
└── swagger/           # API documentation
```

## 🛠️ Tech Stack

- **Framework**: Hono.js
- **Database**: PostgreSQL + Drizzle ORM
- **DI Container**: Custom dependency injection
- **Validation**: Built-in
- **Documentation**: Swagger/OpenAPI

## 📝 Step by Step: สร้าง API เส้นใหม่

### Step 1: กำหนด Domain และ Entity

#### 1.1 สร้าง Database Entity

```typescript
// src/infra/database/entity/[domain].ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const [domain]s = pgTable("[domain]s", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  // เพิ่ม fields ตามต้องการ
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### 1.2 สร้าง Type Definition

```typescript
// src/const/types/[domain].ts
export type [Domain] = {
  id: number
  name: string
  createdAt: Date | null
  // เพิ่ม properties ตามต้องการ
}
```

#### 1.3 สร้าง Error Codes

```typescript
// src/const/enum/errorCodes/[number]_[domain].ts
import { New } from "./base"

const feat[Domain]Num = [number] // เลขลำดับ domain

export const [domain]ErrorCodes = {
  // region handler 0-499
  INVALID_BODY: New(feat[Domain]Num, 0, "[Domain] invalid body"),
  INVALID_PARAMS: New(feat[Domain]Num, 1, "[Domain] invalid params"),
  // endregion

  // region service 500-999
  GET_[DOMAIN]S_INTERNAL_ERROR: New(feat[Domain]Num, 500, "Get [domain]s internal error"),
  CREATE_[DOMAIN]_FAILED: New(feat[Domain]Num, 600, "Create [domain] failed"),
  // endregion
}
```

### Step 2: สร้าง Repository Layer

```typescript
// src/api/repositories/[domain].ts
import { [Domain] } from "@/const/types/[domain]"
import { DatabaseService } from "@/infra/database/connection"
import { [domain]s } from "@/infra/database/entity/[domain]"
import { Logger } from "pino"

export interface [Domain]Repository {
  get[Domain]s(
    databaseService: DatabaseService
  ): Promise<{ data: [Domain][]; error: boolean }>

  get[Domain]ById(
    databaseService: DatabaseService,
    id: number
  ): Promise<{ data: [Domain] | null; error: boolean }>

  create[Domain](
    databaseService: DatabaseService,
    [domain]Data: Omit<[Domain], 'id' | 'createdAt'>
  ): Promise<{ data: [Domain] | null; error: boolean }>
}

export class [Domain]RepositoryImpl implements [Domain]Repository {
  constructor(private logger: Logger) {}

  async get[Domain]s(databaseService: DatabaseService) {
    try {
      const db = databaseService.getDb()
      const result = await db.select().from([domain]s)
      return { data: result, error: false }
    } catch (error) {
      this.logger.error("Cannot get [domain]s", error)
      return { data: [], error: true }
    }
  }

  async get[Domain]ById(databaseService: DatabaseService, id: number) {
    try {
      const db = databaseService.getDb()
      const result = await db.select().from([domain]s).where(eq([domain]s.id, id))
      return { data: result[0] || null, error: false }
    } catch (error) {
      this.logger.error(`Cannot get [domain] with id ${id}`, error)
      return { data: null, error: true }
    }
  }

  async create[Domain](databaseService: DatabaseService, [domain]Data: Omit<[Domain], 'id' | 'createdAt'>) {
    try {
      const db = databaseService.getDb()
      const result = await db.insert([domain]s).values([domain]Data).returning()
      return { data: result[0], error: false }
    } catch (error) {
      this.logger.error("Cannot create [domain]", error)
      return { data: null, error: true }
    }
  }
}
```

### Step 3: สร้าง Service Layer

#### 3.1 สร้าง Query Service (Read Operations)

```typescript
// src/api/services/[domain]/query/[domain]s.ts
import { [Domain]Repository } from "@/api/repositories/[domain]"
import { CUSTOM_ERROR } from "@/const/enum/errorCodes"
import { ReturnError } from "@/const/types/errors/ReturnError"
import { [Domain] } from "@/const/types/[domain]"
import { DatabaseService } from "@/infra/database/connection"
import { Logger } from "pino"

export interface [Domain]sQueryService {
  get[Domain]s(): Promise<{ data: [Domain][]; error: ReturnError }>
  get[Domain]ById(id: number): Promise<{ data: [Domain] | null; error: ReturnError }>
}

export class [Domain]sQueryServiceImpl implements [Domain]sQueryService {
  constructor(
    private logger: Logger,
    private databaseService: DatabaseService,
    private [domain]Repository: [Domain]Repository
  ) {}

  async get[Domain]s() {
    const { data, error } = await this.[domain]Repository.get[Domain]s(this.databaseService)
    if (error) {
      const customErr = CUSTOM_ERROR.[DOMAIN].GET_[DOMAIN]S_INTERNAL_ERROR
      this.logger.error(customErr.message)
      return { data: [], error: customErr }
    }
    return { data, error: null }
  }

  async get[Domain]ById(id: number) {
    const { data, error } = await this.[domain]Repository.get[Domain]ById(this.databaseService, id)
    if (error) {
      const customErr = CUSTOM_ERROR.[DOMAIN].GET_[DOMAIN]S_INTERNAL_ERROR
      this.logger.error(customErr.message)
      return { data: null, error: customErr }
    }
    return { data, error: null }
  }
}
```

#### 3.2 สร้าง Command Service (Write Operations)

```typescript
// src/api/services/[domain]/command/[domain]s.ts
import { [Domain]Repository } from "@/api/repositories/[domain]"
import { CUSTOM_ERROR } from "@/const/enum/errorCodes"
import { ReturnError } from "@/const/types/errors/ReturnError"
import { [Domain] } from "@/const/types/[domain]"
import { DatabaseService } from "@/infra/database/connection"
import { Logger } from "pino"

export interface [Domain]sCommandService {
  create[Domain]([domain]Data: Omit<[Domain], 'id' | 'createdAt'>): Promise<{ data: [Domain] | null; error: ReturnError }>
}

export class [Domain]sCommandServiceImpl implements [Domain]sCommandService {
  constructor(
    private logger: Logger,
    private databaseService: DatabaseService,
    private [domain]Repository: [Domain]Repository
  ) {}

  async create[Domain]([domain]Data: Omit<[Domain], 'id' | 'createdAt'>) {
    const { data, error } = await this.[domain]Repository.create[Domain](this.databaseService, [domain]Data)
    if (error) {
      const customErr = CUSTOM_ERROR.[DOMAIN].CREATE_[DOMAIN]_FAILED
      this.logger.error(customErr.message)
      return { data: null, error: customErr }
    }
    return { data, error: null }
  }
}
```

#### 3.3 สร้าง Main Service Class

```typescript
// src/api/services/[domain]/[domain].ts
import { [Domain]Repository } from "@/api/repositories/[domain]"
import { DatabaseService } from "@/infra/database/connection"
import { Logger } from "pino"
import { [Domain]sQueryService, [Domain]sQueryServiceImpl } from "./query/[domain]s"
import { [Domain]sCommandService, [Domain]sCommandServiceImpl } from "./command/[domain]s"

export class [Domain]Service {
  public [domain]sQuery: [Domain]sQueryService
  public [domain]sCommand: [Domain]sCommandService

  constructor(
    private logger: Logger,
    private databaseService: DatabaseService,
    private [domain]Repository: [Domain]Repository
  ) {
    this.[domain]sQuery = new [Domain]sQueryServiceImpl(
      this.logger,
      this.databaseService,
      this.[domain]Repository
    )

    this.[domain]sCommand = new [Domain]sCommandServiceImpl(
      this.logger,
      this.databaseService,
      this.[domain]Repository
    )
  }
}
```

### Step 4: สร้าง Handler Layer (Controller)

```typescript
// src/api/handlers/[domain]s.ts
import { [Domain]Service } from "@/api/services/[domain]/[domain]"
import { basicError } from "@/const/basicError"
import { HTTP_STATUS } from "@/const/enum/httpStatus"
import { Context } from "hono"
import { Logger } from "pino"

export class [Domain]Handler {
  constructor(private [domain]Service: [Domain]Service) {}

  async get[Domain]s(logger: Logger, c: Context) {
    try {
      const { data, error } = await this.[domain]Service.[domain]sQuery.get[Domain]s()
      if (error) {
        logger.error(error.message)
        return c.json(error, HTTP_STATUS.BAD_REQUEST)
      }
      return c.json(data)
    } catch (error) {
      logger.error("Unexpected error in get[Domain]s", error)
      return c.json(basicError, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  }

  async get[Domain]ById(c: Context) {
    try {
      const id = parseInt(c.req.param('id'))
      if (isNaN(id)) {
        return c.json({ error: "Invalid ID parameter" }, HTTP_STATUS.BAD_REQUEST)
      }

      const { data, error } = await this.[domain]Service.[domain]sQuery.get[Domain]ById(id)
      if (error) {
        return c.json(error, HTTP_STATUS.BAD_REQUEST)
      }
      if (!data) {
        return c.json({ error: "[Domain] not found" }, HTTP_STATUS.NOT_FOUND)
      }
      return c.json(data)
    } catch (error) {
      return c.json(basicError, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  }

  async create[Domain](c: Context) {
    try {
      const body = await c.req.json()

      // Basic validation
      if (!body.name) {
        return c.json({ error: "Name is required" }, HTTP_STATUS.BAD_REQUEST)
      }

      const { data, error } = await this.[domain]Service.[domain]sCommand.create[Domain](body)
      if (error) {
        return c.json(error, HTTP_STATUS.BAD_REQUEST)
      }
      return c.json(data, HTTP_STATUS.CREATED)
    } catch (error) {
      return c.json(basicError, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
  }
}
```

### Step 5: ตั้งค่า Dependency Injection

#### 5.1 เพิ่ม Token ใหม่

```typescript
// src/infra/di/container.ts (เพิ่มใน TOKENS object)
[DOMAIN]_HANDLER: Symbol('[DOMAIN]_HANDLER'),
[DOMAIN]_SERVICE: Symbol('[DOMAIN]_SERVICE'),
[DOMAIN]_REPOSITORY: Symbol('[DOMAIN]_REPOSITORY'),
```

#### 5.2 ลงทะเบียน Dependencies

```typescript
// src/infra/di/setup.ts (เพิ่มใน setupDependencies function)

// Handlers
container.register<[Domain]Handler>(
  TOKENS.[DOMAIN]_HANDLER,
  () => {
    const [domain]Service = container.resolve<[Domain]Service>(TOKENS.[DOMAIN]_SERVICE)
    return new [Domain]Handler([domain]Service)
  },
  { singleton: true }
)

// Services
container.register<[Domain]Service>(
  TOKENS.[DOMAIN]_SERVICE,
  () => {
    const logger = container.resolve<Logger>(TOKENS.LOGGER)
    const databaseService = container.resolve<DatabaseService>(TOKENS.DATABASE)
    const [domain]Repository = container.resolve<[Domain]Repository>(TOKENS.[DOMAIN]_REPOSITORY)
    return new [Domain]Service(logger, databaseService, [domain]Repository)
  },
  { singleton: true }
)

// Repositories
container.register<[Domain]Repository>(
  TOKENS.[DOMAIN]_REPOSITORY,
  () => {
    const logger = container.resolve<Logger>(TOKENS.LOGGER)
    return new [Domain]RepositoryImpl(logger)
  },
  { singleton: true }
)
```

#### 5.3 เพิ่มใน getServices function

```typescript
// src/infra/di/setup.ts (เพิ่มใน return object ของ getServices)
[domain]Handler: container.resolve<[Domain]Handler>(TOKENS.[DOMAIN]_HANDLER),
[domain]Service: container.resolve<[Domain]Service>(TOKENS.[DOMAIN]_SERVICE),
[domain]Repository: container.resolve<[Domain]Repository>(TOKENS.[DOMAIN]_REPOSITORY),
```

### Step 6: สร้าง Routes

```typescript
// src/api/router.ts (เพิ่ม routes ใหม่)
import { getServices, setupDependencies } from "@/infra/di/setup"

// Setup dependency injection
setupDependencies()
const { logger, userHandler, [domain]Handler } = getServices()

// [Domain] routes
const [domain]GroupApi = new Hono()
[domain]GroupApi.get("/", [domain]Handler.get[Domain]s.bind([domain]Handler, logger))
[domain]GroupApi.get("/:id", [domain]Handler.get[Domain]ById.bind([domain]Handler))
[domain]GroupApi.post("/", [domain]Handler.create[Domain].bind([domain]Handler))

// Register group routes
v1.route("/[domain]s", [domain]GroupApi)
```

### Step 7: อัปเดต Error Codes Index

```typescript
// src/const/enum/errorCodes/index.ts
export { [domain]ErrorCodes } from "./[number]_[domain]"

// และใน CUSTOM_ERROR object
[DOMAIN]: [domain]ErrorCodes,
```

### Step 8: สร้าง Database Migration

```bash
# รัน command เพื่อสร้าง migration
bun run drizzle-kit generate
```

```sql
-- migration file ที่ถูกสร้างขึ้น
CREATE TABLE "[domain]s" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);
```

### Step 9: รัน Migration

```bash
# รัน migration เพื่อสร้างตารางในฐานข้อมูล
bun run drizzle-kit migrate
```

## 🧪 การทดสอบ API

### การทดสอบด้วย curl

```bash
# GET all [domain]s
curl -X GET http://localhost:3000/api/v1/[domain]s

# GET [domain] by ID
curl -X GET http://localhost:3000/api/v1/[domain]s/1

# POST create new [domain]
curl -X POST http://localhost:3000/api/v1/[domain]s \
  -H "Content-Type: application/json" \
  -d '{"name": "Test [Domain]"}'
```

### ตัวอย่าง Response

```json
// GET /api/v1/[domain]s
[
  {
    "id": 1,
    "name": "Test [Domain]",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
]

// GET /api/v1/[domain]s/1
{
  "id": 1,
  "name": "Test [Domain]",
  "createdAt": "2025-01-01T00:00:00.000Z"
}

// POST /api/v1/[domain]s
{
  "id": 2,
  "name": "New [Domain]",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

## 📚 Best Practices

### 1. Error Handling

- ใช้ structured error codes
- Log errors ที่เหมาะสม
- Return consistent error format

### 2. Validation

- Validate input ใน handler layer
- ใช้ type-safe validation
- Return clear error messages

### 3. Database Operations

- ใช้ transactions สำหรับ complex operations
- Handle database errors gracefully
- ใช้ prepared statements (Drizzle ทำให้อัตโนมัติ)

### 4. Code Organization

- แยก concerns ตาม layers
- ใช้ dependency injection
- Keep handlers thin, services thick

### 5. Performance

- ใช้ connection pooling
- Implement pagination สำหรับ list endpoints
- Consider caching สำหรับ frequently accessed data

## 🔧 Troubleshooting

### ปัญหาที่พบบ่อย

1. **Dependency Injection Error**

   - ตรวจสอบว่าได้ register dependencies ครบถ้วน
   - ตรวจสอบ import paths

2. **Database Connection Error**

   - ตรวจสอบ environment variables
   - ตรวจสอบว่า database service ทำงาน

3. **Type Errors**

   - ตรวจสอบ type definitions
   - ตรวจสอบ entity schema

4. **Route Not Found**
   - ตรวจสอบการ register routes
   - ตรวจสอบ path parameters

## 📖 เอกสารเพิ่มเติม

- [Hono.js Documentation](https://hono.dev/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**หมายเหตุ**: แทนที่ `[domain]`, `[Domain]`, `[DOMAIN]`, และ `[number]` ด้วยชื่อ domain จริงที่ต้องการสร้าง เช่น `product`, `Product`, `PRODUCT`, และหมายเลขลำดับที่เหมาะสม
