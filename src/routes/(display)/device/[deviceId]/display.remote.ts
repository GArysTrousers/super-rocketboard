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

	const images = sql.get<Image>(`SELECT * FROM image WHERE playlistId = :playlistId ORDER BY position`, {
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
