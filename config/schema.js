import { pgTable, serial, varchar, integer, text, timestamp, json } from 'drizzle-orm/pg-core';

// Define the users table
export const usersTable = pgTable('users_table', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  credits: integer('credits').default(2),
});

// Define the projects table
export const projectTable = pgTable('projects', {
  id: serial('id').primaryKey(),
  projectId: varchar('project_id', { length: 255 }).notNull(),
  createdBy: varchar('created_by', { length: 255 }).references(() => usersTable.email),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define the frames table
export const frameTable = pgTable('frames', {
  id: serial('id').primaryKey(),
  frameId: varchar('frame_id', { length: 255 }).notNull(),
  designCode:text('design_code'),
  projectId: varchar('project_id', { length: 255 }).references(() => projectTable.projectId),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define the chats table
export const chatTable = pgTable('chats', {
  id: serial('id').primaryKey(),
  chatMessages: json('chat_messages').notNull(),
  frameId: varchar('frame_id', { length: 255 }).references(() => frameTable.frameId),
  createdBy: varchar('created_by', { length: 255 }).references(() => usersTable.email),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
