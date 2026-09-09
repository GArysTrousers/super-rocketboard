import { pagePermission } from '$lib/session';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	pagePermission(locals.session.data, 'user')
};