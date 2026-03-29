
export const TAG_COLORS: string[] = [
  "tag-blue",
  "tag-teal",
  "tag-purple",
  "tag-green",
  "tag-orange",
  "tag-pink",
];

export const tagColor = (i: number): string => TAG_COLORS[i % TAG_COLORS.length];

export const DEFAULT_SUBJECTS: string[] = [
  "Mathematics",
  "Physics",
  "Programming",
  "Biology",
  "English",
];
