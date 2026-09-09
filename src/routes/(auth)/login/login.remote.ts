import { command, getRequestEvent } from '$app/server';
import { config } from '$lib/config';
import z from 'zod';

const args = z.object({
	username: z.string(),
	password: z.string()
});

export const login = command(args, async (data) => {
	if (config.admin.username === data.username && config.admin.password === data.password) {
		const { locals } = getRequestEvent();
		locals.session.data = {
			timestamp: Date.now(),
			type: 'admin',
			username: config.admin.username
		};
    return true
	} else if (config.user.username === data.username && config.user.password === data.password) {
		const { locals } = getRequestEvent();
		locals.session.data = {
			timestamp: Date.now(),
			type: 'user',
			username: config.user.username
		};
    return true
	}
  return false
});
