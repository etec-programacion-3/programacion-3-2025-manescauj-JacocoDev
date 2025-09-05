from tortoise import fields, models

class GrupoMuscular(models.Model):
    id = fields.IntField(pk=True)
    nombre = fields.CharField(max_length=100)

class Ejercicio(models.Model):
    id = fields.IntField(pk=True)
    nombre = fields.CharField(max_length=100)
    grupo_muscular = fields.ForeignKeyField("models.GrupoMuscular", related_name = "ejercicios")