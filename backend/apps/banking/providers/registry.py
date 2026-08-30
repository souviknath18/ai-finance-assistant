from .demo_bank import DemoBankProvider


PROVIDERS = {
    "demo": DemoBankProvider,
}


def get_bank_provider(
    provider_name: str,
):
    provider_class = PROVIDERS.get(
        provider_name
    )

    if not provider_class:
        raise ValueError(
            f"Unsupported bank provider: "
            f"{provider_name}"
        )

    return provider_class()