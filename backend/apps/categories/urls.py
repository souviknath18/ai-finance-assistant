from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDistributionView,
    CategorySummaryView,
    CategoryDetailView,
    CategoryOptionsView,
)

urlpatterns = [
    path("", CategoryListCreateView.as_view(), name="category-list-create"),
    path("summary/", CategorySummaryView.as_view(), name="category-summary"),
    path("options/", CategoryOptionsView.as_view(), name="category-options"),
    path("distribution/", CategoryDistributionView.as_view(), name="category-distribution"),
    path("<str:category_id>/", CategoryDetailView.as_view(), name="category-detail"),
]