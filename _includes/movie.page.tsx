// "default" means "my media"
// more info: https://www.omdb.org/en/de/forum_entry/1182
interface MovieCsvRow {
  id: string;
  title: string;
  year: string;
  vote?: string;
  tag?: string;
}

interface MovieNoteRow {
  id: string;
  note: string;
}

interface NetflixRow {
  id: string;
  title: string;
  year: string;
  date: string;
  wikidata: string;
  netflix: string;
}

import { parse } from "https://deno.land/std@0.201.0/csv/mod.ts";

function parseCsv<T>(
  path: string,
  options: { columns?: string[] } = {},
): T[] {
  return parse(Deno.readTextFileSync(path), {
    skipFirstRow: true,
    strip: true,
    ...options,
  }) as unknown as T[];
}

const watchedMovies = parseCsv<MovieCsvRow>("movies/ratings.csv");
const otherMovies = parseCsv<MovieCsvRow>("movies/movies.csv");
const movies: MovieCsvRow[] = watchedMovies.concat(otherMovies);

const ratedMovies = movies.filter(
  ({ tag }) => tag !== "watchlist" && tag !== "default",
);
const ratedOmdbIds = new Set(ratedMovies.map(({ id }) => id));
const ratedTitleYears = new Set(
  ratedMovies.map(({ title, year }) => `${title}\0${year}`),
);

const movieNotes = parseCsv<MovieNoteRow>("movies/notes.csv");

const netflix = parseCsv<NetflixRow>("movies/netflix.csv", {
  columns: ["id", "title", "year", "date", "wikidata", "netflix"],
});

function isInRatedTable({ id, title, year }: NetflixRow): boolean {
  if (id.startsWith("m")) {
    const omdbId = id.slice(1);
    if (ratedOmdbIds.has(omdbId)) return true;
  }
  return ratedTitleYears.has(`${title}\0${year}`);
}

const netflixUnrated = netflix.filter((row) => !isInRatedTable(row));

const notes: Record<string, string> = {};
for (const { id, note } of movieNotes) {
  notes[id] = note;
}

export const layout = "default.njk";

export default (data: Lume.Data) => (
  <>
    <h1>{data.title}</h1>
    <table>
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Release Year</th>
          <th scope="col">My Rating</th>
        </tr>
      </thead>
      <tbody>
        {ratedMovies
          .map(({ id, title, year, vote }) => (
            <tr key={id}>
              <td>
                <a href={`https://omdb.org/m${id}`} title="omdb page">
                  {title}
                </a>
              </td>
              <td>{year}</td>
              <td>
                {(id in notes)
                  ? (
                    <details>
                      <summary>{vote || "0"}</summary>
                      {notes[id]}
                    </details>
                  )
                  : vote || "0"}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
    <small>
      0 means I have not watched and do not want to watch the movie.
    </small>
    <details>
      <summary>Recently watched on Netflix</summary>
      <ul>
        {netflixUnrated.map(({ title, year, netflix }) => (
          <li key={netflix}>
            <a href={`https://www.netflix.com/title/${netflix}`}>{title}</a>
            {`, ${year}`}
          </li>
        ))}
      </ul>
    </details>
  </>
);
