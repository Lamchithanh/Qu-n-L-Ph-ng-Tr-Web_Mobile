// src/Frontend/components/PageLoader/index.jsx
import styles from "../../Style/PageLoader.module.scss";

const PageLoader = () => {
  return (
    <div className={styles.pageLoader}>
      <div className={styles.container}>
        <div className={styles.spinnerContainer}>
          <div className={styles.spinnerOuter}>
            <div className={styles.spinnerInner}>
              <div className={styles.spinnerCenter}></div>
            </div>
          </div>
        </div>
        <div className={styles.loadingContent}>
          <div className={styles.loadingText}>Đang tải trang</div>
          <div className={styles.loadingDots}>
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
