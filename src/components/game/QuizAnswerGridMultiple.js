import React from 'react';
import styles from './QuizAnswerGridMultiple.module.css';

function normalizeValue(item) {
  if (typeof item === 'string') {
    return {
      key: item,
      label: item,
      disabled: false,
    };
  }

  return {
    key: item.key,
    label: item.label,
    disabled: Boolean(item.disabled),
  };
}

export default function QuizAnswerGridMultiple({
  answers = [],
  selectedKeys = [],
  onToggle,
  onSubmit,
  disabled = false,
  className = '',
  maxSelections,
  submitLabel = 'CONFIRM',
}) {
  const normalizedAnswers = answers.map(normalizeValue);
  const countClass =
    normalizedAnswers.length >= 5 ? styles.fiveItems : normalizedAnswers.length === 3 ? styles.threeItems : '';

  return (
    <div className={`${styles.shell} ${className}`.trim()}>
      <div className={`${styles.grid} ${countClass}`.trim()}>
        {normalizedAnswers.map((answer) => {
          const isSelected = selectedKeys.includes(answer.key);
          const isDisabled =
            disabled ||
            answer.disabled ||
            (!isSelected && maxSelections && selectedKeys.length >= maxSelections);

          return (
            <button
              key={answer.key}
              type="button"
              className={`${styles.card} ${isSelected ? styles.selected : ''}`.trim()}
              onClick={() => {
                if (isDisabled) return;
                onToggle?.(answer.key);
              }}
              disabled={isDisabled}
              aria-pressed={isSelected}
            >
              <span className={styles.label}>{answer.label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.footer}>
        <div className={styles.helper}>
          {'YOU CAN SELECT MULTIPLE ANSWERS'}
        </div>

        <button
          type="button"
          className={styles.submitButton}
          onClick={() => onSubmit?.()}
          disabled={disabled || selectedKeys.length === 0}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}