import React from 'react';
import { AppTheme } from '../types/player';
import { LARK_THEMES } from '../data/initialMedia';
import { X, Palette, Check } from 'lucide-react';

interface ThemeStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeThemeId: string;
  onSelectTheme: (theme: AppTheme) => void;
  accentColor: string;
}

export const ThemeStoreModal: React.FC<ThemeStoreModalProps> = ({
  isOpen,
  onClose,
  activeThemeId,
  onSelectTheme,
  accentColor
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#131520] border border-[#272B3E] rounded-3xl p-6 text-white shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${accentColor}25`, color: accentColor }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Theme Skin Store</h3>
              <p className="text-xs text-white/50">Personalize Zafi&apos;s Music colors &amp; skins</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme List */}
        <div className="overflow-y-auto pr-1 my-4 space-y-3 flex-1">
          {LARK_THEMES.map((theme) => {
            const isSelected = theme.id === activeThemeId;
            return (
              <div
                key={theme.id}
                onClick={() => onSelectTheme(theme)}
                className={`relative p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-white/40 bg-white/10 shadow-lg scale-[1.01]'
                    : 'border-white/5 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  {/* Theme Gradient swatch */}
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.previewGradient} border border-white/20 shadow-inner flex items-center justify-center`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white/60"
                      style={{ backgroundColor: theme.primaryAccent }}
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-white">{theme.name}</h4>
                    <span className="text-[11px] text-white/50">
                      Accent: <span className="font-mono text-white/80">{theme.primaryAccent}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  {isSelected ? (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: theme.primaryAccent }}
                    >
                      <Check className="w-4 h-4 text-black font-bold" />
                    </div>
                  ) : (
                    <span className="text-xs text-white/40 hover:text-white/70 px-2 py-1 rounded bg-white/5">
                      Apply
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            style={{ backgroundColor: accentColor }}
            className="w-full py-2.5 rounded-xl font-bold text-black text-sm hover:opacity-90 transition-opacity"
          >
            Apply &amp; Done
          </button>
        </div>
      </div>
    </div>
  );
};
