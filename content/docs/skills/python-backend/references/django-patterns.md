---
title: "Django Patterns"
---
# Django Patterns

Guide to building web applications with Django.

## Project Structure

```
project/
├── manage.py
├── config/                  # Project settings
│   ├── __init__.py
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── users/
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── serializers.py   # DRF
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── tests/
│   └── posts/
│       └── ...
├── templates/
├── static/
└── requirements/
    ├── base.txt
    ├── development.txt
    └── production.txt
```

## Models

### Basic Model

```python
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'
    
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
        ]
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
```

### Model Managers

```python
class PublishedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(status=Post.Status.PUBLISHED)

class Post(models.Model):
    # ... fields ...
    
    objects = models.Manager()  # Default manager
    published = PublishedManager()  # Custom manager

# Usage
Post.objects.all()        # All posts
Post.published.all()      # Only published
```

### Model Methods

```python
class Post(models.Model):
    # ... fields ...
    
    @property
    def is_published(self):
        return self.status == self.Status.PUBLISHED
    
    @property
    def reading_time(self):
        words_per_minute = 200
        word_count = len(self.content.split())
        return max(1, word_count // words_per_minute)
    
    def publish(self):
        self.status = self.Status.PUBLISHED
        self.save(update_fields=['status', 'updated_at'])
```

## Django REST Framework

### Serializers

```python
from rest_framework import serializers
from .models import User, Post

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'bio']
        read_only_fields = ['id']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    reading_time = serializers.ReadOnlyField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'slug', 'content', 'author', 'status', 
                  'reading_time', 'created_at', 'updated_at']
        read_only_fields = ['id', 'slug', 'author', 'created_at', 'updated_at']
```

### ViewSets

```python
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    lookup_field = 'slug'
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == 'list':
            # Only published for list
            queryset = queryset.filter(status=Post.Status.PUBLISHED)
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    @action(detail=True, methods=['post'])
    def publish(self, request, slug=None):
        post = self.get_object()
        if post.author != request.user:
            return Response(
                {'error': 'Not authorized'},
                status=status.HTTP_403_FORBIDDEN
            )
        post.publish()
        return Response(PostSerializer(post).data)
    
    @action(detail=False, methods=['get'])
    def my_posts(self, request):
        posts = self.queryset.filter(author=request.user)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)
```

### URLs

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register('posts', PostViewSet, basename='post')

urlpatterns = [
    path('', include(router.urls)),
]
```

### Pagination

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# Custom pagination
from rest_framework.pagination import PageNumberPagination

class StandardPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class PostViewSet(viewsets.ModelViewSet):
    pagination_class = StandardPagination
```

### Filtering

```python
from django_filters import rest_framework as filters

class PostFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=Post.Status.choices)
    author = filters.NumberFilter(field_name='author__id')
    created_after = filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_before = filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')
    search = filters.CharFilter(method='search_filter')
    
    def search_filter(self, queryset, name, value):
        return queryset.filter(
            models.Q(title__icontains=value) |
            models.Q(content__icontains=value)
        )
    
    class Meta:
        model = Post
        fields = ['status', 'author']

class PostViewSet(viewsets.ModelViewSet):
    filterset_class = PostFilter
```

## Authentication

### JWT with Simple JWT

```python
# settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

### Custom Permissions

```python
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
```

## Signals

```python
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(pre_delete, sender=Post)
def cleanup_post_files(sender, instance, **kwargs):
    # Clean up associated files
    if instance.image:
        instance.image.delete(save=False)
```

## Middleware

```python
import time
import logging

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()
        
        response = self.get_response(request)
        
        duration = time.time() - start_time
        logger.info(
            f"{request.method} {request.path} - {response.status_code} - {duration:.3f}s"
        )
        
        return response

# settings.py
MIDDLEWARE = [
    ...
    'apps.core.middleware.RequestLoggingMiddleware',
]
```

## Celery Tasks

```python
# celery.py
from celery import Celery

app = Celery('project')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# tasks.py
from celery import shared_task

@shared_task
def send_welcome_email(user_id):
    user = User.objects.get(id=user_id)
    # Send email logic
    
@shared_task(bind=True, max_retries=3)
def process_upload(self, file_id):
    try:
        # Process file
        pass
    except Exception as exc:
        self.retry(exc=exc, countdown=60)

# Usage
send_welcome_email.delay(user.id)
process_upload.apply_async(args=[file.id], countdown=10)
```

## Management Commands

```python
# apps/users/management/commands/create_admin.py
from django.core.management.base import BaseCommand
from apps.users.models import User

class Command(BaseCommand):
    help = 'Create admin user'

    def add_arguments(self, parser):
        parser.add_argument('--email', required=True)
        parser.add_argument('--password', required=True)

    def handle(self, *args, **options):
        user = User.objects.create_superuser(
            email=options['email'],
            username=options['email'].split('@')[0],
            password=options['password'],
        )
        self.stdout.write(self.style.SUCCESS(f'Created admin: {user.email}'))

# Usage: python manage.py create_admin --email=admin@example.com --password=secret
```
