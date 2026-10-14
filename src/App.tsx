import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Wind,
  Music,
  Sun,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Maximize2,
  Compass,
  Sliders,
  X,
  Menu,
  Smartphone,
  Laptop,
  Code,
  FileArchive,
} from 'lucide-react';
import { ArtworkItem, REDDYMADE_ARTWORKS } from './data/artworks';
import { GalleryScene3D, LightingPreset } from './components/GalleryScene3D';
import { GalleryMiniMap } from './components/GalleryMiniMap';
import { CatalogModal } from './components/CatalogModal';
import { MobileControlsOverlay } from './components/MobileControlsOverlay';
import { soundscape } from './utils/soundscape';

export default function App() {
  const [hasEnteredPavilion, setHasEnteredPavilion] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(null);
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('golden-hour');
  const [rakingLightActive, setRakingLightActive] = useState(false);
  const [reliefIntensity, setReliefIntensity] = useState(1.15);
  const [guidedTourActive, setGuidedTourActive] = useState(false);

  // Responsive device state
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileMiniMapOpen, setMobileMiniMapOpen] = useState(false);
  const [mobilePlacardExpanded, setMobilePlacardExpanded] = useState(false);
  const [mobileMoveVector, setMobileMoveVector] = useState<{ x: number; z: number } | null>(null);
  const [mobileTurnDelta, setMobileTurnDelta] = useState<number>(0);

  // Audio state
  const [audioStarted, setAudioStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [windVolume, setWindVolume] = useState(0.55);
  const [musicVolume, setMusicVolume] = useState(0.45);
  const [showAtmosphereDrawer, setShowAtmosphereDrawer] = useState(false);

  // Catalog Modal state
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [catalogTab, setCatalogTab] = useState<'collection' | 'inspect' | 'artist' | 'download-code'>('collection');
  const [inspectedArtwork, setInspectedArtwork] = useState<ArtworkItem | null>(null);

  // Visitor position for mini-map
  const [cameraPos, setCameraPos] = useState({ x: 0, z: 4.8, yaw: 0 });
  const [walkTargetCommand, setWalkTargetCommand] = useState<{
    position: [number, number, number];
    target: [number, number, number];
    timestamp: number;
  } | null>(null);

  useEffect(() => {
    const handleDeviceCheck = () => {
      setIsMobileDevice(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    handleDeviceCheck();
    window.addEventListener('resize', handleDeviceCheck);
    return () => window.removeEventListener('resize', handleDeviceCheck);
  }, []);

  const ensureAudioRunning = async () => {
    if (!audioStarted) {
      await soundscape.start();
      setAudioStarted(true);
      setIsMuted(false);
    }
  };

  const handleEnterGallery = async (startTour = false) => {
    await ensureAudioRunning();
    setHasEnteredPavilion(true);
    if (startTour) {
      setGuidedTourActive(true);
      setSelectedArtwork(REDDYMADE_ARTWORKS[0]);
    }
  };

  const handleSelectArtwork = async (art: ArtworkItem | null) => {
    await ensureAudioRunning();
    if (art) {
      soundscape.playInteractionChime();
      setMobilePlacardExpanded(false);
    } else {
      setRakingLightActive(false);
    }
    setSelectedArtwork(art);
  };

  const handleStepArtwork = async (dir: -1 | 1) => {
    await ensureAudioRunning();
    const currentIndex = selectedArtwork
      ? REDDYMADE_ARTWORKS.findIndex((a) => a.id === selectedArtwork.id)
      : -1;
    const nextIndex =
      (currentIndex + dir + REDDYMADE_ARTWORKS.length) % REDDYMADE_ARTWORKS.length;
    const nextArt = REDDYMADE_ARTWORKS[nextIndex];
    soundscape.playInteractionChime();
    setSelectedArtwork(nextArt);
  };

  const handleToggleMute = async () => {
    if (!audioStarted) {
      await ensureAudioRunning();
      return;
    }
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundscape.setMuted(nextMuted);
  };

  const handleWindChange = async (val: number) => {
    await ensureAudioRunning();
    setWindVolume(val);
    soundscape.setWindVolume(val);
  };

  const handleMusicChange = async (val: number) => {
    await ensureAudioRunning();
    setMusicVolume(val);
    soundscape.setMusicVolume(val);
  };

  const handleMobileTurn = (delta: number) => {
    setMobileTurnDelta(delta);
    setTimeout(() => setMobileTurnDelta(0), 120);
  };

  const handleMiniMapFloorClick = (x: number, z: number) => {
    setSelectedArtwork(null);
    setGuidedTourActive(false);
    setWalkTargetCommand({
      position: [x, 1.75, z],
      target: [0, 2.0, -4.5],
      timestamp: Date.now(),
    });
  };

  const handleResetCenterView = () => {
    setSelectedArtwork(null);
    setGuidedTourActive(false);
    setRakingLightActive(false);
    setWalkTargetCommand({
      position: [0, 1.75, 4.8],
      target: [0, 2.1, -6.0],
      timestamp: Date.now(),
    });
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#12100E] text-[#FBF9F5] select-none touch-none">
      {/* 1. FULL-VIEWPORT 3D SEYCHELLES GALLERY CANVAS */}
      <GalleryScene3D
        selectedArtwork={selectedArtwork}
        onSelectArtwork={handleSelectArtwork}
        lightingPreset={lightingPreset}
        rakingLightActive={rakingLightActive}
        reliefIntensity={reliefIntensity}
        guidedTourActive={guidedTourActive}
        onStopGuidedTour={() => setGuidedTourActive(false)}
        onCameraMove={setCameraPos}
        walkTargetCommand={walkTargetCommand}
        mobileMoveVector={mobileMoveVector}
        mobileTurnDelta={mobileTurnDelta}
      />

      {/* 2. TOP BAR (Accommodates Laptops with full horizontal nav & Phones with hamburger drawer) */}
      <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-3 bg-black/60 backdrop-blur-md border-b border-white/10">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={handleResetCenterView}
          className="text-xl font-serif-display font-semibold tracking-tight text-[#FBF9F5] whitespace-nowrap shrink-0 cursor-pointer"
        >
          ReddyMade
        </button>

        {/* Zone 2: Navigation Links for Laptops & Desktops (md+) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-7 text-xs font-medium text-[#D6CEBE]">
          <button
            onClick={handleResetCenterView}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            3D Pavilion
          </button>
          <button
            onClick={() => {
              setInspectedArtwork(null);
              setCatalogTab('collection');
              setCatalogOpen(true);
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Collection Catalogue
          </button>
          <button
            onClick={() => {
              setInspectedArtwork(null);
              setCatalogTab('inspect');
              setCatalogOpen(true);
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Plate Study
          </button>
          <button
            onClick={() => {
              setInspectedArtwork(null);
              setCatalogTab('download-code');
              setCatalogOpen(true);
            }}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 text-[#EAB308]"
          >
            Download Code
          </button>
          <button
            onClick={() => setShowAtmosphereDrawer(!showAtmosphereDrawer)}
            className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0"
          >
            Sun & Soundscape
          </button>
        </nav>

        {/* Zone 3: Actions + Mobile Menu Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={async () => {
              await ensureAudioRunning();
              const nextTour = !guidedTourActive;
              setGuidedTourActive(nextTour);
              if (nextTour && !selectedArtwork) {
                setSelectedArtwork(REDDYMADE_ARTWORKS[0]);
              }
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              guidedTourActive
                ? 'bg-[#D97706] text-white hover:bg-[#B45309]'
                : 'bg-[#FBF9F5] text-[#1C1917] hover:bg-[#EBE6DF]'
            }`}
          >
            {guidedTourActive ? 'Stop Tour' : 'Guided Tour'}
          </button>

          {/* Mobile Navigation Trigger Button (Visible on phones & small screens) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#FBF9F5] transition-colors"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE SLIDE-OUT NAVIGATION DRAWER (FOR PHONES & TABLETS) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/85 backdrop-blur-md flex flex-col justify-between p-5 pt-20 overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-tabular uppercase tracking-widest text-[#D97706]">
              <span>ReddyMade Pavilion Menu</span>
              <span className="text-[#D6CEBE]">Mahé, Seychelles</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  handleResetCenterView();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-base font-serif-display text-[#FBF9F5] flex items-center justify-between"
              >
                <span>3D Island Pavilion (Center View)</span>
                <Compass className="w-4 h-4 text-[#D6CEBE]" />
              </button>

              <button
                onClick={() => {
                  setInspectedArtwork(null);
                  setCatalogTab('collection');
                  setCatalogOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-base font-serif-display text-[#FBF9F5] flex items-center justify-between"
              >
                <span>Collection Catalogue (08)</span>
                <span className="text-xs font-mono-tabular text-[#D97706]">All Plates</span>
              </button>

              <button
                onClick={() => {
                  setInspectedArtwork(null);
                  setCatalogTab('inspect');
                  setCatalogOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-base font-serif-display text-[#FBF9F5] flex items-center justify-between"
              >
                <span>High-Res Plate Study</span>
                <Maximize2 className="w-4 h-4 text-[#D6CEBE]" />
              </button>

              <button
                onClick={() => {
                  setInspectedArtwork(null);
                  setCatalogTab('download-code');
                  setCatalogOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-base font-serif-display text-[#EAB308] flex items-center justify-between"
              >
                <span>Download Source Code</span>
                <span className="text-xs font-mono-tabular bg-[#EAB308]/20 px-2 py-0.5 rounded text-[#EAB308]">.ZIP</span>
              </button>

              <button
                onClick={() => {
                  setShowAtmosphereDrawer(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-base font-serif-display text-[#FBF9F5] flex items-center justify-between"
              >
                <span>Sun & Soundscape Atmosphere</span>
                <Sliders className="w-4 h-4 text-[#D6CEBE]" />
              </button>

              <button
                onClick={() => {
                  setMobileMiniMapOpen(!mobileMiniMapOpen);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-base font-serif-display text-[#FBF9F5] flex items-center justify-between"
              >
                <span>Floorplan Mini-Map</span>
                <span className="text-xs font-mono-tabular text-[#D6CEBE]">
                  {mobileMiniMapOpen ? 'Hide' : 'Show'}
                </span>
              </button>

              <button
                onClick={() => {
                  setInspectedArtwork(null);
                  setCatalogTab('artist');
                  setCatalogOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 active:bg-white/15 text-base font-serif-display text-[#FBF9F5] flex items-center justify-between"
              >
                <span>About Justin Reddy</span>
                <span className="text-xs text-[#D6CEBE]">Monograph</span>
              </button>
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-[#FBF9F5] text-[#1C1917] font-semibold text-xs tracking-wider uppercase text-center"
            >
              Return to 3D Pavilion
            </button>
          </div>
        </div>
      )}

      {/* 3. ARRIVAL / WELCOME GATEWAY (Responsive for Laptops & Phones) */}
      {!hasEnteredPavilion && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-t from-black/85 via-black/60 to-black/45 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-xl w-full max-h-[92vh] overflow-y-auto bg-[#181512]/95 backdrop-blur-md border border-white/15 rounded-xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-5">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-widest uppercase text-[#D6CEBE]">
              <span>MAHÉ ISLAND PAVILION</span>
              <span aria-hidden="true">·</span>
              <span>SEYCHELLES</span>
              <span aria-hidden="true">·</span>
              <span>8 ORIGINAL WORKS</span>
            </div>

            <div className="space-y-1.5">
              <h1
                className="text-4xl sm:text-5xl font-serif-display font-medium text-[#FBF9F5] leading-tight"
                style={{ textWrap: 'balance' }}
              >
                ReddyMade
              </h1>
              <p className="text-xs sm:text-sm font-serif-display italic text-[#D6CEBE]">
                An Interactive 3D Exhibition of Charcoal Drawings & Impasto Acrylics by Justin Reddy
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#D6CEBE]/90 leading-relaxed">
              Step inside an open-air Creole timber pavilion overlooking the turquoise granite coves of Mahé. Equatorial sunlight streams through tall louvered shutters across Justin Reddy’s tactile acrylic brushwork and archival charcoal sketches, accompanied by warm tradewinds and soft island acoustic music.
            </p>

            {/* Device-Specific Controls Guidance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs text-[#D6CEBE]">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white/5">
                <Smartphone className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#FBF9F5]">On Phones & Tablets</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    Drag 1 finger to look 360° · Use on-screen D-Pad or tap floor to walk · Pinch to zoom
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-white/5">
                <Laptop className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-[#FBF9F5]">On Laptops & Desktops</div>
                  <div className="text-[11px] opacity-80 mt-0.5">
                    WASD or Arrow keys to walk · Drag mouse to look 360° · Click art to inspect
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={() => handleEnterGallery(false)}
                className="w-full sm:flex-1 py-3 px-5 rounded-lg bg-[#FBF9F5] text-[#1C1917] font-medium text-xs hover:bg-[#EBE6DF] active:bg-[#DDD6C9] transition-colors text-center"
              >
                Enter 3D Pavilion
              </button>
              <button
                onClick={() => handleEnterGallery(true)}
                className="w-full sm:flex-1 py-3 px-5 rounded-lg bg-[#D97706] text-white font-medium text-xs hover:bg-[#B45309] active:bg-[#92400E] transition-colors text-center"
              >
                Start Guided Tour (All 8 Works)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUN, LIGHTING & SOUNDSCAPE DRAWER (Responsive) */}
      {showAtmosphereDrawer && (
        <div className="fixed top-16 sm:top-20 right-3 sm:right-6 z-30 w-80 max-w-[calc(100vw-1.5rem)] bg-black/80 backdrop-blur-md border border-white/15 rounded-xl p-4 sm:p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-serif-display font-semibold tracking-wide text-[#FBF9F5] flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-[#FBBF24]" />
              Sun & Soundscape Controls
            </span>
            <button
              onClick={() => setShowAtmosphereDrawer(false)}
              className="p-1 hover:bg-white/10 rounded text-[#D6CEBE] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lighting Presets */}
          <div className="space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-[#D6CEBE]">
              Atmospheric Lighting
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'golden-hour', label: 'Morning Glare' },
                { id: 'equatorial-noon', label: 'Equatorial Noon' },
                { id: 'sunset-veranda', label: 'Sunset Veranda' },
                { id: 'nocturnal-spot', label: 'Nocturnal Spotlight' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setLightingPreset(p.id as LightingPreset)}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors text-left text-[11px] ${
                    lightingPreset === p.id
                      ? 'bg-[#D97706] text-white font-medium'
                      : 'bg-white/10 text-[#D6CEBE] hover:bg-white/20'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Texture Relief Slider */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex justify-between text-xs">
              <span className="text-[#D6CEBE] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                Normal Relief Intensity
              </span>
              <span className="font-mono-tabular text-[#FBF9F5]">
                {reliefIntensity.toFixed(2)}×
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2.5"
              step="0.05"
              value={reliefIntensity}
              onChange={(e) => setReliefIntensity(parseFloat(e.target.value))}
              className="w-full accent-[#D97706] cursor-pointer"
            />
          </div>

          {/* Tradewind Volume */}
          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex justify-between text-xs">
              <span className="text-[#D6CEBE] flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-[#38BDF8]" />
                Tradewind & Palm Breeze
              </span>
              <span className="font-mono-tabular text-[#FBF9F5]">
                {Math.round(windVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={windVolume}
              onChange={(e) => handleWindChange(parseFloat(e.target.value))}
              className="w-full accent-[#38BDF8] cursor-pointer"
            />
          </div>

          {/* Acoustic Island Music Volume */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#D6CEBE] flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-[#FBBF24]" />
                Soft Island Acoustic Music
              </span>
              <span className="font-mono-tabular text-[#FBF9F5]">
                {Math.round(musicVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={musicVolume}
              onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
              className="w-full accent-[#D97706] cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* 5A. SELECTED ARTWORK PLACARD - DESKTOP & LAPTOP (Floating Right Sidebar) */}
      {selectedArtwork && (
        <aside className="hidden md:block fixed top-20 right-6 z-20 w-88 max-w-[calc(100vw-3rem)] bg-black/75 backdrop-blur-md border border-white/15 rounded-xl p-5 shadow-2xl space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-[#D6CEBE] font-mono-tabular">
                <span>Plate {selectedArtwork.indexNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedArtwork.year}</span>
                <span aria-hidden="true">·</span>
                <span>{selectedArtwork.dimensions}</span>
              </div>
              <h2 className="text-2xl font-serif-display font-semibold text-[#FBF9F5] mt-1 leading-snug">
                {selectedArtwork.title}
              </h2>
              <p className="text-xs font-serif-display italic text-[#D6CEBE]">
                {selectedArtwork.creoleSubtitle}
              </p>
            </div>
            <button
              onClick={() => setSelectedArtwork(null)}
              className="p-1 hover:bg-white/10 rounded text-[#D6CEBE] hover:text-white"
              title="Close placard"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs text-[#D6CEBE]/90 leading-relaxed border-t border-b border-white/10 py-3">
            <p>{selectedArtwork.curatorialNote}</p>
            <p className="text-[11px] italic text-[#E5DEC9] pt-1">
              {selectedArtwork.textureNote}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={() => setRakingLightActive(!rakingLightActive)}
              className={`px-3 py-2 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
                rakingLightActive
                  ? 'bg-[#D97706] text-white shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 text-[#FBF9F5]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              {rakingLightActive ? 'Spotlight Active' : 'Inspect Relief'}
            </button>

            <button
              onClick={() => {
                setInspectedArtwork(selectedArtwork);
                setCatalogTab('inspect');
                setCatalogOpen(true);
              }}
              className="px-3 py-2 text-xs font-medium rounded-lg bg-[#FBF9F5] text-[#1C1917] hover:bg-[#EBE6DF] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              Plate Study
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => handleStepArtwork(-1)}
                className="p-2 bg-white/10 hover:bg-white/20 text-[#FBF9F5] rounded-lg transition-colors"
                title="Previous Artwork"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleStepArtwork(1)}
                className="p-2 bg-white/10 hover:bg-white/20 text-[#FBF9F5] rounded-lg transition-colors"
                title="Next Artwork"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 5B. SELECTED ARTWORK PLACARD - MOBILE PHONES (Collapsible Bottom Sheet) */}
      {selectedArtwork && (
        <aside className="md:hidden fixed bottom-20 left-3 right-3 z-30 bg-black/85 backdrop-blur-md border border-white/20 rounded-xl p-3.5 shadow-2xl max-h-[50vh] overflow-y-auto space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={selectedArtwork.imageUrl}
                alt={selectedArtwork.title}
                className="w-10 h-10 rounded-md object-contain bg-white/10 shrink-0"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1 text-[10px] text-[#D6CEBE] font-mono-tabular">
                  <span>Plate {selectedArtwork.indexNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedArtwork.year}</span>
                </div>
                <h3 className="text-sm font-serif-display font-semibold text-[#FBF9F5] truncate">
                  {selectedArtwork.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setMobilePlacardExpanded(!mobilePlacardExpanded)}
                className="p-1.5 rounded-lg bg-white/10 text-[#D6CEBE] hover:text-white"
                title={mobilePlacardExpanded ? 'Collapse' : 'Read commentary'}
              >
                {mobilePlacardExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setSelectedArtwork(null)}
                className="p-1.5 rounded-lg bg-white/10 text-[#D6CEBE] hover:text-white"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Expanded curatorial text on mobile */}
          {mobilePlacardExpanded && (
            <div className="text-xs text-[#D6CEBE]/90 leading-relaxed border-t border-white/10 pt-2.5 space-y-1.5">
              <p>{selectedArtwork.curatorialNote}</p>
              <p className="text-[11px] italic text-[#E5DEC9]">
                {selectedArtwork.textureNote}
              </p>
            </div>
          )}

          {/* Quick Action Buttons on Phone */}
          <div className="flex items-center justify-between gap-1.5 pt-1">
            <button
              onClick={() => setRakingLightActive(!rakingLightActive)}
              className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors whitespace-nowrap ${
                rakingLightActive
                  ? 'bg-[#D97706] text-white'
                  : 'bg-white/10 text-[#FBF9F5]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{rakingLightActive ? 'Spot Active' : 'Relief Spot'}</span>
            </button>

            <button
              onClick={() => {
                setInspectedArtwork(selectedArtwork);
                setCatalogTab('inspect');
                setCatalogOpen(true);
              }}
              className="flex-1 py-1.5 px-2 text-xs font-medium rounded-lg bg-[#FBF9F5] text-[#1C1917] flex items-center justify-center gap-1 whitespace-nowrap"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Plate Study</span>
            </button>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleStepArtwork(-1)}
                className="p-1.5 bg-white/10 text-[#FBF9F5] rounded-lg"
                title="Previous"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleStepArtwork(1)}
                className="p-1.5 bg-white/10 text-[#FBF9F5] rounded-lg"
                title="Next"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* 6A. DESKTOP BOTTOM LEFT MINI-MAP FLOORPLAN */}
      <div className="fixed bottom-5 left-6 z-20 hidden md:block">
        <GalleryMiniMap
          cameraPos={cameraPos}
          selectedArtwork={selectedArtwork}
          onSelectArtwork={(art) => handleSelectArtwork(art)}
          onClickFloorSpot={handleMiniMapFloorClick}
        />
      </div>

      {/* 6B. MOBILE FLOATING MINI-MAP (Toggled via button or Mobile D-Pad) */}
      {mobileMiniMapOpen && (
        <div className="fixed bottom-24 left-3 z-30 md:hidden">
          <GalleryMiniMap
            cameraPos={cameraPos}
            selectedArtwork={selectedArtwork}
            onSelectArtwork={(art) => {
              handleSelectArtwork(art);
              setMobileMiniMapOpen(false);
            }}
            onClickFloorSpot={(x, z) => {
              handleMiniMapFloorClick(x, z);
              setMobileMiniMapOpen(false);
            }}
            onClose={() => setMobileMiniMapOpen(false)}
          />
        </div>
      )}

      {/* 7. MOBILE ON-SCREEN TOUCH JOYSTICK / D-PAD (Only on mobile / touch viewports) */}
      <MobileControlsOverlay
        onMoveVectorChange={setMobileMoveVector}
        onTurn={handleMobileTurn}
        onToggleMiniMap={() => setMobileMiniMapOpen(!mobileMiniMapOpen)}
        miniMapOpen={mobileMiniMapOpen}
      />

      {/* 8. BOTTOM CENTER QUICK-JUMP EXHIBITION RAIL (Accommodates both Laptops & Touch Phones) */}
      <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 shadow-xl max-w-[96vw] overflow-x-auto">
        {/* Soundscape Mute/Unmute button */}
        <button
          onClick={handleToggleMute}
          className="px-2 sm:px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#FBF9F5] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          title="Toggle Tradewinds & Island Music"
        >
          {audioStarted && !isMuted ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#FBBF24]" />
              <span className="hidden md:inline">Sound On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#D6CEBE]" />
              <span className="hidden md:inline">Sound Muted</span>
            </>
          )}
        </button>

        <div className="h-4 w-px bg-white/15 shrink-0" />

        {/* Artwork Number Buttons 01 - 08 */}
        <div className="flex items-center gap-1">
          {REDDYMADE_ARTWORKS.map((art) => {
            const active = selectedArtwork?.id === art.id;
            return (
              <button
                key={art.id}
                onClick={() => handleSelectArtwork(art)}
                className={`px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-mono-tabular rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#D97706] text-white font-semibold shadow-xs'
                    : 'text-[#D6CEBE] hover:bg-white/10 active:bg-white/20 hover:text-white'
                }`}
                title={art.title}
              >
                {art.indexNumber}
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-white/15 shrink-0" />

        {/* Mini-Map Toggle on Mobile or Atmosphere Toggle on Desktop */}
        <button
          onClick={() => {
            if (isMobileDevice) {
              setMobileMiniMapOpen(!mobileMiniMapOpen);
            } else {
              setShowAtmosphereDrawer(!showAtmosphereDrawer);
            }
          }}
          className={`px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors whitespace-nowrap shrink-0 ${
            (isMobileDevice ? mobileMiniMapOpen : showAtmosphereDrawer)
              ? 'bg-[#D97706] text-white'
              : 'bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#FBF9F5]'
          }`}
          title={isMobileDevice ? 'Toggle Floorplan Map' : 'Sun & Atmosphere'}
        >
          {isMobileDevice ? <Compass className="w-3.5 h-3.5" /> : <Sliders className="w-3.5 h-3.5" />}
          <span className="hidden lg:inline">{isMobileDevice ? 'Floorplan' : 'Sun & Atmosphere'}</span>
        </button>

        {/* Reset to Center Veranda View */}
        <button
          onClick={handleResetCenterView}
          className="px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-medium rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-[#FBF9F5] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          title="Walk to Center of Room"
        >
          <Compass className="w-3.5 h-3.5 hidden sm:inline" />
          <span>Center</span>
        </button>
      </div>

      {/* 9. CATALOG & HIGH-RES ARCHIVAL INSPECTION MODAL */}
      <CatalogModal
        isOpen={catalogOpen}
        initialTab={catalogTab}
        inspectedArtwork={inspectedArtwork}
        onClose={() => setCatalogOpen(false)}
        onWalkToArtwork={(art) => handleSelectArtwork(art)}
      />
    </div>
  );
}
