CREATE TABLE "chats" (
	"id" serial PRIMARY KEY NOT NULL,
	"chat_messages" json NOT NULL,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "frames" (
	"id" serial PRIMARY KEY NOT NULL,
	"frame_id" varchar(255) NOT NULL,
	"project_id" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" varchar(255) NOT NULL,
	"created_by" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "posts_table" CASCADE;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_created_by_users_table_email_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users_table"("email") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "frames" ADD CONSTRAINT "frames_project_id_projects_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("project_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_created_by_users_table_email_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users_table"("email") ON DELETE no action ON UPDATE no action;