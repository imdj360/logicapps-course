export interface ModuleDef {
  id: string;
  number: string;
  title: string;
  lessons: { slug: string; title: string }[];
}

const l = (slug: string, title: string) => ({ slug, title });

export const MODULES: ModuleDef[] = [
  { id: 'foundations', number: '01', title: 'Foundations', lessons: [
    l('where-logic-apps-run', 'Where Logic Apps run'),
    l('follow-an-order', 'Follow an order through a run'),
    l('stateful-vs-stateless', 'Stateful vs stateless'),
    l('connections-json', 'Connections and connections.json'),
  ] },
  { id: 'hosting', number: '02', title: 'Hosting & runtime', lessons: [
    l('workflow-service-plans', 'Standard on Workflow Service Plans'),
    l('app-service-environment', 'Standard on App Service Environment v3'),
    l('hybrid-on-premises', 'Hybrid & on-premises'),
    l('storage-account', 'The storage account behind Standard'),
    l('built-on-functions', 'Built on Azure Functions'),
  ] },
  { id: 'building', number: '03', title: 'Building flows', lessons: [
    l('connectors', 'Connectors: built-in vs managed'),
    l('expressions', 'Expressions'),
    l('inline-code', 'Inline code and .NET functions'),
    l('control-flow', 'Control flow'),
    l('parallel-branches', 'Parallel branches'),
  ] },
  { id: 'integration', number: '04', title: 'Integration patterns', lessons: [
    l('xslt-maps', 'XML maps: XSLT and Data Mapper'),
    l('liquid-templates', 'JSON with Liquid templates'),
    l('service-bus-queues', 'Service Bus & queues'),
    l('batching', 'Batching'),
    l('debatching', 'Splitting arrays into separate runs'),
    l('async-polling', 'Request/response vs async polling'),
  ] },
  { id: 'reliability', number: '05', title: 'Reliability', lessons: [
    l('retry-policies', 'Retry policies'),
    l('timeouts', 'Timeouts'),
    l('run-after-error-scopes', 'Run-after & error scopes'),
    l('idempotency', 'Idempotency'),
    l('resubmitting-runs', 'Resubmitting runs & failure handling'),
  ] },
  { id: 'operations', number: '06', title: 'Operating at scale', lessons: [
    l('throttling-limits', 'Throttling & limits'),
    l('monitoring', 'Monitoring with App Insights & Log Analytics'),
    l('alerting', 'Alerting'),
    l('failed-at-3am', 'A run failed at 3am — now what?'),
  ] },
  { id: 'security', number: '07', title: 'Security & delivery', lessons: [
    l('managed-identity', 'Managed identity'),
    l('key-vault', 'Key Vault'),
    l('private-networking', 'Private endpoints & VNet'),
    l('cicd', 'CI/CD with Bicep & ARM'),
  ] },
  { id: 'agentic', number: '08', title: 'Agentic Logic Apps', lessons: [
    l('agent-workflows', 'Agent workflows vs fixed workflows'),
    l('logic-apps-as-tools', 'Logic Apps as tools & MCP servers'),
    l('agents-operating-logic-apps', 'Agents that operate Logic Apps'),
    l('agent-guardrails', 'Guardrails for agents'),
    l('agentic-triage', 'Agentic triage'),
  ] },
  { id: 'systems', number: '09', title: 'Whole systems', lessons: [
    l('order-processing', 'Order-processing pipeline'),
    l('edi-b2b', 'EDI / B2B flow'),
    l('integration-hub', 'Event-driven integration hub'),
  ] },
];

export const FIXTURE_MODULE: ModuleDef = {
  id: 'fixtures', number: '99', title: 'Test fixtures', lessons: [
    l('sample', 'Sample lesson'),
    l('sample-draft', 'Sample draft lesson'),
  ],
};

export const includeFixtures = (env: Record<string, string | undefined>) => env.PUBLIC_INCLUDE_FIXTURES === '1';

export const getModules = (withFixtures: boolean): ModuleDef[] =>
  withFixtures ? [...MODULES, FIXTURE_MODULE] : MODULES;
