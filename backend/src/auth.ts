import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, User } from '@prisma/client';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'supersecretaccess';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'supersecretrefresh';

// Helpers
const generateAccessToken = (user: User) => {
  return jwt.sign({ sub: user.id, type: 'access' }, ACCESS_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = async (userId: string) => {
  const token = crypto.randomBytes(40).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt
    }
  });

  return token;
};

const setAuthCookies = (res: express.Response, refreshToken: string) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const clearAuthCookies = (res: express.Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
};

// Middleware
export const authenticateUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as any;
    if (payload.type !== 'access') throw new Error('Invalid token type');
    
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Your session has expired. Please log in again.' });
  }
};

// Rate limiting middleware mock (simple)
const rateLimits: Record<string, number[]> = {};
const rateLimit = (limit: number, windowMs: number) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || 'unknown';
    const now = Date.now();
    if (!rateLimits[ip]) rateLimits[ip] = [];
    rateLimits[ip] = rateLimits[ip].filter(time => now - time < windowMs);
    
    if (rateLimits[ip].length >= limit) {
      return res.status(429).json({ success: false, message: 'Too many requests, please try again later.' });
    }
    rateLimits[ip].push(now);
    next();
  };
};

const authRateLimit = rateLimit(10, 60 * 1000); // 10 per minute

// Routes
router.post('/register', authRateLimit, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : '',
        passwordHash
      }
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);
    
    setAuthCookies(res, refreshToken);

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone
        }
      }
    });
  } catch (error) {
    console.error('Register error', error);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

router.post('/login', authRateLimit, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Missing fields' });

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ success: false, message: 'This account is currently unavailable.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user.id);
    setAuthCookies(res, refreshToken);

    res.json({
      success: true,
      data: {
        accessToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error', error);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revokedAt: new Date() }
      });
    }
  } catch (e) {
    // ignore
  }
  clearAuthCookies(res);
  res.json({ success: true });
});

router.post('/refresh', authRateLimit, async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const storedToken = await prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: true } });

    if (!storedToken) {
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: 'Invalid session' });
    }

    if (storedToken.revokedAt || storedToken.expiresAt < new Date()) {
      // Token reuse detected or expired - revoke all for user (security measure)
      await prisma.refreshToken.updateMany({
        where: { userId: storedToken.userId },
        data: { revokedAt: new Date() }
      });
      clearAuthCookies(res);
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    // Revoke old and create new
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() }
    });

    if (storedToken.user.status !== 'ACTIVE') {
      clearAuthCookies(res);
      return res.status(403).json({ success: false, message: 'Account unavailable' });
    }

    const newAccessToken = generateAccessToken(storedToken.user);
    const newRefreshTokenStr = await generateRefreshToken(storedToken.userId);
    
    // Link new token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { replacedByTokenId: newRefreshTokenStr } // Just metadata logic for tracing
    });

    setAuthCookies(res, newRefreshTokenStr);
    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    clearAuthCookies(res);
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

router.get('/me', authenticateUser, async (req, res) => {
  const user = (req as any).user as User;
  res.json({
    success: true,
    data: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
});

router.post('/change-password', authenticateUser, authRateLimit, async (req, res) => {
  try {
    const user = (req as any).user as User;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword || newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'Invalid password format' });
    }

    if (!(await bcrypt.compare(currentPassword, user.passwordHash))) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newHash }
    });

    // Revoke all refresh tokens on password change
    await prisma.refreshToken.updateMany({
      where: { userId: user.id },
      data: { revokedAt: new Date() }
    });
    
    clearAuthCookies(res);
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal error' });
  }
});

export default router;
