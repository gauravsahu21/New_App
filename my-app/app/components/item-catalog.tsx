import Image from "next/image";
import { data } from "@/data";

export function ItemCatalog() {
  return (
    <section aria-labelledby="gifts-title" className="item-catalog">
      <header className="item-catalog-heading">
        <div>
          <p className="eyebrow account-eyebrow" id="gifts-title">AVAILABLE REWARDS</p>
        </div>
        <span className="item-catalog-count">{data.length} REWARDS</span>
      </header>

      <div className="reward-grid-scroll">
        <ul className="reward-grid">
          {data.map((item, index) => (
            <li className="reward-item" key={item.name}>
              <span className="item-index">{String(index + 1).padStart(3, "0")}</span>
              <Image
                alt=""
                className="item-thumbnail"
                height={64}
                src={item.img}
                width={64}
              />
              <div className="reward-details">
                <span className="reward-type">GIFT</span>
                <span className="item-name">{item.name}</span>
              </div>
              <span className="item-points">{item.points}<small>pts</small></span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}