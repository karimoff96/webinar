# Generated by Django 4.2.3 on 2023-07-05 20:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_content_features_head_content_info_head'),
    ]

    operations = [
        migrations.AddField(
            model_name='content',
            name='video_link',
            field=models.CharField(blank=True, max_length=30),
        ),
    ]
