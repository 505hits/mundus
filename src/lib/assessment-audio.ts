// Ignore callbacks from cancelled or replaced clips: only the current full clip counts.
export function createAssessmentAudioPlayer(
  synthesis: Pick<SpeechSynthesis, "cancel" | "getVoices" | "speak">,
  makeUtterance: (text: string) => SpeechSynthesisUtterance = (text) => new SpeechSynthesisUtterance(text),
) {
  let generation = 0;
  return {
    stop() {
      generation++;
      try { synthesis.cancel(); } catch { /* No callbacks may count after stopping. */ }
    },
    play(text: string, language: string, complete: () => void, failed: () => void) {
      const current = ++generation;
      try {
        synthesis.cancel();
        const utterance = makeUtterance(text);
        utterance.lang = language;
        const voices = synthesis.getVoices();
        const voice = voices.find((item) => item.lang === language)
          ?? voices.find((item) => item.lang.split("-")[0] === language.split("-")[0]);
        if (voice) utterance.voice = voice;
        utterance.rate = 0.9;
        utterance.onend = () => {
          if (current === generation) { generation++; complete(); }
        };
        utterance.onerror = (event) => {
          if (current !== generation) return;
          generation++;
          if (!["interrupted", "canceled"].includes(event.error)) failed();
        };
        synthesis.speak(utterance);
      } catch {
        if (current === generation) { generation++; failed(); }
      }
    },
  };
}
