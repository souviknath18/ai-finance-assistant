from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "user_code",
        "email",
        "full_name",
        "currency",
        "monthly_income",
        "is_verified",
        "is_active",
        "is_staff",
        "created_at",
    )

    search_fields = (
        "user_code",
        "email",
        "full_name",
    )

    list_filter = (
        "is_verified",
        "is_active",
        "is_staff",
        "currency",
    )

    ordering = ("-created_at",)