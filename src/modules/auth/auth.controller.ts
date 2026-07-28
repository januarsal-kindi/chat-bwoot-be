import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthCookiesService } from './auth-cookies.service';
import { AuthService } from './auth.service';
import type { PublicUser } from './auth.service';
import { LoginDto, RegisterDto } from './dto/register.dto';
import { PublicUserDto } from './dto/public-user.dto';
import { SameOriginGuard } from './guards/same-origin.guard';
import {
  SessionAuthGuard,
  type AuthenticatedRequest,
} from './guards/session-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly cookies: AuthCookiesService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SameOriginGuard)
  @ApiOperation({ summary: 'Register a new user and establish a session' })
  @ApiHeader({
    name: 'Origin',
    description: 'Must match one of FRONTEND_ORIGIN (comma-separated allowlist)',
    required: true,
  })
  @ApiCreatedResponse({
    description:
      'User created; access_token and refresh_token set as HttpOnly cookies',
    type: PublicUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid email or password (length 12–128)',
  })
  @ApiForbiddenResponse({ description: 'Missing or disallowed Origin header' })
  @ApiConflictResponse({ description: 'Email is unavailable' })
  async register(
    @Body() input: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PublicUser> {
    const result = await this.auth.register(input);

    this.cookies.setSession(response, result.accessToken, result.refreshToken);

    return result.user;
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SameOriginGuard)
  @ApiOperation({ summary: 'Sign in and establish an independent session' })
  @ApiHeader({
    name: 'Origin',
    description: 'Must match one of FRONTEND_ORIGIN (comma-separated allowlist)',
    required: true,
  })
  @ApiOkResponse({
    description:
      'Signed in; access_token and refresh_token set as HttpOnly cookies',
    type: PublicUserDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid email or password (length 12–128)',
  })
  @ApiForbiddenResponse({ description: 'Missing or disallowed Origin header' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many sign-in attempts' })
  async login(
    @Body() input: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<PublicUser> {
    const result = await this.auth.login(input, clientIp(request));

    this.cookies.setSession(response, result.accessToken, result.refreshToken);

    return result.user;
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: 'Return the current authenticated user' })
  @ApiOkResponse({ type: PublicUserDto })
  @ApiUnauthorizedResponse({
    description: 'Missing, invalid, or expired Session credentials',
  })
  me(@Req() request: AuthenticatedRequest): PublicUser {
    return request.user;
  }
}

function clientIp(request: Request): string {
  return request.ip || request.socket.remoteAddress || 'unknown';
}
