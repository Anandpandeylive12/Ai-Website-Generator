ALTER TABLE "chats" ADD COLUMN "frame_id" varchar(255);--> statement-breakpoint
ALTER TABLE "frames" ADD COLUMN "design_code" text;--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_frame_id_frames_frame_id_fk" FOREIGN KEY ("frame_id") REFERENCES "public"."frames"("frame_id") ON DELETE no action ON UPDATE no action;