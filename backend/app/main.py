from fastapi import FastAPI
from tortoise.contrib.fastapi import register_tortoise
from app.routes import router
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Proyecto Integrador")

@app.get("/")
async def root():
    return {"message": "API Funcionando"}

app.include_router(router)

register_tortoise(
    app,
    db_url="sqlite://app/database/db.sqlite3",
    modules={"models": ["app.models"]},
    generate_schemas=True,
    add_exception_handlers=True,
)