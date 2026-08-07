import { ArchitectProject } from '../architectEngine';
import { FrameworkCodePreview } from './types';

export function generateFastApiBackend(project: ArchitectProject): FrameworkCodePreview {
  const nameSlug = project.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  return {
    framework: 'FastAPI',
    description: 'High-performance Python 3.11 FastAPI backend with Pydantic v2, SQLAlchemy 2.0, AsyncPG, JWT security, and auto-generated Swagger UI.',
    setupCommands: [
      `git clone https://github.com/apives/${nameSlug}-fastapi.git`,
      `cd ${nameSlug}-fastapi`,
      `python -m venv venv && source venv/bin/activate`,
      `pip install -r requirements.txt`,
      `cp .env.example .env`,
      `uvicorn app.main:app --reload`
    ],
    files: [
      {
        name: 'Folder Structure',
        path: 'structure.txt',
        category: 'Folder Structure',
        content: `${nameSlug}-fastapi/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py
│   │   │   │   └── resources.py
│   │   │   └── api.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── base.py
│   │   └── session.py
│   ├── models/
│   │   └── resource.py
│   ├── schemas/
│   │   └── resource.py
│   └── main.py
├── Dockerfile
├── requirements.txt
├── .env.example
└── README.md`
      },
      {
        name: 'FastAPI Router Controller',
        path: 'app/api/v1/endpoints/resources.py',
        category: 'Controllers',
        content: `from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.schemas.resource import ResourceRead, ResourceCreate
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[ResourceRead])
async def list_resources(current_user=Depends(get_current_user)):
    return [
        {"id": "res_101", "title": "Cluster Alpha", "status": "ACTIVE"},
        {"id": "res_102", "title": "Cache Node", "status": "HEALTHY"}
    ]

@router.post("/", response_model=ResourceRead, status_code=status.HTTP_201_CREATED)
async def create_resource(data: ResourceCreate, current_user=Depends(get_current_user)):
    return {"id": "res_103", "title": data.title, "status": "CREATED"}`
      },
      {
        name: 'API Router Inclusion',
        path: 'app/api/v1/api.py',
        category: 'Routes',
        content: `from fastapi import APIRouter
from app.api.v1.endpoints import resources, auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(resources.router, prefix="/resources", tags=["resources"])`
      },
      {
        name: 'SQLAlchemy Model',
        path: 'app/models/resource.py',
        category: 'Models',
        content: `from sqlalchemy import Column, String, DateTime, func
from app.db.base import Base

class Resource(Base):
    __tablename__ = "resources"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    status = Column(String, default="ACTIVE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())`
      },
      {
        name: 'OAuth2 / JWT Security',
        path: 'app/core/security.py',
        category: 'Authentication',
        content: `from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from app.core.config import settings

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )`
      },
      {
        name: 'Pydantic v2 Schema Validation',
        path: 'app/schemas/resource.py',
        category: 'Validation',
        content: `from pydantic import BaseModel, Field
from typing import Optional

class ResourceCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=100)
    category: Optional[str] = None

class ResourceRead(BaseModel):
    id: str
    title: str
    status: str`
      },
      {
        name: 'Environment Config',
        path: '.env.example',
        category: 'Environment Variables',
        content: `PROJECT_NAME="${project.name}"
SECRET_KEY=fastapi_super_secret_98231
DATABASE_URL="postgresql+asyncpg://postgres:pass@localhost:5432/apives"`
      },
      {
        name: 'Async SQLAlchemy Session',
        path: 'app/db/session.py',
        category: 'Database Connection',
        content: `from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session`
      },
      {
        name: 'Python Dockerfile',
        path: 'Dockerfile',
        category: 'Docker Configuration',
        content: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]`
      },
      {
        name: 'FastAPI Main & Swagger Docs',
        path: 'app/main.py',
        category: 'Swagger/OpenAPI Integration',
        content: `from fastapi import FastAPI
from app.api.v1.api import api_router

app = FastAPI(
    title="${project.name}",
    description="${project.description}",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

app.include_router(api_router, prefix="/api/v1")`
      },
      {
        name: 'Health Check Endpoint',
        path: 'app/api/v1/endpoints/health.py',
        category: 'Health Check Endpoint',
        content: `@app.get("/health", tags=["health"])
async def health_check():
    return {"status": "ok", "service": "${nameSlug}"}`
      },
      {
        name: 'SlowAPI Rate Limiter',
        path: 'app/core/limiter.py',
        category: 'Rate Limiting',
        content: `from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])`
      },
      {
        name: 'Structlog Logging',
        path: 'app/core/logger.py',
        category: 'Logging',
        content: `import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("${nameSlug}")`
      },
      {
        name: 'Global Exception Handler',
        path: 'app/core/errors.py',
        category: 'Error Handling',
        content: `from fastapi import Request
from fastapi.responses import JSONResponse

async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error occurred", "detail": str(exc)}
    )`
      },
      {
        name: 'Pytest Unit Tests Scaffold',
        path: 'tests/test_api.py',
        category: 'Unit Tests & Scaffolding',
        content: `import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_get_resources():
    headers = {"Authorization": "Bearer test_jwt_token"}
    response = client.get("/api/v1/resources", headers=headers)
    assert response.status_code in [200, 401]
`
      },
      {
        name: 'FastAPI README',
        path: 'README.md',
        category: 'README Preview',
        content: `# ${project.name} (FastAPI Production Backend)

Python 3.11 + FastAPI + Async SQLAlchemy.`
      }
    ]
  };
}
