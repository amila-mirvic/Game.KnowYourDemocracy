import React, { useEffect, useMemo, useState } from 'react';
import styles from './MatchAnswerGrid.module.css';

function normalizeItem(item, side) {
  if (typeof item === 'string') {
    return {
      key: item,
      label: item,
      side,
    };
  }

  return {
    key: item.key,
    label: item.label,
    side,
  };
}

export default function MatchAnswerGrid({
  leftItems = [],
  rightItems = [],
  matches = {},
  disabled = false,
  className = '',
  wrongLockMs = 550,
  onRoundResolved,
}) {
  const left = useMemo(() => leftItems.map((item) => normalizeItem(item, 'left')), [leftItems]);
  const right = useMemo(() => rightItems.map((item) => normalizeItem(item, 'right')), [rightItems]);

  const [selectedLeft, setSelectedLeft] = useState(null);
  const [selectedRight, setSelectedRight] = useState(null);
  const [resolvedLeft, setResolvedLeft] = useState([]);
  const [resolvedRight, setResolvedRight] = useState([]);
  const [wrongLeft, setWrongLeft] = useState([]);
  const [wrongRight, setWrongRight] = useState([]);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    setSelectedLeft(null);
    setSelectedRight(null);
    setResolvedLeft([]);
    setResolvedRight([]);
    setWrongLeft([]);
    setWrongRight([]);
    setAttempts([]);
  }, [leftItems, rightItems, matches]);

  useEffect(() => {
    if (!selectedLeft || !selectedRight || disabled) return;

    const leftItem = left.find((item) => item.key === selectedLeft);
    const rightItem = right.find((item) => item.key === selectedRight);

    if (!leftItem || !rightItem) {
      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }

    const isCorrect = matches[selectedLeft] === selectedRight;

    if (isCorrect) {
      setResolvedLeft((prev) => (prev.includes(selectedLeft) ? prev : [...prev, selectedLeft]));
      setResolvedRight((prev) => (prev.includes(selectedRight) ? prev : [...prev, selectedRight]));

      setAttempts((prev) => {
        const filtered = prev.filter((entry) => entry.leftKey !== selectedLeft);
        return [
          ...filtered,
          {
            leftKey: selectedLeft,
            leftLabel: leftItem.label,
            chosenRightKey: selectedRight,
            chosenRightLabel: rightItem.label,
            correctRightKey: selectedRight,
            correctRightLabel: rightItem.label,
            isCorrect: true,
          },
        ];
      });

      setSelectedLeft(null);
      setSelectedRight(null);
      return;
    }

    const wrongLeftKey = selectedLeft;
    const wrongRightKey = selectedRight;
    const correctRightKey = matches[selectedLeft];
    const correctRightItem = right.find((item) => item.key === correctRightKey);

    setWrongLeft((prev) => (prev.includes(wrongLeftKey) ? prev : [...prev, wrongLeftKey]));
    setWrongRight((prev) => (prev.includes(wrongRightKey) ? prev : [...prev, wrongRightKey]));

    setAttempts((prev) => {
      const filtered = prev.filter((entry) => entry.leftKey !== wrongLeftKey);
      return [
        ...filtered,
        {
          leftKey: wrongLeftKey,
          leftLabel: leftItem.label,
          chosenRightKey: wrongRightKey,
          chosenRightLabel: rightItem.label,
          correctRightKey,
          correctRightLabel: correctRightItem?.label || '',
          isCorrect: false,
        },
      ];
    });

    setSelectedLeft(null);
    setSelectedRight(null);

    const timeout = window.setTimeout(() => {
      setWrongLeft((prev) => prev.filter((key) => key !== wrongLeftKey));
      setWrongRight((prev) => prev.filter((key) => key !== wrongRightKey));
    }, wrongLockMs);

    return () => window.clearTimeout(timeout);
  }, [selectedLeft, selectedRight, matches, disabled, left, right, wrongLockMs]);

  useEffect(() => {
    if (disabled) return;
    if (left.length === 0) return;
    if (attempts.length !== left.length) return;

    const correctAnswers = left.map((item) => {
      const rightKey = matches[item.key];
      const rightItem = right.find((r) => r.key === rightKey);

      return {
        leftKey: item.key,
        leftLabel: item.label,
        rightKey,
        rightLabel: rightItem?.label || '',
      };
    });

    const isPerfect = attempts.every((entry) => entry.isCorrect);

    const timer = window.setTimeout(() => {
      onRoundResolved?.({
        isPerfect,
        attempts,
        correctAnswers,
      });
    }, 180);

    return () => window.clearTimeout(timer);
  }, [attempts, disabled, left, matches, onRoundResolved, right]);

  const canInteract = !disabled;

  return (
    <div className={`${styles.shell} ${className}`.trim()}>
      <div className={styles.grid}>
        <div className={styles.column}>
          {left.map((item) => {
            if (resolvedLeft.includes(item.key)) {
              return <div key={item.key} className={styles.placeholder} aria-hidden="true" />;
            }

            const isSelected = selectedLeft === item.key;
            const isWrong = wrongLeft.includes(item.key);
            const isDisabled = !canInteract || isWrong;

            return (
              <button
                key={item.key}
                type="button"
                className={`${styles.card} ${isSelected ? styles.selected : ''} ${isWrong ? styles.wrong : ''}`.trim()}
                onClick={() => {
                  if (isDisabled) return;
                  setSelectedLeft((prev) => (prev === item.key ? null : item.key));
                }}
                disabled={isDisabled}
                aria-pressed={isSelected}
              >
                <span className={styles.label}>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.column}>
          {right.map((item) => {
            if (resolvedRight.includes(item.key)) {
              return <div key={item.key} className={styles.placeholder} aria-hidden="true" />;
            }

            const isSelected = selectedRight === item.key;
            const isWrong = wrongRight.includes(item.key);
            const isDisabled = !canInteract || isWrong;

            return (
              <button
                key={item.key}
                type="button"
                className={`${styles.card} ${isSelected ? styles.selected : ''} ${isWrong ? styles.wrong : ''}`.trim()}
                onClick={() => {
                  if (isDisabled) return;
                  setSelectedRight((prev) => (prev === item.key ? null : item.key));
                }}
                disabled={isDisabled}
                aria-pressed={isSelected}
              >
                <span className={styles.label}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}