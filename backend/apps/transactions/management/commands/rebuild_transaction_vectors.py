from django.core.management.base import BaseCommand

from apps.transactions.models import Transaction
from ai_engine.embeddings.vector_store import store_transaction_vector


class Command(BaseCommand):
    help = "Rebuild Chroma vectors for all existing transactions"

    def handle(self, *args, **options):
        transactions = Transaction.objects.all()

        total = transactions.count()
        success_count = 0
        failed_count = 0

        self.stdout.write(f"Found {total} transactions.")

        for transaction in transactions:
            try:
                store_transaction_vector(transaction)
                success_count += 1

                self.stdout.write(
                    self.style.SUCCESS(
                        f"Vector rebuilt: {transaction.transaction_id}"
                    )
                )

            except Exception as error:
                failed_count += 1

                self.stdout.write(
                    self.style.ERROR(
                        f"Failed: {transaction.transaction_id} - {error}"
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Success: {success_count}, Failed: {failed_count}"
            )
        )