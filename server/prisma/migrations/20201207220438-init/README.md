# Migration `20201207220438-init`

This migration has been generated at 12/7/2020, 5:04:38 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201125185150-init..20201207220438-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,7 +1,7 @@
 datasource db {
   provider = "sqlite" 
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -11,8 +11,9 @@
   id          Int      @id @default(autoincrement())
   createdAt   DateTime @default(now())
   description String
   url         String
+  category    String
   postedBy    User     @relation(fields: [postedById], references: [id])
   postedById  Int
   votes       Vote[]
 }
```


