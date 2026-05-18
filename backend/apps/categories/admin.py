from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = [
        "category_id",
        "user",
        "name",
        "category_type",
        "is_system",
        "is_active",
        "created_at",
    ]

    list_filter = ["category_type", "is_system", "is_active", "created_at"]

    search_fields = [
        "category_id",
        "name",
        "keywords",
        "user__email",
    ]