import type { Unsafe } from 'sveltekit-sse';
import { sql } from './db';

export type Emitter = (eventName: string, data: string) => Unsafe<void, Error>;

const connectedDevices: ConnectedDevice[] = [];

interface ConnectedDevice {
	deviceId: number;
	emit: Emitter;
}

export function addDeviceConnection(device: ConnectedDevice) {
	connectedDevices.push(device);
  console.log('🟢 display connected | total connected:', connectedDevices.length);
}

export function removeDeviceConnection(emit: Emitter) {
  const index = connectedDevices.findIndex((v) => v.emit === emit);
	if (index > -1) connectedDevices.splice(index, 1);
  console.log('🔴 display disconnected | total connected:', connectedDevices.length);
}

export function getConnectedDevices() {
  return connectedDevices.map((v) => v.deviceId)
}


export function refreshDevice(deviceId: number) {
	for (const device of connectedDevices) {
		if (device.deviceId === deviceId) {
      try {
        device.emit('update', `${Date.now()}`);
      } catch (e) {
        console.log(e);
      }
		}
	}
}

export function refreshAllDevicesOnPlaylist(playlistId: number) {
  const devices = sql.get<Device>('SELECT * FROM device WHERE playlistId = :playlistId', {playlistId}).map((v) => v.deviceId)
	const cd = connectedDevices.filter((v) => devices.includes(v.deviceId))
  for (const device of cd) {
		device.emit('update', `${Date.now()}`);
	}
}