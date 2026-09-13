import React, { useState } from "react";

export default function FloatingInput({
  id,
  label,
  type = "text",
  register,
  error,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        {...register}
        {...rest}
        onFocus={() => setFocused(true)}
        onBlur={(event) => {
          setFocused(false);
          setHasValue(event.target.value.length > 0);
          register.onBlur?.(event);
        }}
        onChange={(event) => {
          setHasValue(event.target.value.length > 0);
          register.onChange?.(event);
        }}
        placeholder={label}
        className={`peer w-full rounded-[var(--radius-input)] border bg-white px-4 pb-2 pt-5 text-sm text-brand-400 outline-none transition-all placeholder-transparent focus:ring-2 focus:ring-brand-300/25 ${error ? "border-red-500 focus:border-red-500" : "border-[#ead8b0] focus:border-brand-300"}`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-4 font-medium transition-all duration-200 ${focused || hasValue ? "top-1.5 text-[10px] text-brand-300" : "top-[14px] text-sm text-[#8a715b]"}`}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 pl-1 text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
}
