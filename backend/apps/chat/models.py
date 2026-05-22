from django.db import models, transaction
from django.conf import settings
from django.utils import timezone


class ChatSession(models.Model):
    chat_id = models.CharField(
        max_length=40,
        unique=True,
        editable=False,
        db_index=True,
        blank=True,
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="chat_sessions",
    )

    title = models.CharField(max_length=255, default="New Chat")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.chat_id:
            today = timezone.now().strftime("%Y%m%d")

            with transaction.atomic():
                last_session = (
                    ChatSession.objects.select_for_update()
                    .exclude(chat_id="")
                    .order_by("-id")
                    .first()
                )

                if last_session and last_session.chat_id:
                    try:
                        last_number = int(last_session.chat_id.split("-")[-1])
                    except (ValueError, IndexError):
                        last_number = 0
                else:
                    last_number = 0

                self.chat_id = f"CHT-{today}-{last_number + 1:06d}"

                super().save(*args, **kwargs)
                return

        super().save(*args, **kwargs)

    class Meta:
        db_table = "chat_sessions"
        ordering = ["-updated_at"]

    def __str__(self):
        return f"{self.chat_id} - {self.title}"


class ChatMessage(models.Model):
    class Role(models.TextChoices):
        USER = "user", "User"
        AI = "ai", "AI"

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
    )

    content = models.TextField()

    sources = models.JSONField(default=list, blank=True)

    source_type = models.CharField(
        max_length=50,
        blank=True,
        default="",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "chat_messages"
        ordering = ["created_at"]

    def __str__(self):
        return f"{self.role} - {self.session.chat_id}"