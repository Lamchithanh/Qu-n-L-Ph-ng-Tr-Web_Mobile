// src/components/Home/HeroSection/HeroSection.jsx
import { useState } from "react";
import { MapPin, Home, DollarSign } from "lucide-react";
import styles from "../../Style/HeroSection.module.scss";

const HeroSection = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState({
    location: "",
    priceRange: "",
    type: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchParams);
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <h1>Tìm Ngôi Nhà Mơ Ước Của Bạn</h1>
        <p>Khám phá hàng nghìn căn hộ chất lượng cao với mức giá phù hợp</p>

        <form onSubmit={handleSubmit} className={styles.searchForm}>
          <div className={styles.searchInputs}>
            <div className={styles.inputGroup}>
              <MapPin className={styles.icon} size={20} />
              <input
                type="text"
                placeholder="Khu vực"
                value={searchParams.location}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    location: e.target.value,
                  })
                }
              />
            </div>

            <div className={styles.inputGroup}>
              <DollarSign className={styles.icon} size={20} />
              <select
                value={searchParams.priceRange}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    priceRange: e.target.value,
                  })
                }
              >
                <option value="">Khoảng giá</option>
                <option value="0-2">Dưới 2 triệu</option>
                <option value="2-3">2 - 3 triệu</option>
                <option value="3-5">3 - 5 triệu</option>
                <option value="5+">Trên 5 triệu</option>
              </select>
            </div>

            <button type="submit" className={styles.searchButton}>
              Tìm Kiếm
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
