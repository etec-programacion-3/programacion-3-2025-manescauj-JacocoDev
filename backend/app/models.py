from tortoise import fields, models

class GrupoMuscular(models.Model):
    id = fields.IntField(pk=True)
    nombre = fields.CharField(max_length=100)

class Ejercicio(models.Model):
    id = fields.IntField(pk=True)
    nombre = fields.CharField(max_length=100)
    grupo_muscular = fields.ForeignKeyField("models.GrupoMuscular", related_name="ejercicios")


# Tabla intermedia para SesionEntrenamiento ↔ GrupoMuscular
class SesionEntrenamiento_GrupoMuscular(models.Model):
    id = fields.IntField(pk=True)
    sesion = fields.ForeignKeyField("models.SesionEntrenamiento", related_name="grupos_intermedio")
    grupo_muscular = fields.ForeignKeyField("models.GrupoMuscular", related_name="sesiones_intermedio")


class SesionEntrenamiento(models.Model):
    id = fields.IntField(pk=True)
    fecha = fields.DateField()  # Solo Día/Mes/Año
    notas = fields.TextField(null=True)

    # Relación muchos a muchos a través de tabla intermedia
    grupos_musculares = fields.ManyToManyField(
        "models.GrupoMuscular",
        through=SesionEntrenamiento_GrupoMuscular,
        related_name="sesiones"
    )


class Serie(models.Model):
    id = fields.IntField(pk=True)
    peso = fields.FloatField()
    repeticiones = fields.IntField()

    # Relaciones
    sesion = fields.ForeignKeyField("models.SesionEntrenamiento", related_name="series")
    ejercicio = fields.ForeignKeyField("models.Ejercicio", related_name="series")