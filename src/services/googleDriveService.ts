import { getAccessToken } from './firebaseAuth';
import { MediaTrack, Playlist, EqualizerSettings } from '../types/player';

export interface LarkBackupData {
  version: string;
  backupTime: number;
  appName: string;
  tracks: MediaTrack[];
  playlists: Playlist[];
  eqSettings?: EqualizerSettings;
}

export interface GoogleDriveAudioFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime?: string;
  webContentLink?: string;
}

const BACKUP_FILENAME = 'Lark_Player_Music_Backup.json';

export async function backupMusicLibraryToDrive(
  data: LarkBackupData
): Promise<{ fileId: string; backupTime: number }> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  // Search if backup file already exists
  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${BACKUP_FILENAME}' and trashed=false&fields=files(id,name)`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!searchRes.ok) {
    const err = await searchRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to search Google Drive');
  }

  const searchData = await searchRes.json();
  const existingFile = searchData.files && searchData.files[0];
  const fileContent = JSON.stringify(data, null, 2);

  if (existingFile) {
    // Update existing file content
    const updateRes = await fetch(
      `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: fileContent
      }
    );

    if (!updateRes.ok) {
      throw new Error('Failed to update backup file on Google Drive');
    }

    const updated = await updateRes.json();
    return { fileId: updated.id, backupTime: data.backupTime };
  } else {
    // Create new backup file with multipart upload (metadata + media)
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: BACKUP_FILENAME,
      mimeType: 'application/json',
      description: "Zafi's Music Cloud Backup containing playlists and track library"
    };

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      closeDelimiter;

    const createRes = await fetch(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartRequestBody
      }
    );

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Failed to create backup on Google Drive');
    }

    const created = await createRes.json();
    return { fileId: created.id, backupTime: data.backupTime };
  }
}

export async function fetchLatestBackupFromDrive(): Promise<{
  backup: LarkBackupData;
  fileId: string;
  modifiedTime: string;
} | null> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  const searchRes = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=name='${BACKUP_FILENAME}' and trashed=false&fields=files(id,name,modifiedTime,size)&orderBy=modifiedTime desc`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!searchRes.ok) {
    throw new Error('Failed to query backups from Google Drive');
  }

  const searchData = await searchRes.json();
  const file = searchData.files && searchData.files[0];
  if (!file) return null;

  // Fetch file content
  const contentRes = await fetch(
    `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!contentRes.ok) {
    throw new Error('Failed to download backup content from Google Drive');
  }

  const backupData: LarkBackupData = await contentRes.json();
  return {
    backup: backupData,
    fileId: file.id,
    modifiedTime: file.modifiedTime
  };
}

export async function searchAudioFilesFromDrive(): Promise<GoogleDriveAudioFile[]> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  // Query audio files from drive
  const query = "mimeType contains 'audio/' and trashed=false";
  const res = await fetch(
    `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,mimeType,size,createdTime)&pageSize=30`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to search audio files in Google Drive');
  }

  const data = await res.json();
  return data.files || [];
}

export async function fetchDriveAudioAsBlobUrl(fileId: string): Promise<string> {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Drive');

  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    throw new Error('Failed to load audio stream from Google Drive');
  }

  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
