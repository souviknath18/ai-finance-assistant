from django.db import models, transaction
from django.conf import settings
from django.utils import timezone


class Category(models.Model):
    class CategoryType(models.TextChoices):
        EXPENSE = "expense", "Expense"
        INCOME = "income", "Income"
        BOTH = "both", "Both"

    category_id = models.CharField(
        max_length=40,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories",
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    category_type = models.CharField(
        max_length=20,
        choices=CategoryType.choices,
        default=CategoryType.EXPENSE,
    )

    keywords = models.TextField(blank=True, null=True)

    is_system = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.category_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_category = (
                    Category.objects.select_for_update()
                    .exclude(category_id="")
                    .order_by("-id")
                    .first()
                )

                if last_category and last_category.category_id:
                    try:
                        last_number = int(last_category.category_id.split("-")[-1])
                    except (ValueError, IndexError):
                        last_number = 0
                else:
                    last_number = 0

                self.category_id = f"CAT-{today}-{last_number + 1:04d}"
                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    class Meta:
        db_table = "categories"
        ordering = ["name"]
        unique_together = ["user", "name"]

    def __str__(self):
        return self.name