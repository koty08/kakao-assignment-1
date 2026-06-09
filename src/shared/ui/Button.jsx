const VARIANTS = {
  primary: "bg-primary text-white hover:bg-blue-600",
  ghost: "text-gray-500 hover:bg-gray-100",
  danger: "text-red-500 hover:bg-red-50",
  save: "text-primary hover:bg-blue-50",
};

export function Button({ children, variant = "ghost", className = "", ...props }) {
  return (
    <button
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors cursor-pointer
        ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
