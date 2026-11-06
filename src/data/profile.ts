export interface ContactLink {
  label: string;
  href: string;
  external: boolean;
}

export const profile = {
  name: 'Jesslyn',
  title: 'Backend Engineer',
  role: 'Backend Engineer — Scalable Systems · Cloud Infrastructure · AI-Powered Automation',
  summary:
    'Backend engineer with five years of experience building services in Go and Java Spring Boot. I build AI-powered internal tools, workflow automation and Terraform-managed infrastructure on Google Cloud, and I work across the whole path from system design to deployment, observability and performance tuning. I also speak about Firebase at Google developer events and enjoy turning generative AI into tools people use every day.',
  description:
    'Jesslyn — Backend Engineer specializing in scalable systems, cloud infrastructure, and AI-powered automation.',
  location: 'West Jakarta, Indonesia',
  email: 'jsslnjess08@gmail.com',
  github: 'https://github.com/jesslyn-ctrl',
  linkedin: 'https://www.linkedin.com/in/jesslyn-jesslyn-5798711a7/',
  cta: "Let's talk backend systems, cloud, or AI automation.",
};

export const contactLinks: ContactLink[] = [
  { label: profile.email, href: `mailto:${profile.email}`, external: false },
  { label: 'GitHub', href: profile.github, external: true },
  { label: 'LinkedIn', href: profile.linkedin, external: true },
];
