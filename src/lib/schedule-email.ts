export function scheduleEmail(event:string,preferredAt:string,portalUrl:string) {
 const time=new Intl.DateTimeFormat("sk-SK",{dateStyle:"full",timeStyle:"short",timeZone:"Europe/Bratislava"}).format(new Date(preferredAt));
 const title=event==="pending"?"Nová žiadosť o zmenu termínu":event==="accepted"?"Zmena termínu bola prijatá":"Žiadosť o zmenu termínu bola zamietnutá";
 return {subject:`Mundus: ${title}`,text:`${title}.\n\nNavrhovaný termín: ${time} (čas Bratislava).\n${event==="pending"?"Pôvodný termín zostáva v platnosti do prijatia žiadosti.":event==="declined"?"Pôvodný termín zostáva v platnosti.":"Aktuálny termín si skontrolujte v portáli."}\n\nPodrobnosti: ${portalUrl}\n\nMundus Languages`};
}
