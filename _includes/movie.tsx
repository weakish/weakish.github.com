export interface MoviePageData extends Lume.Data {
    id: number;
    title: string;
    year: number;
    vote: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

import {
    parse
  } from "https://deno.land/std@0.201.0/csv/mod.ts";
  
const movies : MoviePageData[] = parse(Deno.readTextFileSync("movies/ratings.csv"), {
    skipFirstRow: true,
    strip: true,
});

export const layout = "default.liquid";

export default () => (
    <table>
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Year</th>
          <th scope="col">Rating</th>
        </tr>
      </thead>
      <tbody>
        {movies.map(({id, title, year, vote}) =>
          <tr key={id}>
            <td>
              <a href={`https://omdb.org/m${id}`}>{title}</a>
            </td>
            <td>{year}</td>
            <td>{vote}</td>
          </tr>
        )}
      </tbody>
    </table>
);