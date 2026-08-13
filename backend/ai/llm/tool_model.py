from ai.llm.langchain_client import (
    get_aura_chat_model,
)
from ai.tools.langchain import (
    AURA_TOOLS,
)


def get_aura_tool_model():
    model = get_aura_chat_model()

    return model.bind_tools(
        AURA_TOOLS
    )