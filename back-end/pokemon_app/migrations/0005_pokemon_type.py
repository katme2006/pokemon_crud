# Generated by Django 4.2.4 on 2023-09-01 16:02

from django.db import migrations, models
import pokemon_app.validators


class Migration(migrations.Migration):

    dependencies = [
        ('pokemon_app', '0004_pokemon_moves'),
    ]

    operations = [
        migrations.AddField(
            model_name='pokemon',
            name='type',
            field=models.CharField(default='normal', validators=[pokemon_app.validators.validate_type]),
        ),
    ]
