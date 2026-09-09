import { api } from "./api";



export async function loadFiles(files: FileList) {
  if (!files || files.length === 0) return [];
  const filesData: ImageUploadData[] = [];
  for (let i = 0; files.item(i) !== null; i++) {
    const file = files.item(i);
    if (file !== null) {
      filesData.push(await loadFile(file));
    }
  }
  return filesData
}

export async function loadFile(file: File) {
  return new Promise<ImageUploadData>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', async () => {
      if (typeof reader.result === 'string') {
        resolve({ data: reader.result, name: file.name })
      }
    });
    reader.readAsDataURL(file);
  })
}


export type ImageUploadData = { data: string; name: string }

export async function uploadImages(images: ImageUploadData[], playlistId: number) {
  const newIds = []
  for (const image of images) {
    newIds.push(await api<any>('/api/upload', {...image, playlistId}))
  }
  return newIds
}