import styles from "./Loading.module.css";
import logo from "../assets/LogoSomenteIcone.png";

function Loading() {
  return (
    <div className={styles.loading}>
      <div className={styles.container}>
        <img src={logo} alt="Sonora" className={styles.logo} />
        <p className={styles.text}>Carregando...</p>
      </div>
    </div>
  );
}

export default Loading;