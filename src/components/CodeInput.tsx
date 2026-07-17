import { useRef, useState, useCallback, type ClipboardEvent, type KeyboardEvent } from "react";

interface Props {
  onChange: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export default function CodeInput({ onChange, disabled, error }: Props) {
  const [letters, setLetters] = useState(["", "", ""]);
  const [digits, setDigits] = useState(["", "", ""]);
  const letterRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  const syncUp = useCallback(
    (l: string[], d: string[]) => {
      if (l.every((v) => v !== "") && d.every((v) => v !== "")) {
        onChange(l.join("") + "-" + d.join(""));
      } else {
        onChange("");
      }
    },
    [onChange]
  );

  const handleLetter = (index: number, raw: string) => {
    const val = raw.toUpperCase().replace(/[^A-Z]/g, "").slice(-1);
    const next = [...letters];
    next[index] = val;
    setLetters(next);
    syncUp(next, digits);
    if (val) {
      if (index < 2) {
        letterRefs.current[index + 1]?.focus();
      } else {
        digitRefs.current[0]?.focus();
      }
    }
  };

  const handleDigit = (index: number, raw: string) => {
    const val = raw.replace(/[^0-9]/g, "").slice(-1);
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    syncUp(letters, next);
    if (val && index < 2) digitRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    section: "letter" | "digit",
    index: number
  ) => {
    if (e.key === "Backspace") {
      const isLetter = section === "letter";
      const arr = isLetter ? letters : digits;
      const setArr = isLetter ? setLetters : setDigits;
      const refs = isLetter ? letterRefs : digitRefs;

      if (arr[index] === "" && index > 0) {
        const prev = [...arr];
        prev[index - 1] = "";
        setArr(prev);
        syncUp(isLetter ? prev : letters, isLetter ? digits : prev);
        refs.current[index - 1]?.focus();
      } else {
        const prev = [...arr];
        prev[index] = "";
        setArr(prev);
        syncUp(isLetter ? prev : letters, isLetter ? digits : prev);
      }
      e.preventDefault();
    }

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const refs = section === "letter" ? letterRefs : digitRefs;
      if (index > 0) refs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const refs = section === "letter" ? letterRefs : digitRefs;
      if (index < 2) refs.current[index + 1]?.focus();
    }

    if (e.key === "-" && section === "letter" && letters.every((l) => l !== "")) {
      e.preventDefault();
      digitRefs.current[0]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (text.length >= 6) {
      const l = [text[0] || "", text[1] || "", text[2] || ""];
      const d = [text[3] || "", text[4] || "", text[5] || ""];
      setLetters(l);
      setDigits(d);
      syncUp(l, d);
      if (d[2]) digitRefs.current[2]?.focus();
      else if (d[1]) digitRefs.current[1]?.focus();
      else if (d[0]) digitRefs.current[0]?.focus();
      else letterRefs.current[2]?.focus();
    }
  };

  const boxClass = (filled: boolean, isErr: boolean) =>
    `w-10 h-12 text-center text-xl font-mono font-bold rounded-xl border-2 bg-secondary outline-none transition-all ${
      isErr
        ? "border-destructive"
        : filled
        ? "border-foreground"
        : "border-border focus:border-foreground"
    }`;

  return (
    <div className="flex items-center justify-center gap-1.5" onPaste={handlePaste}>
      {letters.map((val, i) => (
        <input
          key={`l${i}`}
          ref={(el) => { letterRefs.current[i] = el; }}
          type="text"
          inputMode="text"
          maxLength={1}
          value={val}
          disabled={disabled}
          onChange={(e) => handleLetter(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "letter", i)}
          className={boxClass(val !== "", !!error)}
        />
      ))}
      <span className="text-xl font-bold text-muted-foreground mx-0.5">-</span>
      {digits.map((val, i) => (
        <input
          key={`d${i}`}
          ref={(el) => { digitRefs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          disabled={disabled}
          onChange={(e) => handleDigit(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, "digit", i)}
          className={boxClass(val !== "", !!error)}
        />
      ))}
    </div>
  );
}
