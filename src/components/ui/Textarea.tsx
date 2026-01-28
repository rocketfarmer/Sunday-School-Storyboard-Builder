import React, { useId } from 'react';
interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}: TextareaProps) {
  const textareaId = id || useId();
  return (
    <div className="w-full">
      {label &&
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-gray-700 mb-1">

          {label}
        </label>
      }
      <textarea
        id={textareaId}
        className={`
          flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-gray-400 
          focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50
          transition-all duration-200
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-amber-500 focus:ring-amber-200'}
          ${className}
        `}
        {...props} />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {helperText && !error &&
      <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      }
    </div>);

}