---
title: "Automating Canvas LMS Downloads"
author: "Isabella Isotta"
date: 2026-04-02
type: workflow
categories: [insead-workflow, automation]
description: "A Playwright-based pipeline that pulls lecture materials and assignments from INSEAD's Canvas LMS every morning, with no manual downloading."
---

## The Problem

Every INSEAD course uploads slides, case PDFs, and assignments to Canvas. Downloading them manually before each class is tedious and easy to forget. I wanted a system that does it automatically.

## How It Works

The pipeline uses **Playwright** (a headless browser automation tool) to log into Canvas through INSEAD's SSO, then hits the Canvas REST API to scan for new files and assignments.

**Daily automated sync (7:30am):** A macOS launchd job runs the script every morning. It scans all 6 Term 2 courses, downloads new lecture materials (PDFs, slides, Excel files), and saves them to organised folders by session number. It also tracks assignments: creating to-do items with deadlines and downloading any attached files.

**Session management:** INSEAD's SSO expires sessions every 1-3 days. When this happens, the script automatically fills credentials into the ADFS login form using a fallback chain of selectors (so it survives UI changes). If auto-login fails, a macOS notification fires with the manual login command copied to the clipboard.

**File routing:** The script extracts session numbers from Canvas module names (e.g. "Session 07" becomes `L07`) and saves files to the correct `Sources/L07/` folder. Files that can't be matched go to an `Unsorted/` folder for manual filing.

**State tracking:** A JSON file tracks which Canvas file IDs have already been downloaded, preventing duplicates. State is saved incrementally after each download, so a crash mid-sync does not lose progress.

## What It Connects To

Once files land in the right folders, a separate **lecture note processor** (also run through Claude Code) can generate structured study notes from the slides and recording transcripts. Assignment to-do items feed into a daily triage system that generates first-pass draft answers.

## Stack

- Python + Playwright (browser automation)
- Canvas REST API (no API token needed; session cookies only)
- macOS launchd (scheduling)
- Claude Code skills (processing downloaded materials)
