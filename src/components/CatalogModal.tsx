import React, { useState } from 'react';
import {
  X,
  Compass,
  ZoomIn,
  ZoomOut,
  Sun,
  Download,
  Maximize2,
  Minimize2,
  Check,
  Copy,
  Layers,
  Sparkles,
  Code,
  FileArchive,
  Terminal,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { ArtworkItem, REDDYMADE_ARTWORKS } from '../data/artworks';

interface CatalogModalProps {
  isOpen: boolean;
  initialTab?: 'collection' | 'inspect' | 'artist' | 'download-code';
  inspectedArtwork?: ArtworkItem | null;
  onClose: () => void;
  onWalkToArtwork: (art: ArtworkItem) => void;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({
  isOpen,
  initialTab = 'collection',
  inspectedArtwork = null,
  onClose,
  onWalkToArtwork,
}) => {
  const [activeTab, setActiveTab] = useState<'collection' | 'inspect' | 'artist' | 'download-code'>(
    inspectedArtwork ? 'inspect' : initialTab
  );
  const [activePiece, setActivePiece] = useState<ArtworkItem>(
    inspectedArtwork || REDDYMADE_ARTWORKS[0]
  );
  const [filterMedium, setFilterMedium] = useState<'All' | 'Charcoal' | 'Acrylic'>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });
  const [isFullscreenPlate, setIsFullscreenPlate] = useState(false);
  const [studyViewMode, setStudyViewMode] = useState<'original' | 'raking' | 'tonal'>('original');
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  React.useEffect(() => {
    if (inspectedArtwork) {
      setActivePiece(inspectedArtwork);
      setActiveTab('inspect');
      setZoomLevel(1);
    } else {
      setActiveTab(initialTab);
    }
  }, [inspectedArtwork, initialTab, isOpen]);

  if (!isOpen) return null;

  const filteredArtworks = REDDYMADE_ARTWORKS.filter((art) => {
    if (filterMedium === 'Charcoal') return art.wing === 'Heritage Charcoal Wing';
    if (filterMedium === 'Acrylic') return art.wing === 'Granite & Color Wing';
    return true;
  });

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const updateLoupeCoordinates = (clientX: number, clientY: number, currentTarget: HTMLElement) => {
    const rect = currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
    setLoupePos({ x, y });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto">
      <div
        className={`relative w-full ${
          isFullscreenPlate ? 'max-w-none h-full m-0 rounded-none' : 'max-w-7xl max-h-[95vh] rounded-xl'
        } flex flex-col bg-[#FBF9F5] text-[#1C1917] border border-[#D6CEBE] shadow-2xl overflow-hidden transition-all duration-200`}
      >
        {/* Top Header Bar - Fully Responsive for Mobile & Laptop */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 md:px-8 py-3.5 border-b border-[#E5DEC9] bg-[#F7F4EE] shrink-0">
          <div className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif-display text-2xl font-bold tracking-tight text-[#1C1917]">
                ReddyMade
              </span>
              <span className="text-[10px] sm:text-xs font-mono-tabular uppercase px-2 py-0.5 bg-[#EAE4D7] text-[#78716C] rounded">
                Exhibition Archive
              </span>
            </div>

            <button
              onClick={onClose}
              className="sm:hidden p-1.5 text-xs font-medium text-[#1C1917] bg-[#EBE6DF] hover:bg-[#DDD6C9] rounded-lg transition-colors flex items-center gap-1 shrink-0"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs (Horizontal scroll on phone) */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-1 bg-[#EBE6DF] rounded-lg overflow-x-auto max-w-full">
              <button
                onClick={() => {
                  setActiveTab('collection');
                  setIsFullscreenPlate(false);
                }}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'collection'
                    ? 'bg-[#FBF9F5] text-[#1C1917] shadow-xs font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Collection (08)
              </button>
              <button
                onClick={() => setActiveTab('inspect')}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'inspect'
                    ? 'bg-[#FBF9F5] text-[#1C1917] shadow-xs font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Plate Study
              </button>
              <button
                onClick={() => {
                  setActiveTab('artist');
                  setIsFullscreenPlate(false);
                }}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === 'artist'
                    ? 'bg-[#FBF9F5] text-[#1C1917] shadow-xs font-semibold'
                    : 'text-[#57534E] hover:text-[#1C1917]'
                }`}
              >
                Artist Monograph
              </button>
              <button
                onClick={() => {
                  setActiveTab('download-code');
                  setIsFullscreenPlate(false);
                }}
                className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 ${
                  activeTab === 'download-code'
                    ? 'bg-[#1C1917] text-[#FBF9F5] shadow-xs font-semibold'
                    : 'text-[#9A3412] hover:text-[#7C2D12]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Download</span> Code
              </button>
            </div>

            <button
              onClick={onClose}
              className="hidden sm:flex px-3 py-1.5 text-xs font-medium text-[#1C1917] bg-[#EBE6DF] hover:bg-[#DDD6C9] rounded-lg transition-colors items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <X className="w-4 h-4" />
              Return to 3D Gallery
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {/* TAB 1: COLLECTION CATALOGUE (UNCROPPED, UNMODIFIED ORIGINAL WORKS) */}
          {activeTab === 'collection' && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#E5DEC9] pb-4 md:pb-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#9A3412]">
                    <span>ORIGINAL PAINTINGS & DRAWINGS BY JUSTIN REDDY</span>
                    <span aria-hidden="true">·</span>
                    <span>100% UNMODIFIED ARCHIVAL SCANS</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-display font-medium text-[#1C1917] mt-1.5">
                    Complete Exhibition Catalogue
                  </h2>
                  <p className="text-xs sm:text-sm text-[#57534E] mt-1 max-w-2xl leading-relaxed">
                    All eight original works submitted by Seychellois artist Justin Reddy. Each plate is shown in its complete original composition without cropping, modification, or distortion.
                  </p>
                </div>

                {/* Filter Controls (Phone scrollable) */}
                <div className="flex items-center gap-1 p-1 bg-[#EBE6DF] rounded-lg self-start overflow-x-auto max-w-full">
                  {(['All', 'Charcoal', 'Acrylic'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setFilterMedium(filter)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        filterMedium === filter
                          ? 'bg-[#FBF9F5] text-[#1C1917] shadow-xs font-semibold'
                          : 'text-[#57534E] hover:text-[#1C1917]'
                      }`}
                    >
                      {filter === 'All'
                        ? 'All Works (8)'
                        : filter === 'Charcoal'
                        ? 'Charcoal & Graphite (4)'
                        : 'Impasto Acrylics (4)'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of 8 Works with Unmodified Aspect Ratios and Archival Borders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
                {filteredArtworks.map((art) => (
                  <div
                    key={art.id}
                    className="group flex flex-col justify-between bg-[#F7F4EE] border border-[#E5DEC9] rounded-xl p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      {/* Uncropped Artwork Display Box with archival background */}
                      <div
                        onClick={() => {
                          setActivePiece(art);
                          setActiveTab('inspect');
                        }}
                        className="relative w-full h-56 sm:h-64 bg-[#EDE8DE] border border-[#DCD5C5] rounded-lg overflow-hidden cursor-pointer flex items-center justify-center p-2 mb-3.5 group-hover:border-[#9A3412]/40 transition-colors"
                      >
                        {/* Notice: object-contain preserves 100% of the original painting without cropping! */}
                        <img
                          src={art.imageUrl}
                          alt={art.title}
                          loading="lazy"
                          className="max-h-full max-w-full object-contain shadow-xs transition-transform duration-200 group-hover:scale-[1.02]"
                        />

                        {/* Plate Index Badge */}
                        <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 backdrop-blur-xs text-[#FBF9F5] text-[10px] font-mono-tabular font-medium">
                          Plate {art.indexNumber}
                        </div>

                        {/* Format tag */}
                        <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-[#FBF9F5]/90 text-[#1C1917] text-[10px] font-mono-tabular shadow-xs">
                          {art.aspectRatio > 1.1 ? '4:3' : art.aspectRatio === 1 ? '1:1' : '3:4'}
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-1.5 text-[11px] text-[#78716C] font-mono-tabular">
                        <span>{art.accessionNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{art.year}</span>
                      </div>

                      <h3
                        onClick={() => {
                          setActivePiece(art);
                          setActiveTab('inspect');
                        }}
                        className="text-base sm:text-lg font-serif-display font-semibold text-[#1C1917] mt-1 group-hover:text-[#9A3412] transition-colors cursor-pointer leading-snug"
                      >
                        {art.title}
                      </h3>

                      <p className="text-xs text-[#57534E] mt-1 line-clamp-2 leading-relaxed">
                        {art.creoleSubtitle}
                      </p>

                      <div className="mt-2 text-[11px] font-medium text-[#78716C]">
                        {art.dimensions}
                      </div>
                    </div>

                    {/* Actions with touch-friendly 44px min tap targets */}
                    <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-[#E5DEC9]">
                      <button
                        onClick={() => {
                          setActivePiece(art);
                          setActiveTab('inspect');
                        }}
                        className="flex-1 py-2 text-xs font-medium text-[#1C1917] bg-[#EBE6DF] hover:bg-[#DDD6C9] active:bg-[#D5CEBF] rounded-md transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        Plate Study
                      </button>

                      <button
                        onClick={() => {
                          onWalkToArtwork(art);
                          onClose();
                        }}
                        className="flex-1 py-2 text-xs font-medium bg-[#1C1917] text-[#FBF9F5] hover:bg-[#292524] active:bg-black rounded-md transition-colors flex items-center justify-center gap-1 whitespace-nowrap"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        Stand In Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HIGH-RES PLATE STUDY (DEEP EXAMINATION & UNMODIFIED ORIGINAL SCAN) */}
          {activeTab === 'inspect' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left Column: High-Res Interactive Viewer */}
              <div className="lg:col-span-7 space-y-3 sm:space-y-4">
                {/* Viewer Box with Touch & Mouse Loupe Support */}
                <div
                  onMouseMove={(e) => updateLoupeCoordinates(e.clientX, e.clientY, e.currentTarget)}
                  onTouchMove={(e) => {
                    if (e.touches.length > 0) {
                      updateLoupeCoordinates(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
                    }
                  }}
                  onTouchStart={(e) => {
                    if (e.touches.length > 0) {
                      updateLoupeCoordinates(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
                    }
                  }}
                  className={`relative w-full ${
                    isFullscreenPlate ? 'h-[80vh]' : 'h-[360px] sm:h-[460px] md:h-[500px]'
                  } bg-[#181512] rounded-xl overflow-hidden flex items-center justify-center border border-[#D6CEBE] shadow-inner select-none touch-none`}
                >
                  {/* The Unmodified Original Painting Scan */}
                  <img
                    src={activePiece.imageUrl}
                    alt={activePiece.title}
                    style={{
                      transform: zoomLevel > 1 ? `scale(${zoomLevel})` : undefined,
                      transformOrigin: `${loupePos.x}% ${loupePos.y}%`,
                      filter:
                        studyViewMode === 'raking'
                          ? 'contrast(1.35) brightness(1.05)'
                          : studyViewMode === 'tonal'
                          ? 'grayscale(100%) contrast(1.4)'
                          : 'none',
                    }}
                    className="max-h-[92%] max-w-[92%] object-contain transition-all duration-150 cursor-crosshair shadow-2xl"
                  />

                  {/* Top Overlay Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 sm:gap-2">
                    <span className="px-2 sm:px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md text-[#FBF9F5] text-[11px] sm:text-xs font-mono-tabular">
                      Plate {activePiece.indexNumber} · Original Scan
                    </span>
                    {zoomLevel > 1 && (
                      <span className="px-2 py-1 rounded-md bg-[#D97706] text-white text-[11px] sm:text-xs font-mono-tabular font-medium">
                        {zoomLevel.toFixed(1)}× Zoom
                      </span>
                    )}
                  </div>

                  {/* Top Right Controls: Fullscreen */}
                  <button
                    onClick={() => setIsFullscreenPlate(!isFullscreenPlate)}
                    className="absolute top-3 right-3 p-2 rounded-md bg-black/75 backdrop-blur-md text-[#FBF9F5] hover:bg-black transition-colors"
                    title={isFullscreenPlate ? 'Exit Fullscreen' : 'View Fullscreen'}
                  >
                    {isFullscreenPlate ? (
                      <Minimize2 className="w-4 h-4" />
                    ) : (
                      <Maximize2 className="w-4 h-4" />
                    )}
                  </button>

                  {/* Bottom Controls Bar (Scrollable on small mobile screens) */}
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between gap-2 p-2 rounded-lg bg-black/85 backdrop-blur-md text-white text-xs overflow-x-auto">
                    {/* Zoom Levels */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[#A8A29E] font-medium mr-1 text-[11px]">Zoom:</span>
                      {[1, 1.75, 2.5, 3.5].map((lvl) => (
                        <button
                          key={lvl}
                          onClick={() => setZoomLevel(lvl)}
                          className={`px-2 py-1 rounded text-[11px] font-mono-tabular transition-colors ${
                            zoomLevel === lvl
                              ? 'bg-[#FBF9F5] text-[#1C1917] font-semibold'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {lvl}×
                        </button>
                      ))}
                    </div>

                    {/* View Modes */}
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[#A8A29E] font-medium mr-1 text-[11px] hidden xs:inline">Mode:</span>
                      <button
                        onClick={() => setStudyViewMode('original')}
                        className={`px-2 py-1 rounded text-[11px] transition-colors ${
                          studyViewMode === 'original'
                            ? 'bg-[#D97706] text-white font-medium'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        Original
                      </button>
                      <button
                        onClick={() => setStudyViewMode('raking')}
                        className={`px-2 py-1 rounded text-[11px] transition-colors ${
                          studyViewMode === 'raking'
                            ? 'bg-[#D97706] text-white font-medium'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        Raking
                      </button>
                      <button
                        onClick={() => setStudyViewMode('tonal')}
                        className={`px-2 py-1 rounded text-[11px] transition-colors ${
                          studyViewMode === 'tonal'
                            ? 'bg-[#D97706] text-white font-medium'
                            : 'bg-white/10 text-white hover:bg-white/20'
                        }`}
                      >
                        Tonal
                      </button>
                    </div>

                    {/* Download Original Plate File */}
                    <a
                      href={activePiece.imageUrl}
                      download={`Justin_Reddy_Plate_${activePiece.indexNumber}.jpg`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-[#FBF9F5] text-[#1C1917] hover:bg-white transition-colors flex items-center gap-1 text-[11px] font-medium shrink-0"
                    >
                      <Download className="w-3 h-3" />
                      <span className="hidden sm:inline">Download</span> Plate
                    </a>
                  </div>
                </div>

                {/* Quick 8-Plate Thumbnails Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1">
                  {REDDYMADE_ARTWORKS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePiece(item);
                        setZoomLevel(1);
                      }}
                      className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border text-xs font-mono-tabular transition-all whitespace-nowrap shrink-0 ${
                        activePiece.id === item.id
                          ? 'bg-[#1C1917] text-[#FBF9F5] border-[#1C1917] shadow-sm'
                          : 'bg-[#F7F4EE] text-[#57534E] border-[#D6CEBE] hover:text-[#1C1917]'
                      }`}
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-5 h-5 rounded object-contain bg-white"
                      />
                      <span>Plate {item.indexNumber}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Column: Curatorial Dossier & Accession Records */}
              <div className="lg:col-span-5 space-y-5 sm:space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#9A3412] uppercase tracking-widest">
                    <span>ARCHIVAL PLATE {activePiece.indexNumber}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activePiece.series}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif-display font-semibold text-[#1C1917] mt-1.5 leading-tight">
                    {activePiece.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-serif-display italic text-[#57534E] mt-1">
                    {activePiece.creoleSubtitle}
                  </p>
                </div>

                {/* Museum Accession Table */}
                <dl className="divide-y divide-[#E5DEC9] border-t border-b border-[#E5DEC9] text-xs">
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-[#78716C] font-medium">Accession Number</dt>
                    <dd className="font-mono-tabular font-medium text-[#1C1917]">
                      {activePiece.accessionNumber}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-[#78716C] font-medium">Artist & Provenance</dt>
                    <dd className="text-[#1C1917] font-medium text-right">
                      Justin Reddy · Mahé, Seychelles
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-[#78716C] font-medium">Original Medium</dt>
                    <dd className="text-[#1C1917] text-right font-medium">
                      {activePiece.medium}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-[#78716C] font-medium">Dimensions & Aspect</dt>
                    <dd className="font-mono-tabular text-[#1C1917]">
                      {activePiece.dimensions}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between gap-4">
                    <dt className="text-[#78716C] font-medium">3D Gallery Location</dt>
                    <dd className="text-[#1C1917] font-medium">{activePiece.wing}</dd>
                  </div>
                </dl>

                {/* Color Palette Swatches */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest text-[#78716C] font-semibold mb-2">
                    Extracted Pigment Palette (Tap to Copy)
                  </h4>
                  <div className="flex items-center gap-2 flex-wrap">
                    {activePiece.paletteSwatches.map((hex) => (
                      <button
                        key={hex}
                        onClick={() => handleCopyColor(hex)}
                        className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#EBE6DF] border border-[#D6CEBE] text-xs font-mono-tabular hover:bg-[#DDD6C9] active:scale-95 transition-all"
                        title={`Click to copy ${hex}`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/20"
                          style={{ backgroundColor: hex }}
                        />
                        <span>{hex}</span>
                        {copiedHex === hex ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3 text-[#78716C] opacity-60 group-hover:opacity-100" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Curatorial and Surface Notes */}
                <div className="space-y-3 text-xs md:text-sm text-[#292524] leading-relaxed">
                  <h4 className="text-xs uppercase tracking-widest text-[#78716C] font-semibold">
                    Curatorial Monograph
                  </h4>
                  <p>{activePiece.curatorialNote}</p>

                  <h4 className="text-xs uppercase tracking-widest text-[#78716C] font-semibold pt-2 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-[#9A3412]" />
                    Original Surface Texture & Lighting Observation
                  </h4>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    {activePiece.textureNote}
                  </p>
                </div>

                {/* Primary Action */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      onWalkToArtwork(activePiece);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-5 py-3 text-xs font-medium bg-[#9A3412] text-white rounded-lg hover:bg-[#7C2D12] active:bg-[#60230e] transition-colors flex items-center justify-center gap-2 whitespace-nowrap shadow-sm"
                  >
                    <Compass className="w-4 h-4" />
                    Stand Before This Painting in 3D Pavilion
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ARTIST MONOGRAPH */}
          {activeTab === 'artist' && (
            <div className="max-w-3xl mx-auto space-y-6 py-2 sm:py-4">
              <div className="text-xs uppercase tracking-widest text-[#78716C] font-semibold">
                ARTIST MONOGRAPH · REDDYMADE ART, SEYCHELLES
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif-display font-medium text-[#1C1917]">
                Justin Reddy: Chronicling Island Heritage & Equatorial Color
              </h2>
              <div className="border-b border-[#E5DEC9]" />

              <p className="text-sm sm:text-base text-[#292524] leading-relaxed first-letter:text-4xl sm:first-letter:text-5xl first-letter:font-serif-display first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1">
                Seychellois artist Justin Reddy creates under the studio banner of ReddyMade, synthesizing the sensory world of the Seychelles archipelago. His body of work bridges two profound expressive modes: contemplative, archival charcoal drawings capturing vanishing Creole architecture and maritime life, alongside vibrant graphic acrylic paintings echoing the dazzling light, Precambrian granite rocks, and emerald shores of Mahé.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-4 sm:my-6">
                <div className="p-4 sm:p-5 bg-[#F7F4EE] border border-[#E5DEC9] rounded-xl space-y-2">
                  <h3 className="font-serif-display text-lg font-bold text-[#1C1917]">
                    The Heritage Charcoal Series
                  </h3>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    Preserves the tactile warmth of Creole plantation estates, wooden louvered jalousies, fishermen at the Victoria seawall, and weathered island elders. Justin Reddy leaves wide passages of unprimed archival paper unworked, transforming blank negative space into blazing Indian Ocean light.
                  </p>
                </div>
                <div className="p-4 sm:p-5 bg-[#F7F4EE] border border-[#E5DEC9] rounded-xl space-y-2">
                  <h3 className="font-serif-display text-lg font-bold text-[#1C1917]">
                    The Seychelles Granite & Color Series
                  </h3>
                  <p className="text-xs text-[#57534E] leading-relaxed">
                    Sculpts pure pigment planes into geometric sky puzzle-pieces, crowns of golden coconuts, and monumental granite boulders burning in ochre, orange, and violet along turquoise bays like Anse Source d'Argent.
                  </p>
                </div>
              </div>

              <blockquote className="py-4 sm:py-6 my-2 sm:my-4 border-t border-b border-[#D6CEBE] text-xl sm:text-2xl font-serif-display italic text-[#1C1917] text-center">
                “In Seychelles, the ocean breeze carries stories through the louvers. Every brushstroke is an imprint of salt, stone, and sun.”
              </blockquote>
            </div>
          )}

          {/* TAB 4: DOWNLOAD CODE & DEVICE ACCESSIBILITY */}
          {activeTab === 'download-code' && (
            <div className="max-w-3xl mx-auto space-y-6 py-2 sm:py-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9A3412] font-semibold">
                <Code className="w-4 h-4" />
                <span>SOURCE CODE DOWNLOAD & DEPLOYMENT</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif-display font-medium text-[#1C1917]">
                Download ReddyMade Project Code
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                Download the complete, responsive codebase for the ReddyMade 3D Seychelles Gallery. Engineered with responsive layouts, touch gestures, and keyboard navigation for both mobile phones and laptops.
              </p>

              {/* Direct Download Card */}
              <div className="p-5 sm:p-6 bg-[#F7F4EE] border border-[#D6CEBE] rounded-xl space-y-4 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-serif-display font-semibold text-[#1C1917] flex items-center gap-2">
                      <FileArchive className="w-5 h-5 text-[#9A3412]" />
                      Complete Project ZIP Archive
                    </h3>
                    <p className="text-xs text-[#57534E] mt-1">
                      Includes all React + TypeScript components, Three.js 3D virtual pavilion, mobile touch thumbstick & D-pad, soundscape synthesis engine, high-resolution original artwork plate scans, Tailwind styling, and build configs.
                    </p>
                  </div>
                  <a
                    href="/reddymade-gallery-source.zip"
                    download="reddymade-3d-gallery-source.zip"
                    className="w-full sm:w-auto px-5 py-3 text-xs font-semibold bg-[#1C1917] text-[#FBF9F5] hover:bg-[#292524] active:bg-black rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download ZIP (Source)
                  </a>
                </div>
              </div>

              {/* Device Accommodation Guide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-[#E5DEC9] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917]">
                    <Smartphone className="w-4 h-4 text-[#D97706]" />
                    Phone & Mobile Ergonomics
                  </div>
                  <ul className="text-xs text-[#57534E] space-y-1 list-disc pl-4">
                    <li>Single-finger swipe for 360° pan & look</li>
                    <li>On-screen virtual D-Pad for walking & strafing</li>
                    <li>Two-finger pinch to zoom in & out</li>
                    <li>Tap floor or plate cards to glide camera directly</li>
                    <li>Mobile bottom-sheet curatorial card</li>
                  </ul>
                </div>

                <div className="p-4 bg-white border border-[#E5DEC9] rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917]">
                    <Laptop className="w-4 h-4 text-[#D97706]" />
                    Laptop & Desktop Ergonomics
                  </div>
                  <ul className="text-xs text-[#57534E] space-y-1 list-disc pl-4">
                    <li>WASD or Arrow keys for fluid walking</li>
                    <li>Q / E keys for rapid turning</li>
                    <li>Mouse drag to look 360°</li>
                    <li>Hover raycasting for raking spotlight follow</li>
                    <li>Floating curatorial sidebar & desktop mini-map</li>
                  </ul>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                  Local Development Setup
                </h4>
                <div className="p-4 bg-[#1C1917] text-emerald-400 font-mono-tabular text-xs rounded-xl space-y-1 overflow-x-auto">
                  <div className="text-white/60"># 1. Extract the downloaded zip and navigate to folder</div>
                  <div className="text-white">cd reddymade-3d-gallery</div>
                  <div className="text-white/60 pt-2"># 2. Install all dependencies</div>
                  <div className="text-white">npm install</div>
                  <div className="text-white/60 pt-2"># 3. Start local development server on port 3000</div>
                  <div className="text-white">npm run dev</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
