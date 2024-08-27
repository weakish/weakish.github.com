interface MoviePageData extends Lume.Data {
    id: number;
    title: string;
    year: number;
    vote: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    note: string;
}

interface MovieNote extends Lume.Data {
    id: number;
    note: string;
}

interface Notes {
    [key: number]: string
}

import {
    parse
} from "https://deno.land/std@0.201.0/csv/mod.ts";
  
const movies : MoviePageData[] = parse(Deno.readTextFileSync("movies/ratings.csv"), {
    skipFirstRow: true,
    strip: true,
});

const movieNotes : MovieNote[] = parse(Deno.readTextFileSync("movies/notes.csv"), {
    skipFirstRow: true,
    strip: true,
})

const notes : Notes = {}
for (const {id, note} of movieNotes) {
    notes[id] = note
}

export const layout = "default.liquid";

export default (data) => (
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
        {movies.map(({id, title, year, vote}) =>
          <tr key={id}>
            <td>
              <a href={`https://omdb.org/m${id}`} title="omdb page">{title}</a>
            </td>
            <td>{year}</td>
            <td>{(id in notes) ? <details><summary>{vote}</summary>{notes[id]}</details> : vote}</td>
          </tr>
        )}
      </tbody>
    </table>
    </>
);