# Generated by Django 4.2.3 on 2023-07-05 20:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0003_content_video_link'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='bonus_link',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AddField(
            model_name='content',
            name='button_link',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
