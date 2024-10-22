DO $$ BEGIN
 CREATE TYPE "public"."userRole" AS ENUM('ROOT', 'ADMIN', 'MODERATOR', 'USER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userProfile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"fullName" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "userTokens" (
	"jti" uuid PRIMARY KEY NOT NULL,
	"iat" integer NOT NULL,
	"exp" integer NOT NULL,
	"acc" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"userRole" "userRole" DEFAULT 'USER' NOT NULL,
	"password" varchar(255) DEFAULT '' NOT NULL,
	"passwordChangedAt" timestamp DEFAULT now() NOT NULL,
	"passwordResetToken" char(64),
	"passwordResetExpires" timestamp,
	"accountCreatedAt" timestamp DEFAULT now() NOT NULL,
	"accountUpdatedAt" timestamp DEFAULT now() NOT NULL,
	"accountFrozenAt" timestamp DEFAULT now(),
	"accountFrozen" boolean DEFAULT true NOT NULL,
	"accountActive" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userProfile" ADD CONSTRAINT "userProfile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userTokens" ADD CONSTRAINT "userTokens_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "emailIndex" ON "user" USING btree ("email");