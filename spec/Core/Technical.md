# Technical Context

> Infrastructure, codebases, and benchmarks available for the research project.

## Available Infrastructure

- Google Search API (~40 queries/day)
- Infinite Cloud Go
- YouTube/Bilibili transcript downloader + Whisper
- Sandbox all-in-one Docker container
- Local LLM deployment capability
- OpenAI API keys (limited budget)

## Key Codebases

| Codebase | Owner | Status | Notes |
|----------|-------|--------|-------|
| IGC Pipeline | Qiyue (Bird) | ~60-70% complete | End-to-end runnable, graph in textual representation |
| Search R1 | Qisen | Inference deployed | Qwen 2.5 7B, training not started |
| MiroFlow/MiroThinker | External | Complex | Multi-hundred-round agent loops, MiroFlow + GPT works |

## Target Benchmarks

| Benchmark | Type | Priority |
|-----------|------|----------|
| Live Research Bench | ~100 open-ended questions, rubric evaluation | P0 |
| Deep Research Bench 2 | Open research, human-made rubrics | P0 |
| FutureX / forecasting | Supplementary, time-sensitive | P1 |

## Rejected Benchmarks

- HotpotQA, WebQA — too basic, close-ended
- BrowseComp — browser/computer use, out of scope
- HLE, GAIA — positioning mismatch
- XBench — Chinese-only, computer use oriented
