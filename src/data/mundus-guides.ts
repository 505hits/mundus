type Article = { course: string; sk: [string, string, [string, string][]]; en: [string, string, [string, string][]] };

export const guides: Record<string, Article> = {
  "english-speaking-b1": {
    "course": "english",
    "sk": [
      "Ako sa rozrozprávať po anglicky na úrovni B1",
      "Päť minút hovorenia denne, jednoduchý plán na týždeň a anglické frázy, ktoré pomôžu, keď sa pri rozprávaní zaseknete.",
      [
        [
          "Začnite jednou otázkou",
          "Vyberte si otázku, ktorú by vám niekto mohol položiť v bežnom rozhovore: What did you do last weekend? Dajte si 60 sekúnd a odpovedajte nahlas bez čítania. Stačia tri vety: čo ste robili, s kým a čo sa vám páčilo."
        ],
        [
          "Naučte sa udržať rozhovor",
          "Ak neviete presné slovo, skúste ho opísať: It’s a place where you can… Ak otázke nerozumiete, použite Could you say that again? Na konci pridajte jednu vlastnú otázku, napríklad How about you?"
        ],
        [
          "Skúste päť dní s jednou témou",
          "V pondelok sa nahrajte. V utorok opravte jednu chybu, ktorú počujete. V stredu povedzte tú istú odpoveď bez poznámok. Vo štvrtok pridajte doplňujúcu otázku. V piatok odpovedzte na podobnú otázku a porovnajte, kde sa ešte zasekávate."
        ]
      ]
    ],
    "en": [
      "How to speak English more confidently at B1",
      "A five-minute speaking routine, a simple weekly plan, and useful phrases for getting unstuck in a conversation.",
      [
        [
          "Start with a single question",
          "Pick a question someone might ask in a real conversation: What did you do last weekend? Give yourself 60 seconds and answer out loud without reading. Three sentences are enough: what you did, who you were with, and what you enjoyed."
        ],
        [
          "Keep the conversation going",
          "If a word escapes you, describe it: It’s a place where you can… If you miss the question, try Could you say that again? Finish with a question of your own, such as How about you?"
        ],
        [
          "Practise the same topic for five days",
          "Record yourself on Monday. On Tuesday, correct one mistake you hear. On Wednesday, give the same answer without notes. Add a follow-up question on Thursday. On Friday, answer a similar question and notice which parts still make you pause."
        ]
      ]
    ]
  },
  "restart-german": {
    "course": "german",
    "sk": [
      "Ako sa vrátiť k nemčine po rokoch",
      "Krátke cvičenie vám ukáže, čo si z nemčiny ešte pamätáte. Podľa výsledku si zostavíte plán na prvé dva týždne.",
      [
        [
          "Zistite, čo už viete použiť",
          "Bez slovníka odpovedzte na tri otázky: Wie heißen Sie? Wo wohnen Sie? Was haben Sie gestern gemacht? Ak prvé dve zvládnete a pri tretej sa zaseknete, začnite krátkymi rozhovormi v prítomnom čase a postupne pridajte minulosť."
        ],
        [
          "Rozlišujte porozumenie a hovorenie",
          "Prečítajte si krátky dialóg v kaviarni, potom ho zakryte a objednajte si vlastnými slovami. Skúste Ich hätte gern einen Kaffee, bitte a doplňte otázku Kann ich mit Karte zahlen? Zopakujte situáciu s iným nápojom alebo cenou."
        ],
        [
          "Rozdeľte si prvé dva týždne",
          "Prvý týždeň si zopakujte predstavovanie, čísla a bežné otázky. Druhý týždeň nacvičte jednu situáciu, ktorú skutočne využijete, napríklad príchod do hotela. Po každom cvičení si zapíšte jednu vetu, ktorú chcete nabudúce povedať bez pomoci."
        ]
      ]
    ],
    "en": [
      "How to get back into German after a long break",
      "Use a short German speaking check to find what you remember and build a realistic practice plan for your first two weeks.",
      [
        [
          "Find out what you can still say",
          "Without a dictionary, answer three questions: Wie heißen Sie? Wo wohnen Sie? Was haben Sie gestern gemacht? If the first two feel manageable and the third trips you up, start with short present-tense conversations and gradually bring in the past."
        ],
        [
          "Practise recall as well as comprehension",
          "Read a short café dialogue, cover it, and place an order in your own words. Try Ich hätte gern einen Kaffee, bitte, then ask Kann ich mit Karte zahlen? Repeat the exchange with a different drink or price."
        ],
        [
          "Plan your first two weeks",
          "Spend the first week revisiting introductions, numbers and everyday questions. In week two, practise a situation you will actually use, such as checking in at a hotel. After each practice, write down one sentence you want to say without help next time."
        ]
      ]
    ]
  }
};

export function findGuide(slug: string) {
  return Object.hasOwn(guides, slug) ? guides[slug] : undefined;
}
