# Generated by Django 4.2.4 on 2023-08-29 15:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('move_app', '0001_initial'),
        ('pokemon_app', '0003_alter_pokemon_description_alter_pokemon_level_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='pokemon',
            name='moves',
            field=models.ManyToManyField(related_name='pokemon', to='move_app.move'),
        ),
    ]
