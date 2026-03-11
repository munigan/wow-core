## MVP Definition for WoW Raid Core Analyser (Wrath of the Lich King)

This document defines the Minimum Viable Product (MVP) that will guide design frames, UI sketches, data models, and the initial codebase bootstrap. It focuses on a single-tenant, post-raid ingestion flow with a simple, fast-to-build UI and core analytics.

### 1) Objectives
-  Ingest raid logs in the uwu-logs / Warmane-compatible format.
-  Deliver immediate, actionable analytics after each upload.
-  Provide per-raid and per-member insights on DPS, HPS, consumables, and gear validation.
-  Crawl Warmane Armory to verify gear, enchants, gems, and professions when data is missing from logs.
-  Support perpetual data retention with simple authentication (one core per guild).
-  Present a simple, non-role-based UI suitable for the guild core leader and raid officers.
-  Enable export of key reports (PDF, CSV, JSON) and basic shareable links.
-  Localize UI to en-US only for MVP.

### 2) Scope Boundaries (In-Scope)
-  Log ingestion
  - Upload interface for log files or URL-based sources.
  - Validation of format and basic schema checks.
  - Immediate parsing into core data models and storage.
  - Trigger of lightweight analytics after upload completion.

-  Analytics and dashboards
  - Raid-level metrics: total DPS, total HPS, average DPS/HPS, encounter-level breakdown, duration, kill count.
  - Member-level metrics per raid: DPS, HPS, uptime, resource usage.
  - Consumables usage per member per raid (items and quantities).
  - Gear/enchants/gems inference via log data; Armory crawl if data missing.
  - Weekly/raid-to-raid trend charts for group performance and member trajectories.

-  Gear validation
  - Cross-check log-provided gear data with Armory data.
  - Flag missing or suboptimal enchants, gems, or professions.
  - Simple improvement notes per member.

-  Data model and storage
  - Core (tenant) with a single guild.
  - Raids, Members, Encounters, Performances, Consumables, GearSummary, ArmoryCrawl, LogsSource.
  - Forever retention (no automatic purge in MVP).

-  Authentication and access
  - User accounts associated with a Core.
  - Session-based or token-based authentication.
  - Access restricted to authenticated Core users (no multi-tenant isolation yet beyond Core scoping).

-  API and integration points (bootstrap)
  - Ingestion API for file uploads and metadata.
  - Endpoints to fetch dashboard data (raid, member, trends).
  - Endpoint to trigger/perform Armory crawl (can be integrated in ingestion flow).

-  UI/UX (MVP)
  - Clean, single-view dashboard with sections:
    - Overview: high-level raid health and metrics.
    - Members: per-member performance and consumables.
    - Gear & Enchants: validation status and Armory comparison.
    - Trends: weekly/group charts.
    - Exports: PDF/CSV/JSON generation.
  - No role-based views; uniform experience for all authenticated users.
  - en-US localization.

-  Data flow requirements
  - Upload completes → analytics computed and UI updated in near real-time.
  - Immediate reflection of new data without manual refresh.

### 3) Core Data Model (Entities and Relationships)
-  Core (tenant)
  - id, name, owner_email, created_at

-  Raid
  - id, core_id, name, date, duration, notes, boss_count

-  Member
  - id, core_id, name, class, spec, realm, role (optional)

-  Encounter
  - id, raid_id, name, start_time, end_time, boss

-  Performance
  - id, raid_id, member_id, encounter_id, dps, hps, uptime, damage_taken

-  ConsumableUsage
  - id, raid_id, member_id, item, quantity, timestamp

-  GearSummary
  - id, member_id, enchants, gems, professions, armory_checked_at

-  ArmoryCrawl
  - id, member_id, checked_at, armory_url, gear_snapshot, notes

-  LogsSource
  - id, core_id, type (uwu-logs/Warmane), url, uploaded_at, uploaded_by

### 4) User Flows (Core Scenarios)
-  Upload raid log
  - Authenticate → select Core → upload log → system validates, parses, stores, crawls Armory if needed → dashboard with high-level metrics and top contributors.

-  View member and consumables
  - Filter by raid, view per-member DPS/HPS, uptime, and consumable usage; see gear status and Armory comparison.

-  Gear validation
  - Identify missing enchants/gems/professions; view Armory data; receive simple improvement notes.

-  Trends and group metrics
  - Navigate weekly raids; compare group DPS/HPS, consumables sums, and average kill time.

-  Exporting
  - Generate and download PDF/CSV/JSON reports; optionally create a shareable report link.

### 5) Non-Functional Requirements
-  Performance
  - Ingestion and analytics should complete within a couple of seconds for a typical weekly raid, enabling near real-time UI updates.

-  Security
  - Authentication for Core access; data isolation by Core.
  - Secure file uploads and validation.

-  Reliability
  - Deterministic parsing and error handling; meaningful error messages for invalid logs.

-  Extensibility
  - Field-ready data model to absorb additional metrics and future multi-tenant expansion.

### 6) Milestones (Highest-Level)
-  M1: Ingestion pipeline and core data model scaffolding
  - Implement upload API, basic log parsing, and storage
  - Simple authentication and Core creation flow

-  M2: Raid and member dashboards
  - Compute and display raid-level and member-level metrics
  - Implement consumables tracking

-  M3: Gear validation and Armory crawl
  - Integrate Armory data fetch for missing fields
  - Flag gear gaps and provide improvement notes

-  M4: Trends and exports
  - Week-by-week group trends and member trends
  - PDF/CSV/JSON export functionality

-  M5: Polish and readiness for user testing
  - UI cleanup, error handling, and basic sharing

### 7) Risks and Mitigations
-  Data quality variance in logs
  - Mitigation: robust parsing with fallbacks; clearly surfaced warnings in UI.

-  Armory crawl reliability
  - Mitigation: start with open data; mark uncertain fields as tentative for MVP.

-  Single-tenant focus
  - Mitigation: design data model with Core_id isolation; plan for future multi-tenant expansion.

### 8) Deliverables for AI-Generated Design Frames and Bootstrapping
-  AI-generated design frames
  - Dashboard wireframes (Overview, Members, Gear, Trends, Exports)
  - Data-flow diagrams showing ingestion → parsing → analytics → UI
  - Entity-relationship diagrams for the MVP data model

-  Bootstrapped codebase scaffolds
  - API surface definitions (ingest, get dashboards, exports)
  - Core data models (JSON schema outline)
  - Lightweight analytics primitives (parsers for uwu-logs/Warmane, basic aggregations)
  - Armory crawl module scaffold (open Warmane data fetch)
  - Authentication scaffolding (Core-based tenants)
  - Basic front-end skeleton (dashboard layout with placeholders)


