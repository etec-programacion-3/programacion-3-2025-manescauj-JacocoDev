from tortoise import fields, models

# ==========================================================
# GRUPOS MUSCULARES
# ==========================================================

class GrupoMuscular(models.Model):
    id = fields.IntField(pk=True)
    nombre = fields.CharField(max_length=100)

    def __str__(self):
        return self.nombre


# ==========================================================
# EJERCICIOS
# ==========================================================

class Ejercicio(models.Model):
    id = fields.IntField(pk=True)
    nombre = fields.CharField(max_length=100)
    musculo_enfocado = fields.CharField(max_length=100, null=True)
    grupo_muscular = fields.ForeignKeyField("models.GrupoMuscular", related_name="ejercicios")

    def __str__(self):
        return self.nombre


# ==========================================================
# SESIONES DE ENTRENAMIENTO
# ==========================================================

class SesionEntrenamiento(models.Model):
    id = fields.IntField(pk=True)
    fecha = fields.DateField()
    notas = fields.TextField(null=True)
    grupos_musculares = fields.ManyToManyField(
        "models.GrupoMuscular", related_name="sesiones"
    )

    def __str__(self):
        return f"Sesión {self.id} - {self.fecha}"


# ==========================================================
# SERIES
# ==========================================================

class Serie(models.Model):
    id = fields.IntField(pk=True)
    ejercicio = fields.ForeignKeyField("models.Ejercicio", related_name="series")
    sesion = fields.ForeignKeyField("models.SesionEntrenamiento", related_name="series")
    repeticiones = fields.IntField()
    peso = fields.FloatField()