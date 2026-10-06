import raw from "@/content.js";
import { contactRoutes, parseContent } from "@/lib/content-data";

type Route = NonNullable<ReturnType<typeof contactRoutes>["primary"]>;

const ROUTE_COPY = {
  partner: { label: "I want to partner" },
  player: { label: "I want to play" },
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
    return { label: "Email us", aria: undefined };
  }
  const name = "name" in route ? route.name : "";
  return {
    label: `Message us on ${name}`,
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
        className={`group flex min-h-16 items-center justify-between gap-6 px-6 py-5 font-display text-[clamp(1.25rem,1rem+0.9vw,2rem)] font-bold uppercase transition-[background-color,color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.98] ${
          primary ? "bg-ink text-yellow hover:bg-ink/90" : "border-2 border-ink text-ink hover:bg-ink hover:text-yellow"
        }`}
      >
        {copy.label}
        <span aria-hidden="true" className="transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-1.5">&rarr;</span>
      </a>
    </li>
  );
}

/* The action bars, set inside the caller's own band (the Collaborate closing,
   2026-10-07: the old ink card read flat on the yellow). No
   form: HOUSE-RULES forbids anything that posts. `only` narrows to one
   audience inside contactRoutes, so the email/Instagram fallback still runs.
   Nothing recorded anywhere: the section is absent, not an empty slab. */
export function ContactRoutes({ only, heading }: { only: "partner" | "player"; heading: string }) {
  const routes = contactRoutes(parseContent(raw), { only });
  if (!routes.primary) return null;
  const single = !routes.secondary;

  return (
    <section aria-labelledby={`routes-${only}`} className="mt-10">
      {/* For screen readers: on screen the buttons say what this is. */}
      <h2 id={`routes-${only}`} className="sr-only">
        {heading}
      </h2>
      <div className={single ? "max-w-[36rem]" : ""}>
        <ul className={`grid gap-3 ${single ? "" : "sm:grid-cols-2"}`}>
          <RouteCell route={routes.primary} primary />
          {routes.secondary ? <RouteCell route={routes.secondary} primary={false} /> : null}
        </ul>
      </div>
    </section>
  );
}
