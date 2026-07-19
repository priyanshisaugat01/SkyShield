import type { InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function TextField({ label, id, className = "", ...rest }: TextFieldProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className={className}>
      <label htmlFor={inputId} className="block text-sm text-text-muted mb-1.5">
        {label}
      </label>
      <input
        id={inputId}
        className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm text-text placeholder:text-text-muted/50 outline-none transition-colors focus:border-accent/50 focus:bg-white/[0.05]"
        {...rest}
      />
    </div>
  );
}
