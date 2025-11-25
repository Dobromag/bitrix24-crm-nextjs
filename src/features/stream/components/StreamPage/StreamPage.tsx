import Image from "next/image";
import Link from "next/link";
import { LiveIndicator } from "../LiveIndicator/LiveIndicator";
import styles from "./StreamPage.module.scss";

export const StreamPage = () => {
  return (
    <div className={styles.container}>
      {/* Видео контейнер */}
      <div className={styles.videoWrapper}>
        <Image
          src="/images/stream/stream.jpg"
          alt="Прямая трансляция"
          fill
          priority
          className={styles.video}
          sizes="100vw"
        />
        <LiveIndicator className={styles.liveBadge} />
      </div>

      {/* Контент */}
      <div className={styles.content}>
        <h1 className={styles.title}>Прямая трансляция</h1>
        <p className={styles.description}>
          Следите за процессом выполнения заказов в реальном времени. Видите,
          как работают мастера, как собираются заказы, как всё происходит на
          складе.
        </p>

        {/* Статистика */}
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.value}>12</div>
            <div className={styles.label}>Активных заказов</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.value}>3</div>
            <div className={styles.label}>Сотрудника онлайн</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.value}>47</div>
            <div className={styles.label}>Зрителей</div>
          </div>
        </div>

        {/* Кнопка назад */}
        <Link href="/dashboard" className={styles.backLink}>
          ← Назад на дашборд
        </Link>
      </div>
    </div>
  );
};
