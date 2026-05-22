from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/accounts/", include("apps.accounts.urls")),
    path("api/onboarding/", include("apps.onboarding.urls")),
    path("api/uploads/", include("apps.uploads.urls")),
    path("api/transactions/", include("apps.transactions.urls")),
    path("api/categories/", include("apps.categories.urls")),
    path("api/search/", include("apps.search.urls")),
    path("api/chat/", include("apps.chat.urls")),
    path("api/subscriptions/", include("apps.subscriptions.urls")),
    path("api/insights/", include("apps.insights.urls")),
    path("api/budgets/", include("apps.budgets.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)