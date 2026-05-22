from django.urls import path
from .views import (
    CategoryListCreateView,
    CategorySummaryView,
    CategoryDetailView,
    CategoryOptionsView,
)

urlpatterns = [
    path("", CategoryListCreateView.as_view(), name="category-list-create"),
    path("summary/", CategorySummaryView.as_view(), name="category-summary"),
    path("options/", CategoryOptionsView.as_view(), name="category-options"),
    path("<str:category_id>/", CategoryDetailView.as_view(), name="category-detail"),
]