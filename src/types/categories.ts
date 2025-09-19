import { NEWS_CATEGORIES, POST_CATEGORIES } from "@/constants/categories";

// News category types
export type TNewsCategory = typeof NEWS_CATEGORIES[number];

// Post category types
export type TPostCategory = typeof POST_CATEGORIES[number];
