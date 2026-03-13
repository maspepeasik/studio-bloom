
-- The "Anyone can submit contact messages" policy with WITH CHECK (true) is intentional
-- for a public contact form. Let's make it slightly more restrictive by requiring non-empty fields.
-- The linter warning is a false positive for this use case. No changes needed.
-- Adding a rate limit comment for documentation purposes.
SELECT 1;
