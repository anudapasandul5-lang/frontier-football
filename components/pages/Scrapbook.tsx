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
        <path d="M75 3 C94 12,14 9,25 22 C12 31,96 28,75 40 C94 49,7 46,25 58 C12 67,96 64,75 77" vectorEffect="non-scaling-stroke" />
      </svg>
      <svg className={`${styles.thread} ${styles.mobileThread}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path d="M54 2 C95 9,10 13,45 22 C5 30,95 32,54 41 C95 49,6 51,45 60 C5 68,95 70,54 79" vectorEffect="non-scaling-stroke" />
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
