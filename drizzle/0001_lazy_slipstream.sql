CREATE TYPE "public"."writing_task" AS ENUM('task1', 'task2');--> statement-breakpoint
CREATE TABLE "listening_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"test_id" text NOT NULL,
	"answers" jsonb NOT NULL,
	"raw_score" integer NOT NULL,
	"total" integer NOT NULL,
	"band" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reading_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"test_id" text NOT NULL,
	"answers" jsonb NOT NULL,
	"raw_score" integer NOT NULL,
	"total" integer NOT NULL,
	"band" double precision NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "writing_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"task_response" double precision NOT NULL,
	"coherence_cohesion" double precision NOT NULL,
	"lexical_resource" double precision NOT NULL,
	"grammatical_range" double precision NOT NULL,
	"overall" double precision NOT NULL,
	"feedback" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "writing_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"task" "writing_task" NOT NULL,
	"prompt_id" text NOT NULL,
	"prompt" text NOT NULL,
	"response" text NOT NULL,
	"word_count" integer NOT NULL,
	"overall_band" double precision,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listening_attempts" ADD CONSTRAINT "listening_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reading_attempts" ADD CONSTRAINT "reading_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writing_scores" ADD CONSTRAINT "writing_scores_submission_id_writing_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."writing_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writing_submissions" ADD CONSTRAINT "writing_submissions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;