"use client";

import { useEffect } from "react";

export default function VoiceflowAgent() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs";

    script.onload = () => {
      // @ts-expect-error: Assuming voiceflow is globally available
      // Initialize the Voiceflow chat widget with the provided configuration
      window.voiceflow?.chat?.load?.({
        verify: { projectID: "6853b95094f6d5480faec67d" },
        url: "https://general-runtime.voiceflow.com",
        versionID: "production",
        voice: {
          url: "https://runtime-api.voiceflow.com",
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // cleanup
    };
  }, []);

  return null; // no visual element needed; Voiceflow handles it
}
