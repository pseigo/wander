import { clsx } from "clsx";

import { InternalLink, ExternalLink } from "/wander/common/components/link";

import { Section } from "./footer/section";

const horizontalGutterPaddingClasses =
  "pl-[max(theme(spacing[touch/4]),env(safe-area-inset-left))] " +
  "pr-[max(theme(spacing[touch/4]),env(safe-area-inset-right))]";

export function Footer({ className }) {
  return (
    /* Full-width banner and inner styles. */
    <footer
      className={clsx([
        "mt-24",
        horizontalGutterPaddingClasses,
        "pt-touch pb-[calc(theme(spacing.touch*2)+env(safe-area-inset-bottom))]",
        "bg-[#0b0b0b]",
        "text-white",
        className,
      ])}
    >
      {/* Constrain inner width. */}
      <div
        className={clsx([
          "max-w-[900px]",
          "px-1 sm:px-12 md:px-20 lg:px-0",
          "mx-auto",
        ])}
      >
        <nav>
          <h2 className="text-3xl mb-8">
            <InternalLink href="/" unstyled>
              Wander
            </InternalLink>
          </h2>

          <div
            className={clsx([
              "flex flex-col gap-7",
              "sm:grid",
              "sm:grid-cols-[minmax(0,3fr),_minmax(0,2fr)]",
              "lg:grid-cols-[minmax(0,3fr),_minmax(0,2fr),_minmax(0,3fr)]",
            ])}
          >
            <Section
              className={clsx([
                "sm:col-start-1 sm:row-start-1",
                "lg:col-start-1 lg:row-start-1",
              ])}
            >
              <Section.Title>Account</Section.Title>
              <Section.List>
                <Section.ListItem>
                  <InternalLink background="dark" href="/account/new">
                    Create an Account
                  </InternalLink>
                </Section.ListItem>
                <Section.ListItem>
                  <InternalLink background="dark" href="/account/sign-in">
                    Sign In
                  </InternalLink>
                </Section.ListItem>
              </Section.List>
            </Section>

            <Section
              className={clsx([
                "sm:col-start-1 sm:row-start-2",
                "lg:col-start-1 lg:row-start-2",
              ])}
            >
              <Section.Title>Documentation</Section.Title>
              <Section.List>
                <Section.ListItem>
                  <InternalLink
                    background="dark"
                    href="/docs/tutorials"
                    rel="help"
                  >
                    Tutorials
                  </InternalLink>
                </Section.ListItem>
                <Section.ListItem>
                  <InternalLink
                    background="dark"
                    href="/docs/guides/contribute-to-openstreetmap"
                  >
                    OpenStreetMap Contribution Guide
                  </InternalLink>
                </Section.ListItem>
                <Section.ListItem>
                  <InternalLink background="dark" href="/docs/guides/self-host">
                    Self-Hosting Guide
                  </InternalLink>
                </Section.ListItem>
              </Section.List>
            </Section>

            <Section
              className={clsx([
                "sm:col-start-1 sm:row-start-3",
                "lg:col-start-2 lg:row-start-1",
              ])}
            >
              <Section.Title>Help</Section.Title>
              <Section.List>
                <Section.ListItem>
                  <ExternalLink
                    background="dark"
                    href="https://github.com/pseigo/wander/labels/bug"
                  >
                    Known Issues
                  </ExternalLink>
                </Section.ListItem>
                <Section.ListItem>
                  <ExternalLink
                    background="dark"
                    href="https://github.com/pseigo/wander/issues/new"
                  >
                    Report a Bug
                  </ExternalLink>
                </Section.ListItem>
              </Section.List>
            </Section>

            <Section
              className={clsx([
                "sm:col-start-2 sm:row-start-1",
                "lg:col-start-2 lg:row-start-2",
              ])}
            >
              <Section.Title>Source Code</Section.Title>
              <Section.List>
                <Section.ListItem>
                  <ExternalLink
                    background="dark"
                    href="https://github.com/pseigo/wander/"
                  >
                    GitHub Repository
                  </ExternalLink>
                </Section.ListItem>
              </Section.List>
            </Section>

            <Section
              className={clsx([
                "sm:col-start-2 sm:row-start-2",
                "lg:col-start-3 lg:row-start-1",
              ])}
            >
              <Section.Title>Legal</Section.Title>
              <Section.List>
                <Section.ListItem>
                  <InternalLink background="dark" href="/legal/terms">
                    Terms of Service
                  </InternalLink>
                </Section.ListItem>
                <Section.ListItem>
                  <InternalLink background="dark" href="/legal/privacy">
                    Privacy Policy
                  </InternalLink>
                </Section.ListItem>
              </Section.List>
            </Section>

            <Section
              className={clsx([
                "sm:col-start-2 sm:row-start-3",
                "lg:col-start-3 lg:row-start-2",
              ])}
            >
              <div className="flex flex-col gap-2">
                <div className="text-[#d8d8d8]">
                  Wander is free and open source software under the{" "}
                  <ExternalLink
                    background="dark"
                    href="http://www.apache.org/licenses/LICENSE-2.0"
                  >
                    Apache License, Version 2.0.
                  </ExternalLink>
                </div>
                <div className="text-sm text-[#acacac]">
                  Copyright (c) 2025 Peyton Seigo
                </div>
              </div>
            </Section>
          </div>
        </nav>
      </div>
    </footer>
  );
}
