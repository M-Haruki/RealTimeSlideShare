CREATE TABLE `log` (
	`uuid` text PRIMARY KEY NOT NULL,
	`ip` text NOT NULL,
	`action` text NOT NULL,
	`timestamp` integer DEFAULT 1747235588 NOT NULL,
	`presentation_id` text
);
--> statement-breakpoint
CREATE TABLE `presentations` (
	`presentation_id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`total_page` integer NOT NULL,
	`current_page` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT 1747235588 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slides` (
	`uuid` text PRIMARY KEY NOT NULL,
	`presentation_id` text NOT NULL,
	`page` integer NOT NULL,
	`content` blob NOT NULL
);
