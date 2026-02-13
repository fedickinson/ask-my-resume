---
category: "ai-thinking"
document: "ai-safety-perspective"
title: "How Franklin Thinks About AI Safety"
summary: "Franklin's perspective on AI safety and responsible development, grounded in hands-on coursework in adversarial robustness, privacy, fairness, jailbreaking, and alignment"
chunk_strategy: "paragraph"
context_prefix: "Franklin Dickinson — AI Safety & Responsible Development: "
sample_queries:
  - "How does Franklin think about AI safety?"
  - "Does Franklin understand responsible AI development?"
  - "What does Franklin know about AI alignment?"
  - "Has Franklin studied AI safety formally?"
  - "What's Franklin's take on AI risks?"
  - "Does Franklin care about AI ethics?"
  - "What does Franklin know about adversarial attacks?"
  - "How would Franklin approach safety in an AI product?"
---

# How Franklin Thinks About AI Safety

## The Core Belief

AI safety isn't a separate concern from AI product engineering — it's embedded in it. Every design decision, every architectural choice, every deployment plan either makes a system more trustworthy or less. Franklin believes that the engineers who build AI products need to understand the threat landscape as deeply as the people trying to exploit it. Safety can't be an afterthought bolted on at the end. It has to be a lens through which every product decision gets made.

This isn't a philosophical position Franklin arrived at abstractly. It comes from a semester of hands-on work in Cornell Tech's Trustworthy AI course, taught by Professor Vitaly Shmatikov, a security researcher who has spent years studying how AI systems fail, get exploited, and cause unintended harm. The course combined building models with breaking them — understanding not just how AI works, but how it can go wrong.

## What Franklin Learned by Breaking Things

### Adversarial Robustness

Franklin implemented adversarial attacks against convolutional neural networks, comparing white-box gradient-based methods against black-box random search approaches. He tested data augmentation as a defense and found it provides only marginal robustness improvement. The key insight: iterative gradient-based attacks significantly outperform single-step approaches, and naive defenses like gradient masking create a false sense of security rather than real protection.

For product building, this matters because it means you can't assume a model will behave correctly just because it performs well on your test set. Adversarial robustness needs to be evaluated explicitly, and the defenses need to be as sophisticated as the attacks.

### Jailbreaking and LLM Safety

Franklin studied automated jailbreak generation, including the GCG (Greedy Coordinate Gradient) attack and the "Jailbroken" paper's framework identifying two fundamental failure modes in safety-trained models: competing objectives and mismatched generalization. The sobering finding: combination attacks achieve near-100% success rates against safety-trained models.

This directly informs how Franklin thinks about building LLM-powered products. Input filtering and safety training are necessary but insufficient. Any product that puts an LLM in front of users needs layered defenses — input validation, output filtering, monitoring, and an honest assessment of what the model might do when someone actively tries to break it.

### Data Poisoning and Supply Chain Security

Franklin studied how even small amounts of malicious training data can compromise model behavior, how backdoors persist through fine-tuning and transfer learning, and how larger models can actually be more vulnerable to certain attacks. The implication: every pre-trained model, every crowdsourced dataset, and every third-party training pipeline introduces trust assumptions that can be exploited.

For an AI product engineer, this means treating the model supply chain with the same rigor that software engineers apply to code dependencies. You need to know where your models came from, what data they were trained on, and what assumptions you're inheriting.

### Privacy and Memorization

Franklin studied how LLMs can memorize and regurgitate training data, why naive anonymization fails, and how differential privacy provides formal guarantees against information leakage. He understands the distinction between central and local differential privacy and the practical tradeoffs involved in implementing privacy protections.

This is directly relevant to any product that handles user data or proprietary information. If you're building a RAG system over company documents or personal data, you need to understand what the model might leak and how to prevent it.

## The Frameworks That Stuck

### Security Is Not Safety

Security addresses intentional adversarial attacks. Safety addresses unintended harms. Both are essential, and the industry often overemphasizes one while neglecting the other. Franklin thinks about both when evaluating an AI system: who might try to break this on purpose, and how might it cause harm even when everyone is acting in good faith?

### Performance Is Not Trustworthiness

High accuracy on a benchmark doesn't mean a system is safe, fair, private, or robust. Trustworthiness requires evaluating multiple dimensions simultaneously. Franklin has seen this firsthand — a model can achieve excellent test metrics while being vulnerable to adversarial perturbation, memorizing private training data, or producing systematically unfair outcomes for certain groups.

### Context Determines Appropriateness

Drawing from Nissenbaum's contextual integrity framework, Franklin understands that privacy isn't about secrecy — it's about appropriate information flows for a given context. Similarly, fairness isn't one-size-fits-all. Group fairness and individual fairness serve different goals, and it's mathematically impossible to satisfy all fairness criteria simultaneously. The right approach depends on the context, the stakeholders, and the potential harms.

### Safety Must Keep Pace with Capability

Safety mechanisms need to be as sophisticated as the model's underlying capabilities. When GPT-4 learned to understand Base64 encoding, it became attackable in ways GPT-3.5 wasn't — the safety training hadn't caught up to the new capability. This principle — safety-capability parity — means that every capability improvement needs a corresponding safety evaluation.

## How This Shapes Product Thinking

Franklin doesn't see AI safety as a constraint on building great products. He sees it as a requirement for building products that last. A product that launches without thinking about adversarial robustness, data privacy, fairness, or misuse isn't moving fast — it's accumulating risk that will eventually come due.

Practically, this means Franklin approaches AI product development with several habits:

- **Threat model thinking** — Before building, ask: who might misuse this, what could go wrong unintentionally, and what are we assuming about our data and models?
- **Layered defenses** — No single safety mechanism is sufficient. Input validation, output filtering, monitoring, human-in-the-loop review, and explicit evaluation of failure modes all have a role.
- **Honest evaluation** — Test for the things you're afraid of, not just the things you hope will work. Red-team your own product before someone else does.
- **Sociotechnical framing** — Fairness and safety aren't purely technical problems. They require understanding the social systems around the technology, not just the model architecture.

## Why This Matters Now

As AI agents gain the ability to take actions in the real world — browsing the web, executing code, making purchases, sending communications — the stakes of getting safety wrong increase dramatically. A chatbot that hallucinates is embarrassing. An agent that takes incorrect actions based on manipulated inputs is dangerous.

Franklin believes the AI product engineers who will build the most important products in the next decade are the ones who understand both sides: how to make AI systems powerful and how to make them trustworthy. That combination — building capability and building safety together — is what he's preparing for.