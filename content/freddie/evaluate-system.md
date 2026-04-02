---
title: "Design Iteration with Two AI Agents"
author: "Freddie Chambers"
date: 2026-04-01
categories: [app-building, design, ai-tools]
description: "A two-agent system where one AI writes code and another scores the live app through a browser, iterating until the design is genuinely good."
---

## The Core Insight

The AI that writes the code cannot objectively judge it. It is too close to its own work. So we split the process into two roles: a **generator** and an **evaluator**, and make them iterate until the result is genuinely good.

The generator (the main Claude Code session) writes and improves the UI. The evaluator is a fresh AI agent that has never seen the source code. It can only interact with the live app through a browser, exactly like a real user would. It takes screenshots, clicks around, and scores what it sees against predefined criteria.

## How It Works

For each iteration:

1. The generator modifies the code and commits (every iteration is a git checkpoint)
2. A fresh evaluator subagent is spawned with zero memory of previous evaluations
3. The evaluator navigates the live app, screenshots every screen, interacts with it, and scores it
4. The generator parses the scores and feedback, decides whether to **refine** (keep the concept, improve execution) or **pivot** (the concept is generic, start fresh)
5. Loop until the threshold is met or iterations are exhausted

## Why Fresh Context Matters

Each evaluator is a new AI instance with no memory. This solves three problems:

- **No anchoring bias:** It cannot be lenient because "last time was a 4, so 5 feels like progress." It does not know last time existed.
- **No code sympathy:** It cannot think "well, that gradient is actually clever if you look at the CSS." It has no CSS.
- **No cumulative drift:** Evaluators do not gradually lower their standards over iterations. Each one applies the calibration block cold.

## Scoring Calibration

Without calibration, the whole system collapses into meaningless 7/10s. AI evaluators default to generous assessments. The calibration block provides concrete anchors:

- **3/10:** Default framework styling with a colour swap. Looks like create-react-app.
- **5/10:** Clean but conventional. You have seen this layout on 50 SaaS landing pages.
- **7/10:** Intentional choices. Palette that means something, typography that creates mood.
- **9/10:** Exhibition-grade. Every pixel has a reason.

Two critical rules: "If it looks like something an AI could generate in one shot from common patterns, originality cannot exceed 6." And: "Functional correctness does not raise design scores."

## Refine vs Pivot

The refine/pivot distinction prevents the system from making increasingly marginal adjustments to a mediocre concept. **Refine** when scores are improving and the critique is about polish. **Pivot** when scores plateau or originality is stuck below 6, meaning the concept itself is generic and no amount of polishing will fix it.

A pivot means changing the layout model, the visual metaphor, the density, or the typography approach. Swapping hex values is a refine, not a pivot.
