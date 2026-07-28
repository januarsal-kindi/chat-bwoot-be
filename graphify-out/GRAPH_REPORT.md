# Graph Report - .  (2026-07-28)

## Corpus Check
- 114 files · ~39,080 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 556 nodes · 706 edges · 67 communities (32 shown, 35 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 55 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Deep Module Design
- Agent Skill Catalog
- Tickets And Triage
- Nest App Wiring
- Package Metadata
- Runtime Dependencies
- Issue Tracker Ops
- TypeScript Config
- Swagger Decorators
- Design And Grilling Skills
- Auth Registration Flow
- Auth Credentials Types
- Auth Controller Surface
- Prototype Skill
- Login Abuse Limiter
- Auth Module Guards
- Auth Session Issuance
- Build Exclude Paths
- Wayfinder Skill
- DevTool Dependencies
- Login E2E Helpers
- Research And Merge Skills
- Nest CLI Config
- Auth Cookie Service
- Current User E2E
- Skill Writing Principles
- HITL Loop Script
- Design Heuristics
- Handoff Skill
- Bugfix Seams
- eslint-config-prettier
- @eslint/eslintrc
- @eslint/js
- eslint-plugin-prettier
- globals Package
- Jest Package
- @nestjs/schematics
- @nestjs/testing
- Prettier Package
- Prisma Package
- source-map-support
- Supertest Package
- ts-loader
- ts-node
- tsconfig-paths
- @types/express
- @types/jest
- @types/node
- @types/pg
- @types/supertest
- TypeScript Package
- typescript-eslint
- Feedback Loop Phase
- Skills Setup Agent
- TDD Agent Config
- Teach Agent Config
- To Spec Agent Config
- Needs Triage Role
- Wontfix Role
- Information Hierarchy
- Controller Decorator
- Module Decorator

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 23 edges
2. `scripts` - 16 edges
3. `Teach Skill` - 15 edges
4. `LoginAbuseLimiter` - 15 edges
5. `AuthService` - 14 edges
6. `Setup Matt Pocock Skills` - 12 edges
7. `Test-Driven Development` - 11 edges
8. `Deepening` - 10 edges
9. `Improve Codebase Architecture Skill` - 10 edges
10. `Codebase Design Skill` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Auth Module Documentation` --semantically_similar_to--> `Auth Module`  [INFERRED] [semantically similar]
  docs/auth-module.md → .scratch/auth-module/spec.md
- `User` --semantically_similar_to--> `User`  [INFERRED] [semantically similar]
  docs/auth-module.md → .scratch/auth-module/spec.md
- `Session` --semantically_similar_to--> `Session`  [INFERRED] [semantically similar]
  docs/auth-module.md → .scratch/auth-module/spec.md
- `RefreshCredential` --semantically_similar_to--> `RefreshCredential`  [INFERRED] [semantically similar]
  docs/auth-module.md → .scratch/auth-module/spec.md
- `NestJS TypeScript Starter` --conceptually_related_to--> `Chatbot`  [AMBIGUOUS]
  README.md → CONTEXT.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **JWT plus Session authentication** — scratch_auth_module_issues_02_authenticate_session_and_return_user_access_jwt, scratch_auth_module_issues_02_authenticate_session_and_return_user_session, scratch_auth_module_issues_02_authenticate_session_and_return_user_session_guard [EXTRACTED 1.00]
- **Sign-in abuse and enumeration mitigations** — scratch_auth_module_issues_03_sign_in_with_abuse_controls_abuse_controls, scratch_auth_module_issues_03_sign_in_with_abuse_controls_dummy_password_hash, scratch_auth_module_issues_03_sign_in_with_abuse_controls_uniform_failure_response [EXTRACTED 1.00]
- **Register request code path** — graphify_out_memory_query_20260722_090815_explain_path_auth_register_authcontroller, graphify_out_memory_query_20260722_090815_explain_path_auth_register_authservice, graphify_out_memory_query_20260722_090815_explain_path_auth_register_authcookiesservice [EXTRACTED 1.00]
- **Improve Codebase Architecture Process** — agents_skills_improve_codebase_architecture_skill_explore_subagent, agents_skills_improve_codebase_architecture_html_report_html_report_format, agents_skills_improve_codebase_architecture_skill_grilling_loop [EXTRACTED 1.00]
- **Prototype Branch Selection** — agents_skills_prototype_skill_prototype, agents_skills_prototype_logic_logic_prototype, agents_skills_prototype_ui_ui_prototype [EXTRACTED 1.00]
- **Grilling Skill Chain** — agents_skills_grill_with_docs_skill_grill_with_docs, agents_skills_grilling_skill_grilling, agents_skills_domain_modeling_skill_domain_modeling [EXTRACTED 1.00]
- **Five Canonical Triage Labels** — agents_skills_setup_matt_pocock_skills_triage_labels_needs_triage, agents_skills_setup_matt_pocock_skills_triage_labels_needs_info, agents_skills_setup_matt_pocock_skills_triage_labels_ready_for_agent, agents_skills_setup_matt_pocock_skills_triage_labels_ready_for_human, agents_skills_setup_matt_pocock_skills_triage_labels_wontfix [EXTRACTED 1.00]
- **Teaching Workspace Artifacts** — agents_skills_teach_skill_mission_md, agents_skills_teach_skill_resources_md, agents_skills_teach_skill_learning_records, agents_skills_teach_skill_lessons, agents_skills_teach_skill_assets, agents_skills_teach_skill_glossary_md [EXTRACTED 1.00]
- **Email/Password Authentication Flow** — scratch_auth_module_spec_post_auth_register, scratch_auth_module_spec_post_auth_login, scratch_auth_module_spec_post_auth_refresh, scratch_auth_module_spec_post_auth_logout, scratch_auth_module_spec_post_auth_logout_all, scratch_auth_module_spec_get_auth_me [EXTRACTED 1.00]
- **Auth Persistence Model** — scratch_auth_module_spec_user, scratch_auth_module_spec_session, scratch_auth_module_spec_refreshcredential [EXTRACTED 1.00]
- **HTTP-Only Cookie Credentials** — scratch_auth_module_spec_access_token_cookie, scratch_auth_module_spec_refresh_token_cookie, scratch_auth_module_spec_access_jwt, scratch_auth_module_spec_refreshcredential [EXTRACTED 1.00]

## Communities (67 total, 35 thin omitted)

### Community 0 - "Deep Module Design"
Cohesion: 0.06
Nodes (49): Deepening, In-process Dependency, Local-substitutable Dependency, Remote but Owned (Ports & Adapters), Seam Discipline, True External (Mock), Adapter, Interface (+41 more)

### Community 1 - "Agent Skill Catalog"
Cohesion: 0.06
Nodes (41): Ask Matt Agent Interface, Ask Matt, /code-review, /codebase-design, /diagnosing-bugs, /domain-modeling, /grill-me, /grill-with-docs (+33 more)

### Community 2 - "Tickets And Triage"
Cohesion: 0.08
Nodes (37): To Tickets Agent Interface, Ticket Blocking Edges, To Tickets Skill, Agent Brief, Triage Agent Interface, Out-of-Scope Knowledge Base, ready-for-agent State Role, Triage Skill (+29 more)

### Community 3 - "Nest App Wiring"
Cohesion: 0.08
Nodes (21): Get, Global, joi, Module, joi, AppController, Controller, AppModule (+13 more)

### Community 4 - "Package Metadata"
Cohesion: 0.06
Nodes (35): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+27 more)

### Community 5 - "Runtime Dependencies"
Cohesion: 0.06
Nodes (33): argon2, class-transformer, class-validator, dotenv, @nestjs/common, @nestjs/config, @nestjs/core, @nestjs/jwt (+25 more)

### Community 6 - "Issue Tracker Ops"
Cohesion: 0.10
Nodes (27): CONTEXT-MAP.md, GitHub Issue Tracker, gh CLI, PRs as Triage Surface, Wayfinder Operations, GitLab Issue Tracker, glab CLI, Wayfinder Operations (+19 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.08
Nodes (25): jest, node, compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop (+17 more)

### Community 8 - "Swagger Decorators"
Cohesion: 0.15
Nodes (19): ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiResponse (+11 more)

### Community 9 - "Design And Grilling Skills"
Cohesion: 0.12
Nodes (22): Codebase Design Agent Interface, Codebase Design Skill, Deletion Test, Grill with Docs Agent Config, Grill with Docs Skill, Grilling Agent Config, Grilling Skill, Shared Understanding (+14 more)

### Community 10 - "Auth Registration Flow"
Cohesion: 0.14
Nodes (21): AuthController, AuthCookiesService, AuthService, POST /auth/register, Public User, Ticket 01, Access JWT, Dual JWT and Session Validation (+13 more)

### Community 11 - "Auth Credentials Types"
Cohesion: 0.18
Nodes (13): IsEmail, IsString, Length, AccessTokenPayload, AuthenticatedSession, isEmailConflict(), isRecord(), SessionCredentials (+5 more)

### Community 12 - "Auth Controller Surface"
Cohesion: 0.21
Nodes (7): clientIp(), PublicUserDto, ApiProperty, AuthenticatedRequest, readAccessToken(), SessionAuthGuard, Injectable

### Community 13 - "Prototype Skill"
Cohesion: 0.20
Nodes (12): Prototype Agent Config, Logic Prototype, Logic Prototype TUI, Pure Reducer Pattern, State Machine Pattern, Prototype Skill, Throwaway Branch Capture, Prototype Switcher (+4 more)

### Community 14 - "Login Abuse Limiter"
Cohesion: 0.29
Nodes (3): Inject, LoginAbuseLimiter, Injectable

### Community 15 - "Auth Module Guards"
Cohesion: 0.25
Nodes (5): SameOriginGuard, Injectable, DEFAULT_LOGIN_ABUSE_OPTIONS, LOGIN_ABUSE_OPTIONS, LoginAbuseOptions

### Community 17 - "Build Exclude Paths"
Cohesion: 0.25
Nodes (7): dist, node_modules, **/*spec.ts, test, ./tsconfig.json, exclude, extends

### Community 18 - "Wayfinder Skill"
Cohesion: 0.33
Nodes (7): Tracer Bullet Vertical Slice, Wayfinder Agent Interface, Decision Ticket, Fog of War, Wayfinder Skill, Wayfinder Map, Leading Word

### Community 19 - "DevTool Dependencies"
Cohesion: 0.29
Nodes (7): eslint, @nestjs/cli, devDependencies, eslint, @nestjs/cli, ts-jest, ts-jest

### Community 20 - "Login E2E Helpers"
Cohesion: 0.38
Nodes (3): accessCookie(), accessTokenValue(), cookieHeader()

### Community 21 - "Research And Merge Skills"
Cohesion: 0.33
Nodes (6): Research Agent Config, Background Research Agent, Primary Sources, Research Skill, Resolving Merge Conflicts Agent Config, Resolving Merge Conflicts Skill

### Community 22 - "Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 24 - "Current User E2E"
Cohesion: 0.60
Nodes (4): accessCookie(), accessTokenValue(), cookieHeader(), registerSession()

### Community 25 - "Skill Writing Principles"
Cohesion: 0.50
Nodes (5): Writing Great Skills Agent Interface, Model-Invoked Skill, Predictability, User-Invoked Skill, Writing Great Skills Skill

### Community 26 - "HITL Loop Script"
Cohesion: 0.83
Nodes (3): capture(), hitl-loop.template.sh script, step()

### Community 28 - "Design Heuristics"
Cohesion: 0.67
Nodes (3): Depth, Leverage, Locality

### Community 29 - "Handoff Skill"
Cohesion: 0.67
Nodes (3): Handoff Agent Config, Handoff Skill, Handoff Document

## Ambiguous Edges - Review These
- `Chatbot` → `NestJS TypeScript Starter`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to
- `Session Refresh` → `05 — Sign out the current Session`  [AMBIGUOUS]
  .scratch/auth-module/issues/05-sign-out-current-session.md · relation: references
- `Session Refresh` → `06 — Sign out all Sessions`  [AMBIGUOUS]
  .scratch/auth-module/issues/06-sign-out-all-sessions.md · relation: references

## Knowledge Gaps
- **195 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `extends` (+190 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **35 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Chatbot` and `NestJS TypeScript Starter`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Session Refresh` and `05 — Sign out the current Session`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Session Refresh` and `06 — Sign out all Sessions`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `dependencies` connect `Runtime Dependencies` to `Nest App Wiring`, `Package Metadata`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Why does `joi` connect `Nest App Wiring` to `Runtime Dependencies`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _195 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Deep Module Design` be split into smaller, more focused modules?**
  _Cohesion score 0.05612244897959184 - nodes in this community are weakly interconnected._