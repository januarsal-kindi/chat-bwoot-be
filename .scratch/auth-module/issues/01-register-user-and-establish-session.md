# 01 — Register a User and establish a Session

**What to build:** Let a visitor register with a normalized email and valid password, become a User, and receive a new authenticated Session through secure HTTP-only cookies. The complete flow must persist safely in PostgreSQL and be verifiable through the HTTP API.

**Blocked by:** None — can start immediately.

**Status:** resolved

- [x] Valid registration creates one User, one Session, and one hashed RefreshCredential atomically.
- [x] Email is trimmed and lowercased before validation, lookup, and unique persistence.
- [x] Equivalent email casing or whitespace cannot create another User and returns an email-unavailable conflict.
- [x] Passwords outside 12–128 characters and unknown request fields are rejected.
- [x] Passwords use Argon2id and no plaintext password or refresh credential is stored, logged, or returned.
- [x] Registration returns only the public User and sets the specified access and refresh cookies.
- [x] Cookie attributes match the development and production security policies.
- [x] Missing or disallowed origins are rejected; the configured same origin is accepted.
- [x] Required persistence, access-JWT, cookie, and origin configuration fails validation at startup when unsafe or absent.
- [x] HTTP E2E coverage runs against an isolated migrated PostgreSQL test database.
