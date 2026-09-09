import { pagePermission } from '$lib/session';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	pagePermission(locals.session.data, 'user')
};