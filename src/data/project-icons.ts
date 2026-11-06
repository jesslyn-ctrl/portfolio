/**
 * Hand-drawn line icons for project cards and case-study headers, each on its own pastel.
 * Icons only, never screenshots: limited projects must not show their product.
 */
export const projectIcons = {
  receipt: { tone: 'pink', d: 'M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21zM9 8h6M9 12h6M9 16h3' },
  coffee: { tone: 'gold', d: 'M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3c0 1.5 1.5 1.5 1.5 3M11.5 3c0 1.5 1.5 1.5 1.5 3' },
  'code-review': { tone: 'blue', d: 'M6 3a2 2 0 1 0 0 4 2 2 0 1 0 0-4M6 17a2 2 0 1 0 0 4 2 2 0 1 0 0-4M18 17a2 2 0 1 0 0 4 2 2 0 1 0 0-4M6 7v10M18 17v-6a3 3 0 0 0-3-3h-4M13 5.5L10.5 8l2.5 2.5' },
  dashboard: { tone: 'mint', d: 'M3 4h18v16H3zM3 9h18M9 9v11M12 13h6M12 16.5h4' },
  chat: { tone: 'lilac', d: 'M4 5h16v11H9l-5 4zM8 9.5h8M8 12.5h5' },
  shopping: { tone: 'blue', d: 'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2M9.5 12.5a2.5 2.5 0 0 0 5 0' },
} as const;

export type ProjectIconName = keyof typeof projectIcons;
export const projectIconNames = Object.keys(projectIcons) as [ProjectIconName, ...ProjectIconName[]];
