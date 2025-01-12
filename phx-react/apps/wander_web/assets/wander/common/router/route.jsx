import { Route as WouterRoute } from "wouter";

import { SiteLayout } from "/wander/common/layouts/site";

/**
 * @param {object} props
 * @param {(React.ComponentType | null)} props.Layout - `Layout` must render
 *  its children. Set to `null` to use no layout.
 */
export function Route({ children, path, Layout = SiteLayout }) {
  return (
    <WouterRoute path={path}>
      {Layout !== null ? <Layout>{children}</Layout> : children}
    </WouterRoute>
  );
}
