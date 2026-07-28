# 05 — Sign out the current Session

**What to build:** Let a User sign out the current device immediately and safely retry that action. The affected Session and all its credentials must stop working while Sessions on other devices remain active.

**Blocked by:** 04 — Rotate refresh credentials.

**Status:** ready-for-agent

- [ ] `POST /auth/logout` revokes the current Session when it can be identified.
- [ ] Sign-out clears both cookies using attributes that match how they were set.
- [ ] Sign-out succeeds idempotently when cookies are missing, invalid, expired, or already revoked.
- [ ] The signed-out access cookie can no longer retrieve the current User.
- [ ] The signed-out refresh cookie can no longer rotate credentials.
- [ ] Another device Session belonging to the same User remains authorized and refreshable.
- [ ] Missing or disallowed origins are rejected without changing Session state.
- [ ] HTTP E2E tests verify immediate revocation, idempotency, cookie clearing, and multi-device isolation.
