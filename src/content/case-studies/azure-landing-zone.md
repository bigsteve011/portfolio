---
title: 'Azure landing zone: no public surface, every packet inspected'
summary: 'A Terraform reference implementation of a CAF-aligned Azure landing zone: hub-spoke networking with forced tunnelling through Azure Firewall Premium, PaaS reachable only through private endpoints, and Azure Policy guardrails that deny drift.'
order: 1
role: 'Architecture, Terraform and policy as code'
period: '2026'
status: 'Public reference implementation'
source: 'https://github.com/bigsteve011/azure-landing-zone-hub-spoke-security'
stack: ['Terraform', 'Azure Firewall Premium', 'IDPS', 'TLS inspection', 'Hub-spoke VNets', 'UDR', 'Private Endpoints', 'Private DNS', 'Azure Policy', 'Management Groups']
diagram: 'landingzone'
core: 'Spokes have no route to the Internet except through the firewall, and policy denies anything that tries.'
tldr:
  problem: 'Fast cloud migration leaves fragmented networks, public PaaS endpoints, over-privileged admins and firewall rules with no central egress logging.'
  decision: 'A hub that owns inspection and connectivity, user-defined routes that force all spoke traffic through it, private endpoints for every data service, and guardrails enforced as Azure Policy in Deny mode.'
  result: 'A reviewable Terraform stack in which public Storage and Key Vault endpoints are refused by policy, and all egress passes TLS inspection and IDPS.'
decisions:
  - title: 'Forced tunnelling through the hub firewall'
    decision: 'Each spoke has a route table sending 0.0.0.0/0 to the Azure Firewall private IP, so egress and spoke-to-spoke traffic are inspected and logged in one place.'
    options:
      - 'Per-spoke NSGs and NAT gateways: cheaper, but egress is invisible and rules drift apart.'
      - 'Central firewall with forced routing: one place to inspect, log and allow-list.'
    tradeoff: 'Firewall Premium is billed hourly and becomes a dependency for every spoke.'
    evidence:
      - { label: 'terraform/network.tf', url: 'https://github.com/bigsteve011/azure-landing-zone-hub-spoke-security/blob/main/terraform/network.tf' }
  - title: 'IDPS and threat intelligence in Deny, egress by FQDN allow-list'
    decision: 'Azure Firewall Premium runs IDPS and threat-intel filtering in Deny mode with TLS inspection, and outbound traffic is limited to an explicit FQDN allow-list.'
    options:
      - 'Alert mode: nothing breaks, and nothing is stopped.'
      - 'Deny mode: false positives surface and get tuned.'
    tradeoff: 'New dependencies need an allow-list change before they work.'
    evidence:
      - { label: 'terraform/firewall.tf', url: 'https://github.com/bigsteve011/azure-landing-zone-hub-spoke-security/blob/main/terraform/firewall.tf' }
  - title: 'Guardrails as Azure Policy, not as a checklist'
    decision: 'Custom policy definitions deny public Storage and Key Vault endpoints, unencrypted disks and unapproved regions, grouped in an initiative and assigned by Terraform.'
    options:
      - 'Audit-only policies and periodic reviews.'
      - 'Deny effects that stop the deployment.'
    tradeoff: 'Legitimate exceptions need an explicit exemption, which is itself reviewable.'
    evidence:
      - { label: 'terraform/policy.tf', url: 'https://github.com/bigsteve011/azure-landing-zone-hub-spoke-security/blob/main/terraform/policy.tf' }
      - { label: 'policies/', url: 'https://github.com/bigsteve011/azure-landing-zone-hub-spoke-security/tree/main/policies' }
failures:
  - { failure: 'A new spoke is deployed without the forced route', detection: 'Egress for that range is missing from firewall logs', mitigation: 'Route tables are created by the same code as the spoke', evidence: 'terraform/network.tf' }
  - { failure: 'A team creates a storage account with public access', detection: 'Azure Policy deny event', mitigation: 'The deployment is refused before the resource exists', evidence: 'policies/' }
next:
  - 'Add Privileged Identity Management for platform role assignments.'
  - 'Add plan-time policy tests in CI before apply.'
updated: '2026-11-06'
---
