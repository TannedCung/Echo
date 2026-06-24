CREATE TYPE "public"."session_status" AS ENUM('in_progress', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."speaking_mode" AS ENUM('part1', 'part2', 'part3', 'full_mock');--> statement-breakpoint
CREATE TYPE "public"."turn_role" AS ENUM('examiner', 'candidate');--> statement-breakpoint
CREATE TABLE "question_bank" (
	"id" text PRIMARY KEY NOT NULL,
	"part" text NOT NULL,
	"topic" text NOT NULL,
	"prompt" text NOT NULL,
	"follow_ups" jsonb DEFAULT '[]'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_scores" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"fluency_coherence" double precision NOT NULL,
	"lexical_resource" double precision NOT NULL,
	"grammatical_range" double precision NOT NULL,
	"pronunciation" double precision NOT NULL,
	"overall" double precision NOT NULL,
	"feedback" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session_turns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"role" "turn_role" NOT NULL,
	"text" text NOT NULL,
	"audio_url" text,
	"order" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "speaking_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"mode" "speaking_mode" NOT NULL,
	"status" "session_status" DEFAULT 'in_progress' NOT NULL,
	"overall_band" double precision,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ended_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"name" text,
	"is_guest" integer DEFAULT 0 NOT NULL,
	"goal_band" double precision,
	"test_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session_scores" ADD CONSTRAINT "session_scores_session_id_speaking_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."speaking_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_turns" ADD CONSTRAINT "session_turns_session_id_speaking_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."speaking_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speaking_sessions" ADD CONSTRAINT "speaking_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;