import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken
} from '../services/firebaseAuth';
import {
  backupMusicLibraryToDrive,
  fetchLatestBackupFromDrive,
  searchAudioFilesFromDrive,
  fetchDriveAudioAsBlobUrl,
  LarkBackupData,
  GoogleDriveAudioFile
} from '../services/googleDriveService';
import { MediaTrack, Playlist, EqualizerSettings } from '../types/player';
import { formatTime } from '../utils/formatters';
import {
  X,
  Cloud,
  UploadCloud,
  DownloadCloud,
  Music,
  CheckCircle2,
  AlertTriangle,
  Play,
  Plus,
  RefreshCw,
  LogOut,
  FolderOpen
} from 'lucide-react';

interface GoogleDriveBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: MediaTrack[];
  playlists: Playlist[];
  eqSettings: EqualizerSettings;
  onRestoreBackup: (backup: LarkBackupData) => void;
  onImportDriveTrack: (track: MediaTrack) => void;
  accentColor: string;
}

export const GoogleDriveBackupModal: React.FC<GoogleDriveBackupModalProps> = ({
  isOpen,
  onClose,
  tracks,
  playlists,
  eqSettings,
  onRestoreBackup,
  onImportDriveTrack,
  accentColor
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<'backup' | 'driveFiles'>('backup');

  // Backup & Restore states
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState<string | null>(null);
  const [latestBackup, setLatestBackup] = useState<{
    backup: LarkBackupData;
    modifiedTime: string;
  } | null>(null);
  const [isLoadingBackupInfo, setIsLoadingBackupInfo] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // Drive Audio Files state
  const [driveAudioFiles, setDriveAudioFiles] = useState<GoogleDriveAudioFile[]>([]);
  const [isLoadingDriveFiles, setIsLoadingDriveFiles] = useState(false);
  const [importingFileId, setImportingFileId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Initialize auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser) => {
        setUser(currentUser);
      },
      () => {
        setUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch backup info & audio files when user is connected and modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadBackupInfo();
      loadDriveAudioFiles();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsLoadingAuth(true);
    setStatusMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setStatusMessage('Connected to Google Drive successfully!');
        setTimeout(() => setStatusMessage(null), 3000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Sign-in cancelled or failed';
      setStatusMessage(msg);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setUser(null);
    setLatestBackup(null);
    setDriveAudioFiles([]);
  };

  const loadBackupInfo = async () => {
    setIsLoadingBackupInfo(true);
    try {
      const res = await fetchLatestBackupFromDrive();
      if (res) {
        setLatestBackup({
          backup: res.backup,
          modifiedTime: res.modifiedTime
        });
      } else {
        setLatestBackup(null);
      }
    } catch (e) {
      console.warn('Backup query note:', e);
    } finally {
      setIsLoadingBackupInfo(false);
    }
  };

  const loadDriveAudioFiles = async () => {
    setIsLoadingDriveFiles(true);
    try {
      const files = await searchAudioFilesFromDrive();
      setDriveAudioFiles(files);
    } catch (e) {
      console.warn('Drive files query note:', e);
    } finally {
      setIsLoadingDriveFiles(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsBackingUp(true);
    setBackupSuccess(null);
    setStatusMessage(null);

    const payload: LarkBackupData = {
      version: '5.8.0',
      appName: "Zafi's Music",
      backupTime: Date.now(),
      tracks: tracks,
      playlists: playlists,
      eqSettings: eqSettings
    };

    try {
      await backupMusicLibraryToDrive(payload);
      setBackupSuccess('Successfully backed up library to Google Drive!');
      await loadBackupInfo();
      setTimeout(() => setBackupSuccess(null), 4000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Backup failed';
      setStatusMessage(msg);
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleConfirmRestore = () => {
    if (!latestBackup) return;
    onRestoreBackup(latestBackup.backup);
    setShowRestoreConfirm(false);
    setStatusMessage('Library restored successfully from Google Drive!');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleImportDriveAudio = async (driveFile: GoogleDriveAudioFile) => {
    setImportingFileId(driveFile.id);
    setStatusMessage(null);
    try {
      const streamUrl = await fetchDriveAudioAsBlobUrl(driveFile.id);
      const cleanTitle = driveFile.name.replace(/\.[^/.]+$/, '');

      const newTrack: MediaTrack = {
        id: `gdrive-${driveFile.id}`,
        title: cleanTitle,
        artist: 'Google Drive Cloud Music',
        duration: 190,
        coverUrl:
          'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
        audioUrl: streamUrl,
        addedAt: Date.now(),
        isFavorite: false,
        source: 'local',
        plays: 0,
        fileSize: driveFile.size
          ? `${(parseInt(driveFile.size, 10) / (1024 * 1024)).toFixed(1)} MB`
          : undefined
      };

      onImportDriveTrack(newTrack);
      setStatusMessage(`Imported "${cleanTitle}" to your Zafi's Music library!`);
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to import audio';
      setStatusMessage(msg);
    } finally {
      setImportingFileId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#141624] border border-[#272B3E] rounded-3xl p-6 text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Glow accent */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Google Drive Cloud Music</h3>
              <p className="text-xs text-white/50">Backup, restore &amp; sync your media library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast Banner */}
        {statusMessage && (
          <div className="my-3 p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-2xl text-xs text-cyan-200 flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="truncate">{statusMessage}</span>
          </div>
        )}

        {/* User Authentication Status */}
        <div className="my-3 p-3.5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-10 h-10 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-black"
                  style={{ backgroundColor: accentColor }}
                >
                  {user.displayName?.slice(0, 1) || 'G'}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-sm font-bold text-white truncate">
                  {user.displayName || 'Google User'}
                </div>
                <div className="text-xs text-white/50 truncate">{user.email}</div>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-bold text-white">Not Connected</div>
              <div className="text-xs text-white/50">
                Sign in with Google to backup or stream your Drive music
              </div>
            </div>
          )}

          <div>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/70 hover:text-rose-300 text-xs font-semibold transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              /* Official Google Sign-in Button style */
              <button
                onClick={handleSignIn}
                disabled={isLoadingAuth}
                className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white text-slate-800 text-xs font-bold hover:bg-slate-100 active:scale-95 transition-all shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                <span>{isLoadingAuth ? 'Connecting...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher: Backup & Restore vs Drive Audio Files */}
        {user && (
          <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3 shrink-0">
            <button
              onClick={() => setActiveTab('backup')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'backup'
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Cloud Backup &amp; Restore
            </button>
            <button
              onClick={() => setActiveTab('driveFiles')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'driveFiles'
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              Drive Audio Library ({driveAudioFiles.length})
            </button>
          </div>
        )}

        {/* Content Area */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {!user ? (
            <div className="py-8 text-center px-4 space-y-3">
              <Cloud className="w-12 h-12 mx-auto text-cyan-400/40" />
              <h4 className="font-bold text-base text-white">
                Sync &amp; Back Up Your Music
              </h4>
              <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                Connect your Google Drive to keep your favorite songs, customized playlists,
                and equalizer sound profiles safe. Stream and import songs stored in your cloud storage
                with permission anytime!
              </p>
            </div>
          ) : activeTab === 'backup' ? (
            /* Cloud Backup & Restore Panel */
            <div className="space-y-4">
              {/* Backup Action Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <UploadCloud className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Create Cloud Backup</h4>
                      <p className="text-[11px] text-white/50">
                        {tracks.length} songs · {playlists.length} playlists · Equalizer profiles
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCreateBackup}
                    disabled={isBackingUp}
                    style={{ backgroundColor: accentColor }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-black hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
                  >
                    {isBackingUp ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                    ) : (
                      <UploadCloud className="w-3.5 h-3.5 text-black" />
                    )}
                    <span>{isBackingUp ? 'Backing Up...' : 'Back Up Now'}</span>
                  </button>
                </div>
                {backupSuccess && (
                  <p className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {backupSuccess}
                  </p>
                )}
              </div>

              {/* Restore Action Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <DownloadCloud className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Restore from Google Drive</h4>
                      {isLoadingBackupInfo ? (
                        <p className="text-xs text-white/40">Checking Google Drive backups...</p>
                      ) : latestBackup ? (
                        <div className="text-[11px] text-white/60 space-y-0.5 mt-0.5">
                          <p>
                            Found backup from:{' '}
                            <span className="font-mono text-cyan-300">
                              {new Date(latestBackup.backup.backupTime).toLocaleString()}
                            </span>
                          </p>
                          <p>
                            Contains: {latestBackup.backup.tracks.length} tracks,{' '}
                            {latestBackup.backup.playlists.length} playlists
                          </p>
                        </div>
                      ) : (
                        <p className="text-xs text-white/40">
                          No Zafi&apos;s Music backup found in your Drive yet.
                        </p>
                      )}
                    </div>
                  </div>

                  {latestBackup && (
                    <button
                      onClick={() => setShowRestoreConfirm(true)}
                      className="px-3.5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold transition-colors shrink-0"
                    >
                      Restore
                    </button>
                  )}
                </div>
              </div>

              {/* Explicit Confirmation Dialog (Mandatory for destructive/overwrite operations) */}
              {showRestoreConfirm && (
                <div className="p-4 bg-rose-950/50 border border-rose-500/30 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center gap-2 text-rose-300 text-sm font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>Confirm Restore from Google Drive</span>
                  </div>
                  <p className="text-xs text-white/70">
                    Are you sure you want to restore {latestBackup?.backup.tracks.length} songs and{' '}
                    {latestBackup?.backup.playlists.length} playlists? This will update your current
                    playlists and favorites with the cloud backup.
                  </p>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setShowRestoreConfirm(false)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmRestore}
                      className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow"
                    >
                      Confirm Restore
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Drive Audio Files Panel */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-white/60">
                <span>Audio files found in your Google Drive:</span>
                <button
                  onClick={loadDriveAudioFiles}
                  className="p-1 hover:text-white"
                  title="Refresh list"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isLoadingDriveFiles ? 'animate-spin' : ''}`}
                  />
                </button>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {driveAudioFiles.map((file) => {
                  const isImporting = importingFileId === file.id;
                  return (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                          <Music className="w-4 h-4" />
                        </div>
                        <div className="truncate min-w-0">
                          <h5 className="text-xs font-semibold text-white truncate">
                            {file.name}
                          </h5>
                          <span className="text-[10px] text-white/40">
                            {file.size
                              ? `${(parseInt(file.size, 10) / (1024 * 1024)).toFixed(1)} MB`
                              : 'Audio file'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleImportDriveAudio(file)}
                        disabled={isImporting}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs text-white font-medium transition-all shrink-0"
                      >
                        {isImporting ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                        ) : (
                          <Plus className="w-3.5 h-3.5 text-cyan-400" />
                        )}
                        <span>{isImporting ? 'Importing...' : 'Import'}</span>
                      </button>
                    </div>
                  );
                })}

                {driveAudioFiles.length === 0 && !isLoadingDriveFiles && (
                  <div className="py-8 text-center text-white/40 text-xs">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    No audio files found in your Google Drive root. You can upload .mp3 or .wav files
                    to Drive and sync them here!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            style={{ backgroundColor: accentColor }}
            className="w-full py-2.5 rounded-xl font-bold text-black text-sm hover:opacity-90 transition-opacity"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
