import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import styles from "../../Style/MainLayout.module.scss";
import ChatWidget from "../components/ChatWidget";

const MainLayout = () => {
  return (
    <div className={styles.mainLayout}>
      <Header className={styles.header} />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer className={styles.footer} />
      <ChatWidget />
    </div>
  );
};

export default MainLayout;
