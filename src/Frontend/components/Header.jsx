import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../../Style/Header.module.scss";
import { CONFIG } from "../config/config";
import { useToast } from "../Contexts/ToastContext";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/736x/52/46/49/524649971a55b2f3a0dae1d537c61098.jpg";

const Header = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    avatar: DEFAULT_AVATAR,
    role: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await fetch(`${CONFIG.API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setIsLoggedIn(true);
          setUserInfo({
            name: userData.full_name || userData.username,
            avatar: userData.avatar || DEFAULT_AVATAR,
            role: userData.role || "tenant", // Lưu role từ response
          });
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin user:", error);
        handleLogout();
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest(`.${styles.userInfo}`)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setShowUserMenu(false);
    setUserInfo({
      name: "",
      avatar: DEFAULT_AVATAR,
    });
    showToast("Đăng xuất thành công", "success"); // Thêm thông báo khi đăng xuất
  };

  const handleMenuItemClick = () => {
    // Đóng menu khi click vào bất kỳ mục nào
    setShowUserMenu(false);
  };

  const getMenuItems = () => {
    const commonItems = [
      {
        to: "/RentalContract",
        label: "Hợp đồng thuê",
      },
      {
        to: "/BillPayment",
        label: "Hóa đơn & Thanh toán",
      },
    ];

    if (userInfo.role === "staff") {
      return [
        {
          to: "/TenantManagement",
          label: "Quản lý người thuê",
        },
        ...commonItems,
      ];
    }

    return [
      {
        to: "/ProfilePage",
        label: "Thông tin cá nhân",
      },
      ...commonItems,
    ];
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.glassMorphism}></div>
      <nav className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>LOGO</span>
          <div className={styles.logoHighlight}></div>
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <Link to="/" className={styles.navLink}>
              <span>Trang chủ</span>
              <div className={styles.linkHighlight}></div>
            </Link>
          </li>
          <li>
            <Link to="/AboutPage" className={styles.navLink}>
              <span>Giới thiệu</span>
              <div className={styles.linkHighlight}></div>
            </Link>
          </li>
          <li>
            <Link to="/ContactPage" className={styles.navLink}>
              <span>Liên hệ</span>
              <div className={styles.linkHighlight}></div>
            </Link>
          </li>

          <li className={styles.authSection}>
            {!isLoggedIn ? (
              <div className={styles.authLinks}>
                <Link to="/auth" className={styles.loginButton}>
                  <span>Đăng nhập</span>
                  <div className={styles.buttonGlow}></div>
                </Link>
                <Link to="/auth" className={styles.registerButton}>
                  <span>Đăng ký</span>
                  <div className={styles.buttonGlow}></div>
                </Link>
              </div>
            ) : (
              <div className={styles.userInfo}>
                <div
                  className={styles.userAvatar}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className={styles.avatarContainer}>
                    <img
                      src={userInfo.avatar} // Sử dụng avatar từ state
                      alt="User avatar"
                      onError={(e) => {
                        e.target.src = DEFAULT_AVATAR;
                      }}
                      className={styles.avatarImage}
                    />
                    <div className={styles.avatarRing}></div>
                  </div>
                  <span className={styles.userName}>{userInfo.name}</span>
                </div>

                {showUserMenu && (
                  <div className={styles.userMenu}>
                    <div className={styles.menuBackground}></div>
                    {getMenuItems().map((item, index) => (
                      <Link
                        key={index}
                        to={item.to}
                        className={styles.menuItem}
                        onClick={handleMenuItemClick}
                      >
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <button onClick={handleLogout} className={styles.menuItem}>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
