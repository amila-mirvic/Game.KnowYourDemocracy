import React from 'react';
import styles from './FlyItemsLayer.module.css';

export default function FlyItemsLayer({ items = [] }) {
  return (
    <div className={styles.layer} aria-hidden="true">
      {items.map((item) => {
        const dx = item.toX - item.fromX;
        const dy = item.toY - item.fromY;

        return (
          <div
            key={item.id}
            className={styles.flyItem}
            style={{
              left: `${item.fromX}px`,
              top: `${item.fromY}px`,
              '--dx': `${dx}px`,
              '--dy': `${dy}px`,
            }}
          >
            <img src={item.icon} alt="" className={styles.icon} />
            {item.delta ? <span className={styles.delta}>{item.delta}</span> : null}
          </div>
        );
      })}
    </div>
  );
}