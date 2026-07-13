---
title: Migrating data with prisma migrate
date: 2021-11-28
canonicalUrl: https://tlundberg.com/blog/2021-11-28-migrating-data-with-prisma-migrate/
cover: /assets/prisma-andrey-novik-unsplash.jpg
coverAlt: Cover image for the post. Glass prisma set on a table. Photo taken by Andrey Novik.
---

`prisma migrate` is mainly used for schema migrations, and it's great for doing that. But sometimes you also need or want to migrate your data along with your schema. Turns out prisma migrate can do that as well!

I'm using RedwoodJS, and Redwood has [its own data migration solution](https://redwoodjs.com/docs/data-migrations). But I wanted to do it all with prisma for various reasons. You should decide for your particular scenario what works best for you.

Prisma migrations are just standard .sql files, so if you can express your data migration as one or more sql statements you're good to go.

As I said, I'm using RedwoodJS, so first I edit my `api/db/schema.prisma` file to do my schema migration. In this case I have a "Products" model with a soft/implicit self-reference. I wanted to make that a proper Prisma one-to-many relation. The self-reference is used to model product variations. Like you have a main "Product" that's a shirt. Then you have variants for the different colors of the shirt. So you could have three variants for "red", "green" and "blue" shirts.

This is the diff for my `schema.prisma`-file

```diff
diff --git a/api/db/schema.prisma b/api/db/schema.prisma
index d29fc77..40ffc59 100644
--- a/api/db/schema.prisma
+++ b/api/db/schema.prisma
@@ -45,6 +45,9 @@ model Product {
   stock               Int                 @default(0)
   images              String?
   parent_v_p_id       Int?
+  parentId            String?             @db.Uuid
+  parentProduct       Product?            @relation("ParentProduct", fields: [parentId], references: [id])
+  variants            Product[]           @relation("ParentProduct")
   ean                 String?
   attrib1name         String?
   attrib1val          String?
```

Next up I run `yarn rw prisma migrate dev --create-only`. The key here is the `--create-only` flag. It creates a .sql file with the migration instruction in it, but doesn't actually apply it. This gives us a chance to modify the SQL statements the migration will run.

This is what the generated file looks like

```sql
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "parentId" UUID;

-- AddForeignKey
ALTER TABLE "Product" ADD FOREIGN KEY ("parentId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
```

As you can see the Prisma relation is made up of three fields, but only one is actually created in the database. The `parentId` field in this case. I'm using the database-native datatype `UUID` here to match with the data type of my `id` field.

I mentioned I had a soft or implicit self-reference for product variants. Half of it is the `parent_v_p_id` field you can see in the diff output above. The other half is a `variable_product_id` field. I call products that have different variants for "variable" products. (And products without variants for "simple" products.) Now however I decided to just use the `id` that all products have as the relationship reference. No need for a specific field when I already have a perfectly good id to use.

Now that we know what we want to do, let's write the SQL for it.

I'm not great at SQL, but I do know the basics, so after a few minutes on Google I came up with this statement*

```sql
UPDATE "Product"
SET "parentId" = p.id
FROM (
  SELECT id,
         variable_product_id AS v_p_id
  FROM "Product"
) AS p
WHERE parent_v_p_id IS NOT NULL
  AND p.v_p_id = parent_v_p_id;
```

(* Not really true. I came up with something similar, but had to do some additional tweaks to arrive at what you see above)

Modifying the DB, and especially editing the data in it, is scary. So I wanted a way to test my SQL before making it part of the migration. This is where I turned to my db admin tool of choice, DBeaver. I'm sure TablePlus or something like that would work great as well. Just need a way to run custom SQL statements. The trick I used to be able to test my code was to wrap it in a transaction that I always roll back at the end. That way I can iterate on the sql without doing any permanent changes to the database.

```sql
BEGIN;

-- [migration statements]...

ROLLBACK;
```

I did have to make a few tweaks to my original SQL. When the entire transaction completed without errors I was ready to try it on my test database. So I just copied the statements between the `BEGIN;` and `ROLLBACK;` lines and replaced all the content of my migration .sql file with the copied code.

```sql
-- 20211128123650_parentproduct_relation/migration.sql

-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "parentId" UUID;

-- AddForeignKey
ALTER TABLE "Product"
ADD FOREIGN KEY ("parentId")
  REFERENCES "Product"("id")
  ON DELETE SET NULL
  ON UPDATE CASCADE;

UPDATE "Product"
SET "parentId" = p.id
FROM (
  SELECT id,
         variable_product_id AS v_p_id
  FROM "Product"
) AS p
WHERE parent_v_p_id IS NOT NULL
  AND p.v_p_id = parent_v_p_id;
```

One final precaution to take (depending on how much you care about your test database) is to dump your database to a file. I usually do that with this command

```bash
pg_dump \
  --username=username \
  --password \
  --format=plain \
  --inserts \
  --no-owner \
  --no-privileges \
  db_name > db_name_dump_$(date +"%Y%m%dT%H%M%S").sql
```

It results in a big file that's slow to restore. But it's also a file that's easy read (and understand) and that will work across different versions of PostgreSQL and maybe even between different DB engines. I think it's worth the tradeoffs for when working with my test db. For backing up your prod db you might want to use something else. But now we're off on a tangent. Let's get back to data migrations... 

With the migration script updated it's time to apply it. Running `yarn rw prisma migrate dev` again, but without any extra flags this time, will apply the migration to your test database. 

After running that it's obviously a good idea to verify that everything looks alright in the database. Again DBeaver (or TablePlus etc) comes in handy. Finally you should spin up your app to make sure it runs as expected. Hopefully the db survived the migration and your data (and schema) is properly migrated.

That's it 🙂 Thanks for reading!

---

Cover photo by <a href="https://unsplash.com/@groove328?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Andrey Novik</a> on <a href="https://unsplash.com/s/photos/prisma?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
