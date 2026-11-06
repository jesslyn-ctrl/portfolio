import type { IconName } from './icons';

export interface Skill {
  /** Short label under the icon. */
  name: string;
  /** Longer name shown on hover, when the label is shortened. */
  full?: string;
  icon: IconName;
}

export interface SkillGroup {
  name: string;
  items: Skill[];
}

export const skills: SkillGroup[] = [
  {
    name: 'Languages',
    items: [
      { name: 'Go', icon: 'go' },
      { name: 'Java', icon: 'openjdk' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'Python', icon: 'python' },
    ],
  },
  {
    name: 'Backend',
    items: [
      { name: 'Spring Boot', icon: 'springboot' },
      { name: 'gRPC', icon: 'grpc' },
      { name: 'GraphQL', full: 'GraphQL (gqlgen)', icon: 'graphql' },
      { name: 'REST', icon: 'rest' },
      { name: 'Kafka', icon: 'apachekafka' },
      { name: 'RabbitMQ', icon: 'rabbitmq' },
      { name: 'Microservices', icon: 'microservices' },
    ],
  },
  {
    name: 'Data',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Redis', icon: 'redis' },
      { name: 'SQL Server', icon: 'database' },
      { name: 'Cloud SQL', icon: 'googlecloud' },
      { name: 'Elasticsearch', icon: 'elasticsearch' },
    ],
  },
  {
    name: 'Cloud & DevOps',
    items: [
      { name: 'Google Cloud', full: 'Google Cloud (Cloud Run, GKE, API Gateway, IAM)', icon: 'googlecloud' },
      { name: 'AWS', icon: 'amazonwebservices' },
      { name: 'Terraform', icon: 'terraform' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Kubernetes', icon: 'kubernetes' },
      { name: 'GitHub Actions', icon: 'githubactions' },
    ],
  },
  {
    name: 'AI & Automation',
    items: [
      { name: 'Claude', full: 'Claude & Claude Code', icon: 'claude' },
      { name: 'Pi', full: 'Pi coding agent', icon: 'pi' },
      { name: 'Perplexity', icon: 'perplexity' },
      { name: 'Firebase Genkit', icon: 'firebase' },
      { name: 'Gemini', icon: 'googlegemini' },
      { name: 'OpenAI', icon: 'openai' },
      { name: 'Ollama', icon: 'ollama' },
      { name: 'MCP', full: 'Model Context Protocol', icon: 'mcp' },
      { name: 'Zapier', icon: 'zapier' },
      { name: 'n8n', icon: 'n8n' },
    ],
  },
  {
    name: 'Frontend, Mobile & Testing',
    items: [
      { name: 'Next.js', icon: 'nextdotjs' },
      { name: 'React Native', icon: 'react' },
      { name: 'Android', full: 'Android (Java)', icon: 'android' },
      { name: 'Playwright', full: 'Playwright (end-to-end test automation)', icon: 'playwright' },
    ],
  },
];
