# Lunara mobile repair and deck status
Date: 2026-10-06
Agent: ChatGPT Lumen / Codex

## Observable repair
- Deck browsing no longer auto-selects a different deck after a timer.
- A phone deck drawer stays open after selection; Use [deck] explicitly confirms it.
- Closed phone drawers do not mount hidden galleries.
- Deck previews and reading faces use responsive Next image optimization. Original PNG artwork is preserved.
- Reading controls, input text, navigation tabs, and deck navigation targets are larger on phones.
- Storage write failures show a notice and allow drawing to continue.
- Changing spreads cancels an in-flight draw, and unmounting cleans up its timer.

## Validation
Six focused React DOM regression checks pass. Five of these checks fail against the unchanged main source. TypeScript noEmit passes separately, because the existing Next config skips type validation.
Production compilation and page generation pass using temporary local auth/Stripe placeholders. The initial build without those values stopped at existing auth/Stripe configuration requirements. No real credentials, database or payment operations were exercised. Local database-schema warnings remain.
Physical iPhone/Android visual QA and live optimizer verification remain pending.

## Current deck status and authority
- Summer: founder approved; enabled with 78 faces in main.
- Hallow: enabled in main with 78 faces plus back; merged PR 11.
- Winter: founder Danielle confirms completed on 2026-10-06. Grok ran out of usage before updating its QA log. Preserve enabled status; older 15-FIX log is stale. This is a founder completion receipt, not a new per-card inspection.
- Christmas: latest team record reports 78 faces plus back delivered and visually checked. Prior reference HOLD superseded by Danielle confirming this is the first Christmas design. Not registered in this app's current main.
- Classic Renaissance: latest team record reports 46 checked faces plus back; 31 missing faces and Ten of Wands rejected. Historical 71-PASS sea-themed batch superseded.
- Mermaid and Creatures: latest available QA logs still show open issues; no current completion receipt observed.
- Fairy and other court expansion decks: no complete delivery verified here.

Source: current Drive Team Update and Tasks, current deck registry/tree, founder correction in this session. Runtime registration, delivered artwork, and visual acceptance are distinct facts.
No artwork, deck enablement, subscription prices, auth, database, or production deployment changed by this PR.

## Approval lane
!!!!!! PRIORITY / OVERWRITE WARNING !!!!!!
This proposed change replaces the scoped UI component code and enables image optimization in next.config.mjs. Founder/SUDO approval is required before merge. Current production and original artwork remain preserved.
