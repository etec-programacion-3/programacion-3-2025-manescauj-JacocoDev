from tortoise import fields, models
from tortoise.contrib.pydantic import pydantic_model_creator
from pydantic import BaseModel
from typing import Optional

# ===============================
#   🏋️ GRUPO MUSCULAR
# ===============================
class GrupoMuscular(models.Model):
    id = fields.IntField(pk=True)
    nombre = fields.CharField(max_length=100)


# ===============================
#   🏋️ EJERCICIO
# ===============================
class Ejercicio(models.Model):
    id = fields.IntField(pk=True)
    nombre = fields.CharField(max_length=100)
    descripcion = fields.TextField(null=True)
    grupo_muscular = fields.ForeignKeyField(
        "models.GrupoMuscular", related_name="ejercicios"
    )


# ===============================
#   🏋️ SESIONES Y SERIES
# ===============================
class SesionEntrenamiento(models.Model):
    id = fields.IntField(pk=True)
    fecha = fields.DateField()
    notas = fields.TextField(null=True)


class SesionEntrenamiento_GrupoMuscular(models.Model):
    id = fields.IntField(pk=True)
    sesion = fields.ForeignKeyField(
        "models.SesionEntrenamiento", related_name="grupos_intermedio"
    )
    grupo_muscular = fields.ForeignKeyField(
        "models.GrupoMuscular", related_name="sesiones_intermedio"
    )


SesionEntrenamiento.grupos_musculares = fields.ManyToManyField(
    "models.GrupoMuscular",
    through=SesionEntrenamiento_GrupoMuscular,
    related_name="sesiones",
)


class Serie(models.Model):
    id = fields.IntField(pk=True)
    peso = fields.FloatField()
    repeticiones = fields.IntField()
    sesion = fields.ForeignKeyField(
        "models.SesionEntrenamiento", related_name="series"
    )
    ejercicio = fields.ForeignKeyField("models.Ejercicio", related_name="series")


# ===============================
#   📦 MODELOS Pydantic
# ===============================

# GrupoMuscular Pydantic
GrupoMuscular_Pydantic = pydantic_model_creator(
    GrupoMuscular, name="GrupoMuscular"
)

# Ejercicio Input
class EjercicioIn_Pydantic(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    grupo_muscular_id: int

# Ejercicio Output con objeto grupo_muscular completo
class GrupoMuscularSimple(BaseModel):
    id: int
    nombre: str

class EjercicioOut_Pydantic(BaseModel):
    id: int
    nombre: str
    descripcion: Optional[str] = None
    grupo_muscular: GrupoMuscularSimple

    class Config:
        orm_mode = True