---
type: "explain"
date: "2026-07-22T09:08:15.758847+00:00"
question: "Explain path auth/register"
contributor: "graphify"
source_nodes: ["POST /auth/register", "AuthController", "AuthService"]
---

# Q: Explain path auth/register

## Answer

POST /auth/register is the HTTP contract that creates a User and Session and sets access_token and refresh_token cookies, returning a Public User. Code path: AuthController.register (Post+UseGuards+Body+Res) -> AuthService.register (RegisterDto, PrismaService, isEmailConflict) -> AuthCookiesService.setSession. Ticket 01 implements this endpoint.

## Source Nodes

- POST /auth/register
- AuthController
- AuthService