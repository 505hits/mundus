export function portalEmail(kind:string,studentName:string,portalUrl:string){
  if(kind==="admin_assignment") return {
    subject:"Mundus: nový platený študent čaká na lektora",
    text:"Nový študent "+studentName+" má zaplatený balíček a čaká na priradenie lektora.\n\nSmart matching: "+portalUrl+"\n\nMundus Languages"
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
