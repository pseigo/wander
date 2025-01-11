import { clsx } from "clsx";

/**
 * Button size.
 * @typedef {("normal" | "large")} ButtonSize
 */

/**
 * Button theme.
 *
 * - Buttons you want to draw special attention to should be "primary".
 * - Buttons you don't want to be too distracting should be "normal".
 * - "white" and "black" might look better on certain backdrops, but should be used sparingly.
 *
 * @typedef {("normal" | "primary" | "white" | "black")} ButtonTheme
 */

/**
 * @param {object} props
 * @param {ButtonSize} props.size - Defaults to "normal".
 * @param {ButtonSize} props.theme - Defaults to "normal".
 */
export function Button(
  // prettier-ignore
  {
    label, onClick,
    size = "normal", theme = "normal",
    className, style,
  }
) {
  return (
    <button
      className={clsx([
        "px-touch/2",
        "rounded-[13px]",

        classesForSize(size),
        classesForTheme(theme),

        "select-none",
        "hover:shadow active:shadow-inner",
        "transition-colors duration-150",

        className,
      ])}
      style={style}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

/**
 * @param {ButtonSize} size
 * @returns {(string | string[])}
 */
function classesForSize(size) {
  switch (size) {
    case "normal":
      return ["min-h-touch"];

    case "large":
      return ["min-h-[50px] text-xl"];
  }
}

/**
 * @param {ButtonTheme} theme
 * @returns {(string | string[])}
 */
function classesForTheme(theme) {
  switch (theme) {
    case "normal":
      // TODO: make monochrome and easy on the eye
      return [
        "text-white",
        "bg-sky-500 hover:bg-sky-400 active:bg-sky-600",
        "border border-sky-600 hover:border-sky-500 active:border-sky-600",
      ];

    case "primary":
      return [
        "text-white",
        "bg-sky-500 hover:bg-sky-400 active:bg-sky-600",
        "border border-sky-600 hover:border-sky-500 active:border-sky-600",
      ];

    case "white":
      return [
        "text-black hover:text-gray-800 active:text-gray-800",
        "bg-gray-100 hover:bg-gray-50 active:bg-gray-200",
        "border border-gray-300 hover:border-gray-200 active:border-gray-300",
      ];

    case "black":
      return [
        "text-white hover:text-gray-50 active:text-gray-50",
        "bg-gray-900 hover:bg-gray-800 active:bg-gray-950",
        "border border-gray-800 hover:border-gray-900 active:border-gray-800",
      ];
  }
}
