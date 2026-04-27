# Portfolio Website with MkDocs (Material Theme)

This README explains how to build a portfolio + blog + research hub using MkDocs with Material theme. The provided mkdocs.yml is the central configuration file controlling structure, styling, features, and enhancements.

## 1. Core Concepts
MkDocs builds static sites from Markdown. You author *.md files, configure mkdocs.yml, then run:
  pip install mkdocs-material
  mkdocs serve   # local preview
  mkdocs build   # production output (site/)

## 2. mkdocs.yml Breakdown

### Site Metadata
site_name, site_url, site_description, site_author improve identity and SEO. repo_url + repo_name enable “Edit this page” + repo links (with content.action.edit feature).

### Navigation (nav)
Defines user-visible structure and ordering. Example groups:
  - Home / Landing
  - Blog (index page that can act as post listing if you later add a blog plugin)
  - Tutorials (skills hierarchy)
  - Projects (different lenses: featured, AI, Data Science, Quant)
  - Research (formal / experimental separation)
  - Open Source (contributions, onboarding)
  - Domain Hubs (AI, Data Science, Quant Finance, Stock Market) acting as thematic portals
  - Portfolio / About / Contact (identity + CTA)

Best practices:
  - Keep top-level count manageable (<10)
  - Use plural for collections (Projects) singular for standalone (About)
  - Provide overview/index.md in each section
  - Avoid deep nesting (>3 levels) for scanability
  - Mirror folder names to navigation for predictability

### Theme Configuration
theme:
  name: material
  logo / favicon: brand consistency
  font: readable pairing (Roboto + Fira Mono)
  palette: two schemes (dark + light) with accessible contrast
  features: granular UX enhancements

Key selected features:
  - navigation.tabs / sections: clear high-level segmentation
  - navigation.instant / prefetch: faster perceived load
  - navigation.expand: shows section tree
  - toc.follow: active heading tracking
  - search.highlight / suggest: improves discovery
  - content.action.edit / share: encourages iteration & distribution
  - content.tabs.link / code.annotate: richer technical docs

Guideline: Only enable what provides user value—too many can distract. The current list is cohesive for a knowledge + portfolio hub.

### Color & Identity
palette defines dark (scheme: slate) and light (default) modes with primary + accent colors. Ensure:
  - Contrast AA (test with accessible contrast tools)
  - Limited color roles (primary for navigation, accent for interactive elements)

### Markdown Extensions
Enabled:
  - admonition + pymdownx.details: collapsible callouts
  - highlight + inlinehilite: code emphasis
  - tabbed: multi-language or variant presentation
  - toc (with permalink): deep-link headings
  - footnotes, tables, def_list, attr_list: richer semantics
  - snippets: reuse content fragments (e.g., reuse disclaimers)

Usage Tips:
  - Use admonitions for Notes, Warnings, Tips
  - Group alternative implementations (e.g., Python / Bash) with tabbed
  - Keep heading hierarchy consistent (start at H1 per page)

### Custom Assets
extra_css / extra_javascript allow stylistic polish and minor enhancements (animations, event tracking). Keep them minimal; large bundles defeat static-site performance advantages.

### Extra (social + custom keys)
extra.social drives Material’s social icons. Add only active platforms. Custom keys (like portfolio:) can feed templates or future plugins (if you create theme overrides).

## 3. Content Organization Strategy
Recommended directory layout (already aligned):
  blog/
  tutorials/
  projects/
  research/
  opensource/
  ai/
  data-science/
  quant-finance/
  stock-market/
  assets/         (images, logos)
  docs_root_files (index.md, about.md, contact.md, portfolio.md)
Keep slugs short, lowercase, hyphenated. Use index.md inside each folder as landing page.

## 4. Portfolio Page (portfolio.md)
Suggested structure:
  - Hero summary (value proposition)
  - Highlighted metrics (e.g., Open Source PRs, Publications)
  - Featured Projects (link to projects/featured.md)
  - Skills Matrix (concise, not buzzword dump)
  - Call to Action (Contact / Hire / Collaborate)

## 5. Writing Guidelines
  - One H1 per page (title)
  - Descriptive H2/H3 for skimmability
  - Use internal links: [AI Research](ai/research.md)
  - Keep paragraphs short (≤4 lines)
  - Prefer active voice
  - Show before explain (code first, then narrative)
  - Add alt text to images for accessibility
  - Use consistent tense + naming (e.g., “Quant Finance” everywhere)

## 6. Code & Technical Presentation
  - Always specify language fences (```python) for proper highlighting
  - Use annotated code blocks (with content.code.annotate) sparingly
  - Place long reference material in expandable details to reduce noise

## 7. Performance & Maintenance
  - Periodically audit broken links (link checkers)
  - Optimize images (WebP / compressed PNG)
  - Avoid embedding large media directly (link or thumbnail)
  - Keep navigation prune cycle (quarterly)

## 8. SEO & Sharing
  - Add meta descriptions (Material can derive from first paragraph)
  - Use meaningful filenames (ai-ml.md good; page1.md bad)
  - Prefer keyword-rich headings (e.g., “Quant Factor Backtesting Guide”)
  - Configure canonical site_url (already set)

## 9. Deployment (GitHub Pages Example)
Add workflow (.github/workflows/ci.yml):
  - uses: actions/checkout
  - setup python
  - pip install mkdocs-material
  - mkdocs build
  - deploy via peaceiris/actions-gh-pages or mkdocs gh-deploy
Or simpler: mkdocs gh-deploy --force (manual). Ensure CNAME if using custom domain.

## 10. Extensible Enhancements (Optional Future)
If desired later (add to plugins after install):
  - tags / categories
  - blog plugin (for automatic post listing)
  - sitemap (SEO auto-discovery)
  - minification (optimize assets)
Only add when you have real content using them.

## 11. Sample Minimal mkdocs.yml Template (Adapt + Expand)
site_name: Your Name
site_url: https://example.com
site_description: Portfolio & Knowledge Hub
repo_url: https://github.com/you/yourrepo
nav:
  - Home: index.md
  - Projects:
      - Overview: projects/index.md
  - Blog:
      - Posts: blog/index.md
  - Portfolio: portfolio.md
  - About: about.md
  - Contact: contact.md
theme:
  name: material
  features:
    - navigation.tabs
    - toc.follow
  palette:
    - scheme: default
      primary: indigo
      accent: pink
    - scheme: slate
      primary: indigo
      accent: pink
markdown_extensions:
  - admonition
  - pymdownx.highlight
  - toc:
      permalink: true
extra:
  social:
    - icon: fontawesome/brands/github
      link: https://github.com/you

## 12. Quality Checklist
  - [ ] Each section has index.md
  - [ ] No orphan pages
  - [ ] Descriptive first paragraph per page
  - [ ] Navigation matches strategic priorities
  - [ ] Images optimized & attributed
  - [ ] Internal links validated
  - [ ] Dark/light contrast verified
  - [ ] README kept current (regenerate when structure changes)

## 13. Common Pitfalls
  - Over-nesting nav (causes user fatigue)
  - Large monolithic pages (split logically)
  - Unversioned dependencies (pin in requirements.txt)
  - Mixing inconsistent terminology
  - Forgetting site_url (breaks absolute links / canonical tags)
  - Filename mismatches vs nav (e.g., getting-strated.md vs getting-started.md) break builds

## 14. Getting Started Fast
  1. Copy existing mkdocs.yml
  2. Create directories & index.md files
  3. Write minimal landing (index.md)
  4. Add portfolio.md with core highlights
  5. Run mkdocs serve and iterate
  6. Deploy (gh-deploy or CI workflow)

## 15. Support Growth
Treat the site as a living system: iterate structure as focus areas evolve (e.g., spin out new domain sections only after ≥3 substantive pages).

Concise, purposeful, consistent: this is the guiding principle for an effective portfolio knowledge hub.

## 16. Secrets & Secure Configuration
Never hard-code API keys or analytics IDs in version control. Use environment variables + CI secrets.

Typical secrets (store in GitHub repo Settings > Secrets and use in workflows):
  - GITHUB_TOKEN (auto) or PERSONAL_TOKEN (if triggering other workflows)
  - GA_MEASUREMENT_ID (Google Analytics 4) or PLAUSIBLE_DOMAIN / UMAMI_WEBSITE_ID
  - ALGOLIA_API_KEY / ALGOLIA_INDEX_NAME (DocSearch)
  - GISCUS_REPO / GISCUS_CATEGORY_ID (comments)
  - SENTRY_DSN (error tracking)

Local development:
  1. Create .env (add to .gitignore)
  2. Export vars before build: source .env && mkdocs serve

Example workflow snippet (env block):
  env:
    GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
    ALGOLIA_API_KEY: ${{ secrets.ALGOLIA_API_KEY }}

Inject into mkdocs.yml using placeholders you replace in CI (simple sed) OR rely on Material features:

Google Analytics (GA4) example addition (optional):
extra:
  analytics:
    provider: google
    property: !ENV GA_MEASUREMENT_ID

DocSearch plugin example (after installing mkdocs-material[docsearch]):
plugins:
  - search
  - mike
  - docsearch:
      api_key: !ENV ALGOLIA_API_KEY
      index_name: !ENV ALGOLIA_INDEX_NAME

Do not commit real values—reproducibility + security.

## 17. Component Mapping Cheat Sheet
  mkdocs.yml -> global structure & theme
  docs/      -> content source (mirrors nav)
  assets/    -> static assets (refer via relative paths)
  extra/*    -> declared metadata (social, portfolio meta)
  workflows/ -> deployment automation & secret injection
  custom.css -> brand refinements (minimal overrides)
  custom.js  -> small UX enhancements (avoid heavy scripts)

## 18. Troubleshooting Quick Answers
  Build fails: usually nav path typo or indentation error (2 spaces).
  Missing styling: ensure theme name: material and dependencies installed.
  404 after deploy: wait cache purge or ensure base path matches GitHub Pages project name.
  Fonts not loading: check case sensitivity & relative asset paths.

---
Lean config first; add plugins/features only when they create measurable user value.
