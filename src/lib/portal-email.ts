export function portalEmail(kind:string,studentName:string,portalUrl:string){
  if(kind==="admin_assignment") return {
    subject:"Mundus: nová online platba – študent čaká na lektora",
    text:"Online platba bola potvrdená. Študent "+studentName+" má zaplatený balíček a čaká na priradenie lektora.\n\nSmart matching: "+portalUrl+"\n\nMundus Languages"
  };
  if(kind==="admin_matching_ready") return {
    subject:"Mundus: študent je pripravený na matching",
    text:"Študent "+studentName+" dokončil onboarding po platbe. Matching údaje sú pripravené na kontrolu a schválenie lektora.\n\nOdporúčania: "+portalUrl+"\n\nMundus Languages"
  };
  if(kind==="admin_renewal") return {
    subject:"Mundus: študentovi zostávajú posledné hodiny",
    text:"Študentovi "+studentName+" zostávajú posledné hodiny. Skontrolujte pokračovanie a prípadný follow-up.\n\nPrehľad: "+portalUrl+"\n\nMundus Languages"
  };
  return {
    subject:"Mundus: zostáva vám posledná hodina",
    text:"Dobrý deň, "+studentName+". Z vášho 5-hodinového balíčka vám zostáva posledná hodina. Ak chcete pokračovať bez prestávky, ďalší balíček si môžete vybrať v portáli.\n\nBalíčky: "+portalUrl+"\n\nMundus Languages"
  };
}
