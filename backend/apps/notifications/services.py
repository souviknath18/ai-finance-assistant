from .models import Notification


def create_notification(
    *,
    user,
    title,
    description,
    notification_type,
    tone="dark",
    action_label=None,
    action_url=None,
    progress=None,
):
    return Notification.objects.create(
        user=user,
        title=title,
        description=description,
        notification_type=notification_type,
        tone=tone,
        action_label=action_label,
        action_url=action_url,
        progress=progress,
    )


def create_notification_once(
    *,
    user,
    title,
    description,
    notification_type,
    tone="dark",
    action_label=None,
    action_url=None,
    progress=None,
):
    exists = Notification.objects.filter(
        user=user,
        title=title,
        description=description,
        notification_type=notification_type,
        is_dismissed=False,
    ).exists()

    if exists:
        return None

    return create_notification(
        user=user,
        title=title,
        description=description,
        notification_type=notification_type,
        tone=tone,
        action_label=action_label,
        action_url=action_url,
        progress=progress,
    )