export const PLACEMENT_VERSION = "english-2";
export const PLACEMENT_QUESTIONS = [
  { id: "a1-1", band: "A1", prompt: "My sister ___ a teacher.", options: ["are", "is", "am", "be"], answer: 1 },
  { id: "a1-2", band: "A1", prompt: "Choose the correct sentence.", options: ["He have two cats.", "He has two cats.", "He having two cats.", "He two cats has."], answer: 1 },
  { id: "a1-3", band: "A1", prompt: "Mia starts work at nine and finishes at five. When does she finish?", options: ["At nine", "At noon", "At five", "At eight"], answer: 2 },
  { id: "a2-1", band: "A2", prompt: "We ___ to Prague last weekend.", options: ["go", "gone", "went", "going"], answer: 2 },
  { id: "a2-2", band: "A2", prompt: "This bag is ___ than that one.", options: ["cheapest", "more cheap", "cheaper", "cheap"], answer: 2 },
  { id: "a2-3", band: "A2", prompt: "The shop closes at six on weekdays, but at four on Saturday. You arrive at five on Saturday. Is it open?", options: ["Yes, until six", "No, it closed at four", "Yes, until midnight", "The text does not say"], answer: 1 },
  { id: "b1-1", band: "B1", prompt: "I have lived here ___ 2020.", options: ["for", "during", "since", "from"], answer: 2 },
  { id: "b1-2", band: "B1", prompt: "If I had more time, I ___ another language.", options: ["will learn", "would learn", "learn", "have learned"], answer: 1 },
  { id: "b1-3", band: "B1", prompt: "Although the train was delayed, Eva arrived before the meeting started. Which statement is true?", options: ["Eva missed the meeting", "The train was on time", "Eva arrived in time for the meeting", "The meeting was cancelled"], answer: 2 },
  { id: "b2-1", band: "B2", prompt: "By the time we arrived, the presentation ___.", options: ["has started", "had already started", "starts", "will start"], answer: 1 },
  { id: "b2-2", band: "B2", prompt: "The proposal was rejected ___ its potential benefits.", options: ["although", "because", "despite", "whereas"], answer: 2 },
  { id: "b2-3", band: "B2", prompt: "A report says remote work can improve productivity, provided employees receive adequate support. What does the report imply?", options: ["Remote work always improves productivity", "Support is a condition for the potential improvement", "Support reduces productivity", "All employees must work remotely"], answer: 1 },
  { id: "a1-listen", band: "A1", skill: "listening", audio: "Hello. My name is Alex. I am from London.", prompt: "Where is Alex from?", options: ["Paris", "London", "Rome", "Berlin"], answer: 1 },
  { id: "a2-listen", band: "A2", skill: "listening", audio: "The bus usually leaves at eight, but today it leaves half an hour later.", prompt: "When does the bus leave today?", options: ["7:30", "8:00", "8:30", "9:00"], answer: 2 },
  { id: "b1-listen", band: "B1", skill: "listening", audio: "I was going to book a hotel near the station, but my friend offered me a room, so I stayed with her instead.", prompt: "Where did the speaker stay?", options: ["At a hotel", "At the station", "With a friend", "At home"], answer: 2 },
  { id: "b2-listen", band: "B2", skill: "listening", audio: "The new policy may reduce costs in the long run. However, the initial investment is substantial, and smaller businesses could struggle to afford it.", prompt: "What concern does the speaker express?", options: ["Costs will never fall", "Smaller businesses may struggle with the upfront expense", "Only large businesses can benefit", "No investment is necessary"], answer: 1 },
  { id: "c1-1", band: "C1", prompt: "Not until the audit was complete ___ the extent of the problem.", options: ["they understood", "did they understand", "they had understand", "understood they did"], answer: 1 },
  { id: "c1-2", band: "C1", prompt: "Had it not been for her intervention, the negotiations ___.", options: ["would collapse", "will have collapsed", "would have collapsed", "had collapsed"], answer: 2 },
  { id: "c1-3", band: "C1", prompt: "The study's findings are suggestive rather than conclusive: the sample was small, and several variables remained uncontrolled. What is the author's position?", options: ["The findings prove the hypothesis", "The findings offer tentative support but need further verification", "The findings have no possible value", "Sample size never affects conclusions"], answer: 1 },
  { id: "c1-listen", band: "C1", skill: "listening", audio: "While the committee ostensibly welcomed public consultation, its decision had effectively been made before any submissions were reviewed.", prompt: "What does the speaker imply?", options: ["Consultation determined the outcome", "The committee lacked a decision", "The consultation was largely a formality", "All submissions were accepted"], answer: 2 },
  { id: "c2-1", band: "C2", prompt: "Choose the sentence that expresses a concession followed by firm opposition.", options: ["Useful though the proposal may be, I cannot endorse it.", "Because the proposal is useful, I endorse it.", "Unless it is useful, I endorse it.", "I endorse it so that it becomes useful."], answer: 0 },
  { id: "c2-2", band: "C2", prompt: "His apology rang hollow. This means it sounded ___.", options: ["too quiet to hear", "insincere or unconvincing", "unexpectedly eloquent", "formally correct and sincere"], answer: 1 },
  { id: "c2-3", band: "C2", prompt: "The reviewer describes the argument as 'an elegant edifice erected on decidedly marshy ground'. What is the criticism?", options: ["The writing lacks any structure", "The argument is well presented but rests on unreliable assumptions", "The author discusses architecture literally", "The evidence is stronger than the presentation"], answer: 1 },
  { id: "c2-listen", band: "C2", skill: "listening", audio: "One could hardly accuse the board of undue haste. By the time it finally endorsed the reform, the circumstances that had made it necessary had all but disappeared.", prompt: "What attitude does the speaker convey?", options: ["Admiration for the board's speed", "Concern that reform was premature", "An ironic criticism of the board's delay", "Approval of rejecting the reform"], answer: 2 },
] as const;

export type AssessmentQuestion = { id: string; band: string; prompt: string; options: readonly string[]; answer: number; skill?: string; audio?: string };

export function scorePlacement(answers: unknown, questions: readonly AssessmentQuestion[] = PLACEMENT_QUESTIONS) {
  if (!Array.isArray(answers) || answers.length !== questions.length ||
    answers.some((answer, index) => !Number.isInteger(answer) || answer < 0 || answer >= questions[index].options.length)) {
    throw new Error("Answer every question");
  }
  const bands = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
  const bandScores = bands.map(band => questions.reduce((sum, q, index) => sum + Number(q.band === band && answers[index] === q.answer), 0));
  let recommendation = "Začiatočník / preveriť A1";
  for (let index = 0; index < bands.length; index++) {
    if (bandScores[index] < 3) break;
    recommendation = bands[index];
  }
  const skillScores = { grammar: 0, reading: 0, listening: 0 };
  questions.forEach((q,index) => {
    const skill = q.skill === "listening" ? "listening" : q.id.endsWith("-3") ? "reading" : "grammar";
    skillScores[skill] += Number(answers[index] === q.answer);
  });
  return { skillScores, score: bandScores.reduce((sum, value) => sum + value, 0), bandScores, recommendation };
}
