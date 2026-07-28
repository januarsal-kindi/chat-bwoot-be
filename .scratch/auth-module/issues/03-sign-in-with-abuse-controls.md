# 03 — Sign in safely with abuse controls

**What to build:** Let a registered User sign in with email and password, receive an independent device Session, and access the current User endpoint. Failed attempts must not reveal whether an email exists and must be slowed temporarily by both email and source IP.

**Blocked by:** 02 — Authenticate a Session and return the current User.

**Status:** done

- [x] Valid credentials create a new independent Session and return the same public User shape as registration.
- [x] Sign-in normalizes email identically to registration.
- [x] Successful sign-in sets both secure HTTP-only cookies and the resulting access cookie authorizes `/auth/me`.
- [x] Unknown email and incorrect password return the same status and response body.
- [x] Unknown-email verification uses a fixed dummy password hash to reduce timing differences.
- [x] Temporary limits apply independently to normalized email and source IP without permanently locking a User.
- [x] Requests below the configured limits continue to work, and limits recover after their window.
- [x] Missing or disallowed origins and invalid or unknown input fields are rejected.
- [x] HTTP E2E tests demonstrate separate Sessions for registration and subsequent sign-in.
