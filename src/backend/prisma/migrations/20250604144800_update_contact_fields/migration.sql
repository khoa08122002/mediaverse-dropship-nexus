-- Drop the foreign key constraints first if any exist
-- ALTER TABLE "contacts" DROP CONSTRAINT IF EXISTS "contacts_status_fkey";
-- ALTER TABLE "contacts" DROP CONSTRAINT IF EXISTS "contacts_priority_fkey";

-- Modify the columns to use TEXT type
ALTER TABLE "contacts" ALTER COLUMN "status" TYPE TEXT;
ALTER TABLE "contacts" ALTER COLUMN "status" SET DEFAULT 'NEW';

-- Drop the priority column
ALTER TABLE "contacts" DROP COLUMN "priority";

-- Drop the enums
DROP TYPE IF EXISTS "ContactStatus";
DROP TYPE IF EXISTS "ContactPriority"; 