import { error } from '@sveltejs/kit';
import { readFile } from 'fs/promises';
import type { RequestHandler } from './$types';
import { config } from '$lib/config';

export const GET: RequestHandler = async ({ params, request, locals, url }) => {
	try {
		const { filename } = params;
		const imageData = await readFile(`${config.dataDir}/img/${filename}`);
		return new Response(imageData);
	} catch (e) {
		throw error(404);
	}
};
