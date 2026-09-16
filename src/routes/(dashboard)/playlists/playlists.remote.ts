import { command, query } from '$app/server';
import { config } from '$lib/config';
import { sql } from '$lib/db';
import z from 'zod';
import { rm } from 'node:fs/promises';
import { apiPersmission } from '$lib/session';
import { refreshAllDevicesOnPlaylist } from '$lib/sse';
// import sharp from 'sharp';

const getPlaylistsArgs = z.undefined();
export const getPlaylists = query(getPlaylistsArgs, async (data) => {
	apiPersmission('user');
	const playlists = sql.get<Playlist>(`SELECT * FROM playlist`);
	return playlists;
});

const createPlaylistArgs = z.object({
	name: z.string()
});
export const createPlaylist = command(createPlaylistArgs, async (data) => {
	apiPersmission('user');
	sql.set(`INSERT INTO playlist (name) VALUES (:name)`, data);
});

const removePlaylistArgs = z.object({
	playlistId: z.number()
});
export const removePlaylist = command(removePlaylistArgs, async (data) => {
	apiPersmission('user');
	const images = sql.get<Image>(`SELECT * FROM image WHERE playlistId = :playlistId`, data);
	for (const image of images) {
		await removeImageFromPlaylist({ imageId: image.imageId });
	}
	sql.set(`DELETE FROM playlist WHERE playlistId = :playlistId`, data);
});

const getPlaylistImagesArgs = z.object({
	playlistId: z.number()
});
export const getPlaylistImages = query(getPlaylistImagesArgs, async (data) => {
	apiPersmission('user');
	const images = sql.get<Image>(
		`SELECT * FROM image WHERE playlistId = :playlistId ORDER BY position`,
		data
	);
	return images;
});

const setPlaylistPositionsArgs = z.object({
	playlistId: z.number(),
	imageIds: z.array(z.number())
});
export const setPlaylistPositions = query(setPlaylistPositionsArgs, async (data) => {
	apiPersmission('user');
	let i = 1;
	for (const imageId of data.imageIds) {
		sql.set(
			`UPDATE image SET 
      position = :position
      WHERE imageId = :imageId`,
			{
				imageId,
				position: i++
			}
		);
	}
	refreshAllDevicesOnPlaylist(data.playlistId);
});

const removeImageFromPlaylistArgs = z.object({
	imageId: z.number()
});
export const removeImageFromPlaylist = command(removeImageFromPlaylistArgs, async (data) => {
	apiPersmission('user');
	const image = sql.getOne<Image>(`SELECT * FROM image WHERE imageId = :imageId`, data);
	if (image === null) throw Error('Image not found');
	try {
		rm(`${config.dataDir}/img/${image.sm}`);
	} catch (e) {
		console.log('Failed to delete sm image');
	}
	try {
		rm(`${config.dataDir}/img/${image.lg}`);
	} catch (e) {
		console.log('Failed to delete lg image');
	}
	sql.set(`DELETE FROM image WHERE imageId = :imageId`, data);
	refreshAllDevicesOnPlaylist(image.playlistId);
});

const addImageToPlaylistArgs = z.object({
	imageData: z.string(),
	playlistId: z.number()
});
export const addImageToPlaylist = command(addImageToPlaylistArgs, async (data) => {
	apiPersmission('user');
	try {
		const imageData = decode(data.imageData);
		const res = sql.set(`INSERT INTO image DEFAULT VALUES`);
		if (res.changes === 0 || res.lastInsertRowid === undefined) throw Error("Couldn't record file");
		try {
			const image = new Bun.Image(imageData.buffer);
			// Save fullsize
			await Bun.write(
				`${config.dataDir}/img/${res.lastInsertRowid}-lg.webp`,
				await image.webp().toBuffer()
			);
			// Save thumbnail
			await Bun.write(
				`${config.dataDir}/img/${res.lastInsertRowid}-sm.webp`,
				await image
					.resize(300, 300, {
						fit: 'inside'
					})
					.webp()
					.toBuffer()
			);
			const newObj = {
				imageId: res.lastInsertRowid,
				sm: `${res.lastInsertRowid}-sm.webp`,
				lg: `${res.lastInsertRowid}-lg.webp`,
				playlistId: data.playlistId
			};
			sql.set(
				`REPLACE INTO image (imageId, sm, lg, playlistId)
        VALUES (:imageId, :sm, :lg, :playlistId)`,
				newObj
			);
			refreshAllDevicesOnPlaylist(data.playlistId);
		} catch (e) {
			console.log(e);
			sql.set(`DELETE FROM image WHERE imageId = :id`, { id: res.lastInsertRowid });
			// you should also delete the files
			throw Error('Failed to write image to disk, removed record');
		}
		return res.lastInsertRowid as number;
	} catch (e) {
		console.log(e);
		throw e;
	}
});

function decode(dataURI: string) {
	if (!/data:image\//.test(dataURI)) throw Error('Not an image');

	const res = dataURI.match('data:(image/.*);base64,(.*)');
	if (res && res.length > 2)
		return {
			filetype: res[1].split('/')[1],
			data: res[2],
			buffer: Buffer.from(res[2], 'base64')
		};
	else throw Error("nah she's fucked ay");
}
