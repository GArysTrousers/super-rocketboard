import { command, query } from '$app/server';
import { sql } from '$lib/db';
import { apiPersmission } from '$lib/session';
import { getConnectedDevices, refreshDevice } from '$lib/sse';
import z from 'zod';

const getDashboardDataArgs = z.undefined();

export const getDashboardData = query(getDashboardDataArgs, async (data) => {
	apiPersmission('user');
	const devices = sql.get<Playlist>(`SELECT * FROM device`);
	const connectedDevices = getConnectedDevices()
  return {devices, connectedDevices}
});
