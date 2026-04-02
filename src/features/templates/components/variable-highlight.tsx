"use client";

import { VARIABLE_REGEX } from "../constants";

type VariableHighlightProps = {
  content: string;
  className?: string;
};

/**
 * Affiche un texte avec les variables {{...}} en surbrillance orange.
 * Conserve les retours à la ligne.
 */
export function VariableHighlight({
  content,
  className,
}: VariableHighlightProps) {
  const parts = content.split(VARIABLE_REGEX);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        // Les index impairs correspondent aux captures (noms de variables)
        if (i % 2 === 1) {
          return (
            <span
              key={i}
              className="inline-flex rounded px-1 py-0.5 text-xs font-semibold"
              style={{
                backgroundColor: "#FEF3ED",
                color: "#C4621D",
                border: "1px solid #F5D5B8",
              }}
            >
              {`{{${part}}}`}
            </span>
          );
        }

        // Texte normal : on découpe par \n pour les retours à la ligne
        return part.split("\n").map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ));
      })}
    </span>
  );
}
