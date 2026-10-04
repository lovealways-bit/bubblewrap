# Lunara card fix list

Built on 2026-10-04 from the card audit (`lunara_card_audit.csv`, 197 rows). Every card entry below comes from that audit; none were added by hand. The approved-reference notes and the card back description come from the founder brief. This list is for planning only. No card art was redrawn, regenerated, recolored, or replaced in this branch.

## Approved references

- The only approved references are the 8 KJ "THE EMPIRE" V0 cards held by Design Closet. They are low-res references, not ship art.
- No approved art exists yet for Mermaid, Fairy, Creature, Summer Court, or the Fae Courts.
- In the audit, 143 files are marked NO APPROVED SOURCE FOUND, 52 WRONG, 1 WRONG/UNCLEAR, and 1 VARIANT.

Note: the audit lists the Summer Court files under `public/cards/blonde/`. That folder is now `public/cards/summer-court/`; paths below use the new name.

## 1. Card back

- `public/cards/the-empire.png` (1024x1024), WRONG: differs from approved 07 Card Back Sunflower Compass. The file is a winged lotus; it should be the Sunflower Compass card back.

## 2. Proofs that do not match the approved designs

| Card | File | Size | Status | Audit note |
|---|---|---|---|---|
| The Fool | `public/cards/proofs/major-00.png` | 1024x1536 | VARIANT | same concept as approved Fool (mermaid, dolphins, star) but a different render, not the approved file |
| Two of Cups | `public/cards/proofs/cups-02.png` | 1024x1536 | WRONG | differs from approved chalices and heart Two of Cups |
| Queen of Cups | `public/cards/proofs/cups-13.png` | 331x758 | WRONG | not the approved original blonde mermaid Queen of Cups (V0_MASTER_PROMPT says do not substitute) |
| Page of Pentacles | `public/cards/proofs/pentacles-11.png` | 246x754 | WRONG/UNCLEAR | differs from approved 05 Page of Pentacles (mermaid with compass); prompt also calls a Page of Pentacles turtle version rejected |
| Three of Swords | `public/cards/proofs/swords-03.png` | 246x754 | WRONG | different composition from approved winged heart Three of Swords (does show 3 swords) |
| Knight of Swords | `public/cards/proofs/swords-12.png` | 246x758 | WRONG | approved Knight of Swords is the seahorse rider; repo shows horse knight |
| Ace of Wands | `public/cards/proofs/wands-01.png` | 331x754 | WRONG | differs from approved winged crystal Ace of Wands |

7 cards. Those that are also low-res crops appear again in section 4.

## 3. Off-style shots

Square mockups with background margin, framed differently from the other proofs:

| Card | File | Size | Audit note |
|---|---|---|---|
| Six of Pentacles | `public/cards/proofs/pentacles-06.png` | 1024x1024 | square 1024x1024 mockup with background margin, style/frame inconsistent with other proofs |
| Seven of Pentacles | `public/cards/proofs/pentacles-07.png` | 1024x1024 | square 1024x1024 mockup with background margin, style/frame inconsistent with other proofs |
| Eight of Pentacles | `public/cards/proofs/pentacles-08.png` | 1024x1024 | square 1024x1024 mockup with background margin, style/frame inconsistent with other proofs |
| Nine of Pentacles | `public/cards/proofs/pentacles-09.png` | 1024x1024 | square 1024x1024 mockup with background margin, style/frame inconsistent with other proofs |
| Five of Swords | `public/cards/proofs/swords-05.png` | 1024x1024 | square 1024x1024 mockup with background margin, style/frame inconsistent with other proofs |
| Two of Wands | `public/cards/proofs/wands-02.png` | 1024x1024 | square 1024x1024 mockup with background margin, style/frame inconsistent with other proofs |
| Eight of Wands | `public/cards/proofs/wands-08.png` | 1024x1024 | square 1024x1024 mockup with background margin, style/frame inconsistent with other proofs |

Root fallback illustrations whose shape does not match the rest of the root art:

| Card | File | Size | Audit note |
|---|---|---|---|
| The Tower | `public/cards/major-16.png` | 663x1024 | non-square 663x1024, inconsistent with other root art |
| The Moon | `public/cards/major-18.png` | 662x1024 | non-square 662x1024, inconsistent with other root art |
| Judgement | `public/cards/major-20.png` | 616x1024 | non-square 616x1024, inconsistent with other root art |

## 4. Too small or cropped

44 proof files are low-res crops that will be blurry and heavily cropped in the 2:3 card slot.

| Card | File | Size | Aspect |
|---|---|---|---|
| The Emperor | `public/cards/proofs/major-04.png` | 246x754 | 1:3.1 (slot is 2:3) |
| The Hierophant | `public/cards/proofs/major-05.png` | 246x754 | 1:3.1 (slot is 2:3) |
| The Chariot | `public/cards/proofs/major-07.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Nine of Cups | `public/cards/proofs/cups-09.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Ten of Cups | `public/cards/proofs/cups-10.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Page of Cups | `public/cards/proofs/cups-11.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Knight of Cups | `public/cards/proofs/cups-12.png` | 331x758 | 1:2.3 (slot is 2:3) |
| Queen of Cups | `public/cards/proofs/cups-13.png` | 331x758 | 1:2.3 (slot is 2:3) |
| King of Cups | `public/cards/proofs/cups-14.png` | 331x758 | 1:2.3 (slot is 2:3) |
| Ace of Pentacles | `public/cards/proofs/pentacles-01.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Two of Pentacles | `public/cards/proofs/pentacles-02.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Three of Pentacles | `public/cards/proofs/pentacles-03.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Four of Pentacles | `public/cards/proofs/pentacles-04.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Five of Pentacles | `public/cards/proofs/pentacles-05.png` | 331x758 | 1:2.3 (slot is 2:3) |
| Ten of Pentacles | `public/cards/proofs/pentacles-10.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Page of Pentacles | `public/cards/proofs/pentacles-11.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Knight of Pentacles | `public/cards/proofs/pentacles-12.png` | 331x758 | 1:2.3 (slot is 2:3) |
| Queen of Pentacles | `public/cards/proofs/pentacles-13.png` | 331x758 | 1:2.3 (slot is 2:3) |
| King of Pentacles | `public/cards/proofs/pentacles-14.png` | 331x758 | 1:2.3 (slot is 2:3) |
| Ace of Swords | `public/cards/proofs/swords-01.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Two of Swords | `public/cards/proofs/swords-02.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Three of Swords | `public/cards/proofs/swords-03.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Four of Swords | `public/cards/proofs/swords-04.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Six of Swords | `public/cards/proofs/swords-06.png` | 331x758 | 1:2.3 (slot is 2:3) |
| Seven of Swords | `public/cards/proofs/swords-07.png` | 331x758 | 1:2.3 (slot is 2:3) |
| Eight of Swords | `public/cards/proofs/swords-08.png` | 331x754 | 1:2.3 (slot is 2:3) |
| Nine of Swords | `public/cards/proofs/swords-09.png` | 331x754 | 1:2.3 (slot is 2:3) |
| Ten of Swords | `public/cards/proofs/swords-10.png` | 331x754 | 1:2.3 (slot is 2:3) |
| Page of Swords | `public/cards/proofs/swords-11.png` | 246x758 | 1:3.1 (slot is 2:3) |
| Knight of Swords | `public/cards/proofs/swords-12.png` | 246x758 | 1:3.1 (slot is 2:3) |
| Queen of Swords | `public/cards/proofs/swords-13.png` | 246x758 | 1:3.1 (slot is 2:3) |
| King of Swords | `public/cards/proofs/swords-14.png` | 246x758 | 1:3.1 (slot is 2:3) |
| Ace of Wands | `public/cards/proofs/wands-01.png` | 331x754 | 1:2.3 (slot is 2:3) |
| Three of Wands | `public/cards/proofs/wands-03.png` | 331x754 | 1:2.3 (slot is 2:3) |
| Four of Wands | `public/cards/proofs/wands-04.png` | 246x758 | 1:3.1 (slot is 2:3) |
| Five of Wands | `public/cards/proofs/wands-05.png` | 246x758 | 1:3.1 (slot is 2:3) |
| Six of Wands | `public/cards/proofs/wands-06.png` | 246x758 | 1:3.1 (slot is 2:3) |
| Seven of Wands | `public/cards/proofs/wands-07.png` | 246x758 | 1:3.1 (slot is 2:3) |
| Nine of Wands | `public/cards/proofs/wands-09.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Ten of Wands | `public/cards/proofs/wands-10.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Page of Wands | `public/cards/proofs/wands-11.png` | 246x754 | 1:3.1 (slot is 2:3) |
| Knight of Wands | `public/cards/proofs/wands-12.png` | 331x758 | 1:2.3 (slot is 2:3) |
| Queen of Wands | `public/cards/proofs/wands-13.png` | 331x758 | 1:2.3 (slot is 2:3) |
| King of Wands | `public/cards/proofs/wands-14.png` | 331x758 | 1:2.3 (slot is 2:3) |

## 5. Main deck proofs missing

These Major Arcana have no proof in `public/cards/proofs/`, so the app falls back to the root illustration:

- The Tower (`major-16`)
- The Star (`major-17`)
- The Moon (`major-18`)
- The Sun (`major-19`)
- Judgement (`major-20`)
- The World (`major-21`)

## 6. Summer Court issues

The audit has 28 Summer Court files, all marked NO APPROVED SOURCE FOUND (generated alternates). The deck is hidden from users until it has all 78 approved cards. Specific problems:

- The Hanged Man (`public/cards/summer-court/major-12.png`): white padding bars at sides.
- Death (`public/cards/summer-court/major-13.png`): washed-out grey background, inconsistent.

## 7. Mermaid, Fairy, and Creature

- Mermaid (Tidebound Mermaid): only 6 sample cards on disk (The Fool, The Magician, Ace of Cups, Ace of Pentacles, Ace of Swords, Ace of Wands), none approved. Hidden from users.
- Fairy (Thornlight Fairy): only 6 sample cards on disk (The Fool, The Magician, Ace of Cups, Ace of Pentacles, Ace of Swords, Ace of Wands), none approved. Hidden from users.
- Creature (Wildkin Creature): only 6 sample cards on disk (The Fool, The Magician, Ace of Cups, Ace of Pentacles, Ace of Swords, Ace of Wands), none approved. Hidden from users.

## Turning a deck back on

Decks are listed in `lib/tarot/decks.ts`. Each has an `enabled` flag and a `cardCount`. Set `enabled: true` only once the deck has all 78 approved cards on disk.
