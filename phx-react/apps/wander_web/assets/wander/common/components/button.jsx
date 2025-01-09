import { clsx } from "clsx";

export function Button({ label, onClick = null }) {
  return (
    <button
      className={clsx([
        "px-touch/2 min-h-touch",
        "rounded",

        "hover:shadow active:shadow-inner",

        "text-white",
        "bg-sky-500 hover:bg-sky-400 active:bg-sky-600",
        "border border-sky-600 hover:border-sky-500 active:border-sky-600",
        "transition-colors duration-100",
      ])}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
