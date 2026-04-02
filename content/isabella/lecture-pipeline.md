---
title: "AI Lecture Note Generation"
author: "Isabella Isotta"
date: 2026-04-02
categories: [insead-workflow, automation, ai-tools]
description: "Turning lecture slides and recording transcripts into comprehensive study notes using Claude Code."
---

## The Problem

INSEAD lectures move fast. Slides are dense, professors add context verbally, and by exam time you need structured notes that connect concepts across sessions. Writing these manually takes hours per lecture.

## How It Works

A Claude Code skill called `/lecture-note-processor` takes two inputs: the lecture slide PDFs and the recording transcript. It reads both using PyPDF2, then generates a structured note with:

- **Key Concepts:** 8-12 wikilinked definitions extracted from the lecture
- **Summary:** 3-section overview covering the core problem, case analysis, and applications
- **Detailed Notes:** Comprehensive walkthrough of the lecture content, integrating both what's on the slides and what the professor said in class
- **Equations:** All formulas in LaTeX for proper rendering
- **Cross-references:** Links to related lectures and reading materials

## What Makes It Good

The transcript is the secret weapon. Slides alone give you a skeleton. The transcript captures the professor's emphasis, the worked examples they walk through on the board, the student questions that reveal common misunderstandings, and the "this is what matters for the exam" hints. Combining both sources produces notes that are genuinely useful for revision.

## When It Runs

During the daily `/triage` routine, Claude automatically scans for lectures that have both slides and a transcript but no processed notes. These get launched as background agents, one per subject, running in parallel. No manual approval needed.

Lectures with only slides (no transcript) are flagged as "waiting for recording" and skipped until the transcript arrives.

## Output

Each lecture gets a single markdown note (~1500-3000 words) that lives alongside the source materials. The note's frontmatter links it to the subject and lecture number, so it's queryable by course.
