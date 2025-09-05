from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise

app = FastAPI(title = "Proyecto Integrador")

@app.get("/")
async def root():
    return {"message": "API Funcionando"}

register_tortoise(
    app,
    db_url = DATABASE_URL,
    modules = {"models": ["app.models"]},
    generate_schemas = True,
    add_exception_handlers = True,
)