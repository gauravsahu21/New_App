import Image from "next/image";
import { data } from "@/data";

export function ItemCatalog() {
  return (
    <section aria-labelledby="gifts-title" className="item-catalog">
      <header className="item-catalog-heading">
        <div>
          <p className="eyebrow account-eyebrow">COLLECTION</p>
          <h2 className="item-catalog-title" id="gifts-title">Gifts</h2>
        </div>
        <span className="item-catalog-count">{data.length} GIFTS</span>
      </header>

      <div className="item-table-scroll">
        <table className="item-table">
          <thead>
            <tr>
              <th scope="col">Gift</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.name}>
                <td>
                  <div className="item-cell">
                    <span className="item-index">{String(index + 1).padStart(3, "0")}</span>
                    <Image
                      alt=""
                      className="item-thumbnail"
                      height={48}
                      src={item.img}
                      width={48}
                    />
                    <span className="item-name">{item.name}</span>
                  </div>
                </td>
                <td className="item-points-cell">
                  <span className="item-points">{item.points}<small> pts</small></span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}