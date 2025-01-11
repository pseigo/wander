import { clsx } from "clsx";

export function Section({ children, className }) {
  // prettier-ignore
  return (
    <div className={clsx([
      className
    ])}>
      {children}
    </div>
  );
}

Section.Title = function Title({ children }) {
  // prettier-ignore
  return (
    <h3 className={clsx([
      "text-sm text-[#d2d2d2]",
      "mb-2"
    ])}>{children}</h3>
  );
};

Section.List = function List({ children }) {
  return <ul>{children}</ul>;
};

Section.ListItem = function ListItem({ children }) {
  // prettier-ignore
  return (
    <li className={clsx([
      "text-lg",
      "mb-touch/7"
    ])}>{children}</li>
  );
};
