export interface RecipeImage {
  asset?: { _id?: string; url?: string };
  alt?: string;
  localSrc?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
}

export type DietaryLabel = 'vegetarian' | 'glutenFree' | 'lactoseFree';
export type PassoverStatus = 'none' | 'all' | 'kitniyot';
export type OvenMode =
  'conventional' | 'fan' | 'gentleFan' | 'grill' | 'fanGrill' | 'bottom' | 'pizza';
export interface RecipeSearchItem {
  title: string;
  slug: string;
  description: string;
  imageUrl?: string;
  categoryTitle?: string;
  tags: string[];
  ingredients: string[];
  dietaryLabels: DietaryLabel[];
  passoverStatus: PassoverStatus;
}
export type PortableBlock = {
  _key?: string;
  _type: string;
  style?: string;
  children?: Array<{ _key?: string; _type: string; text?: string; marks?: string[] }>;
};
export interface SiteSettings {
  homeHeadline?: string;
  homeIntro?: string;
  tagline?: string;
  footerText?: string;
  aboutLead?: string;
  aboutBody?: PortableBlock[];
  portrait?: RecipeImage;
}

export interface Category {
  _id?: string;
  title: string;
  slug: string;
  language?: 'he' | 'en';
  description?: string;
  image?: RecipeImage;
}

export interface Ingredient {
  _key?: string;
  amount?: string;
  quantity?: number;
  grams?: number;
  milliliters?: number;
  unit?: string;
  name: string;
  note?: string;
  prepNote?: string;
  splitNote?: string;
}

export interface IngredientGroup {
  _key?: string;
  title?: string;
  items: Ingredient[];
}
export interface Step {
  _key?: string;
  text: string;
  stage?: string;
  durationMinutes?: number;
  durationMinutesMax?: number;
  temperatureC?: number;
  ovenMode?: OvenMode;
  ovenTimerMinutes?: number;
  flameSelectLevel?: number;
  burnerSize?: 'small' | 'medium' | 'high' | 'wok';
  cue?: string;
  why?: string;
  image?: RecipeImage;
}

export interface RecipeLink {
  _id?: string;
  title: string;
  slug: string;
}

export interface RecipeComponent {
  _key?: string;
  title: string;
  intro?: string;
  ingredientGroups?: IngredientGroup[];
  steps?: Step[];
  recipeReference?: RecipeLink;
}

export interface RecipeVariation {
  _key?: string;
  title: string;
  whenToUse?: string;
  changes: string;
  linkedRecipe?: RecipeLink;
}

export interface RecipeTimelineItem {
  _key?: string;
  label: string;
  minutesBeforeServing?: number;
  tasks: string[];
}

export interface DonenessTarget {
  _key?: string;
  level: string;
  takeOutMinC?: number;
  takeOutMaxC?: number;
  finalMinC?: number;
  finalMaxC?: number;
  note?: string;
  isSafetyTarget?: boolean;
}

export interface EquipmentItem {
  _key?: string;
  name: string;
  required?: boolean;
}

export interface Source {
  _key?: string;
  title: string;
  url?: string;
}

export interface RecipeVideo {
  _key?: string;
  title?: string;
  url: string;
}

export interface StorageDetails {
  fridge?: string;
  freezer?: string;
  reheat?: string;
}

export interface Recipe {
  _id: string;
  title: string;
  slug: string;
  language?: 'he' | 'en';
  description: string;
  image?: RecipeImage;
  category?: Category;
  prepMinutes?: number;
  cookMinutes?: number;
  restMinutes?: number;
  activeMinutes?: number;
  activeMinutesMax?: number;
  elapsedMinutes?: number;
  elapsedMinutesMax?: number;
  servings?: number;
  yieldText?: string;
  yieldCount?: number;
  yieldUnit?: string;
  panSize?: string;
  difficulty?: 'easy' | 'medium' | 'advanced';
  kashrutType?: 'meat' | 'dairy' | 'pareve';
  dietaryLabels?: DietaryLabel[];
  passoverStatus?: PassoverStatus;
  passoverNote?: string;
  featured?: boolean;
  publishedAt?: string;
  _updatedAt?: string;
  ingredientGroups?: IngredientGroup[];
  steps?: Step[];
  components?: RecipeComponent[];
  variations?: RecipeVariation[];
  timeline?: RecipeTimelineItem[];
  doneness?: DonenessTarget[];
  keyRules?: string[];
  pitfalls?: string[];
  lessonsLearned?: string;
  tips?: string[];
  equipmentItems?: EquipmentItem[];
  ovenTemperatureC?: number;
  ovenMode?: OvenMode;
  ovenTimerMinutes?: number;
  gramsFirst?: boolean;
  makeAhead?: string;
  substitutions?: string;
  storageDetails?: StorageDetails;
  servedWith?: Array<RecipeLink | null>;
  servedWithText?: string;
  kosherAdaptation?: string;
  originStory?: string;
  sources?: Source[];
  video?: { asset?: { playbackId?: string; status?: string } };
  videos?: RecipeVideo[];
  tags?: string[];
  demo?: boolean;
}
