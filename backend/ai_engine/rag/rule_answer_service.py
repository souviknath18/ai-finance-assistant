from decimal import Decimal
from django.db.models import Sum, Count, Max
from apps.transactions.models import Transaction


def format_money(amount):
    amount = amount or Decimal("0.00")
    return f"₹{abs(amount):,.2f}"


def get_base_transactions(user):
    return Transaction.objects.filter(user=user)


def get_expense_transactions(user):
    return get_base_transactions(user).filter(transaction_type="expense")


def get_income_transactions(user):
    return get_base_transactions(user).filter(transaction_type="income")


def try_rule_based_answer(user, question: str):
    q = question.lower().strip()

    # 1. Total income
    if any(word in q for word in ["total income", "income earned", "how much income"]):
        total = get_income_transactions(user).aggregate(total=Sum("amount"))["total"]
        count = get_income_transactions(user).count()

        return {
            "answer": f"Your total income is {format_money(total)} across {count} income transaction{'s' if count != 1 else ''}.",
            "sources": [],
            "source_type": "rule",
        }

    # 2. Total expense
    if any(word in q for word in ["total expense", "total spent", "how much spent", "how much did i spend"]):
        total = get_expense_transactions(user).aggregate(total=Sum("amount"))["total"]
        count = get_expense_transactions(user).count()

        return {
            "answer": f"Your total spending is {format_money(total)} across {count} expense transaction{'s' if count != 1 else ''}.",
            "sources": [],
            "source_type": "rule",
        }

    # 3. Spending by category
    categories = (
        get_base_transactions(user)
        .exclude(category__isnull=True)
        .exclude(category="")
        .values_list("category", flat=True)
        .distinct()
    )

    matched_category = None

    for category in categories:
        if category and category.lower() in q:
            matched_category = category
            break

    if matched_category and any(word in q for word in ["how much", "total", "spent", "spend", "expense"]):
        transactions = get_expense_transactions(user).filter(
            category__iexact=matched_category
        )

        total = transactions.aggregate(total=Sum("amount"))["total"]
        count = transactions.count()

        return {
            "answer": f"You spent {format_money(total)} on {matched_category} across {count} transaction{'s' if count != 1 else ''}.",
            "sources": [],
            "source_type": "rule",
        }

    # 4. Highest spending category
    if any(phrase in q for phrase in ["where did i spend the most", "highest spending category", "top category", "most money"]):
        top_category = (
            get_expense_transactions(user)
            .exclude(category__isnull=True)
            .exclude(category="")
            .values("category")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("-total")
            .first()
        )

        if top_category:
            return {
                "answer": f"Your highest spending category is {top_category['category']} with {format_money(top_category['total'])} across {top_category['count']} transaction{'s' if top_category['count'] != 1 else ''}.",
                "sources": [],
                "source_type": "rule",
            }

    # 5. Highest single transaction
    if any(phrase in q for phrase in ["highest transaction", "biggest transaction", "largest transaction", "biggest expense", "largest expense"]):
        transaction = get_expense_transactions(user).order_by("-amount").first()

        if transaction:
            return {
                "answer": f"Your largest expense was {format_money(transaction.amount)} for {transaction.merchant_name or transaction.description} on {transaction.date}.",
                "sources": [],
                "source_type": "rule",
            }

    # 6. Transaction count
    if any(phrase in q for phrase in ["how many transactions", "transaction count", "number of transactions"]):
        total_count = get_base_transactions(user).count()
        expense_count = get_expense_transactions(user).count()
        income_count = get_income_transactions(user).count()

        return {
            "answer": f"You have {total_count} transactions: {expense_count} expenses and {income_count} income transactions.",
            "sources": [],
            "source_type": "rule",
        }

    # 7. Category breakdown
    if any(phrase in q for phrase in ["category breakdown", "spending breakdown", "breakdown by category"]):
        breakdown = (
            get_expense_transactions(user)
            .exclude(category__isnull=True)
            .exclude(category="")
            .values("category")
            .annotate(total=Sum("amount"), count=Count("id"))
            .order_by("-total")[:5]
        )

        if breakdown:
            lines = [
                f"{item['category']}: {format_money(item['total'])} across {item['count']} transaction{'s' if item['count'] != 1 else ''}"
                for item in breakdown
            ]

            return {
                "answer": "Here is your top spending breakdown:\n" + "\n".join(lines),
                "sources": [],
                "source_type": "rule",
            }

    return None