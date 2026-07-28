# 04 — Rotate refresh credentials

**What to build:** Let a User renew an active Session after access expiry by presenting the refresh cookie. Every successful refresh must atomically consume the old credential, issue a replacement, and detect replay without affecting other device Sessions.

**Blocked by:** 02 — Authenticate a Session and return the current User.

**Status:** ready-for-agent

- [ ] A valid refresh cookie returns replacement access and refresh cookies without exposing credentials in JSON.
- [ ] Consuming the presented RefreshCredential and creating its replacement occur in one database transaction.
- [ ] The consumed credential cannot refresh the Session again.
- [ ] Replaying a consumed credential revokes only its Session and rejects the request.
- [ ] Credentials belonging to another Session remain valid after replay detection.
- [ ] A Session cannot refresh after 7 days of inactivity or its 30-day absolute expiry.
- [ ] Successful refresh advances idle expiry without extending absolute expiry.
- [ ] Missing, malformed, unknown, expired, and revoked-Session refresh credentials are rejected and unsafe cookies are cleared.
- [ ] Missing or disallowed origins are rejected.
- [ ] Deterministic HTTP E2E tests cover rotation, expiry, and replay without real-time waiting.
