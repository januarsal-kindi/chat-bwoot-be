# Email and Password Authentication

Status: ready-for-agent

## Problem Statement

A person cannot yet register as a User, establish a secure Session, or access private chatbot data. The application needs browser-focused authentication that keeps credentials out of client-side JavaScript, supports several devices per User, and can revoke compromised Sessions without exposing whether an email belongs to an existing User during sign-in.

## Solution

Add an Auth module that lets a person register with an email and password, sign in, refresh a Session, inspect the current User, sign out one device, and sign out all devices. Authentication uses a short-lived JWT access cookie and a rotating opaque refresh cookie. PostgreSQL stores Users, Sessions, and hashed refresh credentials so that logout and refresh-token reuse take effect immediately.

The first release is designed for a same-origin browser client. Both credentials remain in secure, HTTP-only cookies, state-changing requests enforce their origin, and repeated sign-in failures receive temporary rate limits.

## User Stories

1. As a new visitor, I want to register with an email and password, so that I can become a User.
2. As a new User, I want registration to establish a Session immediately, so that I can begin chatting without signing in again.
3. As a new visitor, I want invalid registration input explained clearly, so that I can correct it.
4. As a new visitor, I want email whitespace and casing normalized, so that equivalent email spellings do not create separate Users.
5. As a registered User, I want my email to identify me uniquely, so that another person cannot register the same email.
6. As a registered User, I want an explicit email-unavailable response when registration conflicts, so that I understand why registration failed.
7. As a registered User, I want to sign in with my email and password, so that I can access my Chats.
8. As a registered User, I want equivalent email casing to work when signing in, so that sign-in matches registration behavior.
9. As a registered User, I want an incorrect email and incorrect password to produce the same error, so that attackers cannot discover registered emails through sign-in.
10. As a registered User, I want my password stored using a strong password hash, so that a database leak does not reveal it.
11. As a security-conscious User, I want passwords to support long passphrases, so that I can use a strong memorable credential.
12. As a security-conscious User, I want authentication credentials inaccessible to browser JavaScript, so that common script injection cannot read them.
13. As a User, I want my short-lived access credential renewed without entering my password repeatedly, so that normal use remains convenient.
14. As a User, I want refresh credentials rotated after use, so that replay of an older credential can be detected.
15. As a User, I want replay of an old refresh credential to revoke only the affected Session, so that my other devices remain usable.
16. As a User, I want each device to have an independent Session, so that signing in on one device does not sign out another.
17. As a User, I want a Session to end after prolonged inactivity, so that an abandoned device does not remain authorized indefinitely.
18. As a User, I want every Session to have an absolute lifetime, so that continuous use cannot preserve one refresh credential family forever.
19. As a User, I want to retrieve my current public User details, so that the client can display the authenticated state.
20. As a User, I want to sign out the current device, so that its Session is immediately unusable.
21. As a User, I want current-device sign-out to leave other device Sessions active, so that I do not disrupt my other devices.
22. As a User, I want to sign out all devices, so that I can recover after suspected credential exposure.
23. As a User, I want sign-out to be safe to repeat, so that client retries do not cause errors.
24. As a User, I want expired, malformed, or revoked Session credentials rejected consistently, so that private Chats remain protected.
25. As a User, I want cross-origin state-changing requests rejected, so that another site cannot act through my cookies.
26. As a User, I want cookies configured securely in production while still supporting local development, so that security does not prevent development workflows.
27. As a User, I want repeated failed sign-in attempts slowed temporarily, so that automated guessing is limited without permanently locking me out.
28. As a legitimate User sharing an IP address with others, I want abuse controls to consider both IP and email, so that one signal alone does not define all protection.
29. As a client developer, I want a stable public User shape, so that authentication responses do not leak internal security fields.
30. As a client developer, I want a clear refresh-after-401 flow, so that the client retries a request safely and at most once.
31. As a client developer, I want credentials delivered only through cookies, so that I never need to persist tokens in browser storage.
32. As an operator, I want required authentication configuration validated at startup, so that unsafe deployments fail before serving traffic.

## Implementation Decisions

- Build one Auth module responsible for registration, sign-in, refresh, sign-out, Session guards, cookie handling, and public User projection.
- Add a persistence module using Prisma and PostgreSQL. Authentication depends on three records:
  - User: identifier, normalized unique email, password hash, creation time, and update time.
  - Session: identifier, User identifier, creation time, last-used time, idle expiry, absolute expiry, and optional revocation time.
  - RefreshCredential: identifier, Session identifier, unique token hash, creation time, expiry time, and optional consumption time.
- Normalize email by trimming surrounding whitespace and lowercasing before validation, lookup, and uniqueness checks. Email is immutable in this release.
- Accept only email and password during registration. Passwords must contain 12–128 characters.
- Hash passwords with Argon2id. Never log or return passwords or password hashes.
- Registration creates the User and initial Session atomically. A duplicate normalized email returns a conflict indicating that the email is unavailable.
- Sign-in returns one generic unauthorized response for both unknown email and incorrect password. Password verification must still run against a fixed dummy hash when the email is unknown to reduce timing differences.
- Sign-in abuse controls use temporary limits keyed independently by normalized email and source IP. The initial implementation may use process-local storage while the service runs as one replica; a shared limiter is required before horizontal scaling.
- Sign successful registration and sign-in responses with an HS256 access JWT. The signing secret must contain at least 32 random bytes.
- Access JWTs expire after 15 minutes and contain only the User identifier (`sub`), Session identifier (`sid`), issued-at time, and expiry time.
- Treat access JWTs as identifiers for a server-backed Session, not as fully stateless authorization. Each protected request verifies the JWT and confirms that its Session exists, is not revoked, and has not exceeded its expiry limits.
- Generate refresh credentials from at least 32 cryptographically random bytes. Store only a SHA-256 hash because the source value has sufficient entropy; never persist or log the plaintext credential.
- Rotate refresh credentials in a database transaction that atomically consumes the presented credential and creates its replacement.
- A Session expires after 7 days without refresh and after an absolute maximum of 30 days from creation.
- Presenting a consumed refresh credential is reuse detection. Revoke its Session and reject the refresh; do not revoke other Sessions belonging to the User.
- The client must serialize refresh calls and retry an access-token failure at most once. Concurrent refresh requests for the same Session are not supported.
- Use `access_token` for the access cookie: HTTP-only, `SameSite=Lax`, path `/`, and a 15-minute maximum age.
- Use `refresh_token` for the refresh cookie: HTTP-only, `SameSite=Lax`, path `/auth`, and a 30-day maximum age.
- Keep both cookies host-only by omitting the Domain attribute. Require Secure outside local development.
- Return credentials only as cookies, never in JSON bodies.
- Require an allowed same-origin `Origin` header on state-changing Auth requests. The intended deployment serves the frontend and API from the same origin; cross-origin credentialed CORS is not part of this feature.
- Expose these HTTP operations:
  - `POST /auth/register`: create a User and Session, set both cookies, and return the public User.
  - `POST /auth/login`: verify credentials, create a Session, set both cookies, and return the public User.
  - `POST /auth/refresh`: consume and rotate the refresh credential and replace both cookies.
  - `POST /auth/logout`: revoke the current Session when identifiable, clear both cookies, and succeed idempotently.
  - `POST /auth/logout-all`: require a valid access Session, revoke every Session for its User, and clear both cookies.
  - `GET /auth/me`: require a valid access Session and return the public User.
- The public User contains only identifier, email, and creation time.
- Use global DTO validation to reject unknown fields and transform validated input consistently.
- Remove the unused refresh-JWT secret requirement because refresh credentials are opaque rather than JWTs. Keep the access-JWT secret required and add configurable cookie security and origin settings where needed.
- Expired RefreshCredential records may be removed by a later cleanup job; cleanup is not required for correctness in this release.

## Testing Decisions

- Use the existing application-level HTTP test seam: boot the complete Nest application and call it through Supertest. This is the highest existing seam and tests routing, DTO validation, cookies, guards, persistence, and error mapping together.
- Run Auth end-to-end tests against an isolated real PostgreSQL test database with migrations applied. Mocking Prisma would hide transaction, uniqueness, and rotation behavior that this feature relies on.
- Assert only externally visible behavior: status codes, response bodies, cookie attributes, database-observable Session outcomes through subsequent HTTP requests, and indistinguishable sign-in failures. Do not assert private method calls or internal provider structure.
- Cover successful registration, normalized-email conflict, invalid email, password length boundaries, and rejection of unknown fields.
- Cover successful sign-in, generic failures for unknown email and incorrect password, normalized email lookup, and rate limits by both keys.
- Cover access to the current User with valid, missing, malformed, expired, and revoked-Session access credentials.
- Cover successful refresh, replacement cookies, rejection of the consumed credential, Session revocation after replay, idle expiry, and absolute expiry.
- Cover current-device sign-out, repeated sign-out, preservation of another device Session, and sign-out-all.
- Cover cookie names, paths, HTTP-only behavior, SameSite policy, maximum ages, host-only behavior, and environment-dependent Secure behavior.
- Cover rejection of missing or disallowed origins on state-changing requests and acceptance of the configured same origin.
- Use controlled time at the application boundary for expiry tests so tests remain deterministic; avoid real waiting.
- Preserve the existing simple root endpoint end-to-end test as prior art for booting the complete application, while replacing its in-memory-only setup with shared test database lifecycle utilities for Auth tests.
- Keep targeted unit tests only for pure security helpers whose edge cases are cumbersome through HTTP, such as email normalization or cookie option construction. The HTTP suite remains the primary seam.

## Out of Scope

- Email verification.
- Forgotten-password recovery or administrative password reset.
- Changing a User's email.
- Roles, permissions, or administrative authorization.
- OAuth, social sign-in, magic links, passkeys, and multi-factor authentication.
- Returning tokens in response bodies or storing them in browser local storage.
- Cross-site frontend and API deployments.
- Listing or naming individual device Sessions in the UI.
- Manually revoking one other device while retaining the current Session.
- Persistent distributed rate limiting for multiple application replicas.
- Automated cleanup of expired RefreshCredential records.
- Chat, Message, and Assistant authorization beyond providing the authenticated User and Session guard.

## Further Notes

- The canonical domain terms are User and Session. “Account” should not replace User, and “token” should not replace Session.
- The browser client must send the configured same-origin header, include cookies automatically, serialize refresh attempts, and retry a failed request no more than once.
- Registration intentionally reveals that an email is unavailable. Sign-in must not reveal whether the email exists.
- Immediate Session revocation requires a PostgreSQL lookup for protected requests. This is an intentional security trade-off rather than a stateless-JWT design.
- The local issue is ready for implementation without additional triage.
