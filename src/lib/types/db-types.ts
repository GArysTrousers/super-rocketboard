interface Playlist {
  playlistId: number;
  name: string;
}

interface Image {
  imageId: number;
  sm: string;
  lg: string;
  position: number;
  playlistId: number;
}

interface Device {
  deviceId: number;
  name: string;
  ip: string;
  playlistId: number;
}