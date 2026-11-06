export interface ListEntry {
  text: string;
  when?: string;
}

export interface Talk {
  event: string;
  kind: string;
  role: string;
  /** Year and month, `YYYY-MM`. The list shows the latest talk first. */
  date: string;
}

export const speaking: Talk[] = [
  { event: 'Amartha Workshop 2025', kind: 'Workshop', role: 'Speaker', date: '2025-12' },
  { event: 'Google I/O Extended Cloud 2025', kind: 'Talk', role: 'Firebase speaker', date: '2025-07' },
  { event: 'Google DevFest Depok 2024', kind: 'Workshop', role: 'Firebase speaker', date: '2024-11' },
  { event: "Women Techmakers International Women's Day (IWD) Depok 2024", kind: 'Panel discussion', role: 'Panelist', date: '2024-04' },
  { event: 'Google DevFest Jakarta 2023', kind: 'Tech talk', role: 'Firebase speaker', date: '2023-11' },
];
