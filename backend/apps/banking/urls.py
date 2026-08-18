from django.urls import path

from .views import (
    BankAccountDetailView,
    BankAccountListView,
    ConnectBankAccountView,
    SyncBankAccountView,
)


urlpatterns = [
    path(
        "accounts/",
        BankAccountListView.as_view(),
        name="bank-account-list",
    ),

    path(
        "accounts/connect/",
        ConnectBankAccountView.as_view(),
        name="bank-account-connect",
    ),

    path(
        "accounts/<uuid:account_id>/sync/",
        SyncBankAccountView.as_view(),
        name="bank-account-sync",
    ),

    path(
        "accounts/<uuid:account_id>/",
        BankAccountDetailView.as_view(),
        name="bank-account-detail",
    ),
]