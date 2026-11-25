export interface ModuleDef {
  id: string;
  number: string;
  title: string;
  lessons: { slug: string; title: string }[];
}

const l = (slug: string, title: string) => ({ slug, title });

export const MODULES: ModuleDef[] = [
  { id: 'foundations', number: '01', title: 'Foundations', lessons: [
    l('what-is-logic-apps', 'What is Azure Logic Apps?'),
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
  ] },
  { id: 'building', number: '03', title: 'Building flows', lessons: [
    l('connectors', 'Connectors: built-in vs managed'),
    l('jdbc-databases', 'Databases over JDBC'),
    l('expressions', 'Expressions'),
    l('inline-code', 'Inline code and .NET functions'),
    l('control-flow', 'Control flow'),
    l('run-after-error-scopes', 'Run-after & error scopes'),
    l('parallel-branches', 'Parallel branches'),
  ] },
  { id: 'develop', number: '04', title: 'Develop & test', lessons: [
    l('local-development', 'Local development in VS Code'),
    l('parameters-app-settings', 'Parameters and app settings'),
    l('unit-testing', 'Unit testing workflows'),
    l('mocking-actions', 'Mocking triggers and actions'),
  ] },
  { id: 'integration', number: '05', title: 'Integration patterns', lessons: [
    l('xslt-maps', 'XML maps: XSLT and Data Mapper'),
    l('liquid-templates', 'JSON with Liquid templates'),
    l('service-bus-queues', 'Service Bus & queues'),
    l('batching', 'Batching'),
    l('debatching', 'Splitting arrays into separate runs'),
    l('async-polling', 'Request/response vs async polling'),
  ] },
  { id: 'reliability', number: '06', title: 'Reliability', lessons: [
    l('retry-policies', 'Retry policies'),
    l('timeouts', 'Timeouts'),
    l('idempotency', 'Idempotency'),
    l('resubmitting-runs', 'Resubmitting runs & failure handling'),
  ] },
  { id: 'operations', number: '07', title: 'Operating at scale', lessons: [
    l('throttling-limits', 'Throttling & limits'),
    l('monitoring', 'Monitoring with App Insights & Log Analytics'),
    l('alerting', 'Alerting'),
    l('failed-at-3am', 'A run failed at 3am — now what?'),
  ] },
  { id: 'security', number: '08', title: 'Security & delivery', lessons: [
    l('managed-identity', 'Managed identity'),
    l('key-vault', 'Key Vault'),
    l('easy-auth', 'Easy Auth (App Service authentication)'),
    l('private-networking', 'Private endpoints & VNet'),
    l('cicd', 'CI/CD with Bicep & ARM'),
    l('deployment-slots', 'Deployment slots'),
  ] },
  { id: 'agentic', number: '09', title: 'Agentic Logic Apps', lessons: [
    l('agent-workflows', 'Agent workflows vs fixed workflows'),
    l('logic-apps-as-tools', 'MCP with Logic Apps: expose & call'),
    l('multi-agent-patterns', 'Single and multiple agents'),
    l('agent-guardrails', 'Guardrails for agents'),
    l('agentic-triage', 'Agentic triage'),
  ] },
  { id: 'automation', number: '10', title: 'Logic Apps Automation (preview)', lessons: [
    l('what-is-automation', 'What Logic Apps Automation is'),
    l('projects-apps-workflows', 'Projects, applications and workflows'),
    l('automation-workflows', 'Building an automation workflow'),
  ] },
  { id: 'advanced', number: '11', title: 'Advanced integration patterns', lessons: [
    l('claim-check', 'Claim check'),
    l('request-reply-service-bus', 'Request-reply over Service Bus'),
    l('sequential-convoy', 'Sequential convoy'),
    l('scatter-gather', 'Scatter-gather'),
    l('saga-compensation', 'Saga & compensation'),
    l('competing-consumers', 'Competing consumers & priority queues'),
    l('circuit-breaker', 'Circuit breaker'),
    l('long-waits-correlation', 'Correlation & long waits'),
  ] },
  { id: 'systems', number: '12', title: 'Whole systems', lessons: [
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
