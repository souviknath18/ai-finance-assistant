from dataclasses import dataclass

from django.contrib.auth import get_user_model


User = get_user_model()


@dataclass(frozen=True)
class AuraContext:
    """
    Trusted runtime context for one Aura graph execution.

    This is populated from Django authentication and must never
    come from model-generated arguments.
    """

    user: User