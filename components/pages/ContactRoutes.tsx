import raw from "@/content.js";
import { contactRoutes, parseContent } from "@/lib/content-data";

type Route = NonNullable<ReturnType<typeof contactRoutes>["primary"]>;

const ROUTE_COPY = {
  partner: { label: "I want to partner", hint: "Brands, venues and anyone bringing something to the night." },
  player: { label: "I want to play", hint: "Teams and players after a spot in the next season." },
};

/* What a button says and what it promises. A wa.me link or a profile leaves
   the site in a new tab and says so; a mailto hands off to a mail client, and
   target="_blank" on one leaves an empty tab behind. No audience means one
   route for everybody, so it cannot claim to be the partner or player one. */
function routeCopy(route: Route) {
  if (route.audience) {
    const copy = ROUTE_COPY[route.audience as keyof typeof ROUTE_COPY];
    return { ...copy, aria: `${copy.label} (opens WhatsApp in a new tab)` };
  }
  if (route.kind === "email") {
    return { label: "Email us", hint: "The fastest way we have until a number is listed.", aria: undefined };
  }
  const name = "name" in route ? route.name : "";
  return {
    label: `Message us on ${name}`,
    hint: "A DM reaches us the same day, most days.",
    aria: `Message Frontier Football on ${name} (opens in a new tab)`,
  };
}

function RouteCell({ route, primary }: { route: Route; primary: boolean }) {
  const copy = routeCopy(route);
  const external = route.kind !== "email" ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <li className="flex flex-col gap-3">
      <a
        href={route.href ?? undefined}
        {...external}
        aria-label={copy.aria}
        className={`flex min-h-11 items-center justify-center px-6 py-5 text-center font-display text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] uppercase ${
          primary ? "bg-bone text-ink hover:bg-bone/85" : "border border-bone text-bone hover:bg-bone/10"
        }`}
      >
        {copy.label}
      </a>
      <p className="text-[15px] leading-[1.45] text-muted">{copy.hint}</p>
    </li>
  );
}

/* v1's green action slab, on ink now that colour fields are whole viewports
   only (HOUSE-RULES section 2; owner chose strict bone/ink, 2026-09-22). No
   form: HOUSE-RULES forbids anything that posts. `only` narrows to one
   audience inside contactRoutes, so the email/Instagram fallback still runs.
   Nothing recorded anywhere: the section is absent, not an empty slab. */
export function ContactRoutes({ only, heading }: { only: "partner" | "player"; heading: string }) {
  const routes = contactRoutes(parseContent(raw), { only });
  if (!routes.primary) return null;
  const single = !routes.secondary;

  return (
    <section aria-labelledby={`routes-${only}`} className="frame pb-16">
      {/* For screen readers: on screen the buttons say what this is. */}
      <h2 id={`routes-${only}`} className="sr-only">
        {heading}
      </h2>
      <div className={`canvas-ink p-6 py-8 md:p-12 ${single ? "max-w-[40rem]" : ""}`}>
        <ul className={`grid gap-6 ${single ? "" : "sm:grid-cols-2"}`}>
          <RouteCell route={routes.primary} primary />
          {routes.secondary ? <RouteCell route={routes.secondary} primary={false} /> : null}
        </ul>
        {routes.email && routes.primary.kind !== "email" ? (
          <p className="mt-8 text-[15px] leading-normal">
            <span className="text-muted">Or email</span>{" "}
            <a href={routes.email} className="font-bold underline underline-offset-[3px]">
              {routes.email.slice("mailto:".length)}
            </a>
          </p>
        ) : null}
        {routes.channels.length > 0 ? (
          <p className="mt-3 text-[15px] leading-normal">
            <span className="text-muted">Also on</span>{" "}
            {routes.channels.slice(0, 1).map((link) => (
              <a
                key={link.name}
                href={link.url!}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Frontier Football on ${link.name} (opens in a new tab)`}
                className="font-bold underline underline-offset-[3px]"
              >
                {link.handle ?? link.name}
              </a>
            ))}
          </p>
        ) : null}
      </div>
    </section>
  );
}
