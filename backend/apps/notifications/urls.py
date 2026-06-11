from django.urls import path
from .views import (
    NotificationListView,
    MarkNotificationReadView,
    DismissNotificationView,
    NotificationUnreadCountView,
)

urlpatterns = [
    path("", NotificationListView.as_view(), name="notification-list"),
    path("unread-count/", NotificationUnreadCountView.as_view(), name="notification-unread-count"),
    path("<int:pk>/read/", MarkNotificationReadView.as_view(), name="notification-read"),
    path("<int:pk>/dismiss/", DismissNotificationView.as_view(), name="notification-dismiss"),
]