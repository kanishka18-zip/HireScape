# 🌍 HireScape — The Internet Is Hiring

An interactive 3D globe that visualizes real internship and entry-level job opportunities across India, built for the **Into the Scrape-Verse Hackathon** by WeMakeDevs x Bright Data.

## What It Does

HireScape turns a static list of internships into an explorable universe. Instead of scrolling through a boring job board, you rotate a glowing 3D globe, click on cities to discover real opportunities, filter by category (AI/ML, Web Dev, Data, Design, Sales, HR), and use **"Build My Universe"** to get opportunities matched to your skills and preferences — all visualized live on the map.

## Data Source & Bright Data Scraper Studio

We built a **custom scraper in Bright Data's Scraper Studio** targeting [Internshala](https://internshala.com/internships), a public internship listing platform. No pre-built scraper from Bright Data's library was used — this scraper was built from scratch using Scraper Studio's AI-assisted schema builder.

**Fields extracted:**
- `internship_title`
- `company_name`
- `location`
- `stipend`
- `required_skills` (array)

The scraper was run across multiple pages of Internshala's public internship listings, pulling **208 real internship listings** from public, non-login-walled pages, respecting the hackathon's public-data-only rule.

## Tech Stack

- **Bright Data Scraper Studio** — custom scraper for structured data extraction
- **HTML / CSS / JavaScript** — core site logic
- **Globe.gl (Three.js)** — real interactive 3D globe rendering
- **Python** — data cleaning script (`generate_data.py`) that transforms raw scraped JSON into a clean format for the frontend

## Features

- 🌐 Rotating, zoomable 3D globe with real Indian city coordinates
- ✨ Glowing bubble markers sized by number of opportunities per city
- 🎯 Category filters (AI/ML, Web Dev, Data, Design, Sales/Marketing, HR/Ops)
- 🧭 "Travel to India" quick navigation
- 💫 "Build My Universe" — pick your skills/preferences and see matched opportunities highlighted on the globe
- 📋 Detail cards showing stipend, required skills, and company info per opportunity

## How to Run

1. Clone this repo
2. Open `index.html` in any browser (no build step needed)

## Data Pipeline

1. `jobs_data.json` — raw output from the Bright Data scraper
2. `generate_data.py` — cleans and reformats the data into `data.js`
3. `data.js` — powers the frontend globe visualization

## AI Assistance Disclosure

This project was built with the help of **Claude (Anthropic)** as a coding assistant — used for writing and debugging HTML/CSS/JavaScript, structuring the Python data-cleaning script, and guiding the Bright Data Scraper Studio setup. All code was reviewed, tested, and understood by the developer during the build process.

## Built By

Kanishka — 1st year CSE student, CIT Chennai — for the Into the Scrape-Verse Hackathon (Aug 17–23, 2026)