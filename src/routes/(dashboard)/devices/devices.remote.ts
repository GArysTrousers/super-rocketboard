import { command, getRequestEvent, query } from '$app/server';
import { sql } from '$lib/db';
import { apiPersmission } from '$lib/session';
import z from 'zod';

const getPlaylistsArgs = z.undefined();

export const getPlaylists = query(getPlaylistsArgs, async (data) => {
  apiPersmission('user')
	const playlists = sql.get<Playlist>(`SELECT * FROM playlist`);
	return playlists;
});

const getDevicesArgs = z.undefined();

export const getDevices = query(getDevicesArgs, async (data) => {
  apiPersmission('user')
	const devices = sql.get<Device>(`SELECT * FROM device`);
	return devices;
});

const createDeviceArgs = z.object({
	name: z.string(),
	ip: z.string()
});

export const createDevice = command(createDeviceArgs, async (data) => {
  apiPersmission('admin')
	sql.set(`INSERT INTO device (name, ip, updated) VALUES (:name, :ip, :updated)`, {
		...data,
		updated: Date.now()
	});
});

const updateDeviceArgs = z.object({
	deviceId: z.number(),
	name: z.string(),
	ip: z.string(),
	playlistId: z.number().nullable()
});

export const updateDevice = command(updateDeviceArgs, async (data) => {
  apiPersmission('user')
	sql.set(
		`UPDATE device SET 
    name = :name, 
    ip = :ip, 
    playlistId = :playlistId, 
    updated = :updated 
    WHERE deviceId = :deviceId`,
		{ ...data, updated: Date.now() }
	);
});

const removeDeviceArgs = z.object({
	deviceId: z.number()
});

export const removeDevice = command(removeDeviceArgs, async (data) => {
  apiPersmission('admin')
	sql.set(`DELETE FROM device WHERE deviceId = :deviceId`, data);
});

function updateFreshness(deviceId: number) {
	sql.set(`UPDATE device SET updated = :updated WHERE deviceId = :deviceId`, {
		deviceId: deviceId,
		updated: Date.now()
	});
}
