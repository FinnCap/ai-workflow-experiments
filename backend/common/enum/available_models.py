from enum import Enum


class AvailableModels(Enum):
    ANTHROPIC_CLAUDE_SONNET_4 = "claude-sonnet-4-20250514"
    ANTHROPIC_CLAUDE_SONNET_4_5 = "claude-sonnet-4-5-20250929"
    ANTHROPIC_CLAUDE_HAIKU_4_5 = "claude-haiku-4-5-20251001"

    MISTRAL_MEDIUM_3_1 = "mistral-medium-2508"
    MISTRAL_DEVSTRAL_MEDIUM = "devstral-medium-2507"

    def is_claude(self):
        return "claude" in self.value

    def is_mistral(self):
        return "mistral" in self.value or "devstral" in self.value
