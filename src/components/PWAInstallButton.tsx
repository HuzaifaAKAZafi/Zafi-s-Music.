import React, { useState } from 'react';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, Check, WifiOff } from 'lucide-react';

interface PWAInstallButtonProps {
  accentColor: string;
  variant?: 'header' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  accentColor,
  variant = 'header'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already installed and launched from home screen / standalone app window, suppress
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  if (variant === 'card') {
    return (
      <>
        <div
          onClick={handleInstallClick}
          className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-cyan-900/30 to-black/40 border border-white/10 hover:border-white/20 cursor-pointer transition-all active:scale-[0.98] flex items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-3.5">
            <img
              src="/logo.jpg"
              alt="Zafi's Music"
              className="w-12 h-12 rounded-xl object-cover border border-amber-500/50 shadow-lg shadow-orange-500/20 shrink-0"
            />
            <div>
              <h4 className="font-bold text-sm text-white">Install Zafi&apos;s Music App</h4>
              <p className="text-xs text-white/50">
                Install on your Phone or Desktop for full offline playback
              </p>
            </div>
          </div>

          <button
            style={{ backgroundColor: accentColor }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-black shadow-md shrink-0 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>
        </div>

        {/* Guided Install Modal */}
        {showGuide && (
          <InstallGuideModal
            isIOS={isIOS}
            onClose={() => setShowGuide(false)}
            accentColor={accentColor}
          />
        )}
      </>
    );
  }

  // Header compact variant
  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shadow-sm"
        title="Install Zafi's Music App"
      >
        <Download className="w-3.5 h-3.5" style={{ color: accentColor }} />
        <span>Install App</span>
      </button>

      {showGuide && (
        <InstallGuideModal
          isIOS={isIOS}
          onClose={() => setShowGuide(false)}
          accentColor={accentColor}
        />
      )}
    </>
  );
};

interface InstallGuideModalProps {
  isIOS: boolean;
  onClose: () => void;
  accentColor: string;
}

const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isIOS, onClose, accentColor }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-[#141624] border border-[#272B3E] rounded-3xl p-6 text-white shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.jpg"
              alt="Zafi's Music"
              className="w-8 h-8 rounded-xl object-cover border border-amber-500/50 shadow-md"
            />
            <h3 className="font-bold text-base">Install Zafi&apos;s Music</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="text-xs text-white/70 space-y-3">
          {isIOS ? (
            <>
              <p className="leading-relaxed">To install on iPhone or iPad:</p>
              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                    1
                  </span>
                  <span>
                    Tap the <strong>Share</strong> button in Safari&apos;s toolbar.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                    2
                  </span>
                  <span>
                    Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                    3
                  </span>
                  <span>
                    Tap <strong>Add</strong> at top right to complete.
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="leading-relaxed">To install on Android, Chrome, Edge, or Mac/PC:</p>
              <div className="space-y-2 pl-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                    1
                  </span>
                  <span>Click the browser install icon in the address bar, or tap menu ⋮</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                    2
                  </span>
                  <span>
                    Select <strong>&quot;Install Zafi&apos;s Music&quot;</strong> or{' '}
                    <strong>&quot;Add to Home screen&quot;</strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                    3
                  </span>
                  <span>Enjoy standalone app window with full offline audio playback!</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="pt-2">
          <button
            onClick={onClose}
            style={{ backgroundColor: accentColor }}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-black"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-500/90 backdrop-blur-md text-black text-xs font-bold shadow-xl animate-fadeIn">
      <WifiOff className="w-4 h-4 text-black" />
      <span>Offline Mode — Cached library &amp; local media ready</span>
    </div>
  );
};
