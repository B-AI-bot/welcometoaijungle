# Our Complete AI Stack — How We Built a Personal AI Infrastructure in 2026

**Author:** Loïc Galland
**Published:** July 21, 2025
**Site:** [Welcome to the AI Jungle](https://welcometotheaijungle.com)
**Tags:** AI Infrastructure, Personal AI Agent, Self-Hosted AI, AI for Engineers

---

## TL;DR

We run a personal AI agent stack on a €10/month VPS. **Clawdbot** orchestrates everything — routing requests to Claude Opus 4.5 or Gemini, managing memory in an Obsidian vault, automating daily briefs, handling email, posting to X, and spawning sub-agents for heavy tasks. Total monthly cost: ~€220. It replaces dozens of SaaS tools. This post is the full blueprint.

---

## 1. Why Build Your Own AI Infrastructure?

A **personal AI infrastructure** is a self-hosted system of models, tools, and automations that acts as your persistent AI assistant — not a chatbot you visit, but an agent that lives on your server and works for you around the clock.

Why not just use ChatGPT or Claude chat? We did, for months. Here's what broke:

- **Context dies.** Every new conversation starts from zero. Our agent remembers yesterday, last week, and our entire project history.
- **No tool access.** Chat interfaces can't check your email, post a tweet, search your notes, or review your calendar. Ours can.
- **No automation.** You have to open the app and ask. Our agent runs morning briefs at 8 AM, evening reviews at 10 PM, and security checks every 6 hours — without being asked.
- **Vendor lock-in.** We route between Claude and Gemini based on the task. If a model goes down or pricing changes, we swap — no migration pain.

The goal: an AI assistant that knows our work, has access to our tools, runs 24/7, and costs less than a junior hire's coffee budget.

---

## 2. Architecture Overview

```
┌──────────────┐
│  Channels    │  Telegram · Web Chat · (future: Slack, Discord)
└──────┬───────┘
       │
┌──────▼───────┐
│  Clawdbot    │  Gateway + Orchestrator
│  Gateway     │  Session management, routing, tool dispatch
└──────┬───────┘
       │
┌──────▼───────┐
│  Models      │  Claude Opus 4.5 (primary) · Gemini 2.5 (secondary)
└──────┬───────┘
       │
┌──────▼───────┐
│  Tools       │  Bird CLI · Brave Search · Gmail · Calendar
│              │  GitHub · Web Scraping · File System
└──────┬───────┘
       │
┌──────▼───────┐
│  Memory      │  Obsidian Vault (PARA) · QMD semantic search
│              │  Daily logs · MEMORY.md (curated long-term)
└──────┬───────┘
       │
┌──────▼───────┐
│  Infra       │  Contabo VPS · Tailscale mesh · Syncthing
│              │  UFW firewall · Fail2ban · Cron automation
└──────────────┘
```

The key insight: **Clawdbot is the brain, not any single model.** It manages sessions, routes to the right model, maintains memory across conversations, and dispatches tool calls. The models are interchangeable; the orchestration layer is what makes it an agent instead of a chatbot.

---

## 3. The Stack — Every Tool We Use

### Core: Orchestration & Models

| Component | Tool | Role |
|-----------|------|------|
| Orchestrator | **Clawdbot** | Gateway daemon, session management, multi-model routing, tool dispatch, sub-agent spawning |
| Primary Model | **Claude Opus 4.5** (Anthropic) | Reasoning, writing, code generation, complex analysis |
| Secondary Model | **Gemini 2.5** (Google) | Long-context tasks, multimodal input, cost-effective bulk processing |

Clawdbot runs as a systemd service on our VPS. It exposes a gateway that accepts messages from any channel, resolves which model to use, injects memory context, and handles tool execution. When a task is too complex for a single pass, it spawns **sub-agents** — isolated sessions that handle specific jobs and report back.

### Communication Channels

- **Telegram** — Primary interface. We message our agent like texting a colleague.
- **Web Chat** — For longer sessions, debugging, and rich formatting.
- **Future:** Slack and Discord integrations on the roadmap for team use.

### Memory System

Memory is what separates an agent from a chatbot. Three layers:

1. **Daily Logs** (`memory/YYYY-MM-DD.md`) — Raw event log. Every interaction, decision, and outcome. Agent reads today's and yesterday's on boot.
2. **Long-term Memory** (`MEMORY.md`) — Curated, distilled knowledge. The agent periodically promotes patterns, preferences, and important facts here.
3. **Semantic Search via QMD** — Hybrid search (BM25 + vector + reranking) across the entire Obsidian vault. The closest thing to actual recall.

The vault follows the **PARA structure** (Projects, Areas, Resources, Archives) inside Obsidian. Syncs across devices via Syncthing.

### Tools & Integrations

| Tool | What It Does | How It Connects |
|------|-------------|-----------------|
| **Bird CLI** | Read/search/post on X (Twitter) | Cookie-based auth, CLI wrapper |
| **Brave Search** | Web search without tracking | API (free tier) |
| **Google Calendar** | Schedule review, event creation | API via service account |
| **Gmail** | Email triage and draft polishing | API (read-only for now) |
| **GitHub** | Repo management, PR reviews, issue tracking | CLI + API token |
| **Web Scraping** | Extract content from URLs | Headless browser + readability parser |

### Automation

Cron jobs are the unsung hero:

- **Morning Brief (8:00 AM)** — Weather, calendar, email summary, top tasks, relevant news. Delivered to Telegram.
- **Evening Review (10:00 PM)** — Day summary, completed tasks, pending items, tomorrow's priorities.
- **Security Checks (every 6h)** — Fail2ban status, UFW logs, service health, disk usage.
- **Heartbeat (2-4x/day)** — Rotates through email, calendar, mentions, and weather checks.

**Sub-agent spawning:** When the main agent needs parallel work, it spawns isolated sub-agents. Each gets a focused prompt, does its work, and reports back.

### Infrastructure

| Component | Details | Monthly Cost |
|-----------|---------|-------------|
| **VPS** | Contabo Cloud VPS — 4 vCPU, 8 GB RAM, 200 GB SSD, Ubuntu 24.04 | ~€10 |
| **Mesh Network** | Tailscale — connects VPS, workstations, and phone | Free |
| **File Sync** | Syncthing — Obsidian vault syncs across all devices | Free |
| **Firewall** | UFW + Fail2ban — SSH key-only, Syncthing locked to Tailscale subnet | Free |

One VPS. Systemd services. Cron jobs. Boring infrastructure is reliable infrastructure.

### Content Creation Pipeline

| Tool | Purpose | Status |
|------|---------|--------|
| **Remotion** | Programmatic video generation (React-based) | Early — prototyping |
| **ElevenLabs** | AI voice synthesis for video narration | Working |
| **Nano Banana** | Image generation for blog/social content | Working |

---

## 4. Cost Breakdown

Real numbers:

| Item | Monthly Cost | Notes |
|------|-------------|-------|
| Contabo VPS | ~€10 | 4 vCPU / 8 GB RAM / 200 GB SSD |
| Claude Max subscription | ~$200 | Opus 4.5, high usage cap |
| Brave Search API | $0 | Free tier covers our volume |
| Tailscale | $0 | Free for personal use |
| Syncthing | $0 | Open source, self-hosted |
| ElevenLabs | ~$5-22 | Depends on voice generation volume |
| Domain + misc | ~$3 | DNS, small services |
| **Total** | **~€220/month** | |

This replaces: note-taking app subscription, social media scheduler, email assistant, research tool, task manager, and half a virtual assistant.

---

## 5. What Works Well

- **Morning briefs** — Waking up to a Telegram message with weather, calendar, email digest, and task priorities replaces 15 minutes of context-switching.
- **Email polishing** — Draft in rough bullet points, agent rewrites in the right tone.
- **Research pipelines** — Agent searches the web, reads pages, cross-references, produces structured briefs.
- **Task management** — ECNT process (Email → Calendar → Notes → Tasks) runs as a daily ritual.
- **Sub-agents for content** — Parallel work is real. This blog post was drafted by a sub-agent.

---

## 6. What Doesn't Work Yet

- **Gmail send is read-only.** OAuth scoping and security concerns — want to get this right, not fast.
- **Video pipeline is early.** Remotion + ElevenLabs work independently, but end-to-end flow still needs manual handoff.
- **Memory needs an upgrade.** No good automated process for pruning, summarizing, and compacting old memories.
- **Multi-agent coordination is primitive.** Sub-agents work for independent tasks, not collaborative ones.
- **Voice interaction is one-way.** Can generate speech, but real-time voice conversation isn't there yet.

---

## 7. Lessons Learned

1. **Start with one channel and one model.** Telegram + Claude first. Everything else comes later.
2. **Memory is everything.** Even a simple daily log file makes a massive difference. Invest here early.
3. **Security isn't optional.** SSH keys only, firewall everything, audit regularly. Your agent has access to your email, calendar, social accounts, and files.
4. **Sub-agents change everything.** Parallel work throughput goes through the roof.
5. **Boring infrastructure wins.** One VPS, systemd, cron. When something breaks at 2 AM, you want to SSH in and read a log file, not debug a service mesh.
6. **Design for model-agnosticism.** Models improve fast, prices drop, new players emerge. Model-swapping should be a config change.
7. **The agent should write things down.** Disk is cheap. Amnesia is expensive.

---

## 8. Who Should Build This

**This is for you if:**

- Comfortable with Linux, SSH, and basic sysadmin
- Already use AI assistants daily and want more control
- Have workflows that benefit from automation (email, scheduling, research, content)
- Engineer, maker, or small business operator who values owning their tools
- Willing to invest 2-4 weekends to get the baseline running

**This is NOT for you if:**

- You want plug-and-play — this requires ongoing tinkering
- Uncomfortable with API keys, environment variables, and config files
- Occasional AI usage — the ROI doesn't justify the setup
- Need enterprise-grade uptime and support
- Not ready to spend ~$200/month on model access

---

## 9. Getting Started — 3 Steps

### Step 1: Get a VPS and Set Up Security

Grab a cheap VPS (Contabo, Hetzner, or similar — 4 vCPU / 8 GB RAM is plenty). Install Ubuntu, set up SSH key auth, enable UFW, install Fail2ban. 30 minutes if experienced, 2 hours if not. Don't skip security.

### Step 2: Install Clawdbot + Connect One Channel

Deploy Clawdbot, configure your Claude API key (or Claude Max subscription), connect Telegram. Get a basic conversation working. No tools, no memory, no automation yet.

### Step 3: Add Memory, Then Tools

Set up a simple daily log (`memory/YYYY-MM-DD.md`). Once memory works, add tools one by one: web search first (Brave), then calendar, then email. Each integration takes an afternoon.

From there, the stack grows organically from real needs.

---

## Wrapping Up

Building a personal AI infrastructure isn't about replacing commercial tools with DIY equivalents. It's about creating an agent that *knows you* — your projects, your preferences, your schedule, your communication style — and works for you continuously.

The core (VPS + Clawdbot + Claude + Telegram + daily logs) was running in a weekend. Everything else was incremental.

The best AI stack for 2026 isn't the one with the most components. It's the one you actually use every day. Start small, add what you need, and let your agent earn its keep.

---

*Loïc Galland is an engineer building personal AI agent systems. He writes about AI infrastructure, Industry 5.0, and the intersection of making and machine intelligence at [Welcome to the AI Jungle](https://welcometotheaijungle.com).*
