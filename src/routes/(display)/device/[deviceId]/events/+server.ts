import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { produce } from 'sveltekit-sse';
import { addDeviceConnection, removeDeviceConnection } from '$lib/sse';
import z from 'zod';
import { sql } from '$lib/db';

const isNumber = z.number()

export const POST: RequestHandler = async ({ params }) => {
	const deviceId = Number(params.deviceId);
  try {
    isNumber.parse(deviceId)
    const device = sql.getOne('SELECT * FROM device WHERE deviceId = :deviceId', {deviceId})
    if (device === null) throw Error('No device with that ID')
  } catch (e) {
    error(400)
  }
	try {
		return produce(async ({ emit }) => {
			addDeviceConnection({ deviceId, emit });

			return () => {
				removeDeviceConnection(emit);
			};
		});
	} catch (e) {
		console.log(e);
		error(500);
	}
};
