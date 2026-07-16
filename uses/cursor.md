# Cursor Models

Cursor [models and pricing](https://cursor.com/docs/models-and-pricing#model-pricing).
Prices are per million tokens. Speed, cost, and intelligence tiers come from the Cursor docs model metadata.
Release year and knowledge cutoff year come from provider documentation when Cursor does not publish them.

| Model ID | Context window | Max context | Provider | Capabilities | Speed | Cost | Intelligence | Release year | Knowledge cutoff year | Input | Cache write | Cache read | Output |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [claude-4-sonnet](https://cursor.com/docs/models/claude-4-sonnet) | 200k | - | Anthropic | Agent, Thinking, Images | medium | medium | high | 2025 | 2025 | $3 | $3.75 | $0.3 | $15 |
| [claude-4-sonnet-1m](https://cursor.com/docs/models/claude-4-sonnet-1m) | - | 1M | Anthropic | Agent, Thinking, Images | medium | high | high | 2025 | 2025 | $6 | $7.5 | $0.6 | $22.5 |
| [claude-4-5-haiku](https://cursor.com/docs/models/claude-4-5-haiku) | 200k | - | Anthropic | Thinking, Images | fast | low | moderate | 2025 | 2025 | $1 | $1.25 | $0.1 | $5 |
| [claude-4-5-opus](https://cursor.com/docs/models/claude-opus-4-5) | 200k | 200k | Anthropic | Agent, Thinking, Images | medium | high | frontier | 2025 | 2025 | $5 | $6.25 | $0.5 | $25 |
| [claude-4-5-sonnet](https://cursor.com/docs/models/claude-4-5-sonnet) | 200k | 1M | Anthropic | Agent, Thinking, Images | medium | medium | high | 2025 | 2025 | $3 | $3.75 | $0.3 | $15 |
| [claude-4-6-opus](https://cursor.com/docs/models/claude-opus-4-6) | 200k | 1M | Anthropic | Agent, Thinking, Images | medium | high | frontier | 2026 | 2025 | $5 | $6.25 | $0.5 | $25 |
| [claude-4-6-sonnet](https://cursor.com/docs/models/claude-4-6-sonnet) | 200k | 1M | Anthropic | Agent, Thinking, Images | medium | medium | high | 2026 | 2025 | $3 | $3.75 | $0.3 | $15 |
| [claude-opus-4-7](https://cursor.com/docs/models/claude-opus-4-7) | 300k | 1M | Anthropic | Agent, Thinking, Images | medium | high | frontier | 2026 | 2026 | $5 | $6.25 | $0.5 | $25 |
| [claude-fable-5](https://cursor.com/docs/models/claude-fable-5) | 300k | 1M | Anthropic | Agent, Thinking, Images | medium | high | frontier | 2026 | 2026 | $10 | $12.5 | $1 | $50 |
| [claude-opus-4-7-fast](https://cursor.com/docs/models/claude-opus-4-7-fast) | 200k | 1M | Anthropic | Agent, Thinking, Images | fast | high | frontier | 2026 | 2026 | $30 | $37.5 | $3 | $150 |
| [claude-opus-4-8](https://cursor.com/docs/models/claude-opus-4-8) | 300k | 1M | Anthropic | Agent, Thinking, Images | medium | high | frontier | 2026 | 2026 | $5 | $6.25 | $0.5 | $25 |
| [claude-sonnet-5](https://cursor.com/docs/models/claude-sonnet-5) | 200k | 1M | Anthropic | Agent, Thinking, Images | medium | medium | frontier | 2026 | 2026 | $3 | $3.75 | $0.3 | $15 |
| [composer-1](https://cursor.com/docs/models/cursor-composer-1) | 200k | - | Cursor | Agent, Images | medium | medium | high | 2025 | - | $1.25 | - | $0.125 | $10 |
| [composer-2.5](https://cursor.com/docs/models/cursor-composer-2-5) | 200k | - | Cursor | Agent, Thinking, Images | fast | low | frontier | 2026 | - | $0.5 | - | $0.2 | $2.5 |
| [composer-2.5-fast](https://cursor.com/docs/models/cursor-composer-2-5) | 200k | - | Cursor | Agent, Thinking, Images | fast | high | frontier | 2026 | - | $3 | - | $0.5 | $15 |
| [gemini-2.5-flash](https://cursor.com/docs/models/gemini-2-5-flash) | 200k | 1M | Google | Agent, Thinking, Images | fast | low | moderate | 2025 | 2025 | $0.3 | - | $0.03 | $2.5 |
| [gemini-3-flash](https://cursor.com/docs/models/gemini-3-flash) | 200k | 1M | Google | Agent, Thinking, Images | fast | low | moderate | 2025 | 2025 | $0.5 | - | $0.05 | $3 |
| [gemini-3-pro](https://cursor.com/docs/models/gemini-3-pro) | 200k | 1M | Google | Agent, Thinking, Images | medium | medium | high | 2025 | 2025 | $2 | - | $0.2 | $12 |
| [gemini-3-pro-image-preview](https://cursor.com/docs/models/gemini-3-pro-image-preview) | 200k | 1M | Google | Images | medium | medium | high | 2025 | 2025 | $2 | - | $0.2 | $12 |
| [gemini-3.1-pro](https://cursor.com/docs/models/gemini-3-1-pro) | 200k | 1M | Google | Agent, Thinking, Images | medium | medium | frontier | 2026 | 2025 | $2 | - | $0.2 | $12 |
| [gemini-3.5-flash](https://cursor.com/docs/models/gemini-3-5-flash) | 200k | 1M | Google | Agent, Thinking, Images | fast | low | high | 2026 | 2025 | $1.5 | - | $0.15 | $9 |
| [glm-5.2](https://cursor.com/docs/models/glm-5-2) | 200k | - | Z.ai | Agent, Thinking | medium | low | high | 2026 | - | $1.4 | - | $0.26 | $4.4 |
| [gpt-5.1](https://cursor.com/docs/models/gpt-5) | 272k | - | OpenAI | Agent, Thinking, Images | medium | medium | high | 2025 | 2024 | $1.25 | - | $0.125 | $10 |
| [gpt-5-fast](https://cursor.com/docs/models/gpt-5-fast) | 272k | - | OpenAI | Agent, Thinking, Images | fast | high | high | 2025 | 2024 | $2.5 | - | $0.25 | $20 |
| [gpt-5-mini](https://cursor.com/docs/models/gpt-5-mini) | 272k | - | OpenAI | Agent, Thinking, Images | fast | low | moderate | 2025 | 2024 | $0.25 | - | $0.025 | $2 |
| [gpt-5-codex](https://cursor.com/docs/models/gpt-5-codex) | 272k | - | OpenAI | Agent, Thinking, Images | medium | medium | high | 2025 | 2024 | $1.25 | - | $0.125 | $10 |
| [gpt-5.1-codex](https://cursor.com/docs/models/gpt-5-1-codex) | 272k | - | OpenAI | Agent, Thinking, Images | medium | medium | high | 2025 | 2024 | $1.25 | - | $0.125 | $10 |
| [gpt-5.1-codex-max](https://cursor.com/docs/models/gpt-5-1-codex-max) | 272k | - | OpenAI | Agent, Thinking, Images | medium | medium | high | 2025 | 2024 | $1.25 | - | $0.125 | $10 |
| [gpt-5.1-codex-mini](https://cursor.com/docs/models/gpt-5-1-codex-mini) | 272k | - | OpenAI | Agent, Thinking, Images | fast | low | moderate | 2025 | 2024 | $0.25 | - | $0.025 | $2 |
| [gpt-5.2](https://cursor.com/docs/models/gpt-5.2) | 272k | - | OpenAI | Agent, Thinking, Images | medium | medium | high | 2025 | 2025 | $1.75 | - | $0.175 | $14 |
| [gpt-5.2-codex](https://cursor.com/docs/models/gpt-5-2-codex) | 272k | - | OpenAI | Agent, Thinking, Images | medium | medium | high | 2025 | 2025 | $1.75 | - | $0.175 | $14 |
| [gpt-5.3-codex](https://cursor.com/docs/models/gpt-5-3-codex) | 272k | - | OpenAI | Agent, Thinking, Images | medium | medium | frontier | 2026 | 2025 | $1.75 | - | $0.175 | $14 |
| [gpt-5.4](https://cursor.com/docs/models/gpt-5.4) | 272k | 1M | OpenAI | Agent, Thinking, Images | medium | medium | frontier | 2026 | 2025 | $2.5 | - | $0.25 | $15 |
| [gpt-5.4-mini](https://cursor.com/docs/models/gpt-5-4-mini) | 272k | - | OpenAI | Agent, Thinking, Images | fast | low | high | 2026 | 2025 | $0.75 | - | $0.075 | $4.5 |
| [gpt-5.4-nano](https://cursor.com/docs/models/gpt-5-4-nano) | 272k | - | OpenAI | Agent, Thinking, Images | fast | low | moderate | 2026 | 2025 | $0.2 | - | $0.02 | $1.25 |
| [gpt-5.5](https://cursor.com/docs/models/gpt-5.5) | 272k | 1M | OpenAI | Agent, Thinking, Images | medium | medium | frontier | 2026 | 2025 | $5 | - | $0.5 | $30 |
| [gpt-5.6-luna](https://cursor.com/docs/models/gpt-5-6-luna) | 272k | - | OpenAI | Agent, Thinking, Images | fast | low | moderate | 2026 | 2026 | $1 | $1.25 | $0.1 | $6 |
| [gpt-5.6-sol](https://cursor.com/docs/models/gpt-5-6-sol) | 272k | 1M | OpenAI | Agent, Thinking, Images | medium | medium | frontier | 2026 | 2026 | $5 | $6.25 | $0.5 | $30 |
| [gpt-5.6-terra](https://cursor.com/docs/models/gpt-5-6-terra) | 272k | - | OpenAI | Agent, Thinking, Images | fast | medium | high | 2026 | 2026 | $2.5 | $3.125 | $0.25 | $15 |
| [grok-4-5](https://cursor.com/docs/models/grok-4-5) | 256k | - | Cursor | Agent, Thinking | medium | medium | frontier | 2026 | 2026 | $2 | - | $0.5 | $6 |
| [grok-4-5-fast](https://cursor.com/docs/models/grok-4-5) | 256k | - | Cursor | Agent, Thinking | fast | high | frontier | 2026 | 2026 | $4 | - | $1 | $18 |
| [kimi-k2.7-code](https://cursor.com/docs/models/kimi-k2-7-code) | 262k | - | Moonshot | Agent, Thinking, Images | medium | low | high | 2026 | - | $0.95 | - | $0.19 | $4 |
