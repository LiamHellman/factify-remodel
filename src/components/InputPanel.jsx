import { useRef } from "react";
import { Upload, FileText } from "lucide-react";

export default function InputPanel({ content, onChange }) {
  const fileRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    onChange(text);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-rule-light">
        <h2 className="font-[family-name:var(--font-serif)] text-lg text-ink">
          Input
        </h2>
        <p className="text-[11px] text-ink-faint mt-0.5">
          Upload document or paste text
        </p>
      </div>

      <div className="flex-1 p-4 space-y-3 overflow-y-auto">
        {/* Upload */}
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full border border-dashed border-rule hover:border-ink-faint p-5 text-center transition-colors group"
        >
          <input
            ref={fileRef}
            type="file"
            accept=".txt"
            onChange={handleFile}
            className="hidden"
          />
          <Upload className="w-5 h-5 mx-auto mb-2 text-ink-faint group-hover:text-ink-muted transition-colors" />
          <p className="text-xs text-ink-muted">
            Upload File
          </p>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-rule-light" />
          <span className="text-[10px] text-ink-faint uppercase tracking-widest">
            or
          </span>
          <div className="flex-1 h-px bg-rule-light" />
        </div>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste text..."
          className="w-full h-48 px-3 py-2.5 bg-white border border-rule focus:border-ink-faint text-sm text-ink placeholder-ink-faint resize-none outline-none transition-colors text-[13px] leading-relaxed"
        />

        {content && (
          <div className="flex items-center gap-2 text-[11px] text-ink-faint">
            <FileText className="w-3 h-3" />
            <span>{content.length.toLocaleString()} characters</span>
          </div>
        )}
      </div>
    </div>
  );
}
