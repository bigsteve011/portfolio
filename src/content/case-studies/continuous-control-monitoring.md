---
title: 'Continuous control monitoring: test once, comply many'
summary: 'A unified control library mapped to ISO 27001, NIST CSF 2.0, SOC 2, PCI DSS 4.0 and DORA, with a Python engine that tests the whole control population against system evidence and reports audit readiness for all five in one run.'
order: 3
role: 'Control design and Python engine'
period: '2026'
status: 'Public, synthetic evidence'
source: 'https://github.com/bigsteve011/unified-control-framework-ccm'
stack: ['Python 3.10 (stdlib)', 'ISO 27001:2022', 'NIST CSF 2.0', 'SOC 2', 'PCI DSS 4.0', 'DORA', 'JSON', 'unittest']
diagram: 'ccm'
core: 'A requirement is effective only if every control behind it is.'
tldr:
  problem: 'Point-in-time, sample-based audits miss failures between audits, and each framework gets tested separately for the same controls.'
  decision: 'Rationalise into fifteen unified controls with a crosswalk, and test 100% of the population from system exports with a deterministic engine.'
  result: 'One run produces readiness per framework, named exceptions such as an active leaver account or a 36-day-old critical vulnerability, and JSON for GRC platforms.'
decisions:
  - title: 'Weakest-link roll-up'
    decision: 'A framework requirement is rated effective only when every mapped control is effective.'
    options:
      - 'Average scores: looks better, hides the failing control.'
      - 'Weakest link: conservative and defensible to an auditor.'
    tradeoff: 'Readiness percentages look low until the weakest controls are fixed.'
    evidence:
      - { label: 'UCF methodology', url: 'https://github.com/bigsteve011/unified-control-framework-ccm/blob/main/docs/01-ucf-methodology.md' }
      - { label: 'ccm_engine.py', url: 'https://github.com/bigsteve011/unified-control-framework-ccm/blob/main/src/ccm_engine.py' }
  - title: 'Exceptions are visible, not hidden'
    decision: 'Approved risk acceptances are removed from the failure count but always listed in the report.'
    options:
      - 'Silently suppress accepted risks.'
      - 'Exclude them from scoring and show them.'
    tradeoff: 'Reports are longer.'
    evidence:
      - { label: 'reports/ccm_report.md', url: 'https://github.com/bigsteve011/unified-control-framework-ccm/blob/main/reports/ccm_report.md' }
  - title: 'Deterministic and dependency-free'
    decision: 'Standard library only; the same evidence always gives the same result, so an auditor can reproduce it.'
    options:
      - 'A GRC platform plugin.'
      - 'A small, reproducible script with tests.'
    tradeoff: 'Evidence connectors are exports rather than live APIs.'
    evidence:
      - { label: 'tests/', url: 'https://github.com/bigsteve011/unified-control-framework-ccm/tree/main/tests' }
failures:
  - { failure: 'An evidence export is stale or missing', detection: 'The control is reported as ineffective, not passed', mitigation: 'Missing evidence never counts as success', evidence: 'ccm_engine.py' }
next:
  - 'Pull evidence directly from Entra ID and Defender APIs.'
updated: '2026-11-06'
---
