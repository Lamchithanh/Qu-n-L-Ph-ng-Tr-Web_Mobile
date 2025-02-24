import React, { useState, useEffect } from "react";
import styles from "../../Style/Loader.module.scss";

const Loader = ({
  maxLoadTime = 5,
  onLoadTimeout,
  loadingMessages = [
    "Đang chuẩn bị dữ liệu",
    "Đang tải tài nguyên",
    "Đang xử lý thông tin",
  ],
}) => {
  const [loadTime, setLoadTime] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLoadTime((prevTime) => {
        // Nếu vượt quá thời gian tối đa
        if (prevTime >= maxLoadTime) {
          clearInterval(timer);
          onLoadTimeout && onLoadTimeout();
          return prevTime;
        }

        // Thay đổi thông báo sau mỗi giây
        if (prevTime > 0 && prevTime % 2 === 0) {
          setCurrentMessageIndex(
            (prevIndex) => (prevIndex + 1) % loadingMessages.length
          );
        }

        return prevTime + 1;
      });
    }, 1000);

    // Dọn dẹp timer khi component unmount
    return () => clearInterval(timer);
  }, [maxLoadTime, onLoadTimeout, loadingMessages]);

  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderWrapper}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 300 300"
          className={styles.houseSvg}
          role="img"
          aria-label="Đang tải"
        >
          {/* Nền nhà */}
          <path
            d="M50 150 L150 50 L250 150 L250 250 L50 250 Z"
            fill="#f0f4f8"
            stroke="#4f46e5"
            strokeWidth="4"
          />

          {/* Mái nhà */}
          <path
            d="M50 150 L150 50 L250 150"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="4"
          />

          {/* Cửa sổ */}
          <rect
            x="100"
            y="180"
            width="50"
            height="50"
            fill="#e0e7ff"
            stroke="#4f46e5"
            strokeWidth="2"
          />

          {/* Đường viền hoạt hình */}
          <path
            d="M50 150 L150 50 L250 150 L250 250 L50 250 Z"
            fill="none"
            stroke="url(#borderGradient)"
            strokeWidth="8"
            className={styles.animatedBorder}
          />

          {/* Gradient cho đường viền */}
          <defs>
            <linearGradient
              id="borderGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Nhân vật bên trong nhà */}
        <div className={styles.characterWrapper}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className={styles.characterSvg}
            role="img"
            aria-label="Nhân vật đang tải"
          >
            {/* Thân */}
            <circle
              cx="50"
              cy="60"
              r="30"
              fill="#4f46e5"
              className={styles.characterBody}
            />

            {/* Đầu */}
            <circle
              cx="50"
              cy="30"
              r="20"
              fill="#06b6d4"
              className={styles.characterHead}
            />
          </svg>
        </div>
      </div>

      {/* Văn bản tải */}
      <div className={styles.loaderText} aria-live="polite">
        <span>{loadingMessages[currentMessageIndex]}</span>
        <div className={styles.dotAnimation}>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
        <span className={styles.loadTimeIndicator}>{loadTime} giây</span>
      </div>
    </div>
  );
};

export default Loader;
