import uuid

from django.db import models, transaction
from django.utils import timezone
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)


class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None):
        if not email:
            raise ValueError("Users must have an email address")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            full_name=full_name,
        )

        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, full_name, password=None):
        user = self.create_user(
            email=email,
            full_name=full_name,
            password=password,
        )

        user.is_staff = True
        user.is_superuser = True
        user.is_verified = True

        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    user_code = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
        editable=False,
    )

    email = models.EmailField(
        unique=True,
        max_length=255,
    )

    full_name = models.CharField(max_length=255)

    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True,
    )

    currency = models.CharField(
        max_length=10,
        default="INR",
    )

    monthly_income = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        blank=True,
        null=True,
    )

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    is_onboarded = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def save(self, *args, **kwargs):
        if not self.user_code:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_user = (
                    User.objects.select_for_update()
                    .exclude(user_code="")
                    .order_by("-created_at")
                    .first()
                )

                if last_user and last_user.user_code:
                    last_number = int(last_user.user_code.split("-")[-1])
                    next_number = last_number + 1
                else:
                    next_number = 1

                self.user_code = f"USER-{today}-{next_number:04d}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user_code} - {self.email}"