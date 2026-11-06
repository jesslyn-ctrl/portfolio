/** A resume bullet. `tags` drive the skill highlighter on the home page. */
export interface Point {
  text: string;
  tags: string[];
}

export interface Job {
  title: string;
  org: string;
  place: string;
  /** Year and month, `YYYY-MM`. */
  start: string;
  /** `YYYY-MM`, or null for the current role. */
  end: string | null;
  points: Point[];
}

export const experience: Job[] = [
  {
    title: 'Software Engineer',
    org: 'DoiT International',
    place: 'Remote',
    start: '2026-03',
    end: null,
    points: [
      { text: 'Build internal AI-powered tools and automation platforms that remove repetitive work for Support, Finance and Engineering teams.', tags: ['AI', 'Automation'] },
      { text: 'Lead system design for new services, from architecture proposals through scalability and maintainability reviews.', tags: ['System design', 'Leadership'] },
      { text: 'Develop backend services in Go and run them on Cloud Run behind API Gateway and a load balancer.', tags: ['Go', 'GCP'] },
      { text: 'Manage GCP infrastructure as code with Terraform (Cloud Run, API Gateway, Load Balancing, IAM, Artifact Registry, Cloud Build, Workload Identity Federation), deployed through GitHub Actions pipelines.', tags: ['Terraform', 'GCP', 'CI/CD'] },
      { text: 'Designed Zendesk ticket routing and Finance support automation, covering skill-based assignment, escalations, SLA tracking and reporting, which cut manual triage.', tags: ['Automation'] },
      { text: 'Connect Zendesk, Jira, Slack, Google Workspace and internal APIs through Zapier, n8n and event-driven integrations.', tags: ['Automation'] },
      { text: 'Use AI-assisted development (Claude Code, Gemini, Antigravity) in day-to-day engineering.', tags: ['AI'] },
    ],
  },
  {
    title: 'Senior Backend Engineer',
    org: 'SG-EDTS',
    place: 'Jakarta',
    start: '2025-01',
    end: '2026-03',
    points: [
      { text: 'Led system design and architecture reviews for new microservices, balancing scalability, maintainability and business needs.', tags: ['System design', 'Leadership'] },
      { text: 'Reviewed code and mentored engineers on Java Spring Boot and Go projects.', tags: ['Leadership', 'Java', 'Go'] },
      { text: 'Improved API response times by tuning database queries and caching strategies.', tags: ['Databases'] },
      { text: 'Set team practices for microservice design, CI/CD, testing strategy and observability.', tags: ['CI/CD', 'System design'] },
    ],
  },
  {
    title: 'Backend Engineer',
    org: 'SG-EDTS',
    place: 'Jakarta',
    start: '2023-08',
    end: '2024-12',
    points: [
      { text: 'Built and maintained Java Spring Boot and Go microservices, including gRPC services, for e-Budgeting (insurance) and Klik Indomaret (retail) clients.', tags: ['Java', 'Go', 'gRPC'] },
      { text: 'Implemented Kafka messaging for real-time data exchange and decoupled communication between services.', tags: ['Kafka'] },
      { text: 'Deployed services on Google Cloud (GKE, Cloud SQL) using multi-stage Docker builds and Kubernetes.', tags: ['GCP', 'Kubernetes'] },
      { text: 'Contributed to system design, project structure and technical documentation for new services.', tags: ['System design'] },
      { text: 'Researched and prototyped generative AI features with Google Gemini, OpenAI GPT and Ollama for internal projects.', tags: ['AI'] },
    ],
  },
  {
    title: 'Backend Engineer',
    org: 'Gramedia',
    place: 'Jakarta',
    start: '2022-07',
    end: '2023-07',
    points: [
      { text: 'Led a team of four to deliver the B2B Billing System and the Gramedia Affiliate System for Gramedia.com.', tags: ['Leadership'] },
      { text: 'Built backend APIs and integrations with Python (Django), Express.js and Nuxt on PostgreSQL, MongoDB, RabbitMQ and Firebase, monitored with Elastic APM.', tags: ['Python', 'TypeScript', 'Databases'] },
      { text: 'Mapped vendor and category data so catalog records stayed consistent across systems.', tags: ['Databases'] },
      { text: 'Shipped on AWS with Docker, Elasticsearch and CI/CD pipelines, and took part in system design and code reviews.', tags: ['AWS', 'CI/CD', 'System design'] },
    ],
  },
  {
    title: 'Mobile Android & Full-stack Web Developer',
    org: 'AdIns',
    place: 'Jakarta',
    start: '2021-03',
    end: '2022-07',
    points: [
      { text: 'Resolved production issues and performance bottlenecks for multi-finance clients including BCA Finance, Toyota Astra Finance, Wuling Finance and WOM Finance.', tags: [] },
      { text: 'Maintained Java Spring Boot backends and JSP web applications.', tags: ['Java'] },
      { text: 'Built and fixed Android apps in Java, adding Firebase Crashlytics and Performance Monitoring.', tags: ['Java', 'Mobile'] },
      { text: 'Ran SQL Server data operations and deployed to Apache, WildFly and client servers.', tags: ['Databases'] },
    ],
  },
  {
    title: 'Computation & NLP Assistant Lecturer',
    org: 'Tarumanagara University',
    place: 'Jakarta',
    start: '2020-06',
    end: '2020-12',
    points: [],
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** `2026-03` → `Mar 2026`; null → `Present`. */
export function formatMonth(ym: string | null): string {
  if (!ym) return 'Present';
  return `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
}

/** Months since year zero, for to-scale layout. */
export function monthIndex(ym: string): number {
  return Number(ym.slice(0, 4)) * 12 + Number(ym.slice(5, 7)) - 1;
}

/** `YYYY-MM` for the given date (defaults to today). */
export function currentMonth(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

/** Inclusive length of a role, such as `1 yr 2 mo`. */
export function duration(start: string, end: string | null, now = currentMonth()): string {
  const months = monthIndex(end ?? now) - monthIndex(start) + 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return [years ? `${years} yr${years > 1 ? 's' : ''}` : '', rest ? `${rest} mo` : ''].filter(Boolean).join(' ');
}
