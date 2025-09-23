"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie, Settings, Shield, ChevronUp, ChevronDown } from "lucide-react";

interface CookiePreferences {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const STORAGE_KEY = "cookieConsent";
const PREFS_KEY = "cookiePreferences";

export default function CookiesBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prefs, setPrefs] = useState<CookiePreferences>({
    necessary: true,
    analytics: true,
    marketing: false,
    preferences: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const persist = (consent: string, value: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, consent);
    localStorage.setItem(PREFS_KEY, JSON.stringify(value));
    // Permet à d'autres composants de réagir au consentement.
    window.dispatchEvent(new CustomEvent("cookie-consent-updated"));
    setIsVisible(false);
    setIsExpanded(false);
    setShowSettings(false);
  };

  const handleAcceptAll = () =>
    persist("accepted", {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });

  const handleDeclineAll = () =>
    persist("declined", {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });

  const handleSavePreferences = () => persist("custom", prefs);

  const toggle = (key: "analytics" | "marketing" | "preferences") =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }));

  if (!isVisible) return null;

  const Toggle = ({
    label,
    description,
    checked,
    onChange,
    locked,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange?: () => void;
    locked?: boolean;
  }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div>
        <h4 className="text-xs font-medium text-gray-900">{label}</h4>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      {locked ? (
        <span className="text-xs text-gray-500 font-medium">Actif</span>
      ) : (
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={label}
          onClick={onChange}
          className={`relative w-9 h-5 rounded-full transition-colors ${
            checked ? "bg-orange-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-4 w-4 bg-white rounded-full transition-transform ${
              checked ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      )}
    </div>
  );

  return (
    <div
      role="dialog"
      aria-label="Gestion des cookies"
      className={`fixed bottom-4 left-4 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl transition-all duration-300 ease-out ${
        isExpanded || showSettings ? "w-96 max-h-[80vh] overflow-y-auto" : "w-80"
      }`}
    >
      <button
        onClick={handleDeclineAll}
        aria-label="Fermer et refuser les cookies optionnels"
        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors z-10"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-4">
        {!showSettings ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 pr-6">
              <Cookie className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  Cookies
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Nous utilisons des cookies pour améliorer votre expérience.
                </p>
              </div>
            </div>

            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                <ChevronDown className="w-3 h-3" />
                Plus d'infos
              </button>
            ) : (
              <div className="space-y-3 border-t border-gray-100 pt-3">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
                >
                  <ChevronUp className="w-3 h-3" />
                  Moins d'infos
                </button>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Nous utilisons des cookies nécessaires au fonctionnement du
                  site et, avec votre accord, des cookies de mesure d'audience et
                  de personnalisation. Vous pouvez choisir lesquels accepter.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    <Settings className="w-3 h-3" />
                    Personnaliser
                  </button>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors"
                  >
                    <Shield className="w-3 h-3" />
                    Politique de confidentialité
                  </Link>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDeclineAll}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Tout refuser
              </button>
              <button
                onClick={handleAcceptAll}
                className="flex-1 px-3 py-2 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
              >
                Tout accepter
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between pr-6">
              <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Shield className="w-4 h-4 text-orange-500" />
                Préférences
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                aria-label="Revenir"
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <Toggle
                label="Nécessaires"
                description="Requis (session, panier)"
                checked
                locked
              />
              <Toggle
                label="Analyse"
                description="Mesure d'audience"
                checked={prefs.analytics}
                onChange={() => toggle("analytics")}
              />
              <Toggle
                label="Marketing"
                description="Publicités personnalisées"
                checked={prefs.marketing}
                onChange={() => toggle("marketing")}
              />
              <Toggle
                label="Préférences"
                description="Personnalisation du contenu"
                checked={prefs.preferences}
                onChange={() => toggle("preferences")}
              />
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={handleDeclineAll}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Tout refuser
              </button>
              <button
                onClick={handleSavePreferences}
                className="flex-1 px-3 py-2 text-xs font-medium text-white bg-black hover:bg-gray-800 rounded-lg transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
