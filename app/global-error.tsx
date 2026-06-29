"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: a crash in the root layout itself replaces the whole
 * document, so this renders its own <html>/<body> and cannot rely on the app's
 * CSS, fonts, or theme. Kept deliberately minimal and self-contained with
 * inline styles so it survives even a styling failure.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.25rem",
          padding: "1.5rem",
          textAlign: "center",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          color: "#1b2a2a",
          backgroundColor: "#f6f9f8",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            width: 72,
            height: 72,
            borderRadius: "9999px",
            backgroundColor: "#2f8a88",
            boxShadow: "0 10px 30px -12px rgba(47,138,136,0.6)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 420 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, margin: 0 }}>
            Echo hit an unexpected snag
          </h1>
          <p style={{ color: "#5b6b6a", margin: 0 }}>
            Something went wrong on our end. Reloading usually clears it — your progress is safe.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          style={{
            appearance: "none",
            border: "none",
            cursor: "pointer",
            borderRadius: "9999px",
            padding: "0.75rem 1.5rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#ffffff",
            backgroundColor: "#2f8a88",
          }}
        >
          Reload Echo
        </button>
      </body>
    </html>
  );
}
