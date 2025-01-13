/*
 * Copyright (c) 2025 Peyton Seigo
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { InternalLink, ExternalLink } from "/wander/common/components/link";

import { Explainer } from "./explainer";

export function Explainers({ className }) {
  return (
    <article className={className}>
      <Explainer id="crowdsourced">
        <Explainer.Title>
          Crowdsourced data, powered by the OpenStreetMap project
        </Explainer.Title>
        <Explainer.Points>
          <Explainer.Point>
            Gone are the days of not being able to find a place on the map if
            you don't know its name. In addition, we don't favour one business
            over another in search results. If it’s in OpenStreetMap (
            <abbr>OSM</abbr>) you can see it without complications.
          </Explainer.Point>

          <Explainer.Point>
            Something missing? Get involved in the community! Contributing to
            OpenStreetMap has never been easier. Get started with our{" "}
            <InternalLink href="/docs/guides/contribute-to-openstreetmap">
              Contribution Guide.
            </InternalLink>
          </Explainer.Point>
        </Explainer.Points>
      </Explainer>

      <Explainer id="collections">
        <Explainer.Title>Save your favourite places</Explainer.Title>
        <Explainer.Points>
          <Explainer.Point>
            Create collections and nest them like folders on a computer.
          </Explainer.Point>

          <Explainer.Point>
            Make a collection public to share by URL, and decide if nested
            collections should also be public or stay private.
          </Explainer.Point>

          <Explainer.Point>Attach notes to your saved places.</Explainer.Point>

          <Explainer.Point>
            Customize how your collections look on the map.
          </Explainer.Point>

          <Explainer.Point>
            Export your collections to portable files at any time to backup,
            share, or eject from Wander.
          </Explainer.Point>
        </Explainer.Points>
      </Explainer>

      <Explainer id="free">
        <Explainer.Title>Try for free</Explainer.Title>
        <Explainer.Points>
          <Explainer.Point>
            You can browse, create collections, and export your data without
            signing in.{" "}
            <span className="text-gray-500 dark:text-gray-400 italic">
              (See{" "}
              <InternalLink href="/docs/browser-storage-caveats">
                caveats
              </InternalLink>{" "}
              of browser storage.)
            </span>
          </Explainer.Point>

          <Explainer.Point>
            Create a free account to back up your data, sync across devices, and
            share collections.
          </Explainer.Point>

          <Explainer.Point>
            Currently there are no paid plans, but free accounts do have storage
            limits. In the future, we may offer premium tiers to support hosting
            costs and fund future development.
          </Explainer.Point>

          <Explainer.Point>
            All the{" "}
            <ExternalLink href="https://github.com/pseigo/wander">
              code
            </ExternalLink>{" "}
            is open source under free and permissive licenses. Want to run it
            yourself? Take a look at our{" "}
            <InternalLink href="/docs/guides/self-host">
              Self-Hosting Guide.
            </InternalLink>
          </Explainer.Point>
        </Explainer.Points>
      </Explainer>
    </article>
  );
}
