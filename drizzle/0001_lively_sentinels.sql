ALTER TABLE "rsvps" ALTER COLUMN "status" SET DEFAULT 'confirmed';--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "email" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "rsvps" ADD COLUMN "ticket_count" integer DEFAULT 1 NOT NULL;