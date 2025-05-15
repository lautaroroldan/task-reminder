CREATE TABLE "tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"completed" boolean DEFAULT false,
	"start_date" timestamp DEFAULT now(),
	"end_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"recurring" boolean DEFAULT false,
	"notification" boolean DEFAULT false
);
