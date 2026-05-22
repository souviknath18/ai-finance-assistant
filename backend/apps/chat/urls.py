from django.urls import path

from .views import (
    ChatMessageView,
    ChatSessionListView,
    ChatSessionDetailView,
    ChatSessionDeleteView,
)

urlpatterns = [
    path("message/", ChatMessageView.as_view(), name="chat-message"),
    path("sessions/", ChatSessionListView.as_view(), name="chat-sessions"),
    path("sessions/<int:session_id>/", ChatSessionDetailView.as_view(), name="chat-session-detail"),
    path("sessions/<int:session_id>/delete/", ChatSessionDeleteView.as_view(), name="chat-session-delete"),
]