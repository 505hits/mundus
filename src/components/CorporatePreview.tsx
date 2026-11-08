import { ArrowUpRight, CalendarDays, CheckCircle2, ClipboardList, Globe2, GraduationCap, ShieldCheck, Users } from "lucide-react";

export default function CorporatePreview({ sk }: { sk: boolean }) {
  const exampleRows = [
    { language: sk ? "Angličtina" : "English", type: sk ? "Konverzácie" : "Conversation", status: sk ? "V pláne" : "Planned" },
    { language: sk ? "Nemčina" : "German", type: sk ? "Pracovné situácie" : "Work scenarios", status: sk ? "V pláne" : "Planned" },
    { language: sk ? "Španielčina" : "Spanish", type: sk ? "Individuálne 1:1" : "Private 1:1", status: sk ? "V pláne" : "Planned" },
  ];
  return <div className="relative mx-auto max-w-[570px] lg:ml-auto">
    <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[#8792EE]/25 blur-[60px]" />
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/20 bg-[#F7F8FF] p-4 shadow-[0_30px_100px_rgba(3,8,42,.28)] sm:rounded-[2rem] sm:p-6">
      <div className="flex items-start justify-between gap-3 border-b border-[#DDE2F1] pb-4">
        <div><p className="text-[11px] font-extrabold uppercase tracking-[.18em] text-[#5361AD]">Mundus for business</p><h3 className="mt-1 text-base font-bold text-[#171A2B] sm:text-xl">{sk ? "Prehľad firemného vzdelávania" : "Company learning overview"}</h3></div>
        <div className="flex items-center gap-1 rounded-full bg-[#E6E9FA] px-2.5 py-1.5 text-[10px] font-bold text-[#44529D]"><ClipboardList size={13}/>{sk ? "Ilustračná ukážka" : "Illustrative preview"}</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2.5">
        {[
          { Icon: Users, label: sk ? "Zamestnanci" : "Employees", value: "—" },
          { Icon: GraduationCap, label: sk ? "Hodiny" : "Lessons", value: "—" },
          { Icon: CalendarDays, label: sk ? "Najbližší termín" : "Next session", value: "—" },
        ].map(({Icon,label,value}) => <div key={label} className="min-w-0 rounded-xl border border-[#E4E6F1] bg-white p-2.5 sm:p-4"><Icon size={17} className="text-[#4652B6]"/><p className="mt-3 text-2xl font-semibold tracking-tight text-[#171A2B]">{value}</p><p className="mt-1 text-[10px] leading-4 text-[#6F7485] sm:text-xs">{label}</p></div>)}
      </div>
      <div className="mt-3 rounded-2xl border border-[#E4E6F1] bg-white p-3.5 sm:p-5">
        <div className="flex items-center justify-between gap-2"><p className="text-sm font-bold text-[#171A2B]">{sk ? "Ukážkové jazykové programy" : "Example language programs"}</p><Globe2 size={18} className="text-[#4652B6]"/></div>
        <div className="mt-3 space-y-2.5">{exampleRows.map((row,i) => <div key={row.language} className="flex items-center gap-3 rounded-xl bg-[#F7F8FC] px-3 py-2.5">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${i===0?"bg-[#E4E8FF] text-[#2F3AA2]":i===1?"bg-[#FBE8D9] text-[#80502F]":"bg-[#DCF0E5] text-[#246247]"}`}>{row.language.slice(0,2)}</span>
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold text-[#171A2B]">{row.language}</p><p className="truncate text-xs text-[#737A8D]">{row.type}</p></div>
          <span className="text-[10px] font-semibold text-[#5361AD]">{row.status}</span>
        </div>)}</div>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl bg-[#EAF4F0] px-3 py-3 text-xs leading-5 text-[#265344]"><ShieldCheck size={19} className="shrink-0"/>{sk ? "Manažér vidí len prehľad výučby, nie súkromné študijné údaje." : "Managers see learning activity, not private student information."}</div>
    </div>
    <div className="absolute -bottom-4 -right-2 hidden items-center gap-2 rounded-2xl bg-[#DDE8E5] px-4 py-3 text-xs font-semibold text-[#17473D] shadow-xl sm:flex"><CheckCircle2 size={16}/>{sk ? "Jednoduché pre HR" : "Simple for HR"}<ArrowUpRight size={14}/></div>
  </div>;
}
