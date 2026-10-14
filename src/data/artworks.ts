import faithful1Img from '../assets/images/faithful_reddymade_1_house_1791616592741.jpg';
import faithful2Img from '../assets/images/faithful_reddymade_2_shore_1791616604120.jpg';
import faithful3Img from '../assets/images/faithful_reddymade_3_elder_1791616616409.jpg';
import faithful4Img from '../assets/images/faithful_reddymade_4_cart_1791616627088.jpg';
import faithful5Img from '../assets/images/faithful_reddymade_5_cove_vivid_1791616637679.jpg';
import faithful6Img from '../assets/images/faithful_reddymade_6_diptych_1791616646958.jpg';
import faithful7Img from '../assets/images/faithful_reddymade_7_coconuts_1791616656563.jpeg';
import faithful8Img from '../assets/images/faithful_reddymade_8_cove_washed_1791616666643.jpeg';

export interface ArtworkItem {
  id: string;
  indexNumber: string;
  title: string;
  creoleSubtitle: string;
  year: string;
  medium: string;
  surfaceType: 'charcoal-paper' | 'impasto-acrylic' | 'mixed-canvas';
  dimensions: string;
  accessionNumber: string;
  wing: 'Heritage Charcoal Wing' | 'Granite & Color Wing';
  series: 'Vernacular Creole Heritage' | 'Seychelles Granite & Color';
  imageUrl: string;
  aspectRatio: number; // width / height
  frameWidth: number; // 3D meters
  frameHeight: number; // 3D meters
  position: [number, number, number]; // x, y, z in gallery space
  rotationY: number; // radians
  viewPosition: [number, number, number]; // ideal camera stand position
  viewTarget: [number, number, number]; // ideal camera lookAt target
  bumpScale: number;
  roughness: number;
  curatorialNote: string;
  textureNote: string;
  paletteSwatches: string[];
}

export const REDDYMADE_ARTWORKS: ArtworkItem[] = [
  {
    id: 'creole-plantation-house',
    indexNumber: '01',
    title: 'Lakaz Kreol dan Montanny (Hillside Plantation House)',
    creoleSubtitle: 'Original charcoal drawing on aged cream archival paper',
    year: '2023',
    medium: 'Charcoal and raw graphite on aged archival cotton paper',
    surfaceType: 'charcoal-paper',
    dimensions: '76.0 × 56.0 cm (4:3 horizontal plate)',
    accessionNumber: 'RM.SEY.2023.01',
    wing: 'Heritage Charcoal Wing',
    series: 'Vernacular Creole Heritage',
    imageUrl: faithful1Img,
    aspectRatio: 1.34,
    frameWidth: 2.4,
    frameHeight: 1.8,
    position: [-8.85, 2.35, -5.2],
    rotationY: Math.PI / 2,
    viewPosition: [-5.6, 1.75, -5.2],
    viewTarget: [-8.85, 2.3, -5.2],
    bumpScale: 0.045,
    roughness: 0.86,
    curatorialNote:
      'Set deep within the cinnamon and takamaka forests of Mahé, Justin Reddy captures a historic Seychellois plantation house supported by coral-stone pillars. The steep pitched tin roof and louvered timber jalousie shutters are engineered to breathe with the Indian Ocean tradewinds.',
    textureNote:
      'Pristine original scan: dense willow charcoal shading along the veranda overhang contrasted against crisp architectural graphite ruling on the timber louver shutters.',
    paletteSwatches: ['#F3EBD8', '#3A352F', '#181614', '#8C8170'],
  },
  {
    id: 'fishermen-shore-sketch',
    indexNumber: '02',
    title: 'Lartet Peser (Return of the Artisanal Fishermen)',
    creoleSubtitle: 'Minimalist figurative study on off-white paper',
    year: '2023',
    medium: 'Compressed charcoal and Conté crayon on warm laid paper',
    surfaceType: 'charcoal-paper',
    dimensions: '72.0 × 54.0 cm (4:3 horizontal plate)',
    accessionNumber: 'RM.SEY.2023.02',
    wing: 'Heritage Charcoal Wing',
    series: 'Vernacular Creole Heritage',
    imageUrl: faithful2Img,
    aspectRatio: 1.34,
    frameWidth: 2.4,
    frameHeight: 1.8,
    position: [-8.85, 2.35, 0.2],
    rotationY: Math.PI / 2,
    viewPosition: [-5.6, 1.75, 0.2],
    viewTarget: [-8.85, 2.3, 0.2],
    bumpScale: 0.04,
    roughness: 0.88,
    curatorialNote:
      'Three islanders framed by wide-brimmed straw sun hats converge along the low coral seawall. Justin Reddy balances bold, velvety charcoal silhouettes with sparse expressive contour lines that let the blank paper evoke blinding equatorial sunlight.',
    textureNote:
      'Original drawing surface: unprimed warm cream paper tooth with decisive dry-charcoal pressure marks and soft atmospheric smudge gradients along the shoreline.',
    paletteSwatches: ['#F5EFE0', '#141312', '#57524A', '#C8BFA8'],
  },
  {
    id: 'island-elder-portrait',
    indexNumber: '03',
    title: 'Granmoun Losean (Elder of the Inner Islands)',
    creoleSubtitle: 'High-contrast charcoal portrait drawing on paper',
    year: '2023',
    medium: 'Vine charcoal and dry brush graphite on cold-press rag paper',
    surfaceType: 'charcoal-paper',
    dimensions: '56.0 × 76.0 cm (3:4 vertical plate)',
    accessionNumber: 'RM.SEY.2023.03',
    wing: 'Heritage Charcoal Wing',
    series: 'Vernacular Creole Heritage',
    imageUrl: faithful3Img,
    aspectRatio: 0.747,
    frameWidth: 1.68,
    frameHeight: 2.25,
    position: [-8.85, 2.35, 5.4],
    rotationY: Math.PI / 2,
    viewPosition: [-5.6, 1.75, 5.4],
    viewTarget: [-8.85, 2.3, 5.4],
    bumpScale: 0.052,
    roughness: 0.85,
    curatorialNote:
      'An intimate, monumental portrait honoring the lived wisdom of Seychelles’ maritime generation. Every squint line around the eyes, the peaked mariner’s cap, and the salt-weathered beard are rendered with direct, sculptural mark-making.',
    textureNote:
      'Unmodified drawing scan: rich pitch-black charcoal mass in the cap visor against nuanced mid-tone graphite washes around the eyes and cheekbones.',
    paletteSwatches: ['#EFECE6', '#121212', '#4A4A48', '#9E9B95'],
  },
  {
    id: 'ox-cart-rest-drawing',
    indexNumber: '04',
    title: 'Poz Saret (The Ox-Cart Rest at La Digue)',
    creoleSubtitle: 'Charcoal and pencil drawing on paper',
    year: '2023',
    medium: 'Graphite pencil and charcoal on heavyweight archival paper',
    surfaceType: 'charcoal-paper',
    dimensions: '58.0 × 78.0 cm (3:4 vertical plate)',
    accessionNumber: 'RM.SEY.2023.04',
    wing: 'Heritage Charcoal Wing',
    series: 'Vernacular Creole Heritage',
    imageUrl: faithful4Img,
    aspectRatio: 0.747,
    frameWidth: 1.68,
    frameHeight: 2.25,
    position: [-3.1, 2.35, -8.85],
    rotationY: 0,
    viewPosition: [-3.1, 1.75, -5.5],
    viewTarget: [-3.1, 2.3, -8.85],
    bumpScale: 0.042,
    roughness: 0.84,
    curatorialNote:
      'Two barefoot island drivers wearing wide straw hats pause on the wooden shafts of a charrette (ox-cart) beside a large spoked wheel. Reddy commemorates the unhurried traditional pace of La Digue village life.',
    textureNote:
      'Delicate spoke ruling and textured wheel shading harmonizing with soft cross-hatching in the seated figures’ shirts and hats.',
    paletteSwatches: ['#F2EAD9', '#1E1C19', '#6E665B', '#D5CBB8'],
  },
  {
    id: 'anse-granite-cove-acrylic',
    indexNumber: '05',
    title: 'Anse Source d’Argent: Vibrations of Granite & Tide',
    creoleSubtitle: 'Original graphic acrylic painting on canvas',
    year: '2024',
    medium: 'Graphic impasto acrylic on stretched canvas',
    surfaceType: 'impasto-acrylic',
    dimensions: '90.0 × 120.0 cm (3:4 vertical plate)',
    accessionNumber: 'RM.SEY.2024.05',
    wing: 'Granite & Color Wing',
    series: 'Seychelles Granite & Color',
    imageUrl: faithful5Img,
    aspectRatio: 0.747,
    frameWidth: 1.68,
    frameHeight: 2.25,
    position: [3.1, 2.35, -8.85],
    rotationY: 0,
    viewPosition: [3.1, 1.75, -5.5],
    viewTarget: [3.1, 2.3, -8.85],
    bumpScale: 0.095,
    roughness: 0.36,
    curatorialNote:
      'Justin Reddy reimagines the iconic granite coast of Seychelles as bold, interlocking planes of pure color: deep cobalt sky with graphic white and yellow cloud puzzle pieces, deep green canopy, burnt-orange boulders, and dynamic red/yellow/blue shoreline shapes.',
    textureNote:
      'True painting scan: crisp graphic boundaries between acrylic color fields with heavy-body paint density across the granite boulders and tide line.',
    paletteSwatches: ['#0284C7', '#EA580C', '#FACC15', '#166534'],
  },
  {
    id: 'island-elders-diptych',
    indexNumber: '06',
    title: 'Lalyans Kreol (Creole Alliance Diptych)',
    creoleSubtitle: 'Original split-canvas acrylic painting',
    year: '2024',
    medium: 'Bold graphic acrylic on linen canvas',
    surfaceType: 'impasto-acrylic',
    dimensions: '120.0 × 90.0 cm (4:3 horizontal plate)',
    accessionNumber: 'RM.SEY.2024.06',
    wing: 'Granite & Color Wing',
    series: 'Seychelles Granite & Color',
    imageUrl: faithful6Img,
    aspectRatio: 1.34,
    frameWidth: 2.4,
    frameHeight: 1.8,
    position: [8.85, 2.35, -5.2],
    rotationY: -Math.PI / 2,
    viewPosition: [5.5, 1.75, -5.2],
    viewTarget: [8.85, 2.3, -5.2],
    bumpScale: 0.085,
    roughness: 0.42,
    curatorialNote:
      'A split composition juxtaposing a proud Seychellois elder woman in side profile adorned with a cobalt/white headscarf and floral dress on the left, paired on the right with an expressive portrait under a wide brown brim.',
    textureNote:
      'Original canvas texture showing precise stencil-like floral patterning, vibrant solid color blocks, and rich opaque acrylic application.',
    paletteSwatches: ['#1E3A8A', '#DC2626', '#EAB308', '#78350F'],
  },
  {
    id: 'golden-coconuts-palm',
    indexNumber: '07',
    title: 'Koko Solèy (Crown of Golden Coconuts)',
    creoleSubtitle: 'Original square acrylic painting',
    year: '2024',
    medium: 'Impasto acrylic on square cotton duck canvas',
    surfaceType: 'impasto-acrylic',
    dimensions: '100.0 × 100.0 cm (1:1 square plate)',
    accessionNumber: 'RM.SEY.2024.07',
    wing: 'Granite & Color Wing',
    series: 'Seychelles Granite & Color',
    imageUrl: faithful7Img,
    aspectRatio: 1.0,
    frameWidth: 2.0,
    frameHeight: 2.0,
    position: [8.85, 2.35, 0.2],
    rotationY: -Math.PI / 2,
    viewPosition: [5.5, 1.75, 0.2],
    viewTarget: [8.85, 2.3, 0.2],
    bumpScale: 0.09,
    roughness: 0.38,
    curatorialNote:
      'Gazing straight up into the crown of a tropical coconut palm. Clustered ripe yellow and brown coconuts are anchored by graphic angular frond blades cutting across bright cyan-blue sky fragments.',
    textureNote:
      'Pristine square canvas plate: saturated golden-yellow coconut spheres framed by bold black, umber, and sky-blue geometric frond slashes.',
    paletteSwatches: ['#EAB308', '#38BDF8', '#78350F', '#111827'],
  },
  {
    id: 'granite-cove-weathered-study',
    indexNumber: '08',
    title: 'Memwar Losean (Weathered Coastal Study)',
    creoleSubtitle: 'Original coastal acrylic and mixed pigment painting',
    year: '2024',
    medium: 'Acrylic and mixed pigment on canvas',
    surfaceType: 'mixed-canvas',
    dimensions: '85.0 × 115.0 cm (3:4 vertical plate)',
    accessionNumber: 'RM.SEY.2024.08',
    wing: 'Granite & Color Wing',
    series: 'Seychelles Granite & Color',
    imageUrl: faithful8Img,
    aspectRatio: 0.747,
    frameWidth: 1.68,
    frameHeight: 2.25,
    position: [8.85, 2.35, 5.4],
    rotationY: -Math.PI / 2,
    viewPosition: [5.5, 1.75, 5.4],
    viewTarget: [8.85, 2.3, 5.4],
    bumpScale: 0.068,
    roughness: 0.62,
    curatorialNote:
      'A companion study of the Mahé shoreline featuring the vivid graphic sky, emerald tree mass, orange granite outcrops, and richly weathered foreground pigment blocks with weathered purples, reds, and yellows.',
    textureNote:
      'Unmodified original plate: textural dialogue between flat graphic sky planes and layered weathered pigment forms in the tidal foreground.',
    paletteSwatches: ['#38BDF8', '#EA580C', '#7C3AED', '#E7E0D3'],
  },
];
