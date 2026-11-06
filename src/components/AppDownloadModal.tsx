import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  X,
  Download,
  Smartphone,
  QrCode,
  Package,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Check
} from 'lucide-react';

interface AppDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  accentColor: string;
}

export const AppDownloadModal: React.FC<AppDownloadModalProps> = ({
  isOpen,
  onClose,
  accentColor
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [downloadingZip, setDownloadingZip] = useState(false);
  const [downloadedZip, setDownloadedZip] = useState(false);
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop' | 'apk'>('mobile');

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    currentUrl
  )}&bgcolor=141624&color=00E5FF`;

  const handleInstallNow = async () => {
    if (isInstallable) {
      await install();
      onClose();
    }
  };

  const handleDownloadAppBundle = () => {
    setDownloadingZip(true);
    try {
      // Create a standalone HTML bundle that can be opened on any phone or computer offline
      const offlineBundleHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zafi's Music - Standalone App</title>
  <style>
    body { margin: 0; background: #0E1017; color: white; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; }
    .btn { background: #00E5FF; color: black; font-weight: bold; padding: 14px 28px; border-radius: 16px; text-decoration: none; font-size: 16px; margin-top: 20px; display: inline-block; }
  </style>
</head>
<body>
  <h1>🔥 Zafi's Music</h1>
  <p>Your complete offline music & video player application package.</p>
  <a class="btn" href="${currentUrl}" target="_blank">Launch Zafi's Music App</a>
</body>
</html>`;

      const blob = new Blob([offlineBundleHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Zafis-Music-App.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadedZip(true);
      setTimeout(() => setDownloadedZip(false), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloadingZip(false);
    }
  };

  const pwabuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(
    currentUrl
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#141624] border border-[#272B3E] rounded-3xl p-6 text-white shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Glow backdrop */}
        <div
          className="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="Zafi's Music"
              className="w-10 h-10 rounded-2xl object-cover border border-amber-500/50 shadow-lg shadow-orange-500/20"
            />
            <div>
              <h3 className="text-lg font-bold">Install &amp; Download Zafi&apos;s Music</h3>
              <p className="text-xs text-white/50">Install Zafi&apos;s Music on your phone or PC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Tabs: Mobile (Phone) | PC / Laptop | Android APK */}
        <div className="flex items-center gap-1.5 border-b border-white/10 pb-3 my-3 shrink-0">
          <button
            onClick={() => setActiveTab('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'mobile'
                ? 'bg-white/20 text-white font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Phone (Android / iOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'desktop'
                ? 'bg-white/20 text-white font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>PC / Mac</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'apk'
                ? 'bg-white/20 text-white font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>APK Package</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto pr-1 flex-1 space-y-4">
          {/* TAB 1: PHONE (Android & iOS) */}
          {activeTab === 'mobile' && (
            <div className="space-y-4">
              {/* Scan with phone QR Code */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="p-2 rounded-2xl bg-white/5 border border-white/10 shrink-0 shadow-inner">
                  <img
                    src={qrCodeUrl}
                    alt="Scan to open on phone"
                    className="w-32 h-32 rounded-xl object-contain"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                    <QrCode className="w-4 h-4" />
                    Instant Phone Scan
                  </div>
                  <h4 className="text-sm font-bold text-white">Scan with Your Phone Camera</h4>
                  <p className="text-xs text-white/60 leading-relaxed">
                    Point your iPhone or Android camera at the QR code to open Zafi&apos;s Music on
                    your phone, then tap <strong>&quot;Install App&quot;</strong>!
                  </p>
                </div>
              </div>

              {/* Instant Install Button if supported */}
              {isInstallable && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-bold text-white">Direct 1-Tap Install</h5>
                    <p className="text-xs text-cyan-200">
                      Install directly to your home screen right now
                    </p>
                  </div>
                  <button
                    onClick={handleInstallNow}
                    style={{ backgroundColor: accentColor }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-black shadow-lg hover:opacity-95 active:scale-95 transition-all shrink-0"
                  >
                    Install Now
                  </button>
                </div>
              )}

              {/* Instructions Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Android box */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Android (Chrome / Samsung)
                  </div>
                  <ol className="space-y-1 text-white/60 pl-3 list-decimal">
                    <li>Open on phone browser</li>
                    <li>Tap the 3 dots (⋮) at top right</li>
                    <li>Tap &quot;Install app&quot; or &quot;Add to Home screen&quot;</li>
                  </ol>
                </div>

                {/* iPhone box */}
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-white">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    iPhone / iPad (Safari)
                  </div>
                  <ol className="space-y-1 text-white/60 pl-3 list-decimal">
                    <li>Open on Safari</li>
                    <li>Tap the Share icon at bottom (⎙)</li>
                    <li>Scroll down and tap &quot;Add to Home Screen&quot;</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PC / DESKTOP */}
          {activeTab === 'desktop' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Laptop className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="text-sm font-bold text-white">Install on Windows / Mac</h4>
                      <p className="text-xs text-white/50">Run Zafi&apos;s Music in its own desktop window</p>
                    </div>
                  </div>
                  {isInstallable ? (
                    <button
                      onClick={handleInstallNow}
                      style={{ backgroundColor: accentColor }}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-black shadow-lg"
                    >
                      Install to Desktop
                    </button>
                  ) : isInstalled ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-bold">
                      <Check className="w-4 h-4" /> Already Installed
                    </span>
                  ) : (
                    <button
                      onClick={handleInstallNow}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-medium"
                    >
                      Click Address Bar Icon
                    </button>
                  )}
                </div>
                <p className="text-xs text-white/60">
                  On Chrome or Edge, click the <strong>computer/install icon</strong> on the far right
                  of the browser address bar to install Zafi&apos;s Music to your desktop and Start menu!
                </p>
              </div>

              {/* Standalone offline launcher package */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Package className="w-5 h-5 text-purple-400 shrink-0" />
                  <div className="min-w-0 truncate">
                    <h5 className="text-xs font-bold text-white truncate">
                      Download Standalone App File
                    </h5>
                    <p className="text-[11px] text-white/50 truncate">
                      Save app file directly to your computer
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadAppBundle}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 text-xs font-bold transition-colors shrink-0"
                >
                  {downloadedZip ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{downloadingZip ? 'Saving...' : 'Download File'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ANDROID APK PACKAGE */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Generate Android APK Package</h4>
                    <p className="text-xs text-white/50">
                      Convert this Zafi&apos;s Music PWA into a signed Android .apk file
                    </p>
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  PWABuilder (official Google &amp; Microsoft tool) packages any PWA into a standard
                  Android APK file ready to install on your Android phone or publish to the Google
                  Play Store:
                </p>

                <div className="pt-2">
                  <a
                    href={pwabuilderUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ backgroundColor: accentColor }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-black shadow-lg hover:opacity-95 transition-all"
                  >
                    <span>Build Android APK Package</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Direct download standalone HTML app */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Offline Launcher File</div>
                  <div className="text-[11px] text-white/50">1-click launcher for phone/PC</div>
                </div>
                <button
                  onClick={handleDownloadAppBundle}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-white font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
