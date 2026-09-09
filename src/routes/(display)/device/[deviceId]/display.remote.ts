import { query } from '$app/server';
import { sql } from '$lib/db';
import z, { ZodObject } from 'zod';

const getDevicePlaylistArgs = z.object({
	deviceId: z.number()
});
export const getDeviceData = query(getDevicePlaylistArgs, async (data) => {
	const device = sql.getOne<Device>(`SELECT * FROM device WHERE deviceId = :deviceId`, data);
	if (device === null) throw Error('No device');
	if (device.playlistId === null) return { ...device, playlist: null };

	const playlist = sql.getOne<Playlist>(`SELECT * FROM playlist WHERE playlistId = :playlistId`, {
		playlistId: device.playlistId
	});
	if (playlist === null) throw Error('Playlist does not exist');

	const images = sql.get<Image>(`SELECT * FROM image WHERE playlistId = :playlistId`, {
		playlistId: device.playlistId
	});

	return {
		...device,
		playlist: {
			...playlist,
			images
		}
	};
});

export interface DeviceData extends Device {
	playlist: PlaylistWithImages | null;
}

export interface PlaylistWithImages extends Playlist {
	images: Image[];
}

const getDeviceFreshnessArgs = z.object({
	deviceId: z.number(),
	deviceFreshness: z.number(),
	playlistFreshness: z.number()
});
export const getDeviceFreshness = query(getDeviceFreshnessArgs, async (data) => {
	const device = sql.getOne<Device>(`SELECT * FROM device WHERE deviceId = :deviceId`, {
		deviceId: data.deviceId
	});
	if (device === null) return Error('No device');
	if (device.updated > data.deviceFreshness) return true;
	if (device.playlistId === null) return Error('No playlist assigned to device');

	const playlist = sql.getOne<Playlist>(`SELECT * FROM playlist WHERE playlistId = :playlistId`, {
		playlistId: device.playlistId
	});
	if (playlist === null) throw Error('No playlist');
	if (playlist.updated > data.playlistFreshness) return true;
	return false;
});
