# Auth Module

## Scope

The first release supports public email/password registration and multiple authenticated Sessions per User. Email verification, password recovery, email changes, roles, and OAuth are deferred.

## User rules

- Email is trimmed, lowercased, unique, and immutable.
- Registration accepts only `email` and `password`.
- Passwords must contain 12–128 characters and are hashed with Argon2id.
- Successful registration creates a Session immediately.
- Duplicate registration returns an explicit email-unavailable conflict.
- Login always returns the same error for an unknown email and an incorrect password.
- Failed logins are rate-limited by both normalized email and source IP, using temporary backoff rather than account lockout.

## Session model

- Each device has an independent Session. A User may have multiple active Sessions.
- The access credential is an HS256 JWT valid for 15 minutes.
- The JWT contains only `sub` (User ID), `sid` (Session ID), `iat`, and `exp`.
- The refresh credential is an opaque, cryptographically random value. Only its hash is stored.
- Refresh credentials rotate on every successful refresh.
- A Session expires after 7 days without refresh and no later than 30 days after creation.
- Reuse of a consumed refresh credential revokes only its Session.
- Logout revokes the current Session; logout-all revokes every Session belonging to the User.
- Clients call the refresh endpoint after an access-token `401`, then retry the original request at most once.
- Clients must make refresh calls single-flight to avoid racing token rotation.

## Cookies

Both credentials are sent only in cookies and never in response bodies.

- Access cookie: `access_token`, `HttpOnly`, `SameSite=Lax`, path `/`, 15-minute maximum age.
- Refresh cookie: `refresh_token`, `HttpOnly`, `SameSite=Lax`, path `/auth`, 30-day maximum age.
- Cookies are host-only; no `Domain` attribute is set.
- `Secure` is mandatory outside local development.
- State-changing requests must have an allowed same-origin `Origin` header.
- Credentialed CORS is not required for the intended same-origin deployment.

## HTTP contract

- `POST /auth/register` — accepts email and password, creates the User and Session, sets both cookies, and returns the User.
- `POST /auth/login` — accepts email and password, creates a Session, sets both cookies, and returns the User.
- `POST /auth/refresh` — consumes and rotates the refresh credential and replaces both cookies.
- `POST /auth/logout` — revokes the current Session and clears both cookies. It is idempotent.
- `POST /auth/logout-all` — revokes all Sessions for the authenticated User and clears both cookies.
- `GET /auth/me` — returns the authenticated User.

The public User representation contains only `id`, `email`, and `createdAt`.

## Persistence

### User

- `id`
- `email` (unique normalized value)
- `passwordHash`
- `createdAt`
- `updatedAt`

### Session

- `id`
- `userId`
- `createdAt`
- `lastUsedAt`
- `idleExpiresAt`
- `absoluteExpiresAt`
- `revokedAt`

### RefreshCredential

- `id`
- `sessionId`
- `tokenHash` (unique)
- `createdAt`
- `expiresAt`
- `consumedAt`

Refresh rotation must atomically consume the presented credential and create its replacement.

## Acceptance checks

- Registration stores no plaintext password or refresh credential.
- Protected endpoints reject missing, expired, malformed, and revoked-Session access JWTs.
- Refresh rotation invalidates the previous credential.
- Replaying a consumed refresh credential revokes only the affected Session.
- Logout leaves other device Sessions active; logout-all revokes them.
- Cookies have the expected security attributes in development and production.
- Login behavior does not distinguish an unknown email from a wrong password.
- Rate limits apply independently by source IP and normalized email.
