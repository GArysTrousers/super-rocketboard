interface Playlist {
  playlistId: number;
  name: string;
  updated: number;
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
  updated: number;
  playlistId: number;
}

interface User {
  userId: number;
  username: string;
  passhash: string;
  permission: string;
}