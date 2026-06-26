# Product

## Register

product

## Users
People hopping into a real-time video call — joining by room name with a display name. Context is a self-hosted LiveKit deployment (the user runs their own server), so the audience skews technical/builder. The primary task on any screen is singular: get into the call, then talk/share/chat with low friction.

## Product Purpose
A self-hosted Google Meet alternative built on LiveKit. It exists to give the owner a fully-controlled, no-vendor video meeting tool. Success = join in one screen, a stable call with grid + screenshare + chat, and nothing standing between the user and the conversation.

## Brand Personality
Precise, technical, self-hosted-proud. Three words: **terminal, exact, quiet-confident.** It should feel like infrastructure you own — a developer-grade tool, not a consumer SaaS. Voice is terse and literal (`establishing signal`, `1 peer`, `wss`), never cute.

## Anti-references
- **Google Meet / Zoom blue-on-white** — the category reflex; explicitly avoid it.
- Generic dark "glassy SaaS" with blurred cards and gradient accents.
- Cream/sand/warm-neutral editorial softness.
- Anything that hides the fact this is raw, owned infrastructure.

## Design Principles
1. **The tool disappears into the call.** Chrome is minimal; the video stage is the product.
2. **Show the machinery, proudly.** Surface connection state, transport, peer count as first-class terminal readouts — they reassure a self-hoster.
3. **One screen to join.** No multi-step lobby; room + name + connect.
4. **Earned familiarity.** Standard affordances (LiveKit ControlBar, native controls) themed, never reinvented.
5. **Functional motion only.** Motion conveys state (live pulse, connecting caret, drawer), never decoration.

## Accessibility & Inclusion
WCAG 2.1 AA: body/UI text ≥4.5:1 on near-black, focus-visible rings on every interactive element, full keyboard operability, `prefers-reduced-motion` alternatives for every animation. Lime accent is used for state/emphasis, never as the sole carrier of meaning.
