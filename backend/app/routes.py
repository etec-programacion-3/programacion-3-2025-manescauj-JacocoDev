from fastapi import APIRouter, HTTPException
from app.models import (
    GrupoMuscular,
    Ejercicio,
    GrupoMuscular_Pydantic,
    EjercicioIn_Pydantic,
    EjercicioOut_Pydantic
)
from tortoise.queryset import Q

router = APIRouter()

# ===============================
#   🏋️ CRUD GRUPOS MUSCULARES
# ===============================
@router.get("/grupos-musculares")
async def listar_grupos():
    return await GrupoMuscular_Pydantic.from_queryset(GrupoMuscular.all())

@router.post("/grupos-musculares")
async def crear_grupo(grupo: GrupoMuscular_Pydantic):
    if not grupo.nombre.strip():
        raise HTTPException(status_code=400, detail="El nombre no puede estar vacío.")
    grupo_obj = await GrupoMuscular.create(**grupo.dict())
    return await GrupoMuscular_Pydantic.from_tortoise_orm(grupo_obj)

@router.get("/grupos-musculares/{id}")
async def obtener_grupo(id: int):
    grupo = await GrupoMuscular.get_or_none(id=id)
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo muscular no encontrado.")
    return await GrupoMuscular_Pydantic.from_tortoise_orm(grupo)

@router.put("/grupos-musculares/{id}")
async def actualizar_grupo(id: int, datos: GrupoMuscular_Pydantic):
    grupo = await GrupoMuscular.get_or_none(id=id)
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo muscular no encontrado.")
    grupo.nombre = datos.nombre
    await grupo.save()
    return await GrupoMuscular_Pydantic.from_tortoise_orm(grupo)

@router.delete("/grupos-musculares/{id}")
async def eliminar_grupo(id: int):
    eliminado = await GrupoMuscular.filter(id=id).delete()
    if not eliminado:
        raise HTTPException(status_code=404, detail="Grupo muscular no encontrado.")
    return {"message": "Grupo muscular eliminado correctamente."}


# ===============================
#   🏋️ CRUD EJERCICIOS
# ===============================
@router.get("/ejercicios", response_model=list[EjercicioOut_Pydantic])
async def listar_ejercicios(grupo_muscular_id: int = None):
    qs = Ejercicio.all().prefetch_related("grupo_muscular")
    if grupo_muscular_id is not None:
        qs = qs.filter(grupo_muscular_id=grupo_muscular_id)
    return await qs

@router.get("/ejercicios/{id}", response_model=EjercicioOut_Pydantic)
async def obtener_ejercicio(id: int):
    ejercicio = await Ejercicio.get_or_none(id=id).prefetch_related("grupo_muscular")
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")
    return ejercicio

@router.post("/ejercicios", response_model=EjercicioOut_Pydantic)
async def crear_ejercicio(ejercicio: EjercicioIn_Pydantic):
    grupo = await GrupoMuscular.get_or_none(id=ejercicio.grupo_muscular_id)
    if not grupo:
        raise HTTPException(status_code=404, detail="El grupo muscular indicado no existe.")
    ejercicio_obj = await Ejercicio.create(
        nombre=ejercicio.nombre,
        descripcion=ejercicio.descripcion,
        grupo_muscular=grupo
    )
    return ejercicio_obj

@router.put("/ejercicios/{id}", response_model=EjercicioOut_Pydantic)
async def actualizar_ejercicio(id: int, datos: EjercicioIn_Pydantic):
    ejercicio = await Ejercicio.get_or_none(id=id)
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")
    grupo = await GrupoMuscular.get_or_none(id=datos.grupo_muscular_id)
    if not grupo:
        raise HTTPException(status_code=404, detail="El grupo muscular indicado no existe.")
    ejercicio.nombre = datos.nombre
    ejercicio.descripcion = datos.descripcion
    ejercicio.grupo_muscular = grupo
    await ejercicio.save()
    return ejercicio

@router.delete("/ejercicios/{id}")
async def eliminar_ejercicio(id: int):
    eliminado = await Ejercicio.filter(id=id).delete()
    if not eliminado:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")
    return {"message": "Ejercicio eliminado correctamente."}