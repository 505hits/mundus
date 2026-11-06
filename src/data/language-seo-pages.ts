export type LanguageSeoPage = {
  slug:string;
  value:string;
  sk:{
    name:string;
    seoTitle:string;
    description:string;
    hero:string;
    intro:string;
    goals:string[];
    focus:string[];
    faq:[string,string][];
  };
  en:{
    name:string;
    seoTitle:string;
    description:string;
    hero:string;
    intro:string;
    goals:string[];
    focus:string[];
    faq:[string,string][];
  };
};

export const LANGUAGE_SEO_PAGES:LanguageSeoPage[]=[
  {
    slug:"english",
    value:"English",
    sk:{
      name:"Angličtina",
      seoTitle:"Angličtina online – individuálne hodiny 1:1 | Mundus Languages",
      description:"Individuálne online hodiny angličtiny pre začiatočníkov aj pokročilých. Konverzácia, práca, cestovanie a flexibilné 45- alebo 60-minútové lekcie.",
      hero:"Angličtina online, ktorá sa prispôsobí vášmu cieľu",
      intro:"Či potrebujete angličtinu na cestovanie, do práce, na školu alebo sa chcete konečne rozrozprávať, hodiny nastavíme podľa vašej úrovne a praktických cieľov.",
      goals:["bežná konverzácia a sebavedomie pri hovorení","angličtina do práce, meetingov a e-mailov","cestovanie, letisko, hotel a každodenné situácie","gramatika a slovná zásoba presne tam, kde ich potrebujete"],
      focus:["A1–C1 podľa vašej aktuálnej úrovne","45 alebo 60 minút","flexibilné termíny","individuálne 1:1 online"],
      faq:[
        ["Je angličtina vhodná aj pre úplného začiatočníka?","Áno. Môžete začať úplne od základov. Tempo, slovná zásoba aj gramatika sa prispôsobia vašej úrovni."],
        ["Môžeme sa sústrediť hlavne na rozprávanie?","Áno. Ak je vaším cieľom konverzácia, lekcie môžu byť postavené hlavne na praktickom hovorení a situáciách, ktoré reálne využijete."],
        ["Je možné zamerať sa na pracovnú angličtinu?","Áno. Obsah môže zahŕňať meetingy, prezentácie, odbornú slovnú zásobu, e-maily aj komunikáciu so zákazníkmi alebo kolegami."]
      ]
    },
    en:{
      name:"English",
      seoTitle:"English lessons online – private 1:1 classes | Mundus Languages",
      description:"Private online English lessons for beginners and advanced learners. Conversation, work, travel and flexible 45- or 60-minute classes.",
      hero:"Online English lessons built around your goal",
      intro:"Whether you need English for travel, work, study or simply want to speak with more confidence, lessons are adapted to your current level and real-world goals.",
      goals:["everyday conversation and speaking confidence","English for work, meetings and emails","travel, airports, hotels and everyday situations","grammar and vocabulary where you actually need them"],
      focus:["A1–C1 depending on your level","45 or 60 minutes","flexible scheduling","private 1:1 online lessons"],
      faq:[
        ["Can I start as a complete beginner?","Yes. You can start from zero and build practical language step by step at a pace that suits you."],
        ["Can lessons focus mainly on speaking?","Yes. If conversation is your priority, lessons can focus heavily on practical speaking and situations you are likely to use."],
        ["Can you help with business English?","Yes. Lessons can cover meetings, presentations, professional vocabulary, emails and workplace communication."]
      ]
    }
  },
  {
    slug:"german",
    value:"German",
    sk:{
      name:"Nemčina",
      seoTitle:"Nemčina online – individuálne hodiny 1:1 | Mundus Languages",
      description:"Online hodiny nemčiny 1:1 pre začiatočníkov aj pokročilých. Praktická komunikácia, práca v nemecky hovoriacom prostredí a flexibilné termíny.",
      hero:"Nemčina online pre prácu, cestovanie aj bežný život",
      intro:"Nemčinu môžete začať od úplných základov alebo nadviazať na to, čo ste sa učili kedysi. Lekcie sú praktické a prispôsobené tomu, kde chcete jazyk používať.",
      goals:["základy pre úplných začiatočníkov","praktická komunikácia v práci a v zahraničí","konverzácia a porozumenie hovorenému jazyku","upevnenie gramatiky bez zbytočnej teórie"],
      focus:["A1–C1 podľa úrovne","45 alebo 60 minút","pracovná aj všeobecná nemčina","individuálne online hodiny"],
      faq:[
        ["Môžem začať odznova, ak som nemčinu zabudol?","Áno. Lektor nadviaže na to, čo si ešte pamätáte, a systematicky doplní chýbajúce základy."],
        ["Je možné zamerať sa na nemčinu do práce?","Áno. Lekcie môžu vychádzať z vašej profesie, pracovných situácií a slovnej zásoby, ktorú reálne používate."],
        ["Musím sa učiť veľa gramatiky?","Gramatika sa vysvetľuje najmä tam, kde vám pomôže lepšie hovoriť a rozumieť. Cieľom nie je memorovanie pravidiel bez kontextu."]
      ]
    },
    en:{
      name:"German",
      seoTitle:"German lessons online – private 1:1 classes | Mundus Languages",
      description:"Private online German lessons for beginners and advanced learners. Practical communication, workplace German and flexible scheduling.",
      hero:"Online German for work, travel and everyday life",
      intro:"Start German from the beginning or build on what you learned years ago. Lessons stay practical and are shaped around where you actually want to use the language.",
      goals:["foundations for complete beginners","practical workplace and everyday communication","conversation and listening confidence","grammar explained in useful context"],
      focus:["A1–C1 depending on level","45 or 60 minutes","general and workplace German","private online lessons"],
      faq:[
        ["Can I restart if I have forgotten most of my German?","Yes. Your teacher can identify what you still remember and rebuild the missing foundations without forcing you through everything again."],
        ["Can lessons focus on German for work?","Yes. Lessons can use your profession, workplace situations and relevant vocabulary as the main context."],
        ["Do I need to study a lot of grammar?","Grammar is taught where it helps you communicate more clearly, rather than as isolated theory."]
      ]
    }
  },
  {
    slug:"italian",
    value:"Italian",
    sk:{
      name:"Taliančina",
      seoTitle:"Taliančina online – individuálne hodiny 1:1 | Mundus Languages",
      description:"Individuálne online hodiny taliančiny. Konverzácia, cestovanie, bežná komunikácia aj návrat k zabudnutým základom s flexibilnými termínmi.",
      hero:"Taliančina online pre skutočnú komunikáciu",
      intro:"Taliančina je ideálna na praktické konverzačné hodiny. Môžete začať od nuly, oprášiť staršie základy alebo sa sústrediť na plynulejšie rozprávanie.",
      goals:["taliančina na cestovanie a dovolenku","bežná komunikácia s rodinou alebo priateľmi","obnovenie starších základov","výslovnosť, konverzácia a prirodzené frázy"],
      focus:["začiatočníci aj pokročilí","45 alebo 60 minút","praktická konverzácia","flexibilné online termíny"],
      faq:[
        ["Je možné začať taliančinu úplne od nuly?","Áno. Začnete s najpraktickejšou slovnou zásobou a vetami, ktoré môžete okamžite používať."],
        ["Učil som sa taliančinu dávno. Musím začať úplne od začiatku?","Nie nevyhnutne. Lektor zistí, čo si ešte pamätáte, a lekcie nastaví podľa vašich aktuálnych znalostí."],
        ["Môžeme vynechať zbytočne komplikovanú gramatiku?","Áno. Pri praktickom cieli sa gramatika vysvetľuje najmä v rozsahu potrebnom na správnu a prirodzenú komunikáciu."]
      ]
    },
    en:{
      name:"Italian",
      seoTitle:"Italian lessons online – private 1:1 classes | Mundus Languages",
      description:"Private online Italian lessons for conversation, travel and everyday communication, with flexible scheduling for beginners and returning learners.",
      hero:"Online Italian for real conversations",
      intro:"Italian works especially well for practical conversation-focused lessons. Start from zero, refresh old foundations or focus on speaking more naturally.",
      goals:["Italian for travel and holidays","everyday communication with family or friends","refreshing forgotten foundations","pronunciation, conversation and natural phrases"],
      focus:["beginners to advanced learners","45 or 60 minutes","practical conversation","flexible online scheduling"],
      faq:[
        ["Can I start Italian from zero?","Yes. You can begin with practical vocabulary and phrases that are useful immediately."],
        ["I studied Italian years ago. Do I need to restart completely?","Not necessarily. Your teacher can identify what you still remember and build from your current level."],
        ["Can lessons avoid unnecessary grammar theory?","Yes. If your goal is practical communication, grammar is taught mainly where it helps you speak correctly and naturally."]
      ]
    }
  },
  {
    slug:"spanish",
    value:"Spanish",
    sk:{
      name:"Španielčina",
      seoTitle:"Španielčina online – individuálne hodiny 1:1 | Mundus Languages",
      description:"Online hodiny španielčiny 1:1 pre začiatočníkov aj pokročilých. Cestovanie, konverzácia, výslovnosť a praktická komunikácia.",
      hero:"Španielčina online pre cestovanie aj každodennú konverzáciu",
      intro:"Ak chcete španielčinu najmä používať, nie iba študovať, hodiny môžu byť od začiatku postavené na praktických situáciách, výslovnosti a hovorení.",
      goals:["španielčina na cestovanie","základy pre úplných začiatočníkov","konverzácia a výslovnosť","praktická slovná zásoba do každodenných situácií"],
      focus:["A1–C1 podľa úrovne","45 alebo 60 minút","praktické hovorenie","individuálne online"],
      faq:[
        ["Je španielčina vhodná pre úplného začiatočníka?","Áno. Od prvých hodín sa môžete učiť jednoduché frázy a situácie, ktoré sa dajú okamžite použiť."],
        ["Môžeme sa pripraviť na konkrétnu cestu?","Áno. Lekcie môžu byť zamerané na letisko, hotel, reštauráciu, dopravu, orientáciu a situácie, ktoré vás čakajú."],
        ["Budeme riešiť aj výslovnosť?","Áno. Výslovnosť a porozumenie hovorenému jazyku sú prirodzenou súčasťou konverzačných hodín."]
      ]
    },
    en:{
      name:"Spanish",
      seoTitle:"Spanish lessons online – private 1:1 classes | Mundus Languages",
      description:"Private online Spanish lessons for beginners and advanced learners. Travel, conversation, pronunciation and practical communication.",
      hero:"Online Spanish for travel and everyday conversation",
      intro:"If your goal is to use Spanish rather than only study it, lessons can focus from day one on practical situations, pronunciation and speaking.",
      goals:["Spanish for travel","foundations for complete beginners","conversation and pronunciation","useful everyday vocabulary"],
      focus:["A1–C1 depending on level","45 or 60 minutes","practical speaking","private online lessons"],
      faq:[
        ["Is Spanish suitable for a complete beginner?","Yes. From your first lessons you can work with simple phrases and real situations that you can use immediately."],
        ["Can we prepare for a specific trip?","Yes. Lessons can focus on airports, hotels, restaurants, transport, directions and situations relevant to your trip."],
        ["Will we work on pronunciation too?","Yes. Pronunciation and understanding spoken Spanish are a natural part of conversation-focused lessons."]
      ]
    }
  },
  {
    slug:"french",
    value:"French",
    sk:{
      name:"Francúzština",
      seoTitle:"Francúzština online – individuálne hodiny 1:1 | Mundus Languages",
      description:"Individuálne online hodiny francúzštiny s flexibilnými termínmi. Výslovnosť, konverzácia, základy aj pokročilá komunikácia.",
      hero:"Francúzština online s dôrazom na porozumenie a hovorenie",
      intro:"Francúzština môže pôsobiť náročne najmä pri výslovnosti a porozumení. Individuálne hodiny vám umožnia venovať viac času presne tomu, čo potrebujete.",
      goals:["výslovnosť a porozumenie","základy pre začiatočníkov","konverzácia na cestovanie a bežný život","systematické zlepšovanie slovnej zásoby a gramatiky"],
      focus:["začiatočníci aj pokročilí","45 alebo 60 minút","individuálne tempo","online a flexibilne"],
      faq:[
        ["Je francúzština náročná pre úplného začiatočníka?","Začiatky sú zvládnuteľné, keď sa výslovnosť, slovná zásoba a základné vetné vzory učia postupne a v kontexte."],
        ["Môžeme sa sústrediť na výslovnosť?","Áno. Pri individuálnych hodinách môže lektor venovať viac času výslovnosti, počúvaniu a opravám vašich konkrétnych chýb."],
        ["Je možné kombinovať konverzáciu a gramatiku?","Áno. Gramatika sa dá prepájať s témami a konverzáciou tak, aby ste ju aktívne používali."]
      ]
    },
    en:{
      name:"French",
      seoTitle:"French lessons online – private 1:1 classes | Mundus Languages",
      description:"Private online French lessons with flexible scheduling. Pronunciation, conversation, beginner foundations and advanced communication.",
      hero:"Online French with a focus on understanding and speaking",
      intro:"French can feel challenging, especially pronunciation and listening. Private lessons give you more time to work on exactly the areas you need.",
      goals:["pronunciation and listening","foundations for beginners","conversation for travel and everyday life","systematic vocabulary and grammar development"],
      focus:["beginners to advanced learners","45 or 60 minutes","individual pace","flexible online lessons"],
      faq:[
        ["Is French difficult for a complete beginner?","The beginning is manageable when pronunciation, vocabulary and sentence patterns are introduced gradually and in context."],
        ["Can we focus specifically on pronunciation?","Yes. Private lessons allow your teacher to spend more time on pronunciation, listening and your individual errors."],
        ["Can conversation and grammar be combined?","Yes. Grammar can be connected directly to topics and conversation so that you actively use what you learn."]
      ]
    }
  },
  {
    slug:"slovak-for-foreigners",
    value:"Slovak",
    sk:{
      name:"Slovenčina pre cudzincov",
      seoTitle:"Slovenčina pre cudzincov online | Mundus Languages",
      description:"Online slovenčina pre cudzincov zameraná na bežnú komunikáciu, rodinu, život na Slovensku a praktické situácie. Individuálne 1:1 hodiny.",
      hero:"Slovenčina pre cudzincov – prakticky a bez zbytočnej teórie",
      intro:"Lekcie môžu byť zamerané najmä na každodennú komunikáciu na Slovensku: rodina, obchody, úrady, práca, lekár alebo bežné rozhovory. Gramatiku vysvetľujeme v rozsahu, ktorý pomáha hovoriť správne a zrozumiteľne.",
      goals:["komunikácia s rodinou a priateľmi","život a každodenné situácie na Slovensku","základná pracovná komunikácia","praktická gramatika a výslovnosť"],
      focus:["úplní začiatočníci aj pokročilí","45 alebo 60 minút","praktické situácie","individuálne online hodiny"],
      faq:[
        ["Je kurz vhodný aj pre partnera alebo partnerku zo zahraničia?","Áno. Hodiny môžu byť zamerané presne na bežnú komunikáciu s rodinou a každodenné situácie."],
        ["Musíme sa učiť veľa slovenskej gramatiky?","Nie. Pri praktickom cieli sa sústredíme najmä na gramatiku, ktorú človek potrebuje, aby sa vedel správne a prirodzene dohovoriť."],
        ["Môže začiatočník začať úplne od nuly?","Áno. Lekcie sa dajú začať od najzákladnejších fráz, výslovnosti a slovnej zásoby pre každodenný život."]
      ]
    },
    en:{
      name:"Slovak for foreigners",
      seoTitle:"Slovak lessons for foreigners online | Mundus Languages",
      description:"Private online Slovak lessons for foreigners focused on everyday communication, family, life in Slovakia and practical situations.",
      hero:"Practical Slovak for foreigners",
      intro:"Lessons can focus on everyday communication in Slovakia: family, shops, offices, work, doctors and ordinary conversations. Grammar is taught mainly where it helps you speak clearly and correctly.",
      goals:["communication with family and friends","everyday life in Slovakia","basic workplace communication","practical grammar and pronunciation"],
      focus:["complete beginners to advanced learners","45 or 60 minutes","real-life situations","private online lessons"],
      faq:[
        ["Is this suitable for a foreign partner or spouse?","Yes. Lessons can focus specifically on communication with family and everyday life in Slovakia."],
        ["Do I need to study a lot of Slovak grammar?","No. If your goal is practical communication, grammar is taught mainly where it helps you speak correctly and naturally."],
        ["Can a complete beginner start from zero?","Yes. Lessons can begin with the most useful phrases, pronunciation and vocabulary for everyday life."]
      ]
    }
  }
];

export function languageSeoPage(slug:string){
 return LANGUAGE_SEO_PAGES.find(page=>page.slug===slug);
}
