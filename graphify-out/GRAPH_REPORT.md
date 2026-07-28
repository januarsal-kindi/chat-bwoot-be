# Graph Report - .  (2026-07-22)

## Corpus Check
- Corpus is ~36,662 words - fits in a single context window. You may not need a graph.

## Summary
- 465 nodes · 571 edges · 56 communities (25 shown, 31 thin omitted)
- Extraction: 90% EXTRACTED · 9% INFERRED · 1% AMBIGUOUS · INFERRED: 52 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Auth Tickets and Triage
- Nest App Controllers
- Agent Skills Catalog
- Auth Module API
- Runtime Dependencies
- Deep Module Design
- Domain Docs Layout
- Issue Tracker Setup
- TypeScript Compiler Config
- Package and Jest Config
- Architecture Improvement Skills
- NPM Scripts
- Prototype Skill
- Code Review and Implement
- Build Output Config
- ESLint Toolchain
- Research and Merge Skills
- Nest CLI Config
- Writing Great Skills
- HITL Debug Loop Script
- Depth Leverage Locality
- Handoff Skill
- Bug Fix Seam Phase
- eslint-config-prettier
- @eslint/js
- eslint-plugin-prettier
- globals Package
- jest Package
- @nestjs/cli
- @nestjs/schematics
- @nestjs/testing
- prettier Package
- prisma Package
- source-map-support
- supertest Package
- ts-loader
- ts-node
- tsconfig-paths
- @types/express
- @types/jest
- @types/node
- @types/pg
- @types/supertest
- typescript Package
- typescript-eslint
- Feedback Loop Phase
- Setup Skills Agent Config
- TDD Agent Config
- Teach Agent Config
- To Spec Agent Config
- needs-triage Role
- wontfix Role
- Information Hierarchy

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 22 edges
2. `scripts` - 16 edges
3. `Teach Skill` - 15 edges
4. `Setup Matt Pocock Skills` - 12 edges
5. `Test-Driven Development` - 11 edges
6. `PrismaService` - 10 edges
7. `Deepening` - 10 edges
8. `Improve Codebase Architecture Skill` - 10 edges
9. `Session` - 10 edges
10. `RegisterDto` - 9 edges

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
- **Improve Codebase Architecture Process** — agents_skills_improve_codebase_architecture_skill_explore_subagent, agents_skills_improve_codebase_architecture_html_report_html_report_format, agents_skills_improve_codebase_architecture_skill_grilling_loop [EXTRACTED 1.00]
- **Prototype Branch Selection** — agents_skills_prototype_skill_prototype, agents_skills_prototype_logic_logic_prototype, agents_skills_prototype_ui_ui_prototype [EXTRACTED 1.00]
- **Grilling Skill Chain** — agents_skills_grill_with_docs_skill_grill_with_docs, agents_skills_grilling_skill_grilling, agents_skills_domain_modeling_skill_domain_modeling [EXTRACTED 1.00]
- **Five Canonical Triage Labels** — agents_skills_setup_matt_pocock_skills_triage_labels_needs_triage, agents_skills_setup_matt_pocock_skills_triage_labels_needs_info, agents_skills_setup_matt_pocock_skills_triage_labels_ready_for_agent, agents_skills_setup_matt_pocock_skills_triage_labels_ready_for_human, agents_skills_setup_matt_pocock_skills_triage_labels_wontfix [EXTRACTED 1.00]
- **Teaching Workspace Artifacts** — agents_skills_teach_skill_mission_md, agents_skills_teach_skill_resources_md, agents_skills_teach_skill_learning_records, agents_skills_teach_skill_lessons, agents_skills_teach_skill_assets, agents_skills_teach_skill_glossary_md [EXTRACTED 1.00]
- **Email/Password Authentication Flow** — scratch_auth_module_spec_post_auth_register, scratch_auth_module_spec_post_auth_login, scratch_auth_module_spec_post_auth_refresh, scratch_auth_module_spec_post_auth_logout, scratch_auth_module_spec_post_auth_logout_all, scratch_auth_module_spec_get_auth_me [EXTRACTED 1.00]
- **Auth Persistence Model** — scratch_auth_module_spec_user, scratch_auth_module_spec_session, scratch_auth_module_spec_refreshcredential [EXTRACTED 1.00]
- **HTTP-Only Cookie Credentials** — scratch_auth_module_spec_access_token_cookie, scratch_auth_module_spec_refresh_token_cookie, scratch_auth_module_spec_access_jwt, scratch_auth_module_spec_refreshcredential [EXTRACTED 1.00]

## Communities (56 total, 31 thin omitted)

### Community 0 - "Auth Tickets and Triage"
Cohesion: 0.06
Nodes (47): To Tickets Agent Interface, Ticket Blocking Edges, To Tickets Skill, Tracer Bullet Vertical Slice, Agent Brief, Triage Agent Interface, Out-of-Scope Knowledge Base, ready-for-agent State Role (+39 more)

### Community 1 - "Nest App Controllers"
Cohesion: 0.09
Nodes (19): Get, Global, AppController, Controller, AppModule, Module, AppService, Injectable (+11 more)

### Community 2 - "Agent Skills Catalog"
Cohesion: 0.07
Nodes (37): Ask Matt Agent Interface, Ask Matt, /code-review, /codebase-design, /diagnosing-bugs, /domain-modeling, /grill-me, /grill-with-docs (+29 more)

### Community 3 - "Auth Module API"
Cohesion: 0.10
Nodes (21): Body, IsEmail, IsString, Length, Post, Res, AuthController, Controller (+13 more)

### Community 4 - "Runtime Dependencies"
Cohesion: 0.06
Nodes (31): argon2, class-transformer, class-validator, dotenv, joi, @nestjs/common, @nestjs/config, @nestjs/core (+23 more)

### Community 5 - "Deep Module Design"
Cohesion: 0.08
Nodes (29): Deepening, In-process Dependency, Local-substitutable Dependency, Remote but Owned (Ports & Adapters), Seam Discipline, True External (Mock), Design It Twice, Design It Twice (Ousterhout) (+21 more)

### Community 6 - "Domain Docs Layout"
Cohesion: 0.10
Nodes (26): Domain Docs Consumer Rules, ADR Conflict Flagging, CONTEXT-MAP.md, CONTEXT.md, docs/adr/, domain-modeling skill, Glossary Vocabulary Rule, Domain Docs Layout (+18 more)

### Community 7 - "Issue Tracker Setup"
Cohesion: 0.12
Nodes (24): GitHub Issue Tracker, gh CLI, PRs as Triage Surface, Wayfinder Operations, GitLab Issue Tracker, glab CLI, MRs as Triage Surface, Wayfinder Operations (+16 more)

### Community 8 - "TypeScript Compiler Config"
Cohesion: 0.09
Nodes (22): compilerOptions, allowSyntheticDefaultImports, baseUrl, declaration, emitDecoratorMetadata, esModuleInterop, experimentalDecorators, forceConsistentCasingInFileNames (+14 more)

### Community 9 - "Package and Jest Config"
Cohesion: 0.10
Nodes (19): author, description, jest, collectCoverageFrom, coverageDirectory, moduleFileExtensions, rootDir, testEnvironment (+11 more)

### Community 10 - "Architecture Improvement Skills"
Cohesion: 0.16
Nodes (16): Codebase Design Agent Interface, Codebase Design Skill, Deletion Test, Improve Codebase Architecture Agent Config, Before After Diagram, Candidate Card, HTML Report Format, Mass Diagram Pattern (+8 more)

### Community 11 - "NPM Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, format, lint, postinstall, prisma:generate, prisma:migrate, start (+8 more)

### Community 12 - "Prototype Skill"
Cohesion: 0.20
Nodes (12): Prototype Agent Config, Logic Prototype, Logic Prototype TUI, Pure Reducer Pattern, State Machine Pattern, Prototype Skill, Throwaway Branch Capture, Prototype Switcher (+4 more)

### Community 13 - "Code Review and Implement"
Cohesion: 0.25
Nodes (8): Code Review Agent Interface, Code Review Skill, Fowler Smell Baseline, Spec Axis, Standards Axis, Implement Agent Config, Implement Skill, TDD Skill

### Community 14 - "Build Output Config"
Cohesion: 0.25
Nodes (7): dist, node_modules, **/*spec.ts, test, ./tsconfig.json, exclude, extends

### Community 15 - "ESLint Toolchain"
Cohesion: 0.29
Nodes (7): eslint, @eslint/eslintrc, devDependencies, eslint, @eslint/eslintrc, ts-jest, ts-jest

### Community 16 - "Research and Merge Skills"
Cohesion: 0.33
Nodes (6): Research Agent Config, Background Research Agent, Primary Sources, Research Skill, Resolving Merge Conflicts Agent Config, Resolving Merge Conflicts Skill

### Community 17 - "Nest CLI Config"
Cohesion: 0.33
Nodes (5): collection, compilerOptions, deleteOutDir, $schema, sourceRoot

### Community 18 - "Writing Great Skills"
Cohesion: 0.50
Nodes (5): Writing Great Skills Agent Interface, Model-Invoked Skill, Predictability, User-Invoked Skill, Writing Great Skills Skill

### Community 19 - "HITL Debug Loop Script"
Cohesion: 0.83
Nodes (3): capture(), hitl-loop.template.sh script, step()

### Community 21 - "Depth Leverage Locality"
Cohesion: 0.67
Nodes (3): Depth, Leverage, Locality

### Community 22 - "Handoff Skill"
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
- **185 isolated node(s):** `$schema`, `collection`, `sourceRoot`, `deleteOutDir`, `name` (+180 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Chatbot` and `NestJS TypeScript Starter`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Session Refresh` and `05 — Sign out the current Session`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Session Refresh` and `06 — Sign out all Sessions`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `Deepening` connect `Deep Module Design` to `Architecture Improvement Skills`?**
  _High betweenness centrality (0.049) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `ESLint Toolchain` to `Package and Jest Config`, `eslint-config-prettier`, `@eslint/js`, `eslint-plugin-prettier`, `globals Package`, `jest Package`, `@nestjs/cli`, `@nestjs/schematics`, `@nestjs/testing`, `prettier Package`, `prisma Package`, `source-map-support`, `supertest Package`, `ts-loader`, `ts-node`, `tsconfig-paths`, `@types/express`, `@types/jest`, `@types/node`, `@types/pg`, `@types/supertest`, `typescript Package`, `typescript-eslint`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **What connects `$schema`, `collection`, `sourceRoot` to the rest of the system?**
  _185 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Auth Tickets and Triage` be split into smaller, more focused modules?**
  _Cohesion score 0.06290471785383904 - nodes in this community are weakly interconnected._