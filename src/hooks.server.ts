import { config } from '$lib/config';
import { getLogoutCookie, getSessionCookie, parseSession } from '$lib/session';
import { type Handle } from '@sveltejs/kit';
import { existsSync, mkdirSync } from 'node:fs';

if (!existsSync(`${config.dataDir}/img`)) {
	mkdirSync(`${config.dataDir}/img`, { recursive: true });
}

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.session = {
		data: null,
		logout: false
	};

	event.locals.session.data = parseSession(event.cookies.get(config.cookieName));

	const response = await resolve(event);

	if (event.locals.session.logout || event.locals.session.data === null) {
		response.headers.set('Set-Cookie', getLogoutCookie());
	} else {
		response.headers.set('Set-Cookie', getSessionCookie(event.locals.session.data));
	}

	return response;
};
