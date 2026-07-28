# 02 — Authenticate a Session and return the current User

**What to build:** Let a browser use its access cookie to prove an active Session and retrieve the current public User. Authentication must validate both the JWT and its server-backed Session so revoked or expired Sessions stop working immediately.

**Blocked by:** 01 — Register a User and establish a Session.

**Status:** done

- [x] A valid registration access cookie authorizes `GET /auth/me`.
- [x] The access JWT contains only the User identifier, Session identifier, issued-at time, and expiry time.
- [x] The response exposes only the User identifier, email, and creation time.
- [x] Missing, malformed, incorrectly signed, and expired access JWTs are rejected consistently.
- [x] An unknown, revoked, or absolutely expired Session is rejected even when the JWT signature and expiry are valid.
- [x] Internal password and Session fields never appear in the response.
- [x] The reusable Session guard can protect later private chatbot endpoints.
- [x] HTTP E2E tests cover all externally observable authentication outcomes.
