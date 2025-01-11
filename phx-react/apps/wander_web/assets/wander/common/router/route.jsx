import { Route as WouterRoute } from "wouter";

import { SiteLayout } from "/wander/common/layouts/site";

export function Route({ children, path, Layout = SiteLayout }) {
  return (
    <WouterRoute path={path}>
      <Layout>{children}</Layout>
    </WouterRoute>
  );
}
