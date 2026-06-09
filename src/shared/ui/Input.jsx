export function Input({ error = false, className = "", ...props }) {
  return (
    <input
      className={`w-full px-4 py-2.5 text-sm rounded-xl border outline-none transition-colors
        ${error ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-primary"} ${className}`}
      {...props}
    />
  );
}
