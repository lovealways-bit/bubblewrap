import { ESSENCES } from './essences'
import type { Suit, TarotCard } from './types'

// ---------------------------------------------------------------------------
// The full 78-card tarot deck as structured data.
// 22 Major Arcana + 56 Minor Arcana (14 per suit).
// This module is data-only: no shuffle logic, no UI. Import `buildDeck()`
// to get a fresh, ordered deck instance.
// ---------------------------------------------------------------------------

const majorArcana: Omit<TarotCard, 'arcana'>[] = [
  {
    id: 'major-00',
    name: 'The Fool',
    number: 0,
    keywords: ['beginnings', 'faith', 'innocence'],
    upright: 'A leap into the unknown. New beginnings, spontaneity, and boundless potential.',
    reversed: 'Recklessness without a map. Hesitation, naivety, or a risk taken too soon.',
  },
  {
    id: 'major-01',
    name: 'The Magician',
    number: 1,
    keywords: ['will', 'manifestation', 'power'],
    upright: 'The tools are already in your hands. Willpower, focus, and manifestation.',
    reversed: 'Power turned inward or misused. Manipulation, scattered energy, untapped talent.',
  },
  {
    id: 'major-02',
    name: 'The High Priestess',
    number: 2,
    keywords: ['intuition', 'mystery', 'the unseen'],
    upright: 'Listen beneath the noise. Intuition, secrets, and the wisdom of stillness.',
    reversed: 'A signal ignored. Disconnection from intuition, secrets kept, withdrawal.',
  },
  {
    id: 'major-03',
    name: 'The Empress',
    number: 3,
    keywords: ['abundance', 'nurture', 'creation'],
    upright: 'Growth in full bloom. Abundance, creativity, and nurturing care.',
    reversed: 'The garden neglected. Creative block, dependence, or smothering.',
  },
  {
    id: 'major-04',
    name: 'The Emperor',
    number: 4,
    keywords: ['authority', 'structure', 'order'],
    upright: 'A throne built on discipline. Authority, structure, and steady command.',
    reversed: 'Order hardened into tyranny. Rigidity, control, or a crown that no longer fits.',
  },
  {
    id: 'major-05',
    name: 'The Hierophant',
    number: 5,
    keywords: ['tradition', 'guidance', 'belief'],
    upright: 'The old roads still lead somewhere. Tradition, mentorship, shared belief.',
    reversed: 'The rules break beneath you. Rebellion, dogma, or a faith outgrown.',
  },
  {
    id: 'major-06',
    name: 'The Lovers',
    number: 6,
    keywords: ['union', 'choice', 'values'],
    upright: 'Two forces align. Union, harmony, and a choice made from the heart.',
    reversed: 'A fracture in alignment. Disharmony, misplaced values, a fork mis-taken.',
  },
  {
    id: 'major-07',
    name: 'The Chariot',
    number: 7,
    keywords: ['drive', 'victory', 'control'],
    upright: 'Will harnessed to motion. Determination, triumph, and forward drive.',
    reversed: 'Reins slipping loose. Lost direction, opposing forces, aggression.',
  },
  {
    id: 'major-08',
    name: 'Strength',
    number: 8,
    keywords: ['courage', 'patience', 'inner power'],
    upright: 'Gentleness that tames the beast. Courage, patience, quiet power.',
    reversed: 'The lion within, unruled. Self-doubt, raw emotion, spent resolve.',
  },
  {
    id: 'major-09',
    name: 'The Hermit',
    number: 9,
    keywords: ['solitude', 'search', 'guidance'],
    upright: 'A lantern carried inward. Introspection, solitude, and hard-won guidance.',
    reversed: 'Solitude curdled to exile. Isolation, withdrawal, a path lost in the dark.',
  },
  {
    id: 'major-10',
    name: 'Wheel of Fortune',
    number: 10,
    keywords: ['cycles', 'fate', 'turning'],
    upright: 'The wheel turns in your favor. Cycles, fortune, a fated turning point.',
    reversed: 'The wheel stalls against you. Setbacks, resistance to change, bad timing.',
  },
  {
    id: 'major-11',
    name: 'Justice',
    number: 11,
    keywords: ['truth', 'fairness', 'consequence'],
    upright: 'The scales find their level. Truth, fairness, and cause meeting effect.',
    reversed: 'The scales tip crooked. Injustice, dishonesty, accountability evaded.',
  },
  {
    id: 'major-12',
    name: 'The Hanged Man',
    number: 12,
    keywords: ['surrender', 'perspective', 'pause'],
    upright: 'Stillness that reveals. Surrender, a new angle, a meaningful pause.',
    reversed: 'A pause that becomes a trap. Stalling, indecision, sacrifice for nothing.',
  },
  {
    id: 'major-13',
    name: 'Death',
    number: 13,
    keywords: ['endings', 'transformation', 'release'],
    upright: 'The ending that clears the way. Transformation, release, rebirth.',
    reversed: 'A hand that won’t let go. Resistance to change, stagnation, decay.',
  },
  {
    id: 'major-14',
    name: 'Temperance',
    number: 14,
    keywords: ['balance', 'moderation', 'patience'],
    upright: 'The alchemy of measure. Balance, moderation, patient blending.',
    reversed: 'The mixture spoiled. Excess, imbalance, a purpose out of tune.',
  },
  {
    id: 'major-15',
    name: 'The Devil',
    number: 15,
    keywords: ['bondage', 'temptation', 'shadow'],
    upright: 'Chains you could shed if you looked. Temptation, attachment, shadow.',
    reversed: 'The lock gives way. Breaking free, reclaiming power, releasing what binds.',
  },
  {
    id: 'major-16',
    name: 'The Tower',
    number: 16,
    keywords: ['upheaval', 'revelation', 'collapse'],
    upright: 'What was false comes down. Sudden upheaval, revelation, hard truth.',
    reversed: 'A collapse delayed, not denied. Averted disaster, fear of change.',
  },
  {
    id: 'major-17',
    name: 'The Star',
    number: 17,
    keywords: ['hope', 'renewal', 'faith'],
    upright: 'A light after the storm. Hope, renewal, and quiet inspiration.',
    reversed: 'The light dimmed by doubt. Despair, lost faith, disconnection.',
  },
  {
    id: 'major-18',
    name: 'The Moon',
    number: 18,
    keywords: ['illusion', 'dream', 'the unknown'],
    upright: 'Nothing is quite as it seems. Illusion, intuition, the unlit road.',
    reversed: 'The fog begins to lift. Confusion clearing, fear released, truth surfacing.',
  },
  {
    id: 'major-19',
    name: 'The Sun',
    number: 19,
    keywords: ['joy', 'success', 'vitality'],
    upright: 'Warmth on everything. Joy, success, clarity, and vitality.',
    reversed: 'A cloud across the noon. Temporary gloom, delay, dimmed optimism.',
  },
  {
    id: 'major-20',
    name: 'Judgement',
    number: 20,
    keywords: ['reckoning', 'awakening', 'absolution'],
    upright: 'The call you cannot un-hear. Reckoning, awakening, absolution.',
    reversed: 'The call refused. Self-doubt, harsh judgement, a summons ignored.',
  },
  {
    id: 'major-21',
    name: 'The World',
    number: 21,
    keywords: ['completion', 'wholeness', 'arrival'],
    upright: 'The circle closes. Completion, wholeness, fulfillment, arrival.',
    reversed: 'So close, yet unfinished. Loose ends, shortcuts, a delayed arrival.',
  },
]

interface MinorSpec {
  number: number
  name: string
  upright: string
  reversed: string
  keywords: string[]
}

const suitElement: Record<Suit, string> = {
  wands: 'fire',
  cups: 'water',
  swords: 'air',
  pentacles: 'earth',
}

const wands: MinorSpec[] = [
  { number: 1, name: 'Ace of Wands', keywords: ['spark', 'potential', 'inspiration'], upright: 'A first flame of inspiration. New passion, creative potential, a bold spark.', reversed: 'The spark sputters. Delays, wasted energy, a direction not yet found.' },
  { number: 2, name: 'Two of Wands', keywords: ['planning', 'choice', 'horizon'], upright: 'The world map in your hands. Planning, foresight, a decision to expand.', reversed: 'Playing it too safe. Fear of the unknown, a plan left on the shelf.' },
  { number: 3, name: 'Three of Wands', keywords: ['expansion', 'foresight', 'progress'], upright: 'Ships sent out to sea. Expansion, momentum, and long-range vision.', reversed: 'The horizon stalls. Delays, obstacles, plans that overreach.' },
  { number: 4, name: 'Four of Wands', keywords: ['celebration', 'home', 'harmony'], upright: 'A threshold worth crossing. Celebration, harmony, homecoming.', reversed: 'The party feels hollow. Transition, instability, support withdrawn.' },
  { number: 5, name: 'Five of Wands', keywords: ['conflict', 'competition', 'friction'], upright: 'Sparks in the arena. Competition, conflict, restless tension.', reversed: 'The fighting eases. Conflict avoided or resolved, inner strife.' },
  { number: 6, name: 'Six of Wands', keywords: ['victory', 'recognition', 'pride'], upright: 'The victor rides through. Recognition, success, public triumph.', reversed: 'A crown that slips. Fall from grace, ego, praise withheld.' },
  { number: 7, name: 'Seven of Wands', keywords: ['defense', 'grit', 'standing firm'], upright: 'Holding the high ground. Perseverance, defending what you built.', reversed: 'The ground gives way. Overwhelm, giving up, exhaustion.' },
  { number: 8, name: 'Eight of Wands', keywords: ['speed', 'movement', 'news'], upright: 'Arrows in swift flight. Rapid movement, momentum, sudden news.', reversed: 'Everything slows. Delays, frustration, energy misfired.' },
  { number: 9, name: 'Nine of Wands', keywords: ['resilience', 'persistence', 'the last mile'], upright: 'One more stand. Resilience, persistence, guarding hard-won ground.', reversed: 'Running on fumes. Exhaustion, paranoia, defenses too high.' },
  { number: 10, name: 'Ten of Wands', keywords: ['burden', 'duty', 'overload'], upright: 'The weight of all you carry. Burden, responsibility, near the finish.', reversed: 'Setting the load down. Release, delegation, or a collapse.' },
  { number: 11, name: 'Page of Wands', keywords: ['discovery', 'enthusiasm', 'spark'], upright: 'A messenger of fire. Curiosity, enthusiasm, the thrill of discovery.', reversed: 'Enthusiasm without aim. Hastiness, false starts, unwelcome news.' },
  { number: 12, name: 'Knight of Wands', keywords: ['adventure', 'action', 'impulse'], upright: 'Full gallop toward the goal. Action, adventure, fearless drive.', reversed: 'The charge overshoots. Recklessness, haste, scattered fire.' },
  { number: 13, name: 'Queen of Wands', keywords: ['confidence', 'warmth', 'magnetism'], upright: 'A flame others gather around. Confidence, warmth, magnetic resolve.', reversed: 'Warmth turned brittle. Insecurity, jealousy, a demanding streak.' },
  { number: 14, name: 'King of Wands', keywords: ['vision', 'leadership', 'boldness'], upright: 'A ruler of vision. Bold leadership, big-picture command.', reversed: 'Command turned rash. Impulsiveness, tyranny, overreach.' },
]

const cups: MinorSpec[] = [
  { number: 1, name: 'Ace of Cups', keywords: ['new love', 'emotion', 'flow'], upright: 'The heart’s cup overflows. New love, emotion, and open feeling.', reversed: 'A cup held back. Blocked emotion, emptiness, feeling repressed.' },
  { number: 2, name: 'Two of Cups', keywords: ['union', 'attraction', 'partnership'], upright: 'A vow between two. Connection, attraction, mutual partnership.', reversed: 'The bond wavers. Imbalance, tension, a parting of ways.' },
  { number: 3, name: 'Three of Cups', keywords: ['friendship', 'celebration', 'community'], upright: 'Cups raised together. Friendship, celebration, belonging.', reversed: 'The toast sours. Gossip, overindulgence, drifting apart.' },
  { number: 4, name: 'Four of Cups', keywords: ['apathy', 'contemplation', 'discontent'], upright: 'A gift unnoticed. Apathy, contemplation, quiet discontent.', reversed: 'Eyes open again. New awareness, acceptance, a chance seized.' },
  { number: 5, name: 'Five of Cups', keywords: ['loss', 'grief', 'regret'], upright: 'Mourning what spilled. Loss, grief, regret over the fallen cups.', reversed: 'Turning to what remains. Acceptance, forgiveness, moving on.' },
  { number: 6, name: 'Six of Cups', keywords: ['nostalgia', 'memory', 'innocence'], upright: 'A door to the past. Nostalgia, sweet memory, innocence.', reversed: 'Anchored in yesterday. Living in the past, unable to move forward.' },
  { number: 7, name: 'Seven of Cups', keywords: ['choices', 'illusion', 'fantasy'], upright: 'Cups full of dreams. Many choices, imagination, wishful thinking.', reversed: 'The fog clears. Clarity, a decision made, illusions dropped.' },
  { number: 8, name: 'Eight of Cups', keywords: ['withdrawal', 'seeking', 'departure'], upright: 'Walking from the shore. Withdrawal, seeking deeper meaning.', reversed: 'Drifting without aim. Fear of leaving, indecision, aimlessness.' },
  { number: 9, name: 'Nine of Cups', keywords: ['contentment', 'wish', 'satisfaction'], upright: 'The wish granted. Contentment, satisfaction, emotional fullness.', reversed: 'A wish that rings empty. Smugness, unmet longing, excess.' },
  { number: 10, name: 'Ten of Cups', keywords: ['harmony', 'joy', 'fulfillment'], upright: 'A rainbow over the home. Harmony, joy, lasting fulfillment.', reversed: 'The picture cracks. Disharmony, broken bonds, misalignment.' },
  { number: 11, name: 'Page of Cups', keywords: ['intuition', 'message', 'creativity'], upright: 'A gift from the deep. Intuition, gentle creativity, a heartfelt message.', reversed: 'Feeling out of reach. Emotional immaturity, blocked creativity.' },
  { number: 12, name: 'Knight of Cups', keywords: ['romance', 'charm', 'heart'], upright: 'A knight following the heart. Romance, charm, an offer of feeling.', reversed: 'Charm without substance. Moodiness, illusion, jealousy.' },
  { number: 13, name: 'Queen of Cups', keywords: ['compassion', 'calm', 'depth'], upright: 'Still water, deep feeling. Compassion, calm, emotional security.', reversed: 'Depth turned turbulent. Insecurity, dependence, self-sacrifice.' },
  { number: 14, name: 'King of Cups', keywords: ['balance', 'diplomacy', 'mastery'], upright: 'Master of the tide. Emotional balance, diplomacy, calm control.', reversed: 'The tide unruled. Volatility, manipulation, cold withdrawal.' },
]

const swords: MinorSpec[] = [
  { number: 1, name: 'Ace of Swords', keywords: ['clarity', 'truth', 'breakthrough'], upright: 'A blade of pure clarity. Truth, breakthrough, a decisive insight.', reversed: 'The edge dulled. Confusion, chaos, truth wielded harshly.' },
  { number: 2, name: 'Two of Swords', keywords: ['stalemate', 'choice', 'avoidance'], upright: 'Blindfolded at the crossroads. Stalemate, hard choice, avoidance.', reversed: 'The blindfold slips. Indecision breaking, overwhelm, truth faced.' },
  { number: 3, name: 'Three of Swords', keywords: ['heartbreak', 'sorrow', 'grief'], upright: 'Three blades, one heart. Heartbreak, sorrow, painful truth.', reversed: 'The blades withdrawn. Recovery, forgiveness, releasing the pain.' },
  { number: 4, name: 'Four of Swords', keywords: ['rest', 'recovery', 'stillness'], upright: 'A soldier’s needed rest. Recovery, contemplation, retreat.', reversed: 'Rest refused. Restlessness, burnout, stagnation.' },
  { number: 5, name: 'Five of Swords', keywords: ['discord', 'defeat', 'conflict'], upright: 'A hollow victory. Conflict, defeat, discord that costs.', reversed: 'Laying down arms. Reconciliation, amends, moving past conflict.' },
  { number: 6, name: 'Six of Swords', keywords: ['transition', 'passage', 'recovery'], upright: 'A crossing to calmer water. Transition, moving on, recovery.', reversed: 'The crossing stalls. Stuck, resistance, unfinished business.' },
  { number: 7, name: 'Seven of Swords', keywords: ['strategy', 'stealth', 'deception'], upright: 'A quiet exit with the spoils. Strategy, stealth, or deception.', reversed: 'The truth catches up. Confession, conscience, coming clean.' },
  { number: 8, name: 'Eight of Swords', keywords: ['restriction', 'trapped', 'fear'], upright: 'Bound by your own blindfold. Restriction, feeling trapped, fear.', reversed: 'The bindings loosen. Release, new perspective, freedom found.' },
  { number: 9, name: 'Nine of Swords', keywords: ['anxiety', 'dread', 'sleepless'], upright: 'The 3 a.m. of the soul. Anxiety, dread, nightmares, worry.', reversed: 'Dawn after the dread. Hope, recovery, worry released.' },
  { number: 10, name: 'Ten of Swords', keywords: ['ending', 'rock bottom', 'release'], upright: 'The final blade, the lowest point. Painful ending, betrayal.', reversed: 'The sun rises anyway. Recovery, regeneration, the worst behind you.' },
  { number: 11, name: 'Page of Swords', keywords: ['curiosity', 'vigilance', 'ideas'], upright: 'A restless, watchful mind. Curiosity, new ideas, vigilance.', reversed: 'Thoughts that scatter. Haste, gossip, all talk and no aim.' },
  { number: 12, name: 'Knight of Swords', keywords: ['ambition', 'drive', 'charge'], upright: 'Charging on pure conviction. Ambition, drive, fast decisive action.', reversed: 'The charge turns blind. Recklessness, aggression, burnout.' },
  { number: 13, name: 'Queen of Swords', keywords: ['clarity', 'independence', 'honesty'], upright: 'A clear, unclouded mind. Independence, honesty, sharp perception.', reversed: 'Clarity turned cold. Bitterness, harsh words, isolation.' },
  { number: 14, name: 'King of Swords', keywords: ['authority', 'reason', 'truth'], upright: 'Ruler of the intellect. Authority through truth, reason, fairness.', reversed: 'Reason weaponized. Manipulation, cold judgement, misused power.' },
]

const pentacles: MinorSpec[] = [
  { number: 1, name: 'Ace of Pentacles', keywords: ['opportunity', 'prosperity', 'seed'], upright: 'A seed of real prosperity. Opportunity, new venture, solid ground.', reversed: 'A seed that won’t take. Missed opportunity, scarcity, poor footing.' },
  { number: 2, name: 'Two of Pentacles', keywords: ['balance', 'juggling', 'adaptability'], upright: 'Keeping the coins in motion. Balance, adaptability, juggling demands.', reversed: 'A ball dropped. Overwhelm, disorganization, priorities askew.' },
  { number: 3, name: 'Three of Pentacles', keywords: ['teamwork', 'skill', 'craft'], upright: 'Craft shared becomes cathedral. Teamwork, skill, collaboration.', reversed: 'The build falters. Discord, poor work, effort misaligned.' },
  { number: 4, name: 'Four of Pentacles', keywords: ['security', 'holding', 'control'], upright: 'Coins held tight. Security, saving, a grip on what you have.', reversed: 'The grip becomes a cage. Greed, materialism, clinging.' },
  { number: 5, name: 'Five of Pentacles', keywords: ['hardship', 'lack', 'isolation'], upright: 'Out in the cold. Hardship, loss, insecurity, feeling left out.', reversed: 'Warmth found again. Recovery, aid arriving, hardship ending.' },
  { number: 6, name: 'Six of Pentacles', keywords: ['generosity', 'giving', 'balance'], upright: 'The scales of giving. Generosity, charity, fair exchange.', reversed: 'Gifts with strings. Inequality, debt, one-sided giving.' },
  { number: 7, name: 'Seven of Pentacles', keywords: ['patience', 'investment', 'harvest'], upright: 'Tending the slow harvest. Patience, long-term investment.', reversed: 'Watching a poor yield. Impatience, wasted effort, low return.' },
  { number: 8, name: 'Eight of Pentacles', keywords: ['mastery', 'diligence', 'craft'], upright: 'Repetition into mastery. Diligence, skill-building, dedication.', reversed: 'Going through the motions. Perfectionism, uninspired, corners cut.' },
  { number: 9, name: 'Nine of Pentacles', keywords: ['abundance', 'independence', 'luxury'], upright: 'The garden earned alone. Abundance, self-sufficiency, refinement.', reversed: 'Comfort with a cost. Overwork, dependence, hollow luxury.' },
  { number: 10, name: 'Ten of Pentacles', keywords: ['legacy', 'wealth', 'family'], upright: 'Wealth that outlives you. Legacy, lasting security, family.', reversed: 'The estate falters. Financial loss, instability, broken legacy.' },
  { number: 11, name: 'Page of Pentacles', keywords: ['ambition', 'study', 'opportunity'], upright: 'A student of the real. Ambition, study, a new opportunity.', reversed: 'Study stalls. Procrastination, distraction, promise unrealized.' },
  { number: 12, name: 'Knight of Pentacles', keywords: ['diligence', 'routine', 'reliability'], upright: 'The steady, dependable march. Diligence, routine, reliability.', reversed: 'Steady turns stuck. Boredom, stagnation, work left idle.' },
  { number: 13, name: 'Queen of Pentacles', keywords: ['nurture', 'practical', 'abundance'], upright: 'Provider of a warm hearth. Practical care, nurture, abundance.', reversed: 'Care spread too thin. Self-neglect, smothering, imbalance.' },
  { number: 14, name: 'King of Pentacles', keywords: ['wealth', 'security', 'leadership'], upright: 'Master of the material realm. Wealth, security, grounded leadership.', reversed: 'Fortune turned to appetite. Greed, stubbornness, obsession.' },
]

// Evocative one-line themes shown under each Major Arcana title, matching the
// painted-deck art direction.
const MAJOR_THEMES: Record<string, string> = {
  'major-00': 'New Beginnings',
  'major-01': 'Creation',
  'major-02': 'Intuition',
  'major-03': 'Abundance',
  'major-04': 'Authority',
  'major-05': 'Tradition',
  'major-06': 'Sacred Choice',
  'major-07': 'Willpower',
  'major-08': 'Inner Power',
  'major-09': 'Solitude',
  'major-10': 'Cycles',
  'major-11': 'Truth',
  'major-12': 'Surrender',
  'major-13': 'Transformation',
  'major-14': 'Balance',
  'major-15': 'Shadow',
  'major-16': 'Upheaval',
  'major-17': 'Hope',
  'major-18': 'Illusion',
  'major-19': 'Joy',
  'major-20': 'Awakening',
  'major-21': 'Completion',
}

// The three footer keywords per Major Arcana, tuned to the painted deck.
const MAJOR_KEYWORDS: Record<string, [string, string, string]> = {
  'major-00': ['trust', 'explore', 'align'],
  'major-01': ['will', 'skill', 'action'],
  'major-02': ['mystery', 'wisdom', 'inner knowing'],
  'major-03': ['nurture', 'create', 'bloom'],
  'major-04': ['structure', 'order', 'command'],
  'major-05': ['guidance', 'belief', 'wisdom'],
  'major-06': ['union', 'values', 'devotion'],
  'major-07': ['drive', 'focus', 'victory'],
  'major-08': ['courage', 'patience', 'grace'],
  'major-09': ['seek', 'reflect', 'guide'],
  'major-10': ['fate', 'turning', 'change'],
  'major-11': ['fairness', 'balance', 'karma'],
  'major-12': ['pause', 'release', 'see'],
  'major-13': ['release', 'renew', 'rise'],
  'major-14': ['blend', 'calm', 'heal'],
  'major-15': ['bondage', 'desire', 'release'],
  'major-16': ['break', 'reveal', 'rebuild'],
  'major-17': ['heal', 'trust', 'shine'],
  'major-18': ['dream', 'intuition', 'unveil'],
  'major-19': ['vitality', 'success', 'warmth'],
  'major-20': ['reckon', 'rise', 'absolve'],
  'major-21': ['wholeness', 'arrival', 'fulfill'],
}

// Single evocative theme word shown under each Minor Arcana title, matching
// the painted-deck art direction (Cups mirror the reference deck exactly).
const MINOR_THEMES: Record<string, string> = {
  'wands-01': 'Spark', 'wands-02': 'Planning', 'wands-03': 'Expansion', 'wands-04': 'Celebration',
  'wands-05': 'Conflict', 'wands-06': 'Victory', 'wands-07': 'Defense', 'wands-08': 'Momentum',
  'wands-09': 'Resilience', 'wands-10': 'Burden', 'wands-11': 'Discovery', 'wands-12': 'Adventure',
  'wands-13': 'Confidence', 'wands-14': 'Vision',
  'cups-01': 'New Love', 'cups-02': 'Union', 'cups-03': 'Friendship', 'cups-04': 'Apathy',
  'cups-05': 'Grief', 'cups-06': 'Nostalgia', 'cups-07': 'Illusion', 'cups-08': 'Departure',
  'cups-09': 'Satisfaction', 'cups-10': 'Fulfillment', 'cups-11': 'Curiosity', 'cups-12': 'Romance',
  'cups-13': 'Intuition', 'cups-14': 'Emotional Mastery',
  'swords-01': 'Clarity', 'swords-02': 'Stalemate', 'swords-03': 'Heartbreak', 'swords-04': 'Rest',
  'swords-05': 'Discord', 'swords-06': 'Passage', 'swords-07': 'Strategy', 'swords-08': 'Restriction',
  'swords-09': 'Anxiety', 'swords-10': 'Ending', 'swords-11': 'Vigilance', 'swords-12': 'Ambition',
  'swords-13': 'Independence', 'swords-14': 'Authority',
  'pentacles-01': 'Opportunity', 'pentacles-02': 'Balance', 'pentacles-03': 'Teamwork', 'pentacles-04': 'Security',
  'pentacles-05': 'Hardship', 'pentacles-06': 'Generosity', 'pentacles-07': 'Patience', 'pentacles-08': 'Mastery',
  'pentacles-09': 'Abundance', 'pentacles-10': 'Legacy', 'pentacles-11': 'Ambition', 'pentacles-12': 'Diligence',
  'pentacles-13': 'Nurture', 'pentacles-14': 'Prosperity',
}

// The three footer keywords per Minor Arcana (Cups mirror the reference deck).
const MINOR_KEYWORDS: Record<string, [string, string, string]> = {
  'wands-01': ['ignite', 'begin', 'dare'], 'wands-02': ['plan', 'choose', 'expand'],
  'wands-03': ['expand', 'foresee', 'advance'], 'wands-04': ['celebrate', 'rest', 'belong'],
  'wands-05': ['compete', 'clash', 'strive'], 'wands-06': ['win', 'shine', 'lead'],
  'wands-07': ['defend', 'stand', 'hold'], 'wands-08': ['move', 'rush', 'arrive'],
  'wands-09': ['endure', 'guard', 'persist'], 'wands-10': ['carry', 'strain', 'finish'],
  'wands-11': ['explore', 'spark', 'learn'], 'wands-12': ['charge', 'dare', 'act'],
  'wands-13': ['radiate', 'inspire', 'lead'], 'wands-14': ['envision', 'command', 'inspire'],
  'cups-01': ['open', 'feel', 'flow'], 'cups-02': ['bond', 'attract', 'share'],
  'cups-03': ['celebrate', 'gather', 'toast'], 'cups-04': ['pause', 'ponder', 'notice'],
  'cups-05': ['mourn', 'accept', 'release'], 'cups-06': ['remember', 'cherish', 'reconnect'],
  'cups-07': ['dream', 'imagine', 'choose'], 'cups-08': ['leave', 'seek', 'evolve'],
  'cups-09': ['enjoy', 'receive', 'appreciate'], 'cups-10': ['love', 'harmony', 'home'],
  'cups-11': ['feel', 'wonder', 'discover'], 'cups-12': ['offer', 'follow', 'express'],
  'cups-13': ['empathy', 'wisdom', 'flow'], 'cups-14': ['calm', 'guide', 'balance'],
  'swords-01': ['cut', 'see', 'decide'], 'swords-02': ['weigh', 'pause', 'choose'],
  'swords-03': ['grieve', 'feel', 'heal'], 'swords-04': ['rest', 'recover', 'renew'],
  'swords-05': ['clash', 'yield', 'learn'], 'swords-06': ['move', 'leave', 'heal'],
  'swords-07': ['plan', 'slip', 'scheme'], 'swords-08': ['release', 'see', 'free'],
  'swords-09': ['worry', 'face', 'release'], 'swords-10': ['end', 'release', 'rise'],
  'swords-11': ['watch', 'question', 'learn'], 'swords-12': ['charge', 'act', 'pursue'],
  'swords-13': ['discern', 'speak', 'stand'], 'swords-14': ['reason', 'judge', 'lead'],
  'pentacles-01': ['plant', 'build', 'ground'], 'pentacles-02': ['juggle', 'adapt', 'flow'],
  'pentacles-03': ['build', 'share', 'craft'], 'pentacles-04': ['hold', 'save', 'guard'],
  'pentacles-05': ['endure', 'seek', 'recover'], 'pentacles-06': ['give', 'share', 'balance'],
  'pentacles-07': ['tend', 'wait', 'harvest'], 'pentacles-08': ['practice', 'refine', 'perfect'],
  'pentacles-09': ['enjoy', 'thrive', 'refine'], 'pentacles-10': ['build', 'secure', 'endure'],
  'pentacles-11': ['study', 'dream', 'start'], 'pentacles-12': ['labor', 'persist', 'deliver'],
  'pentacles-13': ['provide', 'tend', 'ground'], 'pentacles-14': ['build', 'secure', 'lead'],
}

function buildMinor(suit: Suit, specs: MinorSpec[]): TarotCard[] {
  return specs.map((spec) => ({
    id: `${suit}-${String(spec.number).padStart(2, '0')}`,
    name: spec.name,
    arcana: 'minor',
    suit,
    number: spec.number,
    upright: spec.upright,
    reversed: spec.reversed,
    keywords: [...spec.keywords, suitElement[suit]],
  }))
}

/**
 * Returns a fresh, canonically ordered 78-card deck.
 * Always returns a new array of new objects so callers can safely
 * shuffle/mutate their own copy without affecting the source data.
 */
export function buildDeck(): TarotCard[] {
  const majors: TarotCard[] = majorArcana.map((c) => ({ ...c, arcana: 'major' }))
  const ordered = [
    ...majors,
    ...buildMinor('wands', wands),
    ...buildMinor('cups', cups),
    ...buildMinor('swords', swords),
    ...buildMinor('pentacles', pentacles),
  ]
  // Stamp each card with its layer number (1-78), core meaning, themed label,
  // painted-art reference, and (for Majors) reference-tuned keywords.
  return ordered.map((card, index) => ({
    ...card,
    layer: index + 1,
    essence: ESSENCES[card.id],
    theme: MAJOR_THEMES[card.id] ?? MINOR_THEMES[card.id],
    keywords: MAJOR_KEYWORDS[card.id] ?? MINOR_KEYWORDS[card.id] ?? card.keywords,
    imageRef: `/cards/${card.id}.png`,
  }))
}

export const DECK_SIZE = 78
