---
title: 'Zero-trust CI/CD: no stored keys, only signed images ship'
summary: 'GitHub Actions hardened with OIDC federation to AWS and Azure, 15-minute credentials scoped to one repository and environment, CycloneDX SBOMs, and Sigstore Cosign signatures verified before deployment.'
order: 2
role: 'Pipeline design, Terraform and supply-chain security'
period: '2026'
status: 'Public reference implementation'
source: 'https://github.com/bigsteve011/zero-trust-cicd-github-oidc'
stack: ['GitHub Actions', 'OIDC', 'AWS IAM / STS', 'Entra ID', 'Terraform', 'Sigstore Cosign', 'CycloneDX SBOM', 'GHCR']
diagram: 'oidc'
core: 'The pipeline never holds a cloud key; it proves who it is and gets fifteen minutes.'
tldr:
  problem: 'Long-lived cloud credentials in CI secrets leak through pull-request injection, debug logs and compromised runners, and carry broad privileges.'
  decision: 'Federate GitHub OIDC tokens with AWS and Entra ID trust policies that match the exact repository and protected environment, and gate deployment on a verified Cosign signature.'
  result: 'No static cloud secrets in the pipeline, credentials that expire after 15 minutes, and images that cannot be deployed unless their signature verifies.'
decisions:
  - title: 'OIDC federation instead of access keys'
    decision: 'The runner requests a GitHub-signed JWT and exchanges it with AWS STS or Entra ID for short-lived credentials. The trust policy requires the exact repository and the protected production environment.'
    options:
      - 'Access keys in repository secrets: simple, long-lived, and readable by any compromised step.'
      - 'Federated identity scoped by claims.'
    tradeoff: 'Trust policies must be maintained per repository and environment.'
    evidence:
      - { label: 'terraform/', url: 'https://github.com/bigsteve011/zero-trust-cicd-github-oidc/tree/main/terraform' }
  - title: 'Sign, attest and verify before deploy'
    decision: 'Each build produces a CycloneDX SBOM; the image digest is signed and attested keylessly with Cosign and verified against the workflow identity before the deploy step runs.'
    options:
      - 'Trust the registry: anyone with push access can ship.'
      - 'Verify provenance cryptographically.'
    tradeoff: 'Adds steps and a dependency on Sigstore infrastructure.'
    evidence:
      - { label: 'secure-deploy.yml', url: 'https://github.com/bigsteve011/zero-trust-cicd-github-oidc/blob/main/.github/workflows/secure-deploy.yml' }
failures:
  - { failure: 'A fork or another branch tries to assume the deploy role', detection: 'STS rejects the token because the subject claim does not match', mitigation: 'Trust is bound to repository and environment', evidence: 'terraform/' }
  - { failure: 'A tampered image is pushed to the registry', detection: 'cosign verify fails', mitigation: 'The deploy step never runs', evidence: 'secure-deploy.yml' }
next:
  - 'Enforce signature verification in-cluster with an admission controller.'
updated: '2026-11-06'
---
