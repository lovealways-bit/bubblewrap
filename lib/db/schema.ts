import { boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

// ---- Better Auth tables (column names must stay camelCase) ----

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// ---- App tables (plain userId column, scoped per user in every query) ----

export const subscription = pgTable('subscription', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  tier: text('tier').notNull().default('free'),
  status: text('status').notNull().default('active'),
  stripeCustomerId: text('stripeCustomerId'),
  stripeSubscriptionId: text('stripeSubscriptionId'),
  stripePriceId: text('stripePriceId'),
  currentPeriodEnd: timestamp('currentPeriodEnd'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const savedReading = pgTable('saved_reading', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  spreadId: text('spreadId').notNull(),
  question: text('question'),
  deckTheme: text('deckTheme').notNull().default('classic'),
  cards: jsonb('cards').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const consent = pgTable('consent', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  dataPersonalization: boolean('dataPersonalization').notNull().default(false),
  dataAnalytics: boolean('dataAnalytics').notNull().default(false),
  marketingEmails: boolean('marketingEmails').notNull().default(false),
  acceptedTermsAt: timestamp('acceptedTermsAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const customizationProfile = pgTable('customization_profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  birthDate: text('birthDate'),
  birthTime: text('birthTime'),
  birthPlace: text('birthPlace'),
  sunSign: text('sunSign'),
  moonSign: text('moonSign'),
  risingSign: text('risingSign'),
  focusAreas: jsonb('focusAreas'),
  notes: text('notes'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const customDeck = pgTable('custom_deck', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  name: text('name').notNull(),
  stylePrompt: text('stylePrompt'),
  palette: jsonb('palette'),
  borderStyle: text('borderStyle'),
  coverImageUrl: text('coverImageUrl'),
  cardArt: jsonb('cardArt'),
  status: text('status').notNull().default('draft'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const journalEntry = pgTable('journal_entry', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  title: text('title'),
  body: text('body').notNull(),
  mood: text('mood'),
  // Snapshot of the sky the moment the entry was written, so reflections stay
  // anchored to their lunar context even as the moon moves on.
  moonPhase: text('moonPhase'),
  moonIllumination: integer('moonIllumination'),
  // Optional link to a saved reading this reflection responds to.
  readingId: text('readingId'),
  entryDate: text('entryDate').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const designFrame = pgTable('design_frame', {
  id: text('id').primaryKey(),
  deckTheme: text('deckTheme').notNull(),
  cardId: text('cardId').notNull(),
  cardName: text('cardName').notNull(),
  suit: text('suit'),
  expectedCount: integer('expectedCount'),
  countVerified: boolean('countVerified').notNull().default(false),
  imagePath: text('imagePath').notNull(),
  prompt: text('prompt'),
  source: text('source').notNull().default('generated'),
  status: text('status').notNull().default('active'),
  createdBy: text('createdBy'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})
