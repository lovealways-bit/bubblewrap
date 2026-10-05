# Lunara card frame preview · 2026-09-27

Preview branch only. Do not promote lunara-atlas production until founder QA.

## Bugs in the live screenshots
- Mixed aspect art letterboxed inside the 2:3 slot (`object-contain`).
- Reversed cards looked sideways instead of flipped 180.
- Blonde court art lived in `public/cards/blonde/` but was not a picker theme.

## Patch
- Register Lunara Blonde Court in `lib/tarot/decks.ts`.
- Proof faces use `object-cover` and `rotate-180` when reversed. R badge stays.
- Picker lists all five themes. Incomplete themes still fall back to Classic proofs.

Live production remains `lunara-tarot-three.vercel.app` until this branch is approved.


> Update 2026-10-04: the Blonde Court deck is now named Summer Court, its art folder is `public/cards/summer-court/`, and it is hidden from users until it has all 78 cards. See `docs/LUNARA_CARD_FIX_LIST.md`.
