from decimal import Decimal
from unittest.mock import patch

from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.test import APITestCase

from apps.banking.models import BankConnection


User = get_user_model()


class BankingAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="souvik@example.com",
            full_name="Souvik Nath",
            password="testpass123",
        )

        self.other_user = User.objects.create_user(
            email="other@example.com",
            full_name="Other User",
            password="testpass123",
        )

        self.account = BankConnection.objects.create(
            user=self.user,

            provider="demo",

            institution_code="hdfc",
            institution_name="HDFC Bank",

            account_name="HDFC Savings Account",
            account_type=(
                BankConnection
                .AccountType
                .SAVINGS
            ),

            masked_account_number="4821",

            external_account_id=(
                "test-account-001"
            ),

            balance=Decimal(
                "50000.00"
            ),

            currency="INR",

            status=(
                BankConnection
                .Status
                .CONNECTED
            ),

            is_demo=True,
        )

        self.client.force_authenticate(
            user=self.user
        )

    # --------------------------------------------------
    # Account list
    # --------------------------------------------------

    def test_user_can_list_own_accounts(self):
        response = self.client.get(
            "/api/banking/accounts/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data["accounts"]),
            1,
        )

        self.assertEqual(
            response.data[
                "accounts"
            ][0]["institution_code"],
            "hdfc",
        )

    def test_user_cannot_see_another_users_accounts(
        self,
    ):
        BankConnection.objects.create(
            user=self.other_user,

            provider="demo",

            institution_code="sbi",
            institution_name=(
                "State Bank of India"
            ),

            account_name=(
                "SBI Savings Account"
            ),

            account_type=(
                BankConnection
                .AccountType
                .SAVINGS
            ),

            masked_account_number="1234",

            external_account_id=(
                "other-account-001"
            ),

            balance=Decimal(
                "90000.00"
            ),

            currency="INR",

            status=(
                BankConnection
                .Status
                .CONNECTED
            ),

            is_demo=True,
        )

        response = self.client.get(
            "/api/banking/accounts/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            len(response.data["accounts"]),
            1,
        )

        account_ids = [
            str(account["id"])
            for account
            in response.data["accounts"]
        ]

        self.assertIn(
            str(self.account.id),
            account_ids,
        )

    # --------------------------------------------------
    # Async sync
    # --------------------------------------------------

    @patch(
        "apps.banking.views."
        "sync_bank_connection_task.delay"
    )
    def test_sync_queues_celery_task(
        self,
        mock_delay,
    ):
        response = self.client.post(
            (
                f"/api/banking/accounts/"
                f"{self.account.id}/sync/"
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_202_ACCEPTED,
        )

        self.account.refresh_from_db()

        self.assertEqual(
            self.account.status,
            BankConnection
            .Status
            .SYNCING,
        )

        mock_delay.assert_called_once_with(
            str(self.account.id)
        )

        self.assertEqual(
            response.data["status"],
            "syncing",
        )

    @patch(
        "apps.banking.views."
        "sync_bank_connection_task.delay"
    )
    def test_syncing_account_is_not_queued_twice(
        self,
        mock_delay,
    ):
        self.account.status = (
            BankConnection
            .Status
            .SYNCING
        )

        self.account.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        response = self.client.post(
            (
                f"/api/banking/accounts/"
                f"{self.account.id}/sync/"
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_202_ACCEPTED,
        )

        self.assertEqual(
            response.data["status"],
            "syncing",
        )

        mock_delay.assert_not_called()

    # --------------------------------------------------
    # Security / user isolation
    # --------------------------------------------------

    @patch(
        "apps.banking.views."
        "sync_bank_connection_task.delay"
    )
    def test_user_cannot_sync_another_users_account(
        self,
        mock_delay,
    ):
        other_account = (
            BankConnection.objects.create(
                user=self.other_user,

                provider="demo",

                institution_code="sbi",

                institution_name=(
                    "State Bank of India"
                ),

                account_name=(
                    "SBI Savings Account"
                ),

                account_type=(
                    BankConnection
                    .AccountType
                    .SAVINGS
                ),

                masked_account_number=(
                    "9999"
                ),

                external_account_id=(
                    "other-bank-account"
                ),

                balance=Decimal(
                    "25000.00"
                ),

                status=(
                    BankConnection
                    .Status
                    .CONNECTED
                ),
            )
        )

        response = self.client.post(
            (
                f"/api/banking/accounts/"
                f"{other_account.id}/sync/"
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        mock_delay.assert_not_called()

    # --------------------------------------------------
    # Disconnected accounts
    # --------------------------------------------------

    @patch(
        "apps.banking.views."
        "sync_bank_connection_task.delay"
    )
    def test_disconnected_account_cannot_sync(
        self,
        mock_delay,
    ):
        self.account.status = (
            BankConnection
            .Status
            .DISCONNECTED
        )

        self.account.save(
            update_fields=[
                "status",
                "updated_at",
            ]
        )

        response = self.client.post(
            (
                f"/api/banking/accounts/"
                f"{self.account.id}/sync/"
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        mock_delay.assert_not_called()

    # --------------------------------------------------
    # Queue failure
    # --------------------------------------------------

    @patch(
        "apps.banking.views."
        "sync_bank_connection_task.delay"
    )
    def test_queue_failure_marks_account_as_error(
        self,
        mock_delay,
    ):
        mock_delay.side_effect = Exception(
            "Redis unavailable"
        )

        response = self.client.post(
            (
                f"/api/banking/accounts/"
                f"{self.account.id}/sync/"
            )
        )

        self.assertEqual(
            response.status_code,
            (
                status
                .HTTP_503_SERVICE_UNAVAILABLE
            ),
        )

        self.account.refresh_from_db()

        self.assertEqual(
            self.account.status,
            BankConnection
            .Status
            .ERROR,
        )

        self.assertIsNotNone(
            self.account.last_sync_error
        )

    # --------------------------------------------------
    # Disconnect
    # --------------------------------------------------

    def test_user_can_disconnect_own_account(
        self,
    ):
        response = self.client.delete(
            (
                f"/api/banking/accounts/"
                f"{self.account.id}/"
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_204_NO_CONTENT,
        )

        self.account.refresh_from_db()

        self.assertEqual(
            self.account.status,
            BankConnection
            .Status
            .DISCONNECTED,
        )

    def test_user_cannot_disconnect_another_users_account(
        self,
    ):
        other_account = (
            BankConnection.objects.create(
                user=self.other_user,

                provider="demo",

                institution_code="axis",

                institution_name=(
                    "Axis Bank"
                ),

                account_name=(
                    "Axis Savings Account"
                ),

                account_type=(
                    BankConnection
                    .AccountType
                    .SAVINGS
                ),

                masked_account_number=(
                    "7777"
                ),

                external_account_id=(
                    "axis-other-account"
                ),

                status=(
                    BankConnection
                    .Status
                    .CONNECTED
                ),
            )
        )

        response = self.client.delete(
            (
                f"/api/banking/accounts/"
                f"{other_account.id}/"
            )
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

        other_account.refresh_from_db()

        self.assertEqual(
            other_account.status,
            BankConnection
            .Status
            .CONNECTED,
        )