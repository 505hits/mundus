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
await db.exec(readFileSync(new URL("../supabase/migrations/202610050008_teacher_profile_visibility.sql",import.meta.url),"utf8"));
await db.exec(readFileSync(new URL("../supabase/migrations/202610050010_require_teacher_photo.sql",import.meta.url),"utf8"));
assert.equal((await db.query("select count(*)::int n from teacher_public_profiles")).rows[0].n,0);
await db.exec("insert into profiles values('00000000-0000-4000-8000-000000000001','teacher','active')");
await assert.rejects(db.query("insert into teacher_public_profiles(teacher_id,languages,website_visible) values('00000000-0000-4000-8000-000000000001',array['English'],true)"),/check constraint/);
await assert.rejects(db.query("insert into teacher_public_profiles(teacher_id,headline,bio,languages,website_visible) values('00000000-0000-4000-8000-000000000001','English teacher','Conversation and practical English lessons.',array['English'],true)"),/check constraint/);
await db.query("insert into teacher_public_profiles(teacher_id,headline,bio,languages,photo_path,website_visible) values('00000000-0000-4000-8000-000000000001','English teacher','Conversation and practical English lessons.',array['English'],'00000000-0000-4000-8000-000000000001/profile.jpg',true)");
const bucket=(await db.query("select public,file_size_limit from storage.buckets where id='teacher-public'")).rows[0];
assert.equal(bucket.public,true);assert.equal(Number(bucket.file_size_limit),5242880);
for(const file of ["teacher-nesrine.webp","teacher-veronika.webp","teacher-roland.webp","teacher-lenka.webp","teacher-tamara.webp","teacher-alisa.webp","teacher-jakub.webp","teacher-anar.webp"]){
 const photo=readFileSync(new URL("../public/images/mundus/"+file,import.meta.url));
 assert.ok(photo.length>3000,`Teacher photo ${file} must contain complete image data`);
 assert.equal(photo.toString("ascii",0,4),"RIFF");
 assert.equal(photo.toString("ascii",8,12),"WEBP");
}
await db.close();
console.log("PASS: teacher public profile requires complete content and photo before publishing");
