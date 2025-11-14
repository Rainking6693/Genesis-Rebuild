# Genesis Integration Plan

This plan captures the major architecture upgrades we're integrating into Genesis, drawn from the referenced papers (links below). Each task is grouped by capability and includes the relevant research anchor. Mark a task complete as soon as it ships.

## 1. AsyncThink-style orchestration
- [x] Implement fork/join organizer-worker protocol so the swarm layer can fire multiple sub-tasks concurrently (parallel tool calls, parallel business evaluations).  
      * Goal: reduce latency / boost accuracy even on a single VPS (target ~28% faster, +89% accuracy as reported).  
      * Anchor: **ArXiv 2510.26658**.

## 2. Rubric-based auditing (Research Rubrics + RIFL)
- [x] Plug the published rubric-verifier pipelines into HTDAG planning and multi-turn responses so each artifact is graded using explicit criteria.  
      * Aim: Layer-1 checks evaluate every business plan or research task against Research Rubrics + RIFL.  
      * Anchors: **ArXiv 2511.07685**, **ArXiv 2511.10507**.

## 3. AuditLLM-like continuous auditor
- [x] Deploy an autonomous auditing agent that continuously reviews traces/compliance (QA tests executed, Support tickets logged, etc.), enforcing readiness without manual spot checks.  
      * Anchor: Inspired by **AuditLLM-style autonomous audits** from the broader literature and Gen-AI Ops patterns.

## 4. Binary RAR hallucination control
- [x] Integrate binary retrieve-and-verify reward (and RL scripts from the `rl-binary-rar` repo) into DreamGym/evolution so agents only accept outputs that align with retrieved documents.  
      * This prevents hallucinations for customer-facing content; valuable even on VPS.  
      * Anchor: **ArXiv 2510.17733** plus the `https://github.com/chentong0/rl-binary-rar` repo.

## 5. Reasoning codebooks (Codebook-aware agents)
- [ ] Add Memori-backed “codebooks” so each agent caches reusable reasoning snippets, stabilizing DreamGym evolution and reducing repeated mistakes.  
      * Anchor: Compositional reasoning + codebook guidance from the literature above, applied to the DreamGym evolution loop.

## References
1. [AsyncThink-style orchestration – arXiv:2510.26658](https://arxiv.org/pdf/2510.26658)  
2. [Research Rubrics + RIFL – arXiv:2511.07685](https://arxiv.org/pdf/2511.07685)  
3. [RIFL evaluation pipelines – arXiv:2511.10507](https://arxiv.org/pdf/2511.10507)  
4. [Binary RAR – arXiv:2510.17733](https://arxiv.org/pdf/2510.17733)  
5. [RL Binary RAR repo](https://github.com/chentong0/rl-binary-rar)
