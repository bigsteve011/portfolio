// Hand-maintained profile content. Project claims are backed by a public
// repository or a verifiable credential; career details come from the CV.

export const profile = {
  name: 'Stephen Omowumi',
  role: 'Cloud Security, DevSecOps & GRC Engineer',
  statement:
    'I build cloud platforms where security and compliance are part of the pipeline, not a review at the end. ' +
    'Controls are tested continuously, recovery is proven, and risk is explained in business terms.',
  meta: 'Kraków, Poland · Azure · AWS · Terraform · ISO 27001 · DORA',
  about: [
    "I'm a cloud security and DevSecOps engineer in Kraków with 6+ years across regulated financial services, cloud and enterprise environments. I bring cloud infrastructure and cybersecurity together so teams can adopt the cloud at full speed without giving up security, resilience or compliance.",
    "Today I audit cloud infrastructure and applications in a regulated bank, and build containerised workloads, CI/CD pipelines and serverless platforms as a DevOps engineer. Before that I secured hybrid cloud estates for financial services clients: IAM and Conditional Access, Defender for Cloud and Sentinel, and automated control tests that replaced sample-based audits.",
    "I'm an ISO/IEC 27001, 42001 and 27701 Lead Auditor, CompTIA CySA+ and Security+ certified, with an MBA, an M.Sc. in Telecommunication Management and a B.Sc. in Telecommunication Science. The case studies above show how I work.",
  ],
  email: 'stephen.omowumi10@gmail.com',
  links: {
    github: 'https://github.com/bigsteve011',
    githubDevops: 'https://github.com/Steeve-devops',
    linkedin: 'https://www.linkedin.com/in/stephen-omowumi-6b59b14a/',
    credly: 'https://www.credly.com/users/stephen-omowumi.e854fb1c/badges/credly',
  },
};

const credly = profile.links.credly;

export const certifications = [
  { code: 'ISO 27001 LA', name: 'ISO/IEC 27001:2022 Lead Auditor', url: credly },
  { code: 'ISO 42001 LA', name: 'ISO/IEC 42001:2023 Lead Auditor', url: credly },
  { code: 'ISO 27701 LA', name: 'ISO/IEC 27701:2025 Lead Auditor', url: credly },
  { code: 'CySA+', name: 'CompTIA Cybersecurity Analyst+', url: credly },
  { code: 'Security+', name: 'CompTIA Security+', url: credly },
];

export const experience = [
  { role: 'Cybersecurity Auditor (Cloud Infrastructure & Applications)', org: 'State Street Bank GmbH · Kraków', period: 'Jul 2025 – present' },
  { role: 'DevOps Engineer (Remote)', org: 'SSLabs · Canada', period: 'Jan 2025 – present' },
  { role: 'Cloud & Infrastructure Engineer (Cloud Security)', org: 'LTIMindtree · Poland', period: '2023 – 2025' },
];

// Shift-left · Prove · Automate: the method, with where each part is evidenced.
export const method = [
  {
    step: 'Shift left',
    text: 'Security is a property of the pipeline, not a sign-off at the end: no static cloud secrets, signed images, policy that denies public endpoints before anything is deployed.',
    evidence: { label: 'Zero-trust CI/CD: OIDC, no stored keys', href: '/work/zero-trust-cicd/#d-01' },
  },
  {
    step: 'Prove',
    text: 'A control is only effective if the evidence says so. Failover is tested against RTO/RPO, and a framework requirement passes only when every control behind it does.',
    evidence: { label: 'CCM: weakest-link roll-up', href: '/work/continuous-control-monitoring/#d-01' },
  },
  {
    step: 'Automate',
    text: 'Guardrails and evidence collection run as code on every change and every day, so compliance is a continuous state rather than an annual project.',
    evidence: { label: 'Landing zone: policy as code', href: '/work/azure-landing-zone/#d-03' },
  },
];
