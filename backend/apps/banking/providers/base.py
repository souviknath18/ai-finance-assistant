from abc import ABC, abstractmethod
from typing import Any


class BaseBankProvider(ABC):
    """
    Base interface that every banking provider must implement.

    Aura's business logic should depend on this interface,
    not on DemoBank, Plaid, Setu, Finvu, etc.
    """

    provider_name: str = ""

    @abstractmethod
    def get_institutions(self) -> list[dict[str, Any]]:
        """
        Return financial institutions supported by this provider.
        """
        raise NotImplementedError

    @abstractmethod
    def create_account(
        self,
        institution_code: str,
    ) -> dict[str, Any]:
        """
        Create/fetch the account data required to create
        a BankConnection.
        """
        raise NotImplementedError

    @abstractmethod
    def fetch_transactions(
        self,
        connection,
    ) -> list[dict[str, Any]]:
        """
        Fetch normalized transactions for a BankConnection.

        Every provider should convert its own API response
        into Aura's common transaction structure.
        """
        raise NotImplementedError