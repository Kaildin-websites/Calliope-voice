CREATE TABLE `trial_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`created_at` integer NOT NULL,
	`name` text NOT NULL,
	`business` text NOT NULL,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`sector` text NOT NULL,
	`monthly_leads` text NOT NULL,
	`crm` text,
	`agent` text
);
