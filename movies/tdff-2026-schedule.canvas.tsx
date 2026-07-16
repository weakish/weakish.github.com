import {
  Divider,
  H1,
  H2,
  Link,
  Pill,
  Row,
  Stack,
  Table,
  Text,
} from "cursor/canvas";

const POSTER_BASE = "/movies/tdff-2026/posters";

type Screening = {
  date: string;
  day: string;
  time: string;
  venue: string;
  city: string;
};

type Movie = {
  title: string;
  poster: string;
  imdb: string;
  screenings: Screening[];
};

const VENUE_TONE: Record<string, "info" | "success" | "warning"> = {
  "House Samyan": "info",
  "Century Sukhumvit": "success",
  "Pratudang Space": "warning",
};

const movies: Movie[] = [
  {
    title: "Eat Drink Man Woman",
    poster: `${POSTER_BASE}/eat-drink-man-woman.jpg`,
    imdb: "https://www.imdb.com/title/tt0111797/",
    screenings: [
      { date: "2026-07-22", day: "Wed 22 Jul", time: "19:00", venue: "House Samyan", city: "Bangkok" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "19:15", venue: "Century Sukhumvit", city: "Bangkok" },
    ],
  },
  {
    title: "Girl",
    poster: `${POSTER_BASE}/girl.jpg`,
    imdb: "https://www.imdb.com/title/tt33396536/",
    screenings: [
      { date: "2026-07-23", day: "Thu 23 Jul", time: "17:45", venue: "House Samyan", city: "Bangkok" },
      { date: "2026-07-25", day: "Sat 25 Jul", time: "20:15", venue: "Century Sukhumvit", city: "Bangkok" },
    ],
  },
  {
    title: "Kuei-Mei, a Woman",
    poster: `${POSTER_BASE}/kuei-mei-a-woman.jpg`,
    imdb: "https://www.imdb.com/title/tt0089178/",
    screenings: [
      { date: "2026-07-23", day: "Thu 23 Jul", time: "20:05", venue: "House Samyan", city: "Bangkok" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "11:00", venue: "Century Sukhumvit", city: "Bangkok" },
    ],
  },
  {
    title: "Back Home",
    poster: `${POSTER_BASE}/back-home.png`,
    imdb: "https://www.imdb.com/find/?q=Back+Home+2025+Tsai+Ming-liang",
    screenings: [
      { date: "2026-07-23", day: "Thu 23 Jul", time: "17:30", venue: "Century Sukhumvit", city: "Bangkok" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "15:35", venue: "House Samyan", city: "Bangkok" },
    ],
  },
  {
    title: "From Clay to Cloud",
    poster: `${POSTER_BASE}/from-clay-to-cloud.jpg`,
    imdb: "https://www.imdb.com/find/?q=From+Clay+to+Cloud+2025+documentary",
    screenings: [
      { date: "2026-07-23", day: "Thu 23 Jul", time: "19:15", venue: "Century Sukhumvit", city: "Bangkok" },
      { date: "2026-07-25", day: "Sat 25 Jul", time: "18:05", venue: "House Samyan", city: "Bangkok" },
    ],
  },
  {
    title: "New Taipei Documentary Film Award",
    poster: `${POSTER_BASE}/new-taipei-documentary-film-award.jpg`,
    imdb: "https://www.imdb.com/find/?q=New+Taipei+Documentary+Film+Award",
    screenings: [
      { date: "2026-07-24", day: "Fri 24 Jul", time: "18:00", venue: "Century Sukhumvit", city: "Bangkok" },
    ],
  },
  {
    title: "Pushing Hands",
    poster: `${POSTER_BASE}/pushing-hands.jpg`,
    imdb: "https://www.imdb.com/title/tt0107977/",
    screenings: [
      { date: "2026-07-25", day: "Sat 25 Jul", time: "12:05", venue: "House Samyan", city: "Bangkok" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "15:10", venue: "Century Sukhumvit", city: "Bangkok" },
    ],
  },
  {
    title: "The Wedding Banquet",
    poster: `${POSTER_BASE}/the-wedding-banquet.jpg`,
    imdb: "https://www.imdb.com/title/tt0107207/",
    screenings: [
      { date: "2026-07-25", day: "Sat 25 Jul", time: "14:05", venue: "House Samyan", city: "Bangkok" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "17:10", venue: "Century Sukhumvit", city: "Bangkok" },
    ],
  },
  {
    title: "The Wave Will Carry Us",
    poster: `${POSTER_BASE}/the-wave-will-carry-us.jpg`,
    imdb: "https://www.imdb.com/title/tt38589615/",
    screenings: [
      { date: "2026-07-25", day: "Sat 25 Jul", time: "16:10", venue: "House Samyan", city: "Bangkok" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "13:00", venue: "Pratudang Space", city: "Khon Kaen" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "13:15", venue: "Century Sukhumvit", city: "Bangkok" },
    ],
  },
  {
    title: "SPI",
    poster: `${POSTER_BASE}/spi.jpg`,
    imdb: "https://www.imdb.com/find/?q=SPI+2025+Sayun+Simung",
    screenings: [
      { date: "2026-07-25", day: "Sat 25 Jul", time: "09:30", venue: "Pratudang Space", city: "Khon Kaen" },
      { date: "2026-07-25", day: "Sat 25 Jul", time: "15:30", venue: "Century Sukhumvit", city: "Bangkok" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "13:40", venue: "House Samyan", city: "Bangkok" },
    ],
  },
  {
    title: "LA PALOMA",
    poster: `${POSTER_BASE}/la-paloma.jpg`,
    imdb: "https://www.imdb.com/find/?q=LA+PALOMA+2026+Lu+Yuan-chi",
    screenings: [
      { date: "2026-07-25", day: "Sat 25 Jul", time: "13:00", venue: "Pratudang Space", city: "Khon Kaen" },
      { date: "2026-07-25", day: "Sat 25 Jul", time: "13:00", venue: "Century Sukhumvit", city: "Bangkok" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "16:55", venue: "House Samyan", city: "Bangkok" },
    ],
  },
  {
    title: "A Long Way Home",
    poster: `${POSTER_BASE}/a-long-way-home.jpg`,
    imdb: "https://www.imdb.com/find/?q=A+Long+Way+Home+2025+Wu+Nien-hua",
    screenings: [
      { date: "2026-07-25", day: "Sat 25 Jul", time: "18:30", venue: "Century Sukhumvit", city: "Bangkok" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "09:30", venue: "Pratudang Space", city: "Khon Kaen" },
      { date: "2026-07-26", day: "Sun 26 Jul", time: "18:25", venue: "House Samyan", city: "Bangkok" },
    ],
  },
];

const allScreenings = movies
  .flatMap((movie) =>
    movie.screenings.map((s) => ({
      ...s,
      title: movie.title,
      poster: movie.poster,
      imdb: movie.imdb,
    })),
  )
  .sort((a, b) => {
    const dateCmp = a.date.localeCompare(b.date);
    if (dateCmp !== 0) return dateCmp;
    return a.time.localeCompare(b.time);
  });

function PosterLink({
  poster,
  imdb,
  title,
}: {
  poster: string;
  imdb: string;
  title: string;
}) {
  return (
    <Link href={imdb}>
      <img
        src={poster}
        alt={title}
        style={{
          width: 48,
          height: 72,
          objectFit: "cover",
          borderRadius: 4,
          display: "block",
        }}
      />
    </Link>
  );
}

function VenuePill({ venue }: { venue: string }) {
  return <Pill tone={VENUE_TONE[venue] ?? "info"} size="sm">{venue}</Pill>;
}

export default function Tdff2026Schedule() {
  const movieRows = movies.map((movie) => [
    <PosterLink
      poster={movie.poster}
      imdb={movie.imdb}
      title={movie.title}
    />,
    <Link href={movie.imdb}>{movie.title}</Link>,
    movie.screenings
      .map((s) => `${s.day} ${s.time} — ${s.venue} (${s.city})`)
      .join("\n"),
  ]);

  return (
    <Stack gap={20}>
      <Stack gap={6}>
        <H1>Taiwan Documentary &amp; Film Festival in Thailand 2026</H1>
        <Text tone="secondary">
          Combined schedule for Bangkok (House Samyan &amp; Century Sukhumvit) and Khon Kaen
          (Pratudang Space) · 22–26 July 2026
        </Text>
        <Row gap={8} wrap>
          <VenuePill venue="House Samyan" />
          <VenuePill venue="Century Sukhumvit" />
          <VenuePill venue="Pratudang Space" />
        </Row>
        <Text tone="tertiary" size="small">
          Sources: Facebook festival post · housesamyan.com · ticket.docclubandpub.com · Pratudang
          reservation form
        </Text>
      </Stack>

      <Stack gap={8}>
        <H2>Combined timetable (all cities)</H2>
        <Table
          headers={["Date", "Time", "Film", "Venue", "City"]}
          rows={allScreenings.map((s) => [
            s.day,
            s.time,
            <Row gap={10} align="center">
              <PosterLink poster={s.poster} imdb={s.imdb} title={s.title} />
              <Link href={s.imdb}>{s.title}</Link>
            </Row>,
            <VenuePill venue={s.venue} />,
            s.city,
          ])}
          columnAlign={["left", "left", "left", "left", "left"]}
          striped
          stickyHeader
        />
      </Stack>

      <Divider />

      <Stack gap={8}>
        <H2>All screenings by film</H2>
        <Text tone="secondary" size="small">
          Click any poster to open the film on IMDb. Newer documentaries without IMDb pages link to
          search results.
        </Text>
        <Table
          headers={["Poster", "Film", "Screenings"]}
          rows={movieRows}
          columnAlign={["center", "left", "left"]}
          striped
          stickyHeader
        />
      </Stack>

      <Text tone="tertiary" size="small">
        Tickets:{" "}
        <Link href="https://www.housesamyan.com/site/Movie">House Samyan</Link>
        {" · "}
        <Link href="https://ticket.docclubandpub.com/">Century Sukhumvit (Doc Club)</Link>
        {" · "}
        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSc7PSS9CbKxRjwZH4nHCbtMTuA_KXZzcaD6rf0SDnAbQgOQjg/viewform">
          Pratudang Space (Khon Kaen)
        </Link>
      </Text>
    </Stack>
  );
}
