import groq from 'groq';

const recipeFields = `
  _id, _updatedAt, title, "slug": slug.current, description, featured, publishedAt,
  prepMinutes, cookMinutes, restMinutes,
  activeMinutes, activeMinutesMax, elapsedMinutes, elapsedMinutesMax,
  servings, yieldText, yieldCount, yieldUnit, panSize, gramsFirst,
  difficulty, kashrutType, dietaryLabels, "passoverStatus": coalesce(passoverStatus, "none"), passoverNote, tags,
  equipmentItems[]{_key, name, required}, ovenTemperatureC, ovenMode, ovenTimerMinutes,
  doneness[]{_key, level, takeOutMinC, takeOutMaxC, finalMinC, finalMaxC, isSafetyTarget, note},
  keyRules, pitfalls, lessonsLearned, kosherAdaptation,
  originStory, makeAhead, substitutions, storageDetails{fridge, freezer, reheat},
  servedWithText, servedWith[]->{_id, title, "slug": slug.current},
  sources[]{_key, title, url},
  image { asset->{_id, url}, alt, hotspot, crop },
  category->{_id, title, "slug": slug.current, description, image {asset->{_id, url}, alt, hotspot, crop}},
  ingredientGroups[]{_key, title, items[]{_key, amount, quantity, grams, milliliters, unit, name, note, prepNote, splitNote}},
  steps[]{_key, text, stage, durationMinutes, durationMinutesMax, temperatureC, ovenMode, ovenTimerMinutes, flameSelectLevel, burnerSize, cue, why, image {asset->{_id, url}, alt, hotspot, crop}},
  components[]{_key, title, intro, recipeReference->{_id, title, "slug": slug.current},
    ingredientGroups[]{_key, title, items[]{_key, amount, quantity, grams, milliliters, unit, name, note, prepNote, splitNote}},
    steps[]{_key, text, stage, durationMinutes, durationMinutesMax, temperatureC, ovenMode, ovenTimerMinutes, flameSelectLevel, burnerSize, cue, why, image {asset->{_id, url}, alt, hotspot, crop}}
  },
  timeline[]{_key, label, minutesBeforeServing, tasks},
  variations[]{_key, title, whenToUse, changes, linkedRecipe->{_id, title, "slug": slug.current}},
  tips,
  videos[]{_key, title, url}, video {asset->{playbackId, status}}
`;

export const recipesQuery = groq`*[_type == "recipe" && defined(slug.current)] | order(featured desc, publishedAt desc) {${recipeFields}}`;
export const categoriesQuery = groq`*[_type == "category" && defined(slug.current)] | order(order asc, title asc) {
  _id, title, "slug": slug.current, description, image {asset->{_id, url}, alt, hotspot, crop}
}`;

export const siteSettingsQuery = groq`*[_type == "siteSettings" && _id == "siteSettings"][0]{
  homeHeadline, homeIntro, tagline, footerText, aboutLead, aboutBody,
  portrait {asset->{_id, url}, alt, hotspot, crop}
}`;
