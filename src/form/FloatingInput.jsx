import React from "react";

export default function FloatingInput({
  id,
  label,
  type = "text",
  register,
  error,
  ...rest
}) {
  return (
    <div className="relative w-full">
      <input
        id={id}
        type={type}
        {...register}
        {...rest}
        placeholder=" "
        className={`peer w-full rounded-[var(--radius-input)] border bg-white px-4 pb-2 pt-5 text-sm text-brand-400 outline-none transition-all focus:ring-2 focus:ring-brand-300/25 ${error ? "border-red-500 focus:border-red-500" : "border-[#ead8b0] focus:border-brand-300"}`}
      />
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 font-medium transition-all duration-200 top-1.5 text-[10px] text-brand-300 peer-placeholder-shown:top-[14px] peer-placeholder-shown:text-sm peer-placeholder-shown:text-[#8a715b] peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:text-brand-300"
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 pl-1 text-xs text-red-600">{error.message}</p>
      )}
    </div>
  );
}
