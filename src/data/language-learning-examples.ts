type LessonExample={heading:string;intro:string;steps:{title:string;description:string}[]};
type LocalizedExample={sk:LessonExample;en:LessonExample};

export const LANGUAGE_LEARNING_EXAMPLES:Record<string,LocalizedExample>={
 english:{
  sk:{heading:"Ako môže vyzerať vaša angličtina na prvých hodinách",intro:"Obsah sa vždy prispôsobí vašej úrovni a cieľu. Toto je príklad praktického postupu, nie pevný sylabus.",steps:[
   {title:"Zistíme, čo už viete",description:"Krátky rozhovor o práci, škole alebo cestovaní pomôže lektorovi spoznať vaše silné stránky aj miesta, kde sa pri hovorení zaseknete."},
   {title:"Trénujeme situácie z vášho života",description:"Vyskúšate napríklad rozhovor na pracovnom meetingu, objednanie v reštaurácii alebo vysvetlenie problému. Slovíčka aj gramatika majú konkrétny kontext."},
   {title:"Z chýb urobíme plán",description:"Počas hovorenia zbierame užitočné frázy a opakujúce sa chyby. Na ďalšej hodine nadviažeme tak, aby ste videli pokrok v tom, čo potrebujete."}
  ]},
  en:{heading:"What your first English lessons might look like",intro:"We adjust each lesson to your level and goals. This is an example of a practical approach, not a fixed syllabus.",steps:[
   {title:"Find out where you are now",description:"A short conversation about work, study or travel helps your teacher understand your strengths and what makes speaking difficult."},
   {title:"Practise situations that matter",description:"Role-play a work meeting, ordering a meal or explaining a problem. Vocabulary and grammar are learned in a useful context."},
   {title:"Turn mistakes into next steps",description:"Collect natural phrases and recurring errors while you speak. Use them to shape the next lesson around real progress."}
  ]}
 },
 german:{
  sk:{heading:"Nemčina online: od zapamätaných slov k použiteľným vetám",intro:"Nemčinu často poznáme zo školy, ale pri rozhovore nám chýbajú slová. Hodiny môžu tento rozdiel postupne zmenšiť.",steps:[
   {title:"Oživíme základy",description:"V krátkych dialógoch zistíme, čo si pamätáte z časovania slovies, slovosledu a bežných otázok."},
   {title:"Nacvičíme reálne rozhovory",description:"Podľa cieľa trénujete telefonát, pracovný pohovor, komunikáciu s kolegom alebo situáciu v nemecky hovoriacej krajine."},
   {title:"Upevníme najčastejšie frázy",description:"Jednoduché opakovanie a krátke domáce úlohy pomôžu previesť pasívnu slovnú zásobu do aktívneho hovorenia."}
  ]},
  en:{heading:"German online: turn remembered words into usable sentences",intro:"You may remember German from school but struggle to speak. Lessons can help bridge the gap at your own pace.",steps:[
   {title:"Refresh essential foundations",description:"Short dialogues reveal what you still remember about verbs, word order and everyday questions."},
   {title:"Practise real conversations",description:"Depending on your goal, rehearse a phone call, a job interview, a colleague conversation or life in a German-speaking country."},
   {title:"Build an active phrase bank",description:"Short, relevant practice and feedback help turn passive vocabulary into language you can actually use."}
  ]}
 },
 spanish:{
  sk:{heading:"Španielčina na situácie, ktoré naozaj zažijete",intro:"Začať môžete aj bez predchádzajúcich skúseností. Nejde len o tabuľky slovies, ale o schopnosť niečo povedať.",steps:[
   {title:"Predstavíte sa",description:"Naučíte sa pozdraviť, povedať niečo o sebe, pýtať sa jednoduché otázky a rozumieť bežným odpovediam."},
   {title:"Zvládnete malý rozhovor",description:"Skúsite objednávanie, cestovanie alebo príjemný rozhovor o koníčkoch. Lektor vám pomáha s výslovnosťou a prirodzenými vetami."},
   {title:"Budujete istotu",description:"Postupne predlžujete rozhovory a dopĺňate gramatiku presne tam, kde ju potrebujete pri používaní jazyka."}
  ]},
  en:{heading:"Spanish for conversations you might really have",intro:"You can start with no previous knowledge. The goal is not only to memorise verb tables, but to be able to say something useful.",steps:[
   {title:"Introduce yourself",description:"Learn greetings, basic information about yourself, simple questions and the most common replies."},
   {title:"Have a short conversation",description:"Practise ordering, travelling or talking about your interests, with help on pronunciation and natural expressions."},
   {title:"Grow your confidence",description:"Build longer exchanges gradually and learn grammar where it helps you communicate."}
  ]}
 },
 italian:{
  sk:{heading:"Taliančina na cestovanie, rodinu aj rozhovory",intro:"Ak vás baví talianska kultúra alebo sa potrebujete dohovoriť s blízkymi, lekcie môžu stavať práve na tom.",steps:[
   {title:"Začneme užitočnými vetami",description:"Pozdravy, predstavenie, rodina, jedlo a jednoduché otázky sú vhodné aj pre úplného začiatočníka."},
   {title:"Vyskúšame bežné situácie",description:"Môžete trénovať kaviareň, cestu vlakom, návštevu rodiny alebo krátky telefonát."},
   {title:"Ladíme prirodzené vyjadrovanie",description:"Lektor opraví najdôležitejšie chyby, vysvetlí výslovnosť a odporučí krátke aktivity medzi hodinami."}
  ]},
  en:{heading:"Italian for travel, family and everyday conversations",intro:"If you enjoy Italian culture or want to speak with family and friends, lessons can centre on those real needs.",steps:[
   {title:"Start with useful phrases",description:"Greetings, introductions, family, food and simple questions work well for complete beginners."},
   {title:"Practise everyday situations",description:"Try a café conversation, a train journey, a family visit or a quick phone call."},
   {title:"Sound more natural",description:"Your teacher can focus on key corrections, pronunciation and short practice between lessons."}
  ]}
 },
 french:{
  sk:{heading:"Francúzština s dôrazom na porozumenie a výslovnosť",intro:"Pri francúzštine je rozdiel medzi napísaným a hovoreným jazykom výrazný, preto môžu hodiny kombinovať počúvanie a aktívne rozprávanie.",steps:[
   {title:"Zorientujeme sa v úrovni",description:"Krátkymi vetami a počúvaním zistíme, ako dobre rozumiete každodenným otázkam a odpovediam."},
   {title:"Nacvičíme výslovnosť v kontexte",description:"Spojíme prirodzené frázy s praktickými situáciami, napríklad cestovanie, objednávanie alebo predstavenie sa."},
   {title:"Rozšírime rozhovor",description:"Postupne pridávame témy, slovnú zásobu a gramatiku, vďaka ktorým viete reagovať aj bez naučeného scenára."}
  ]},
  en:{heading:"French with practical listening and pronunciation",intro:"Written and spoken French can feel very different. Lessons can combine listening and active speaking from the beginning.",steps:[
   {title:"Check your starting point",description:"Use simple sentences and listening exercises to see how well you understand everyday questions and replies."},
   {title:"Practise pronunciation in context",description:"Connect natural expressions with practical situations such as travel, ordering or introducing yourself."},
   {title:"Build longer exchanges",description:"Gradually add topics, vocabulary and grammar so you can respond beyond memorised phrases."}
  ]}
 },
 "slovak-for-foreigners":{
  sk:{heading:"Slovenčina pre cudzincov do každodenného života",intro:"Ak žijete na Slovensku alebo chcete hovoriť s rodinou či kolegami, sústredíme sa na situácie, ktoré sa opakujú každý deň.",steps:[
   {title:"Základné otázky a odpovede",description:"Predstavenie, rodina, bývanie a jednoduché otázky vám pomôžu začať krátke rozhovory."},
   {title:"Praktický život na Slovensku",description:"Trénujeme obchod, reštauráciu, návštevu úradu či dohodnutie termínu podľa toho, čo práve potrebujete."},
   {title:"Viac istoty pri rozprávaní",description:"Gramatiku vysvetľujeme na konkrétnych vetách. Postupne prechádzame od pripravených dialógov k prirodzenej komunikácii."}
  ]},
  en:{heading:"Slovak for foreigners in everyday life",intro:"If you live in Slovakia or want to talk with family and colleagues, lessons can focus on situations you meet every day.",steps:[
   {title:"Essential questions and answers",description:"Introductions, family, housing and simple questions help you start short conversations."},
   {title:"Practical life in Slovakia",description:"Practise shops, restaurants, appointments or official paperwork, depending on what you actually need."},
   {title:"Speak with growing confidence",description:"Grammar is explained through usable sentences. Move from prepared dialogues toward natural conversations step by step."}
  ]}
 },
};

export function languageLearningExample(slug:string){return LANGUAGE_LEARNING_EXAMPLES[slug]??null;}
