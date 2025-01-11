import { clsx } from "clsx";

export function Explainer({ children, id }) {
  return (
    <div id={id} className="mb-14 last:mb-0">
      {children}
    </div>
  );
}

Explainer.Title = function Title({ children }) {
  return <h2 className="text-2xl leading-8 mb-4">{children}</h2>;
};

Explainer.Points = function Points({ children }) {
  return <ul className="list-disc list-outside pl-[1.3em]">{children}</ul>;
};

Explainer.Point = function Point({ children }) {
  return <li className="leading-6 mb-4 last:mb-0">{children}</li>;
};
