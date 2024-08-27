import { parse } from "https://deno.land/std@0.201.0/csv/mod.ts";

const movies = parse(Deno.readTextFileSync("movies/ratings.csv"), {
  skipFirstRow: true,
  strip: true,
});

export default function* () {
  for (const movie of movies) {
    yield {
      url: `/movies/${movie.id}/`,
      layout: "movie.tsx",
      date: new Date(movie.date as string),
      id: movie.id,
      title: movie.title,
      year: movie.year,
      vote: movie.vote,
    };
  }
}
