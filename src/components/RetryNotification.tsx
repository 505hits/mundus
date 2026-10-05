"use client";
import {useActionState} from "react";
import {retryNotification} from "@/app/retry-notification";
export default function RetryNotification({id}:{id:string}) {
 const [state,action,pending]=useActionState(retryNotification,{});
 return <form action={action}><input type="hidden" name="job_id" value={id}/><button disabled={pending||!!state.success} className="mt-2 rounded-lg border px-3 py-2 text-sm font-semibold text-[#2F3AA2] disabled:opacity-50">{pending?"Zaraďujem…":"Zaradiť znova do fronty"}</button>{state.error&&<p role="alert" className="mt-2 text-sm text-red-700">{state.error}</p>}{state.success&&<p role="status" className="mt-2 text-sm text-[#2F3AA2]">{state.success}</p>}</form>;
}
