# Generated by Django 4.2.3 on 2023-07-05 14:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Content',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField()),
                ('ad', models.CharField(max_length=40)),
                ('header', models.TextField()),
                ('bonus', models.TextField()),
                ('features_1', models.CharField(max_length=180)),
                ('features_2', models.CharField(max_length=180)),
                ('features_3', models.CharField(max_length=180)),
                ('features_4', models.CharField(max_length=180)),
                ('features_5', models.CharField(max_length=180)),
                ('features_6', models.CharField(max_length=180)),
                ('info_1', models.CharField(max_length=180)),
                ('info_2', models.CharField(max_length=180)),
                ('info_3', models.CharField(max_length=180)),
                ('info_4', models.CharField(max_length=180)),
                ('info_5', models.CharField(max_length=180)),
                ('about', models.CharField(max_length=100)),
                ('about_image', models.ImageField(upload_to='images/')),
            ],
        ),
    ]
