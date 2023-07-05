from django.shortcuts import render
from main.models import Content

def main_index(request):
    return render(request, 'web.html', context={
        "posts": Content.objects.all()
    })