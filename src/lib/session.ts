import jwt from 'jsonwebtoken';
import { config } from '$lib/config';
import z from 'zod';
import type { AppSession } from '../app';
import { error, redirect } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

const schema = {
	sessionJwt: z.object({
		timestamp: z.number(),
		username: z.string(),
		type: z.enum(['user', 'admin', 'none'])
	})
};

export function parseSession(sessionJwt: string | undefined): AppSession {
	// no cookie
	if (sessionJwt === undefined) {
		return {
			timestamp: Date.now(),
			type: 'none',
			username: ''
		};
	}

	// validate jwt
	let jwtData;
	try {
		jwtData = jwt.verify(sessionJwt, config.jwtSecret);
	} catch (e) {
		return {
			timestamp: Date.now(),
			type: 'none',
			username: ''
		};
	}

	//validate session data
	let data;
	try {
		data = schema.sessionJwt.parse(jwtData);
	} catch (e) {
		return {
			timestamp: Date.now(),
			type: 'none',
			username: ''
		};
	}

	return data;
}

export function getSessionCookie(session: AppSession): string {
	return `${config.cookieName}=${jwt.sign(session, config.jwtSecret)}; Max-Age=${config.sessionLengthInDays * 86400}; Path=/; Http-Only`;
}

export function getLogoutCookie() {
	return `${config.cookieName}=; Max-Age=0; Path=/; Http-Only`;
}

export function pagePermission(session: AppSession | null, allowed: 'admin' | 'user') {
	if (session === null) throw redirect(307, '/login');
  if (session.type === 'none') throw redirect(307, '/login');
  if (allowed === 'admin') {
		if (session.type === 'admin') return;
    throw error(403);
	} else if (allowed === 'user') {
		if (session.type === 'admin' || session.type === 'user') return;
    throw error(403);
	}
}

export function apiPersmission(allowed: 'admin' | 'user') {
  const session = getRequestEvent().locals.session.data
	if (session === null) throw error(401);
  if (session.type === 'none') throw error(401);
  if (allowed === 'admin') {
		if (session.type === 'admin') return;
    throw error(403);
	} else if (allowed === 'user') {
		if (session.type === 'admin' || session.type === 'user') return;
    throw error(403);
	}
}