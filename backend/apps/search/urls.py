from django.urls import path
from .views import SemanticSearchView, SimilarTransactionsView

urlpatterns = [
    path("semantic/", SemanticSearchView.as_view(), name="semantic-search"),
    path("similar/", SimilarTransactionsView.as_view(), name="similar-transactions"),
]