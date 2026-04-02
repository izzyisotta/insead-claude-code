---
title: "Morning Triage System"
author: "Isabella Isotta"
date: 2026-04-02
type: workflow
categories: [productivity, automation]
description: "A daily ritual skill that enriches new tasks, processes lecture materials, generates assignment first passes, and produces a morning briefing."
---

## The Problem

MBA life generates a constant stream of tasks, deadlines, readings, and assignments across multiple courses, career activities, and personal projects. Without a system, things fall through the cracks.

## How It Works

A Claude Code skill called `/triage` runs every morning as the first thing. It is almost entirely automatic: you run it and get a briefing back, with background agents handling the work.

**What it does:**

1. **Syncs incoming files:** Pulls transcripts from Google Drive, fixes file extensions from iOS shortcuts
2. **Enriches new inbox items:** Scans each new task/resource/idea for vault context (related people, companies, deadlines, existing notes) and appends a structured plan
3. **Processes lecture materials:** Automatically runs the lecture note processor on any lectures with both slides and transcript
4. **Generates assignment first passes:** For assignments with future deadlines that have not been drafted yet, launches background agents to read the brief and generate a structured first attempt
5. **Checks Canvas sync status:** Reports whether the morning's automated download succeeded or failed
6. **Morning briefing:** Surfaces deadlines due this week, stale items, someday items worth reviewing, and a summary of open tasks
7. **Deadline activation:** Auto-promotes items to "active" when their deadline is within 7 days
8. **Archive cleanup:** Moves completed/killed items out of the active inbox

## The Key Design Decision

Almost nothing requires approval. Lecture processing, assignment first passes, clipping processing, and inbox enrichment all run automatically as background agents. The briefing is what you read; the work has already started by the time you see it.

The only exception is merge candidates (overlapping tasks that might be duplicates), which genuinely need a human decision.

## What It Produces

A concise morning briefing with: Canvas sync status, items enriched, deadlines, stale items, and a count of background agents launched. Plus a dated triage log note for the record.
