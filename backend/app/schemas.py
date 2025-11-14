from pydantic import BaseModel
from datetime import date
from typing import List, Optional

# ==========================================================
# GRUPOS MUSCULARES
# ==========================================================

class GrupoMuscularBase(BaseModel):
    nombre: str


class GrupoMuscularIn(GrupoMuscularBase):
    pass


class GrupoMuscularOut(GrupoMuscularBase):
    id: int

    class Config:
        from_attributes = True


# ==========================================================
# EJERCICIOS
# ==========================================================

class EjercicioBase(BaseModel):
    nombre: str
    musculo_enfocado: Optional[str] = None
    grupo_muscular_id: int


class EjercicioIn(EjercicioBase):
    pass


class EjercicioOut(BaseModel):
    id: int
    nombre: str
    musculo_enfocado: Optional[str]
    grupo_muscular: GrupoMuscularOut

    class Config:
        from_attributes = True


# ==========================================================
# SESIONES DE ENTRENAMIENTO
# ==========================================================

class SesionEntrenamientoBase(BaseModel):
    fecha: date
    notas: Optional[str] = None


class SesionEntrenamientoIn(SesionEntrenamientoBase):
    grupo_ids: List[int]


class SesionEntrenamientoOut(SesionEntrenamientoBase):
    id: int
    grupos_musculares: List[GrupoMuscularOut]
    series: List["SerieOut"] = []

    class Config:
        from_attributes = True


# ==========================================================
# SERIES
# ==========================================================

class SerieBase(BaseModel):
    repeticiones: int
    peso: float


class SerieIn(SerieBase):
    ejercicio_id: int


class SerieOut(SerieBase):
    id: int
    ejercicio: EjercicioOut

    class Config:
        from_attributes = True


SesionEntrenamientoOut.update_forward_refs()
SerieOut.update_forward_refs()