import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read=(p)=>readFileSync(new URL("../"+p,import.meta.url),"utf8");
const migration=read("supabase/migrations/202611060005_company_portal_and_group_requests.sql");
const dashboard=read("src/app/(company)/company/dashboard/page.tsx");
const employees=read("src/app/(company)/company/employees/page.tsx");
const companies=read("src/app/companies/page.tsx");
const groups=read("src/app/group-lessons/page.tsx");
const adminActions=read("src/app/(admin)/admin/companies/actions.ts");
const auth=read("src/lib/auth.ts");

for(const table of ["companies","company_members","company_employees","company_quote_requests"]) assert.ok(migration.includes("public."+table));
assert.ok(migration.includes("company_employee_overview"));
assert.ok(migration.includes("revoke all on public.company_employees from anon, authenticated"));
assert.ok(migration.includes("revoke all on public.company_members from anon, authenticated"));
assert.ok(migration.includes("p.role='company' and p.status='active'"));
assert.ok(!dashboard.includes("lesson_reports"),"company dashboard must not access private teacher reports");
assert.ok(!employees.includes("lesson_reports"),"company employee list must not access private teacher reports");
assert.ok(!dashboard.includes("placement_results"),"company dashboard must not access assessment results");
assert.ok(companies.includes("Request a quote") && companies.includes("Požiadať o cenovú ponuku"));
assert.ok(groups.includes("2–5") && groups.includes("/contact?type=group"));
assert.ok(adminActions.includes('role:"company"') && adminActions.includes("company_employees"));
assert.ok(auth.includes('"company"'));
console.log("PASS: company portal privacy, quote requests and group lesson offer");
