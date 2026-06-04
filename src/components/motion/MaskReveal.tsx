import { ReactNode } from "react";

/** Split headline into mask-reveal lines (Mercedes editorial pattern) */
export function MaskLines({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const lines = text.split(". ").map((s, i, arr) =>
    i < arr.length - 1 ? `${s}.` : s
  );

  if (lines.length === 1 && !text.includes(".")) {
    return (
      <span className={`mb-line block overflow-hidden ${className}`}>
        <span className="mb-line-inner block">{text}</span>
      </span>
    );
  }

  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className={`mb-line block overflow-hidden ${className}`}>
          <span className="mb-line-inner block">{line}</span>
        </span>
      ))}
    </>
  );
}

/** Word-by-word mask for hero headlines */
export function MaskWords({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="mb-line inline-block overflow-hidden align-bottom">
          <span className={`mb-line-inner inline-block ${className}`}>{word}&nbsp;</span>
        </span>
      ))}
    </>
  );
}

export function IntroBlock({
  label,
  headline,
  body,
  align = "left",
}: {
  label: string;
  headline: string;
  body?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <div className="mb-line mb-6 overflow-hidden">
        <p className="mb-intro-label section-label">{label}</p>
      </div>
      <h2 className="headline-editorial text-balance">
        <MaskLines text={headline} />
      </h2>
      {body && (
        <p className="mb-intro-body body-large mt-8 max-w-[48ch] opacity-0">{body}</p>
      )}
    </div>
  );
}
