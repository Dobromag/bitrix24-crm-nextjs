import clsx from "clsx";
import styles from "./LiveIndicator.module.scss";

interface LiveIndicatorProps {
  className?: string;
}

export const LiveIndicator = ({ className }: LiveIndicatorProps) => {
  return (
    <div className={clsx(styles.indicator, className)}>
      <span className={styles.pulse} />
      <span className={styles.text}>LIVE</span>
    </div>
  );
};
