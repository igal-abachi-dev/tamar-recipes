import recipe from './recipe';
import category from './category';
import siteSettings from './siteSettings';
import { recipePartTypes } from './recipe-parts';

export const schemaTypes = [recipe, category, siteSettings, ...recipePartTypes];
