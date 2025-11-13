from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app import models, schemas

router = APIRouter()


# ==========================================================
# GRUPOS MUSCULARES
# ==========================================================

@router.get("/grupos-musculares", response_model=List[schemas.GrupoMuscularOut])
async def listar_grupos():
    return await models.GrupoMuscular.all()


@router.post("/grupos-musculares", response_model=schemas.GrupoMuscularOut)
async def crear_grupo(datos: schemas.GrupoMuscularIn):
    if not datos.nombre.strip():
        raise HTTPException(status_code=400, detail="El nombre no puede estar vacío.")
    return await models.GrupoMuscular.create(nombre=datos.nombre)


@router.get("/grupos-musculares/{id}", response_model=schemas.GrupoMuscularOut)
async def obtener_grupo(id: int):
    grupo = await models.GrupoMuscular.get_or_none(id=id)
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo muscular no encontrado.")
    return grupo


@router.put("/grupos-musculares/{id}", response_model=schemas.GrupoMuscularOut)
async def actualizar_grupo(id: int, datos: schemas.GrupoMuscularIn):
    grupo = await models.GrupoMuscular.get_or_none(id=id)
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo muscular no encontrado.")
    grupo.nombre = datos.nombre
    await grupo.save()
    return grupo


@router.delete("/grupos-musculares/{id}")
async def eliminar_grupo(id: int):
    eliminado = await models.GrupoMuscular.filter(id=id).delete()
    if not eliminado:
        raise HTTPException(status_code=404, detail="Grupo muscular no encontrado.")
    return {"message": "Grupo muscular eliminado correctamente."}


# ==========================================================
# EJERCICIOS
# ==========================================================

@router.get("/ejercicios", response_model=List[schemas.EjercicioOut])
async def listar_ejercicios(grupo_muscular_id: Optional[int] = Query(None)):
    if grupo_muscular_id:
        ejercicios = await models.Ejercicio.filter(
            grupo_muscular_id=grupo_muscular_id
        ).prefetch_related("grupo_muscular")
    else:
        ejercicios = await models.Ejercicio.all().prefetch_related("grupo_muscular")
    return ejercicios


@router.get("/ejercicios/{id}", response_model=schemas.EjercicioOut)
async def obtener_ejercicio(id: int):
    ejercicio = await models.Ejercicio.get_or_none(id=id)
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")
    await ejercicio.fetch_related("grupo_muscular")
    return ejercicio


@router.post("/ejercicios", response_model=schemas.EjercicioOut)
async def crear_ejercicio(datos: schemas.EjercicioIn):
    if not datos.nombre.strip():
        raise HTTPException(status_code=400, detail="El nombre no puede estar vacío.")

    grupo = await models.GrupoMuscular.get_or_none(id=datos.grupo_muscular_id)
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo muscular no encontrado.")

    nuevo = await models.Ejercicio.create(
        nombre=datos.nombre,
        musculo_enfocado=datos.musculo_enfocado,
        grupo_muscular=grupo
    )

    await nuevo.fetch_related("grupo_muscular")
    return nuevo


@router.put("/ejercicios/{id}", response_model=schemas.EjercicioOut)
async def actualizar_ejercicio(id: int, datos: schemas.EjercicioIn):
    ejercicio = await models.Ejercicio.get_or_none(id=id)
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")

    grupo = await models.GrupoMuscular.get_or_none(id=datos.grupo_muscular_id)
    if not grupo:
        raise HTTPException(status_code=404, detail="Grupo muscular no encontrado.")

    ejercicio.nombre = datos.nombre
    ejercicio.musculo_enfocado = datos.musculo_enfocado
    ejercicio.grupo_muscular = grupo
    await ejercicio.save()
    await ejercicio.fetch_related("grupo_muscular")
    return ejercicio


@router.delete("/ejercicios/{id}")
async def eliminar_ejercicio(id: int):
    eliminado = await models.Ejercicio.filter(id=id).delete()
    if not eliminado:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")
    return {"message": "Ejercicio eliminado correctamente."}


# ==========================================================
# SESIONES DE ENTRENAMIENTO
# ==========================================================

@router.get("/sesiones", response_model=List[schemas.SesionEntrenamientoOut])
async def listar_sesiones():
    sesiones = await models.SesionEntrenamiento.all().prefetch_related(
        "grupos_musculares",
        "series__ejercicio",
        "series__ejercicio__grupo_muscular"
    )
    return sesiones



@router.get("/sesiones/{id}", response_model=schemas.SesionEntrenamientoOut)
async def obtener_sesion(id: int):
    sesion = await models.SesionEntrenamiento.get_or_none(id=id)
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada.")
    await sesion.fetch_related(
        "grupos_musculares",
        "series__ejercicio",
        "series__ejercicio__grupo_muscular"
    )
    return sesion


@router.post("/sesiones", response_model=schemas.SesionEntrenamientoOut)
async def crear_sesion(datos: schemas.SesionEntrenamientoIn):
    grupos = await models.GrupoMuscular.filter(id__in=datos.grupo_ids)
    if len(grupos) != len(datos.grupo_ids):
        raise HTTPException(
            status_code=404,
            detail="Uno o más grupos musculares no existen."
        )

    sesion = await models.SesionEntrenamiento.create(
        fecha=datos.fecha,
        notas=datos.notas
    )
    await sesion.grupos_musculares.add(*grupos)
    await sesion.fetch_related(
        "grupos_musculares",
        "series__ejercicio",
        "series__ejercicio__grupo_muscular"
    )
    return sesion


@router.put("/sesiones/{id}", response_model=schemas.SesionEntrenamientoOut)
async def actualizar_sesion(id: int, datos: schemas.SesionEntrenamientoIn):
    sesion = await models.SesionEntrenamiento.get_or_none(id=id)
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada.")

    grupos = await models.GrupoMuscular.filter(id__in=datos.grupo_ids)
    if len(grupos) != len(datos.grupo_ids):
        raise HTTPException(status_code=404, detail="Uno o más grupos musculares no existen.")

    sesion.fecha = datos.fecha
    sesion.notas = datos.notas
    await sesion.save()

    await sesion.grupos_musculares.clear()
    await sesion.grupos_musculares.add(*grupos)

    await sesion.fetch_related(
        "grupos_musculares",
        "series__ejercicio",
        "series__ejercicio__grupo_muscular"
    )
    return sesion


@router.delete("/sesiones/{id}")
async def eliminar_sesion(id: int):
    eliminado = await models.SesionEntrenamiento.filter(id=id).delete()
    if not eliminado:
        raise HTTPException(status_code=404, detail="Sesión no encontrada.")
    return {"message": "Sesión eliminada correctamente."}


# ==========================================================
# EJERCICIOS POR SESION
# ==========================================================

@router.get("/sesiones/{id}/ejercicios", response_model=List[schemas.EjercicioOut])
async def ejercicios_por_sesion(id: int):
    sesion = await models.SesionEntrenamiento.get_or_none(id=id)
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada.")
    await sesion.fetch_related("grupos_musculares")
    grupo_ids = [g.id for g in sesion.grupos_musculares]
    ejercicios = await models.Ejercicio.filter(grupo_muscular_id__in=grupo_ids).prefetch_related("grupo_muscular")
    return ejercicios


# ==========================================================
# SERIES
# ==========================================================

@router.get("/sesiones/{id}/series", response_model=List[schemas.SerieOut])
async def listar_series_por_sesion(id: int):
    sesion = await models.SesionEntrenamiento.get_or_none(id=id)
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada.")
    series = await models.Serie.filter(sesion_id=id).prefetch_related("ejercicio", "ejercicio__grupo_muscular")
    return series


@router.post("/sesiones/{id}/series", response_model=schemas.SerieOut)
async def crear_serie(id: int, datos: schemas.SerieIn):
    sesion = await models.SesionEntrenamiento.get_or_none(id=id)
    if not sesion:
        raise HTTPException(status_code=404, detail="Sesión no encontrada.")

    ejercicio = await models.Ejercicio.get_or_none(id=datos.ejercicio_id)
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")

    nueva = await models.Serie.create(
        repeticiones=datos.repeticiones,
        peso=datos.peso,
        ejercicio=ejercicio,
        sesion=sesion
    )
    await nueva.fetch_related("ejercicio", "ejercicio__grupo_muscular")
    return nueva


@router.put("/series/{id}", response_model=schemas.SerieOut)
async def actualizar_serie(id: int, datos: schemas.SerieIn):
    serie = await models.Serie.get_or_none(id=id)
    if not serie:
        raise HTTPException(status_code=404, detail="Serie no encontrada.")

    ejercicio = await models.Ejercicio.get_or_none(id=datos.ejercicio_id)
    if not ejercicio:
        raise HTTPException(status_code=404, detail="Ejercicio no encontrado.")

    serie.ejercicio = ejercicio
    serie.repeticiones = datos.repeticiones
    serie.peso = datos.peso
    await serie.save()
    await serie.fetch_related("ejercicio", "ejercicio__grupo_muscular")
    return serie


@router.delete("/series/{id}")
async def eliminar_serie(id: int):
    eliminado = await models.Serie.filter(id=id).delete()
    if not eliminado:
        raise HTTPException(status_code=404, detail="Serie no encontrada.")
    return {"message": "Serie eliminada correctamente."}