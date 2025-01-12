import { clsx } from "clsx";

import { InternalLink } from "/wander/common/components/link";

const horizontalGutterPaddingClasses =
  "pl-[max(theme(spacing[touch/4]),env(safe-area-inset-left))] " +
  "pr-[max(theme(spacing[touch/4]),env(safe-area-inset-right))]";

export function Header() {
  return (
    <header
      className={clsx([
        horizontalGutterPaddingClasses,
        "py-touch/10",

        "sticky top-0",

        "bg-[rgb(0,129,221)]",
        "border-b border-[rgb(0,120,206)]",
        "shadow-sm",
        "text-white",
      ])}
    >
      <nav className="max-w-[900px] mx-auto">
        <InternalLink href="/" unstyled className="text-xl">
          Wander
        </InternalLink>
      </nav>
    </header>
  );
}
