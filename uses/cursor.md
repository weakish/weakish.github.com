# Cursor Models

Cursor [models and pricing](https://cursor.com/docs/models-and-pricing#model-pricing).
Prices are per million tokens. Speed, cost, and intelligence tiers come from the Cursor docs model metadata.
Release year and knowledge cutoff year come from provider documentation when Cursor does not publish them.
Cursor Cloud indicates availability in the Cloud Agent model picker on [cursor.com/agents](https://cursor.com/agents) (snapshot 11 Oct 2026).

## CursorBench

[CursorBench](https://cursor.com/cursorbench) 4.0 plots correctness against average cost per task.
Cost decreases toward the right, so the upper-right is higher score at lower cost.
Points from the same model family are connected Minimal → Low → Medium → High → Extra High → Max, skipping missing levels.
An outer ring marks a model/effort available in the Cloud Agent picker.
Hover or tap a point for the model name and effort.
Numbers are from the public leaderboard (pricing snapshot 10 Oct 2026).
Rings on this plot are Grok 4.6/4.7, Opus 5.5, GPT-5.6 Sol, Fable 5.1, Gemini 3.8 Flash, Muse Spark 1.3, and Sonnet 5.5 at all listed efforts.
The table Cloud column is the 11 Oct 2026 picker (also Gemini 3.7 Flash, which is not on CursorBench 4.0).
Sonnet 5.5 and Haiku 5.5 scale hard with effort: Sonnet 5.5 Low 35.8% → Max 55.5% (2nd overall); Haiku 5.5 Low 30.9% → Max 48.4%.
GPT-5.6 does not: Sol Max 41.7% and Terra Max 41.3% sit with Haiku High (42.3%), next to Grok 4.6 Extra High and Muse Spark 1.3 Max; Luna Low is last at 16.0%.

![CursorBench 4.0 score versus average cost per task](/uses/cursor-bench.svg)

| Model ID | Context window | Max context | Provider | Capabilities | Cursor Cloud | Speed | Cost | Intelligence | Release year | Knowledge cutoff year | Input | Cache write | Cache read | Output |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [claude-4-sonnet](https://cursor.com/docs/models/claude-4-sonnet) | 200k | - | Anthropic | Agent, Thinking, Images | - | medium | medium | high | 2025 | 2025 | $3 | $3.75 | $0.3 | $15 |
| [claude-4-sonnet-1m](https://cursor.com/docs/models/claude-4-sonnet-1m) | - | 1M | Anthropic | Agent, Thinking, Images | - | medium | high | high | 2025 | 2025 | $6 | $7.5 | $0.6 | $22.5 |
| [claude-4-5-haiku](https://cursor.com/docs/models/claude-4-5-haiku) | 200k | - | Anthropic | Thinking, Images | - | fast | low | moderate | 2025 | 2025 | $1 | $1.25 | $0.1 | $5 |
| [claude-4-5-opus](https://cursor.com/docs/models/claude-opus-4-5) | 200k | 200k | Anthropic | Agent, Thinking, Images | - | medium | high | frontier | 2025 | 2025 | $5 | $6.25 | $0.5 | $25 |
| [claude-4-5-sonnet](https://cursor.com/docs/models/claude-4-5-sonnet) | 200k | 1M | Anthropic | Agent, Thinking, Images | - | medium | medium | high | 2025 | 2025 | $3 | $3.75 | $0.3 | $15 |
| [claude-4-6-opus](https://cursor.com/docs/models/claude-opus-4-6) | 200k | 1M | Anthropic | Agent, Thinking, Images | - | medium | high | frontier | 2026 | 2025 | $5 | $6.25 | $0.5 | $25 |
| [claude-4-6-sonnet](https://cursor.com/docs/models/claude-4-6-sonnet) | 200k | 1M | Anthropic | Agent, Thinking, Images | - | medium | medium | high | 2026 | 2025 | $3 | $3.75 | $0.3 | $15 |
| [claude-opus-4-7](https://cursor.com/docs/models/claude-opus-4-7) | 300k | 1M | Anthropic | Agent, Thinking, Images | - | medium | high | frontier | 2026 | 2026 | $5 | $6.25 | $0.5 | $25 |
| [claude-fable-5](https://cursor.com/docs/models/claude-fable-5) | 300k | 1M | Anthropic | Agent, Thinking, Images | - | medium | high | frontier | 2026 | 2026 | $10 | $12.5 | $1 | $50 |
| [claude-fable-5.1](https://cursor.com/docs/models/claude-fable-5-1) | 300k | 1M | Anthropic | Agent, Thinking, Images | yes | medium | high | frontier | 2026 | 2026 | $10 | $12.5 | $0.25 | $50 |
| [claude-opus-4-7-fast](https://cursor.com/docs/models/claude-opus-4-7-fast) | 200k | 1M | Anthropic | Agent, Thinking, Images | - | fast | high | frontier | 2026 | 2026 | $30 | $37.5 | $3 | $150 |
| [claude-opus-4-8](https://cursor.com/docs/models/claude-opus-4-8) | 300k | 1M | Anthropic | Agent, Thinking, Images | - | medium | high | frontier | 2026 | 2026 | $5 | $6.25 | $0.5 | $25 |
| [claude-opus-4-8-fast](https://cursor.com/docs/models/claude-opus-4-8) | 300k | 1M | Anthropic | Agent, Thinking, Images | - | fast | high | frontier | 2026 | 2026 | $10 | $12.5 | $1 | $50 |
| [claude-opus-5](https://cursor.com/docs/models/claude-opus-5) | 300k | 1M | Anthropic | Agent, Thinking, Images | - | medium | high | frontier | 2026 | 2026 | $5 | $6.25 | $0.5 | $25 |
| [claude-opus-5-fast](https://cursor.com/docs/models/claude-opus-5) | 300k | 1M | Anthropic | Agent, Thinking, Images | - | fast | high | frontier | 2026 | 2026 | $10 | $12.5 | $1 | $50 |
| [claude-opus-5.5](https://cursor.com/docs/models/claude-opus-5-5) | 300k | 1M | Anthropic | Agent, Thinking, Images | yes | medium | high | frontier | 2026 | 2026 | $4 | $5 | $0.2 | $20 |
| [claude-sonnet-5](https://cursor.com/docs/models/claude-sonnet-5) | 200k | 1M | Anthropic | Agent, Thinking, Images | - | medium | medium | frontier | 2026 | 2026 | $2 | $2.5 | $0.2 | $10 |
| [claude-sonnet-5.5](https://cursor.com/docs/models/claude-sonnet-5-5) | 200k | 1M | Anthropic | Agent, Thinking, Images | yes | medium | medium | frontier | 2026 | 2026 | $2 | $2.5 | $0.1 | $10 |
| [composer-1](https://cursor.com/docs/models/cursor-composer-1) | 200k | - | Cursor | Agent, Images | - | medium | medium | high | 2025 | - | $1.25 | - | $0.125 | $10 |
| [composer-2.5](https://cursor.com/docs/models/cursor-composer-2-5) | 200k | - | Cursor | Agent, Thinking, Images | - | fast | low | frontier | 2026 | - | $0.5 | - | $0.2 | $2.5 |
| [composer-2.5-fast](https://cursor.com/docs/models/cursor-composer-2-5) | 200k | - | Cursor | Agent, Thinking, Images | - | fast | high | frontier | 2026 | - | $3 | - | $0.5 | $15 |
| [gemini-2.5-flash](https://cursor.com/docs/models/gemini-2-5-flash) | 200k | 1M | Google | Agent, Thinking, Images | - | fast | low | moderate | 2025 | 2025 | $0.3 | - | $0.03 | $2.5 |
| [gemini-3-flash](https://cursor.com/docs/models/gemini-3-flash) | 200k | 1M | Google | Agent, Thinking, Images | - | fast | low | moderate | 2025 | 2025 | $0.5 | - | $0.05 | $3 |
| [gemini-3-pro](https://cursor.com/docs/models/gemini-3-pro) | 200k | 1M | Google | Agent, Thinking, Images | - | medium | medium | high | 2025 | 2025 | $2 | - | $0.2 | $12 |
| [gemini-3-pro-image-preview](https://cursor.com/docs/models/gemini-3-pro-image-preview) | 200k | 1M | Google | Images | - | medium | medium | high | 2025 | 2025 | $2 | - | $0.2 | $12 |
| [gemini-3.1-pro](https://cursor.com/docs/models/gemini-3-1-pro) | 200k | 1M | Google | Agent, Thinking, Images | - | medium | medium | frontier | 2026 | 2025 | $2 | - | $0.2 | $12 |
| [gemini-3.5-flash](https://cursor.com/docs/models/gemini-3-5-flash) | 200k | 1M | Google | Agent, Thinking, Images | - | fast | low | high | 2026 | 2025 | $1.5 | - | $0.15 | $9 |
| [gemini-3.6-flash](https://cursor.com/docs/models/gemini-3-6-flash) | 200k | 1M | Google | Agent, Thinking, Images | - | fast | low | high | 2026 | 2026 | $1.5 | - | $0.15 | $7.5 |
| [gemini-3.7-flash](https://cursor.com/docs/models/gemini-3-7-flash) | 200k | 1M | Google | Agent, Thinking, Images | yes | fast | low | high | 2026 | 2026 | $0.75 | - | $0.075 | $3.5 |
| [gemini-3.8-flash](https://cursor.com/docs/models/gemini-3-8-flash) | 200k | 1M | Google | Agent, Thinking, Images | yes | fast | low | high | 2026 | 2026 | $0.75 | - | $0.075 | $3.5 |
| [glm-5.2](https://cursor.com/docs/models/glm-5-2) | 200k | - | Z.ai | Agent, Thinking | - | medium | low | high | 2026 | - | $1.4 | - | $0.26 | $4.4 |
| [gpt-5.1](https://cursor.com/docs/models/gpt-5) | 272k | - | OpenAI | Agent, Thinking, Images | - | medium | medium | high | 2025 | 2024 | $1.25 | - | $0.125 | $10 |
| [gpt-5-fast](https://cursor.com/docs/models/gpt-5-fast) | 272k | - | OpenAI | Agent, Thinking, Images | - | fast | high | high | 2025 | 2024 | $2.5 | - | $0.25 | $20 |
| [gpt-5-mini](https://cursor.com/docs/models/gpt-5-mini) | 272k | - | OpenAI | Agent, Thinking, Images | - | fast | low | moderate | 2025 | 2024 | $0.25 | - | $0.025 | $2 |
| [gpt-5-codex](https://cursor.com/docs/models/gpt-5-codex) | 272k | - | OpenAI | Agent, Thinking, Images | - | medium | medium | high | 2025 | 2024 | $1.25 | - | $0.125 | $10 |
| [gpt-5.1-codex](https://cursor.com/docs/models/gpt-5-1-codex) | 272k | - | OpenAI | Agent, Thinking, Images | - | medium | medium | high | 2025 | 2024 | $1.25 | - | $0.125 | $10 |
| [gpt-5.1-codex-max](https://cursor.com/docs/models/gpt-5-1-codex-max) | 272k | - | OpenAI | Agent, Thinking, Images | - | medium | medium | high | 2025 | 2024 | $1.25 | - | $0.125 | $10 |
| [gpt-5.1-codex-mini](https://cursor.com/docs/models/gpt-5-1-codex-mini) | 272k | - | OpenAI | Agent, Thinking, Images | - | fast | low | moderate | 2025 | 2024 | $0.25 | - | $0.025 | $2 |
| [gpt-5.2](https://cursor.com/docs/models/gpt-5-2) | 272k | - | OpenAI | Agent, Thinking, Images | - | medium | medium | high | 2025 | 2025 | $1.75 | - | $0.175 | $14 |
| [gpt-5.2-codex](https://cursor.com/docs/models/gpt-5-2-codex) | 272k | - | OpenAI | Agent, Thinking, Images | - | medium | medium | high | 2025 | 2025 | $1.75 | - | $0.175 | $14 |
| [gpt-5.3-codex](https://cursor.com/docs/models/gpt-5-3-codex) | 272k | - | OpenAI | Agent, Thinking, Images | - | medium | medium | frontier | 2026 | 2025 | $1.75 | - | $0.175 | $14 |
| [gpt-5.4](https://cursor.com/docs/models/gpt-5-4) | 272k | 1M | OpenAI | Agent, Thinking, Images | - | medium | medium | frontier | 2026 | 2025 | $2.5 | - | $0.25 | $15 |
| [gpt-5.4-fast](https://cursor.com/docs/models/gpt-5-4) | 272k | 1M | OpenAI | Agent, Thinking, Images | - | fast | high | frontier | 2026 | 2025 | $5 | - | $0.5 | $30 |
| [gpt-5.4-mini](https://cursor.com/docs/models/gpt-5-4-mini) | 272k | - | OpenAI | Agent, Thinking, Images | - | fast | low | high | 2026 | 2025 | $0.75 | - | $0.075 | $4.5 |
| [gpt-5.4-nano](https://cursor.com/docs/models/gpt-5-4-nano) | 272k | - | OpenAI | Agent, Thinking, Images | - | fast | low | moderate | 2026 | 2025 | $0.2 | - | $0.02 | $1.25 |
| [gpt-5.5](https://cursor.com/docs/models/gpt-5-5) | 272k | 1M | OpenAI | Agent, Thinking, Images | - | medium | medium | frontier | 2026 | 2025 | $5 | - | $0.5 | $30 |
| [gpt-5.5-fast](https://cursor.com/docs/models/gpt-5-5) | 272k | 1M | OpenAI | Agent, Thinking, Images | - | fast | high | frontier | 2026 | 2025 | $12.5 | - | $1.25 | $75 |
| [gpt-5.6-luna](https://cursor.com/docs/models/gpt-5-6-luna) | 272k | - | OpenAI | Agent, Thinking, Images | - | fast | low | moderate | 2026 | 2026 | $0.2 | $0.25 | $0.02 | $1.2 |
| [gpt-5.6-luna-fast](https://cursor.com/docs/models/gpt-5-6-luna) | 272k | - | OpenAI | Agent, Thinking, Images | - | fast | low | moderate | 2026 | 2026 | $0.4 | $0.5 | $0.04 | $2.4 |
| [gpt-5.6-sol](https://cursor.com/docs/models/gpt-5-6-sol) | 272k | 1M | OpenAI | Agent, Thinking, Images | yes | medium | medium | frontier | 2026 | 2026 | $5 | $6.25 | $0.5 | $30 |
| [gpt-5.6-sol-fast](https://cursor.com/docs/models/gpt-5-6-sol) | 272k | 1M | OpenAI | Agent, Thinking, Images | yes | fast | high | frontier | 2026 | 2026 | $10 | $12.5 | $1 | $60 |
| [gpt-5.6-terra](https://cursor.com/docs/models/gpt-5-6-terra) | 272k | - | OpenAI | Agent, Thinking, Images | - | fast | medium | high | 2026 | 2026 | $2 | $2.5 | $0.2 | $12 |
| [gpt-5.6-terra-fast](https://cursor.com/docs/models/gpt-5-6-terra) | 272k | - | OpenAI | Agent, Thinking, Images | - | fast | high | high | 2026 | 2026 | $4 | $5 | $0.4 | $24 |
| [grok-4.5](https://cursor.com/docs/models/grok-4-5) | 256k | - | Cursor | Agent, Thinking | - | medium | medium | frontier | 2026 | 2026 | $2 | - | $0.5 | $6 |
| [grok-4.5-fast](https://cursor.com/docs/models/grok-4-5) | 256k | - | Cursor | Agent, Thinking | - | fast | high | frontier | 2026 | 2026 | $4 | - | $1 | $12 |
| [grok-4.6](https://cursor.com/docs/models/grok-4-6) | 256k | - | Cursor | Agent, Thinking | yes | medium | medium | frontier | 2026 | 2026 | $2 | - | $0.5 | $6 |
| [grok-4.6-fast](https://cursor.com/docs/models/grok-4-6) | 256k | - | Cursor | Agent, Thinking | yes | fast | high | frontier | 2026 | 2026 | $4 | - | $1 | $12 |
| [grok-4.7](https://cursor.com/docs/models/grok-4-7) | 256k | 500k | Cursor | Agent, Thinking | yes | medium | medium | frontier | 2026 | 2026 | $2 | - | $0.5 | $6 |
| [grok-4.7-fast](https://cursor.com/docs/models/grok-4-7) | 256k | 500k | Cursor | Agent, Thinking | yes | fast | high | frontier | 2026 | 2026 | $4 | - | $1 | $12 |
| [muse-spark-1.3](https://cursor.com/docs/models/muse-spark-1-3) | 300k | 1M | Meta | Agent, Thinking, Images | yes | medium | low | frontier | 2026 | - | $1.25 | - | $0.15 | $4.25 |
| [kimi-k2.7-code](https://cursor.com/docs/models/kimi-k2-7-code) | 262k | - | Moonshot | Agent, Thinking, Images | - | medium | low | high | 2026 | - | $0.95 | - | $0.19 | $4 |
| [kimi-k3](https://cursor.com/docs/models/kimi-k3) | 200k | 1M | Moonshot | Agent, Thinking, Images | - | medium | medium | high | 2026 | - | $3 | - | $0.3 | $15 |
