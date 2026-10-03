import type { AssessmentQuestion } from "./placement";
type Row = readonly [string, readonly string[], number, string?];
function bank(rows: Row[]): readonly AssessmentQuestion[] {
  const bands = ["A1", "A2", "B1", "B2", "C1", "C2"];
  return rows.map(([prompt, options, answer, audio], index) => ({
    id: `${bands[Math.floor(index / 4)].toLowerCase()}-${index % 4 === 3 ? "listen" : index % 4 + 1}`,
    band: bands[Math.floor(index / 4)], prompt, options, answer,
    ...(audio ? { audio, skill: "listening" } : {}),
  }));
}
// European Portuguese; original approximate bank, pending teacher review.
export const PORTUGUESE_PLACEMENT = bank([
  [
    "Eu ___ de Lisboa.",
    [
      "és",
      "sou",
      "é",
      "são"
    ],
    1
  ],
  [
    "A Maria tem ___ carro azul.",
    [
      "uma",
      "umas",
      "um",
      "uns"
    ],
    2
  ],
  [
    "O João mora no Porto e trabalha numa escola. Onde mora?",
    [
      "Em Lisboa",
      "No Porto",
      "Em Faro",
      "Em Coimbra"
    ],
    1
  ],
  [
    "A que horas começa a aula?",
    [
      "Às oito",
      "Às nove",
      "Às dez",
      "Às onze"
    ],
    2,
    "Bom dia. A nossa aula de português começa às dez horas da manhã."
  ],
  [
    "Ontem nós ___ ao cinema.",
    [
      "vamos",
      "iremos",
      "fomos",
      "ir"
    ],
    2
  ],
  [
    "Esta mala é ___ do que aquela.",
    [
      "mais leve",
      "muito leve",
      "leve mais",
      "a mais leve de"
    ],
    0
  ],
  [
    "A loja abre de terça a sábado e fecha à segunda-feira. Quando está aberta?",
    [
      "Na segunda de manhã",
      "Só ao domingo",
      "Todas as segundas",
      "Na quarta à tarde"
    ],
    3
  ],
  [
    "Porque vai a Ana chegar mais tarde?",
    [
      "Está doente",
      "O autocarro está atrasado",
      "Perdeu as chaves",
      "Foi às compras"
    ],
    1,
    "Vou chegar vinte minutos mais tarde. O autocarro está atrasado. Espera por mim à porta do café."
  ],
  [
    "Quando era criança, eu ___ à praia todos os verões.",
    [
      "irei",
      "ia",
      "ir",
      "vamos"
    ],
    1
  ],
  [
    "Se tiver tempo amanhã, ___ a minha avó.",
    [
      "visitava",
      "visitaria",
      "visitar",
      "visitarei"
    ],
    3
  ],
  [
    "Apesar da chuva, a Rita saiu para caminhar. O que fez?",
    [
      "Ficou em casa",
      "Esperou pelo sol",
      "Caminhou mesmo com chuva",
      "Cancelou o passeio"
    ],
    2
  ],
  [
    "O que fará o falante antes de visitar o museu?",
    [
      "Encontrar o irmão",
      "Comprar um livro",
      "Voltar para casa",
      "Apanhar um táxi"
    ],
    0,
    "Antes de visitar o museu, vou encontrar o meu irmão junto à estação. Depois iremos juntos ver a exposição."
  ],
  [
    "Se tivesse mais tempo, ___ outra língua.",
    [
      "aprendo",
      "aprenderei",
      "aprenderia",
      "aprender"
    ],
    2
  ],
  [
    "Embora ele ___ cansado, continua a trabalhar.",
    [
      "está",
      "esteja",
      "estará",
      "estar"
    ],
    1
  ],
  [
    "O projeto poupará energia a longo prazo, mas exige um investimento inicial elevado. Qual é o obstáculo referido?",
    [
      "Nunca poupará energia",
      "O custo elevado no início",
      "Não precisa de financiamento",
      "Só funciona durante um dia"
    ],
    1
  ],
  [
    "Porque deve cada equipa adaptar a sua organização?",
    [
      "A empresa vai fechar",
      "Todos trabalharão menos",
      "Algumas tarefas exigem presença física",
      "Ninguém aceita trabalhar à distância"
    ],
    2,
    "O trabalho à distância permite maior flexibilidade. No entanto, certas tarefas exigem presença no escritório. Cada equipa terá de encontrar uma organização adequada."
  ],
  [
    "Se eu tivesse conhecido os riscos, não ___ o contrato.",
    [
      "assinarei",
      "assino",
      "teria assinado",
      "assinando"
    ],
    2
  ],
  [
    "A decisão ficou em suspenso. Isto significa que ___.",
    [
      "é definitiva",
      "ainda não foi tomada",
      "foi cancelada para sempre",
      "deixou de ser necessária"
    ],
    1
  ],
  [
    "A autora reconhece os avanços, mas questiona se os benefícios chegam de forma justa a todos. O que põe em causa?",
    [
      "A existência de qualquer avanço",
      "A distribuição equitativa dos benefícios",
      "A utilidade de estudar a sociedade",
      "A possibilidade de melhoria"
    ],
    1
  ],
  [
    "O que se sugere sobre a consulta pública?",
    [
      "Determinou inteiramente a decisão",
      "Foi cancelada",
      "Teve pouco efeito numa decisão já delineada",
      "Vai ocorrer no próximo mês"
    ],
    2,
    "A consulta foi apresentada como uma oportunidade para ouvir os cidadãos. Contudo, as linhas gerais da proposta já estavam definidas antes de chegarem as primeiras contribuições."
  ],
  [
    "Que frase exprime concordância acompanhada de reservas?",
    [
      "Concordo sem qualquer objeção.",
      "Aceito, não sem algumas reticências.",
      "Rejeito categoricamente a proposta.",
      "Ninguém me pediu opinião."
    ],
    1
  ],
  [
    "O elogio continha uma farpa. O que se entende?",
    [
      "Era inteiramente benevolente",
      "Incluía uma crítica subtil e mordaz",
      "Foi dito num tom inaudível",
      "Referia-se apenas a desporto"
    ],
    1
  ],
  [
    "O crítico descreve o ensaio como uma fachada elegante assente em alicerces frágeis. Qual é a crítica?",
    [
      "A apresentação é mais convincente do que os fundamentos",
      "Os argumentos são demasiado sólidos",
      "O texto descreve literalmente um prédio",
      "Todos os aspetos são aprovados"
    ],
    0
  ],
  [
    "Que atitude transmite o falante?",
    [
      "Admiração pela rapidez",
      "Receio de uma decisão precipitada",
      "Crítica irónica à demora",
      "Satisfação pela ausência de reforma"
    ],
    2,
    "Acusar a comissão de pressa excessiva seria, no mínimo, ousado. Quando finalmente aprovou a reforma, as circunstâncias que a tinham tornado necessária já tinham desaparecido."
  ]
]);
export const PORTUGUESE_PROGRESS = bank([
  [
    "Os meus amigos ___ em Coimbra.",
    [
      "mora",
      "moras",
      "moramos",
      "moram"
    ],
    3
  ],
  [
    "Tenho dois ___ pretos.",
    [
      "gato",
      "gatos",
      "gata",
      "gatinho"
    ],
    1
  ],
  [
    "A Inês tem um cão e três gatos. Quantos gatos tem?",
    [
      "Um",
      "Dois",
      "Três",
      "Nenhum"
    ],
    2
  ],
  [
    "Onde trabalha o Pedro?",
    [
      "Num hospital",
      "Num banco",
      "Numa escola",
      "Num restaurante"
    ],
    3,
    "Chamo-me Pedro. Sou cozinheiro e trabalho num restaurante perto de casa."
  ],
  [
    "No sábado passado, ela ___ a avó.",
    [
      "visita amanhã",
      "visitará",
      "visitou",
      "visitar"
    ],
    2
  ],
  [
    "Hoje está ___ frio do que ontem.",
    [
      "mais",
      "muito",
      "muitos",
      "o mais de"
    ],
    0
  ],
  [
    "A entrada custa doze euros na internet e quinze na bilheteira. Onde é mais barata?",
    [
      "Na bilheteira",
      "Na internet",
      "O preço é igual",
      "Só de manhã"
    ],
    1
  ],
  [
    "Quando é preciso levar um casaco?",
    [
      "Esta noite",
      "Na próxima semana",
      "Amanhã",
      "No verão"
    ],
    2,
    "Leva um casaco amanhã. De manhã vai estar calor, mas a temperatura vai descer bastante ao fim do dia."
  ],
  [
    "Este quadro ___ por uma artista local.",
    [
      "pintou",
      "foi pintado",
      "pintando",
      "foi pintar"
    ],
    1
  ],
  [
    "É importante que nós ___ a horas.",
    [
      "chegamos",
      "chegar",
      "cheguemos",
      "chegaremos chegando"
    ],
    2
  ],
  [
    "A Lara costuma ir de bicicleta para o trabalho. Hoje vai de autocarro porque chove. Porque não usa a bicicleta?",
    [
      "Está avariada",
      "Vendeu-a",
      "Está a chover",
      "Não sabe andar"
    ],
    2
  ],
  [
    "Porque mudou o dia da reunião?",
    [
      "A sala já estava reservada",
      "O diretor estava doente",
      "Ninguém queria participar",
      "O edifício estava fechado"
    ],
    0,
    "A reunião estava marcada para terça-feira. Como a sala já estava reservada, passámos a reunião para quarta-feira."
  ],
  [
    "Ter-te-ia ajudado se me ___ pedido.",
    [
      "tens",
      "terás",
      "tivesses",
      "ter"
    ],
    2
  ],
  [
    "Ainda que ela ___ muito ocupada, responde às mensagens.",
    [
      "está",
      "esteja",
      "estará",
      "estar"
    ],
    1
  ],
  [
    "O serviço é cómodo; porém, alguns utilizadores receiam o uso indevido dos seus dados. Qual é o contraste?",
    [
      "Comodidade e preocupações com a privacidade",
      "Preço e velocidade",
      "Horário e distância",
      "Qualidade e variedade"
    ],
    0
  ],
  [
    "Porque será a oficina realizada novamente?",
    [
      "Era obrigatória",
      "As opiniões dos participantes foram positivas",
      "Era gratuita",
      "Todas as vagas foram preenchidas"
    ],
    1,
    "Vieram menos pessoas do que esperávamos. Em contrapartida, os participantes deram opiniões muito positivas. Vamos repetir a oficina, melhorando a divulgação."
  ],
  [
    "Que frase indica um facto anterior a um pensamento passado?",
    [
      "Pensei que ela já tinha telefonado.",
      "Penso que ela telefonará amanhã.",
      "Telefonarei quando tiver tempo.",
      "Ela está a telefonar agora."
    ],
    0
  ],
  [
    "Dar um resultado por adquirido significa ___.",
    [
      "rejeitá-lo de imediato",
      "considerá-lo garantido sem o verificar",
      "escrevê-lo numa folha",
      "calculá-lo rigorosamente"
    ],
    1
  ],
  [
    "O estudo fornece indícios, não provas definitivas: uma amostra tão pequena não permite generalizar. Que postura recomenda?",
    [
      "Certeza absoluta",
      "Prudência na interpretação",
      "Rejeição de toda a investigação",
      "Indiferença perante os dados"
    ],
    1
  ],
  [
    "Que grupo não está abrangido pela garantia explícita?",
    [
      "Trabalhadores com contrato sem termo",
      "A direção",
      "Prestadores de serviços externos",
      "Todos os trabalhadores"
    ],
    2,
    "A garantia de que nenhum posto seria eliminado referia-se expressamente aos trabalhadores com contrato sem termo. A situação dos prestadores de serviços externos continuava por esclarecer."
  ],
  [
    "Que frase sugere que um fracasso foi evitado por pouco?",
    [
      "O projeto falhou antes de começar.",
      "Não fosse a intervenção dela, o projeto teria fracassado.",
      "O sucesso estava garantido desde o início.",
      "Ninguém interveio no projeto."
    ],
    1
  ],
  [
    "A promessa ficou em letra morta. O que significa?",
    [
      "Foi cumprida antecipadamente",
      "Não teve aplicação concreta",
      "Foi dita em voz baixa",
      "Foi escrita à mão"
    ],
    1
  ],
  [
    "O comentário chama à reforma um triunfo da encenação sobre a substância. O que questiona?",
    [
      "Se os resultados justificam uma apresentação tão enfática",
      "Se houve apresentação pública",
      "Se a reforma tem uma imagem pública",
      "Se a imprensa a discutiu"
    ],
    0
  ],
  [
    "Como é avaliada a resposta?",
    [
      "Como exemplo de tato",
      "Como demasiado curta para avaliar",
      "Como gesto que resolveu o conflito",
      "Como intervenção desastrada que agravou as relações"
    ],
    3,
    "Considerar diplomática aquela resposta exigiria uma boa dose de benevolência. Em poucas frases, conseguiu pôr contra si tanto os críticos como quem ainda estava disposto a apoiá-la."
  ]
]);
