export interface ListEntry {
  text: string;
  when?: string;
}

export interface Talk {
  event: string;
  kind: string;
  role: string;
  when: string;
}

export const speaking: Talk[] = [
  { event: 'Google DevFest Jakarta 2023', kind: 'Tech talk', role: 'Firebase speaker', when: 'Nov 2023' },
  { event: 'Google DevFest Depok 2024', kind: 'Workshop', role: 'Firebase speaker', when: 'Nov 2024' },
  { event: 'Google I/O Extended Cloud 2025', kind: 'Talk', role: 'Firebase speaker', when: 'Jul 2025' },
];
