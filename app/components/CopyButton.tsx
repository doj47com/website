import { useState } from "react";
import { Copy, Check } from "lucide-react"; // Ensure you have lucide-react installed

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <button
      onClick={copyToClipboard}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
      {copied ? "Copied!" : "JSON"}
    </button>
  );
}
