# 06 — Sign out all Sessions

**What to build:** Let an authenticated User revoke every Session after suspected credential exposure. All signed-in devices must lose access and refresh capability, and the initiating browser must have its cookies cleared.

**Blocked by:** 03 — Sign in safely with abuse controls; 04 — Rotate refresh credentials.

**Status:** ready-for-agent

- [ ] `POST /auth/logout-all` requires a valid active access Session.
- [ ] The operation revokes every active Session belonging to the authenticated User in one consistent update.
- [ ] Access cookies from the registration device and another signed-in device can no longer retrieve the current User.
- [ ] Refresh cookies from every affected device can no longer rotate credentials.
- [ ] Sessions belonging to a different User remain unaffected.
- [ ] The initiating browser receives cleared access and refresh cookies.
- [ ] Repeating the operation with an invalidated Session is rejected without affecting another User.
- [ ] Missing or disallowed origins are rejected without revoking Sessions.
- [ ] HTTP E2E tests demonstrate complete User-wide revocation across multiple devices.
