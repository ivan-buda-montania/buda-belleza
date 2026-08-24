import { ChevronDown } from 'lucide-react';
import { cloneElement, isValidElement, type ChangeEvent, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type FieldChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

/** The subset of props `FormField` injects into a caller-supplied control. */
interface ControlProps {
  id: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (event: FieldChangeEvent) => void;
  className?: string;
  'aria-invalid'?: boolean;
  'aria-describedby'?: string;
}

interface FormFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (event: FieldChangeEvent) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
  hint?: string;
  /** A `<select>` or `<textarea>` rendered in place of the default input. */
  children?: ReactNode;
  autoComplete?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  className?: string;
}

const controlBase =
  'bg-ink-50 text-ink-900 placeholder:text-ink-400 ring-line hover:ring-line-strong focus:bg-surface focus:ring-brand-500 w-full rounded-xl px-4 text-sm ring-1 outline-none transition-[background-color,box-shadow] duration-200 ease-[var(--ease-out-quint)] focus:ring-2';

export function FormField({
  id,
  label,
  name,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  error,
  hint,
  children,
  autoComplete,
  inputMode,
  className,
}: FormFieldProps) {
  const hasError = Boolean(error);
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = cn(hintId, errorId) || undefined;

  const controlClass = cn(
    controlBase,
    hasError && 'bg-danger-100/50 ring-danger-500 focus:ring-danger-500',
  );

  const isSelect = isValidElement(children) && children.type === 'select';

  const control = isValidElement<ControlProps>(children) ? (
    cloneElement(children, {
      id,
      name,
      required,
      value,
      onChange,
      'aria-invalid': hasError || undefined,
      'aria-describedby': describedBy,
      className: cn(controlClass, children.props.className),
    })
  ) : (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      autoComplete={autoComplete}
      inputMode={inputMode}
      aria-invalid={hasError || undefined}
      aria-describedby={describedBy}
      className={cn(controlClass, 'h-12')}
    />
  );

  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <label htmlFor={id} className="text-ink-800 text-sm font-semibold">
        {label}
        {required && (
          <span aria-hidden="true" className="text-brand-600 ml-0.5">
            *
          </span>
        )}
      </label>

      <div className="relative min-w-0">
        {control}
        {/* Native select arrows differ per platform, so we hide the widget's own and draw this. */}
        {isSelect && (
          <ChevronDown
            aria-hidden="true"
            className="text-ink-500 pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2"
          />
        )}
      </div>

      {hint && (
        <p id={hintId} className="text-ink-500 text-xs leading-relaxed">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-danger-700 text-xs font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
