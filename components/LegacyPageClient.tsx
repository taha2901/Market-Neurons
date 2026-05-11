"use client";

import { useEffect, useMemo, useRef } from "react";

type LegacyPageClientProps = {
  styles: string;
  bodyHtml: string;
  scripts: string[];
};

export default function LegacyPageClient({
  styles,
  bodyHtml,
  scripts,
}: LegacyPageClientProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hasBodyHiddenOverflow = useMemo(
    () =>
      /body\s*\{[\s\S]*?overflow\s*:\s*hidden/i.test(styles) ||
      /body\s*\{[\s\S]*?height\s*:\s*100vh/i.test(styles),
    [styles],
  );

  useEffect(() => {
    const appendedScripts: HTMLScriptElement[] = [];

    scripts.forEach((scriptBody) => {
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.text = scriptBody;
      document.body.appendChild(script);
      appendedScripts.push(script);
    });

    // Legacy scripts often wait for `load`; in Next they mount after load.
    window.dispatchEvent(new Event("load"));

    return () => {
      appendedScripts.forEach((script) => script.remove());
    };
  }, [scripts]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div
        ref={rootRef}
        style={
          hasBodyHiddenOverflow
            ? {
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                overflow: "auto",
              }
            : undefined
        }
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </>
  );
}
