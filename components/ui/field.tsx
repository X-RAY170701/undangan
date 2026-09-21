import {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";

const baseInputClasses =
  "w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900";

function slugify(label: string) {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}

export function FieldWrapper({
  label,
  htmlFor,
  hint,
  children,
}: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-800">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, hint, id, className = "", ...props }, ref) => {
    const fieldId = id ?? props.name ?? slugify(label);
    return (
      <FieldWrapper label={label} htmlFor={fieldId} hint={hint}>
        <input
          ref={ref}
          id={fieldId}
          className={`${baseInputClasses} ${className}`}
          {...props}
        />
      </FieldWrapper>
    );
  }
);
TextField.displayName = "TextField";

interface TextAreaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
}

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(({ label, hint, id, className = "", ...props }, ref) => {
  // Konsisten dengan TextField: fallback ID di-slugify (bukan label mentah),
  // karena atribut `id` HTML tidak boleh mengandung spasi — kalau tidak,
  // <textarea> tanpa `id`/`name` (mis. field "Cerita Cinta" di editor) dapat
  // `id="Ceritakan kisah Anda"` yang secara teknis HTML tidak valid.
  const fieldId = id ?? props.name ?? slugify(label);
  return (
    <FieldWrapper label={label} htmlFor={fieldId} hint={hint}>
      <textarea
        ref={ref}
        id={fieldId}
        rows={4}
        className={`${baseInputClasses} resize-y ${className}`}
        {...props}
      />
    </FieldWrapper>
  );
});
TextAreaField.displayName = "TextAreaField";
