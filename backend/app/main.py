from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from app.config import DATABASE_URL
from app import routes  

app = FastAPI(title="Proyecto Integrador")

@app.get("/")
async def root():
    return {"message": "API Funcionando"}

# Registrar rutas
app.include_router(routes.router)

# Conectar base de datos
register_tortoise(
    app,
    db_url=DATABASE_URL,
    modules={"models": ["app.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)