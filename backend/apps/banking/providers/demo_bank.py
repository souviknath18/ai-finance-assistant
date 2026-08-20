import random
import uuid

from datetime import timedelta
from decimal import Decimal

from django.utils import timezone


DEMO_BANKS = {
    "hdfc": {
        "code": "hdfc",
        "name": "HDFC Bank",
        "account_name":
            "HDFC Savings Account",
        "account_type":
            "savings",
        "masked_account_number":
            "4821",
        "currency":
            "INR",
    },

    "sbi": {
        "code": "sbi",
        "name":
            "State Bank of India",
        "account_name":
            "SBI Savings Account",
        "account_type":
            "savings",
        "masked_account_number":
            "7314",
        "currency":
            "INR",
    },

    "icici": {
        "code": "icici",
        "name": "ICICI Bank",
        "account_name":
            "ICICI Savings Account",
        "account_type":
            "savings",
        "masked_account_number":
            "2659",
        "currency":
            "INR",
    },

    "axis": {
        "code": "axis",
        "name": "Axis Bank",
        "account_name":
            "Axis Savings Account",
        "account_type":
            "savings",
        "masked_account_number":
            "9042",
        "currency":
            "INR",
    },
}


DEMO_EXPENSES = [
    (
        "SWIGGY BANGALORE",
        Decimal("428.00"),
    ),
    (
        "ZOMATO",
        Decimal("620.00"),
    ),
    (
        "UBER INDIA",
        Decimal("287.00"),
    ),
    (
        "AMAZON INDIA",
        Decimal("1899.00"),
    ),
    (
        "NETFLIX",
        Decimal("649.00"),
    ),
    (
        "SPOTIFY",
        Decimal("119.00"),
    ),
    (
        "RELIANCE SMART",
        Decimal("2140.00"),
    ),
    (
        "INDIAN OIL",
        Decimal("1800.00"),
    ),
    (
        "BESCOM",
        Decimal("1450.00"),
    ),
    (
        "AIRTEL",
        Decimal("799.00"),
    ),
]


def get_demo_institutions():
    return [
        {
            "code":
                bank["code"],

            "name":
                bank["name"],

            "description":
                (
                    "Connect a simulated "
                    "account with sample "
                    "financial activity."
                ),

            "available":
                True,

            "demo_account_name":
                bank[
                    "account_name"
                ],

            "demo_account_type":
                bank[
                    "account_type"
                ].title(),

            "demo_masked_account_number":
                bank[
                    "masked_account_number"
                ],

            "demo_currency":
                bank[
                    "currency"
                ],
        }
        for bank in
        DEMO_BANKS.values()
    ]


def create_demo_account(
    institution_code: str,
):
    bank = DEMO_BANKS.get(
        institution_code
    )

    if not bank:
        raise ValueError(
            "Unsupported demo institution."
        )

    return {
        "institution_code":
            bank["code"],

        "institution_name":
            bank["name"],

        "account_name":
            bank["account_name"],

        "account_type":
            bank["account_type"],

        "masked_account_number":
            bank[
                "masked_account_number"
            ],

        "external_account_id":
            (
                "demo-account-"
                f"{uuid.uuid4()}"
            ),

        "balance":
            Decimal(
                "84320.00"
            ),

        "currency":
            bank["currency"],
    }


def generate_demo_transactions(
    *,
    count: int = 35,
):
    today = timezone.localdate()

    transactions = []

    for month_offset in range(
        3
    ):
        transaction_date = (
            today
            - timedelta(
                days=(
                    month_offset
                    * 30
                )
            )
        )

        transactions.append(
            {
                "external_transaction_id":
                    (
                        "salary-"
                        f"{transaction_date.isoformat()}"
                    ),

                "date":
                    transaction_date,

                "description":
                    "SALARY CREDIT",

                "merchant_name":
                    "Employer",

                "amount":
                    Decimal(
                        "65000.00"
                    ),

                "transaction_type":
                    "income",

                "balance_after_transaction":
                    None,

                "reference_number":
                    None,
            }
        )

    for _ in range(
        count
    ):
        (
            description,
            amount,
        ) = random.choice(
            DEMO_EXPENSES
        )

        days_ago = (
            random.randint(
                0,
                90,
            )
        )

        transaction_date = (
            today
            - timedelta(
                days=days_ago
            )
        )

        transactions.append(
            {
                "external_transaction_id":
                    (
                        "demo-"
                        f"{uuid.uuid4()}"
                    ),

                "date":
                    transaction_date,

                "description":
                    description,

                "merchant_name":
                    description.title(),

                "amount":
                    amount,

                "transaction_type":
                    "expense",

                "balance_after_transaction":
                    None,

                "reference_number":
                    None,
            }
        )

    return transactions