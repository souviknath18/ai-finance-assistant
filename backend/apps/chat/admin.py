from django.contrib import admin

from .models import ChatSession, ChatMessage


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    extra = 0
    readonly_fields = ["role", "content", "sources", "source_type", "created_at"]


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ["chat_id", "user", "title", "created_at", "updated_at"]
    search_fields = ["chat_id", "title", "user__email", "user__username"]
    list_filter = ["created_at", "updated_at"]
    readonly_fields = ["chat_id", "created_at", "updated_at"]
    inlines = [ChatMessageInline]


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ["session", "role", "short_content", "source_type", "created_at"]
    search_fields = ["content", "session__chat_id"]
    list_filter = ["role", "source_type", "created_at"]
    readonly_fields = ["created_at"]

    def short_content(self, obj):
        return obj.content[:80]