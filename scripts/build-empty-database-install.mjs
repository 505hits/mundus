import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const firstMigrations = [
  "20260929_portal_admin_and_reports_rls.sql", "20260929_portal_update_hardening.sql",
  "20260929_schedule_and_package_guardrails.sql", "20260929_schedule_request_integrity.sql",
];
export function buildEmptyInstall() {
  const remaining = readdirSync(resolve(root, "supabase/migrations")).filter(name => name.endsWith(".sql") && !firstMigrations.includes(name)).sort();
  const files = ["supabase/bootstrap-empty.sql", ...[...firstMigrations, ...remaining].map(name => "supabase/migrations/" + name), "supabase/bootstrap-finalize.sql"];
  const sections = files.map(path => {
    const sql = readFileSync(resolve(root, path), "utf8").replace(/^begin;\r?$/gmi, "").replace(/^commit;\r?$/gmi, "");
    return `\n-- SOURCE: ${path}\n${sql}\n`;
  });
  return `-- MUNDUS: installation complete pour une base public VIDE uniquement.\n-- Tout executer en une fois dans Supabase SQL Editor.\n-- Aucun compte admin n'est attribue automatiquement. Aucun email/paiement n'est envoye.\n-- Une erreur annule l'ensemble de l'installation. Ne pas decouper ce fichier.\nbegin;\n${sections.join("\n")}\nnotify pgrst, 'reload schema';\ncommit;\nselect 'MUNDUS_INSTALL_OK' as installation;\n`;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv[2];
  if (!target) throw Error("Provide the output .sql file path");
  writeFileSync(resolve(target), buildEmptyInstall());
  console.log("Wrote tested-source Mundus installation bundle");
}
