import {PGlite} from "@electric-sql/pglite";
import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
const db=new PGlite();
await db.exec(`
create role anon;create role authenticated;create role service_role;
create schema auth;create schema storage;
create function auth.uid() returns uuid language sql as $$select null::uuid$$;
create table profiles(id uuid primary key,role text,status text);
create function mundus_matching_role(role_name text) returns boolean language sql stable as $$select true$$;
create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
`);
await db.exec(readFileSync(new URL("../supabase/migrations/202610050005_teacher_public_profiles.sql",import.meta.url),"utf8"));
assert.equal((await db.query("select count(*)::int n from teacher_public_profiles")).rows[0].n,0);
const bucket=(await db.query("select public,file_size_limit from storage.buckets where id='teacher-public'")).rows[0];
assert.equal(bucket.public,true);assert.equal(Number(bucket.file_size_limit),5242880);
await db.close();
console.log("PASS: teacher public profile table and image bucket migration");
