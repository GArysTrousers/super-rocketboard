import { command, getRequestEvent } from '$app/server';
import z from 'zod';

const args = z.undefined()

export const logout = command(args, async (data) => {
		const { locals } = getRequestEvent();
    if (locals.session.data === null) {
      return "You weren't signed in"
    }
    try {
      locals.session.logout = true;
      return "Logged out successfully"
    } catch (e) {
      return "Error logging out"
    }
});
