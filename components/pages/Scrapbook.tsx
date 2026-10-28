import Link from "next/link";
import type { Content } from "@/lib/content-data";
import { phoneSrcSet } from "@/lib/phone-image";
import styles from "./Scrapbook.module.css";

type Photo = { photo: string | null; photoAlt: string | null; photoCredit?: string | null };
type Album = { albumId: string | null; driveFolder: string | null };
const albumHref = (item?: Album) => item?.albumId ? `/albums/${encodeURIComponent(item.albumId)}` : item?.driveFolder;

/* Timeline photos are cropped for the frame's 1.6:1 shape. Ground Zero keeps
   its watermark whole; Division 0 uses the owner's selected event photo. */
const runPhotos: Record<string, { photo: string; photoAlt: string }> = {
  "Ground Zero": { photo: "/pages/run-ground-zero.webp", photoAlt: "Two players race for the ball in a women's match at Ground Zero; photograph by ThePapare" },
  "Turf Wars": { photo: "/pages/run-turf-wars.webp", photoAlt: "Turf Wars players and organisers together with a trophy at Club Fusion" },
  "4 x 4 Series": { photo: "/pages/run-4x4.webp", photoAlt: "SZN 6 runners-up with their medals and the trophy" },
  "Watch Parties": { photo: "/pages/run-watch-parties.webp", photoAlt: "A supporter laughs with her friends at the Norway v England watch party" },
  "Division 0": { photo: "/pages/run-division-0.webp", photoAlt: "Two players with controllers face a football video game screen at Division 0" },
};

export function Scrapbook({ data }: { data: Content }) {
  const ground = data.competitions.find((item) => item.name === "Ground Zero");
  const turf = data.competitions.find((item) => item.name === "Turf Wars");
  const division = data.competitions.find((item) => item.name === "Division 0");
  const series = [...data.seasons].sort((a, b) => b.season - a.season).find((item) => item.photo);
  const party = data.watchAlongs.find((item) => item.photo);
  const pins = [
    { name: "Ground Zero", item: ground, href: albumHref(ground) },
    { name: "Turf Wars", item: turf, href: albumHref(turf) },
    { name: "4 x 4 Series", item: series, href: data.seasons.length ? "/who-we-are/4x4-series" : null },
    { name: "Watch Parties", item: party, href: party ? "/gallery#watch-parties" : null },
    { name: "Division 0", item: division, href: albumHref(division) },
  ];

  return (
    <div className={styles.board}>
      <svg className={`${styles.thread} ${styles.desktopThread}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M25 2.7 C6 11,86 8,75 19.4 C88 28,4 25,25 36.1 C6 45,93 42,75 52.8 C88 61,4 58,25 69.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className={`${styles.thread} ${styles.mobileThread}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M45 2 C4 9,89 13,54 22 C94 30,4 32,45 41 C4 49,93 51,54 60 C94 68,4 70,45 79" vectorEffect="non-scaling-stroke" />
      </svg>
      <ol className={styles.pins}>
        {pins.map(({ name, item, href }, index) => {
          const body = <>
            <span className={styles.number} aria-hidden="true">{index + 1}</span>
            {item?.photo ? <PinPhoto item={{ ...item, ...runPhotos[name] }} name={name} /> : null}
            <strong>{name}{href ? <span aria-hidden="true">↗</span> : null}</strong>
            {item && "photoCredit" in item && item.photoCredit ? <small className={styles.credit}>{item.photoCredit}</small> : null}
          </>;
          return (
            <li className={styles.pin} key={name}>
              <div className="scrapbook-reveal">
                {href ? <Link href={href} className={styles.paper}>{body}</Link> : <div className={styles.paper}>{body}</div>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function PinPhoto({ item, name }: { item: Photo; name: string }) {
  return <figure className={styles.photo}>
    <img src={item.photo!} srcSet={item.photoCredit ? undefined : phoneSrcSet(item.photo!)}
      sizes="(max-width: 700px) 86vw, 46vw" alt={item.photoAlt ?? name}
      width={1200} height={750} loading="lazy" decoding="async"
      className={item.photoCredit ? styles.credited : "scrapbook-photo"} />
  </figure>;
}

export function SeriesSeasons({ seasons }: { seasons: Content["seasons"] }) {
  return <ol className={styles.seasons}>
    {[...seasons].sort((a, b) => a.season - b.season).map((season) => {
      const href = albumHref(season);
      const body = <>
        {season.photo ? <img src={season.photo} srcSet={phoneSrcSet(season.photo)}
          sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
          alt={season.photoAlt ?? `4 x 4 Series Season ${season.season}`} width={600} height={430} loading="lazy" decoding="async" /> : null}
        <div className={styles.seasonDetails}>
          <h2 className="font-display">Season {season.season}{href ? <span aria-hidden="true">↗</span> : null}</h2>
          {season.date ? <p>{season.date}</p> : null}
          {season.venue ? <p>{season.venue}</p> : null}
          {season.champion ? <p className={styles.champion}><span className="micro">Champion</span><strong>{season.champion}</strong></p> : null}
        </div>
      </>;
      return <li className="scrapbook-reveal" key={season.season}>
        {href ? <Link href={href} className={styles.season}>{body}</Link> : <div className={styles.season}>{body}</div>}
      </li>;
    })}
  </ol>;
}
