# Generated by Django 4.2.3 on 2023-07-05 19:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='features_head',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='content',
            name='info_head',
            field=models.CharField(default=1, max_length=50),
            preserve_default=False,
        ),
    ]
