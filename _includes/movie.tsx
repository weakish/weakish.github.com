export interface MoviePageData extends Lume.Data {
  id: number;
  year: number;
  vote: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

export const layout = "default.liquid";

export default ({ id, title, year, vote }: MoviePageData) => (
  <table>
    <tbody>
      <tr>
        <th>Title</th>
        <td>
          <a href={`https://omdb.org/m${id}`}>{title}</a>
        </td>
      </tr>
      <tr>
        <th>Year</th>
        <td>{year}</td>
      </tr>
      <tr>
        <th>Rating</th>
        <td>{vote}</td>
      </tr>
    </tbody>
  </table>
);
