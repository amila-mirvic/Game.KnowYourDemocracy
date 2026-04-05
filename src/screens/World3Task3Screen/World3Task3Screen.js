import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CorrectFlash from '../../components/game/CorrectFlash';
import FlyItemsLayer from '../../components/game/FlyItemsLayer';
import GameplayShell from '../../components/game/GameplayShell';
import InfoModal from '../../components/game/InfoModal';
import QuestionCard from '../../components/game/QuestionCard';
import QuizAnswerGrid from '../../components/game/QuizAnswerGrid';
import TaskCompletionModal from '../../components/game/TaskCompletionModal';
import TaskTopBar from '../../components/game/TaskTopBar';
import { WORLD3_FEEDBACK_MESSAGES, WORLD3_TASK3 } from '../../game/content/world3Tasks';
import { getPlayerFromLocationState } from '../../game/utils/player';
import { safeRead, safeWrite } from '../../game/utils/storage';

const MAIN_MENU_ROUTE = '/world-3';
const NEXT_TASK_ROUTE = '/world-3/task-4-intro';

const FALLBACK_BADGES = {
  beginner: `${process.env.PUBLIC_URL}/world1/task1/beginner.png`,
  advanced: `${process.env.PUBLIC_URL}/world1/task1/advanced.png`,
  expert: `${process.env.PUBLIC_URL}/world1/task1/expert.png`,
};

const resolveSkillBadge = (points, badges) => {
  if (points <= 8) return { id: 'beginner', src: badges.beginner };
  if (points <= 20) return { id: 'advanced', src: badges.advanced };
  return { id: 'expert', src: badges.expert };
};

function resolveCorrectKey(item, rawOptions) {
  if (item?.correctKey) return item.correctKey;

  const explicitCorrect = rawOptions.find((option) => option?.correct === true);
  if (explicitCorrect?.key) return explicitCorrect.key;

  let bestOption = null;
  for (const option of rawOptions) {
    if (!bestOption) {
      bestOption = option;
      continue;
    }

    const bestPoints = typeof bestOption?.points === 'number' ? bestOption.points : -Infinity;
    const currentPoints = typeof option?.points === 'number' ? option.points : -Infinity;

    if (currentPoints > bestPoints) {
      bestOption = option;
    }
  }

  return bestOption?.key || null;
}

function normalizeTask3(taskData) {
  const badges = {
    beginner: taskData?.badges?.beginner || FALLBACK_BADGES.beginner,
    advanced: taskData?.badges?.advanced || FALLBACK_BADGES.advanced,
    expert: taskData?.badges?.expert || FALLBACK_BADGES.expert,
  };

  const backgroundUrl =
    taskData?.backgroundUrl || `${process.env.PUBLIC_URL}/world3/bg3.png`;

  const pointsIcon =
    taskData?.pointsIcon || `${process.env.PUBLIC_URL}/world1/task1/points.png`;

  const curiosityIcon =
    taskData?.curiosityIcon || `${process.env.PUBLIC_URL}/world1/task1/curiositypoints.png`;

  const rawScenarios = Array.isArray(taskData?.scenarios)
    ? taskData.scenarios
    : Array.isArray(taskData?.rounds)
    ? taskData.rounds
    : [];

  const scenarios = rawScenarios.map((item, index) => {
    const rawOptions = Array.isArray(item?.options)
      ? item.options
      : Array.isArray(item?.answers)
      ? item.answers
      : [];

    const correctKey = resolveCorrectKey(item, rawOptions);

    const normalizedOptions = rawOptions.map((option) => {
      const isCorrect = option?.key === correctKey;

      const feedback =
        option?.feedback ||
        item?.feedbackMap?.[option?.key] ||
        item?.feedback ||
        'Think about which action creates the strongest civic impact.';

      return {
        key: option?.key || `option-${index}`,
        label: option?.label || option?.text || 'OPTION',
        feedback,
        isCorrect,
        awardedPoints: isCorrect ? (typeof option?.points === 'number' ? option.points : 8) : 0,
      };
    });

    return {
      id: item?.id || `scenario-${index + 1}`,
      title: item?.title || `SCENARIO ${index + 1}`,
      statement: item?.statement || item?.text || '',
      correctKey,
      options: normalizedOptions,
    };
  });

  return {
    badges,
    backgroundUrl,
    pointsIcon,
    curiosityIcon,
    scenarios,
  };
}

export default function World3Task3Screen() {
  const navigate = useNavigate();
  const location = useLocation();
  const player = useMemo(() => getPlayerFromLocationState(location.state), [location.state]);
  const nameUpper = (player?.name || 'PLAYER').toUpperCase();

  const task3 = useMemo(() => normalizeTask3(WORLD3_TASK3 || {}), []);
  const scenarios = task3.scenarios;

  const [index, setIndex] = useState(0);
  const current = scenarios[index] || null;

  const [points, setPoints] = useState(0);
  const [curiosityPoints] = useState(0);
  const [flashOpen, setFlashOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [topMessage, setTopMessage] = useState(`${nameUpper} KEEP GOING`);
  const [endOpen, setEndOpen] = useState(false);
  const [locked, setLocked] = useState(false);

  const pointsTargetRef = useRef(null);
  const curiosityTargetRef = useRef(null);
  const cardRef = useRef(null);
  const [flyItems, setFlyItems] = useState([]);
  const flyIdRef = useRef(0);
  const [pulsePoints, setPulsePoints] = useState(false);
  const [pulseCuriosity] = useState(false);

  useEffect(() => {
    setTopMessage(`${nameUpper} KEEP GOING`);
  }, [nameUpper]);

  useEffect(() => {
    setLocked(false);
  }, [index]);

  const pickTopMessage = useCallback(() => {
    setTopMessage((prev) => {
      let next = prev;
      let guard = 0;

      while (next === prev && guard < 10) {
        next =
          WORLD3_FEEDBACK_MESSAGES[
            Math.floor(Math.random() * WORLD3_FEEDBACK_MESSAGES.length)
          ].replace('{NAME}', nameUpper);
        guard += 1;
      }

      return next;
    });
  }, [nameUpper]);

  const makeFly = useCallback(({ type, icon, delta }) => {
    const fromRect = cardRef.current?.getBoundingClientRect();
    const toRect =
      type === 'points'
        ? pointsTargetRef.current?.getBoundingClientRect()
        : curiosityTargetRef.current?.getBoundingClientRect();

    if (!fromRect || !toRect) return;

    const id = flyIdRef.current++;

    setFlyItems((items) => [
      ...items,
      {
        id,
        icon,
        delta,
        fromX: fromRect.left + fromRect.width * 0.65,
        fromY: fromRect.top + fromRect.height * 0.32,
        toX: toRect.left + toRect.width * 0.5,
        toY: toRect.top + toRect.height * 0.5,
      },
    ]);

    window.setTimeout(() => {
      setFlyItems((items) => items.filter((item) => item.id !== id));

      if (type === 'points') {
        setPulsePoints(true);
        window.setTimeout(() => setPulsePoints(false), 320);
      }
    }, 820);
  }, []);

  const showFlash = useCallback(() => {
    setFlashOpen(true);
    window.setTimeout(() => setFlashOpen(false), 520);
  }, []);

  const saveResults = useCallback((taskPoints, badges) => {
    safeWrite('yd_world3_task3', {
      points: taskPoints,
      curiosityPoints: 0,
      badges,
      totalScenarios: scenarios.length,
      finishedAt: Date.now(),
    });

    if (!safeRead('yd_world3_task3_counted')) {
      const prev = safeRead('yd_scores', {
        totalPoints: 0,
        totalCuriosityPoints: 0,
        badges: [],
      });

      safeWrite('yd_scores', {
        totalPoints: (prev.totalPoints || 0) + taskPoints,
        totalCuriosityPoints: prev.totalCuriosityPoints || 0,
        badges: [...(prev.badges || []), ...badges],
      });

      safeWrite('yd_world3_task3_counted', true);
    }
  }, [scenarios.length]);

  const finishTask = useCallback(() => {
    const badges = [resolveSkillBadge(points, task3.badges)];
    saveResults(points, badges);
    setEndOpen(true);
  }, [points, saveResults, task3.badges]);

  const nextScenario = useCallback(() => {
    setIndex((prev) => {
      const next = prev + 1;
      if (next >= scenarios.length) {
        window.setTimeout(() => finishTask(), 120);
        return prev;
      }
      return next;
    });
  }, [finishTask, scenarios.length]);

  const handleOption = useCallback(
    (option) => {
      if (!current || modalOpen || endOpen || locked) return;

      setLocked(true);
      pickTopMessage();

      const isCorrect = option.key === current.correctKey;
      const gainedPoints = isCorrect ? option.awardedPoints || 0 : 0;

      if (gainedPoints > 0) {
        makeFly({
          type: 'points',
          icon: task3.pointsIcon,
          delta: `+${gainedPoints}`,
        });
        window.setTimeout(() => setPoints((v) => v + gainedPoints), 320);
      }

      if (isCorrect) {
        showFlash();
        window.setTimeout(() => {
          nextScenario();
        }, 680);
        return;
      }

      setModalText(option.feedback || 'Think about which action is most effective.');
      setModalOpen(true);

      window.setTimeout(() => {
        setModalOpen(false);
        nextScenario();
      }, 920);
    },
    [current, endOpen, locked, makeFly, modalOpen, nextScenario, pickTopMessage, showFlash, task3.pointsIcon]
  );

  const earnedBadges = useMemo(
    () => [resolveSkillBadge(points, task3.badges)],
    [points, task3.badges]
  );

  const hasScenarios = scenarios.length > 0;

  return (
    <GameplayShell backgroundUrl={task3.backgroundUrl}>
      <TaskTopBar
        message={topMessage}
        points={points}
        curiosityPoints={curiosityPoints}
        pointsIcon={task3.pointsIcon}
        curiosityIcon={task3.curiosityIcon}
        pointsTargetRef={pointsTargetRef}
        curiosityTargetRef={curiosityTargetRef}
        pulsePoints={pulsePoints}
        pulseCuriosity={pulseCuriosity}
      />

      <div
        style={{
          display: 'grid',
          gap: '22px',
          justifyItems: 'center',
          alignContent: 'center',
          minHeight: 'calc(100dvh - 140px)',
          padding: '12px 16px 22px',
        }}
      >
        <QuestionCard
          cardRef={cardRef}
          title={current?.title || 'TASK 3'}
          text={
            current?.statement ||
            (hasScenarios
              ? ''
              : 'No valid scenarios were found for Task 3. Check world3Tasks.js structure for this task.')
          }
        />

        {hasScenarios ? (
          <QuizAnswerGrid
            answers={(current?.options || []).map((option) => ({
              key: option.key,
              label: option.label,
              onClick: () => handleOption(option),
            }))}
          />
        ) : (
          <div
            style={{
              width: 'min(1120px, 100%)',
              padding: '24px',
              borderRadius: '28px',
              border: '6px solid #f4bc1f',
              background: '#cb5b3f',
              color: '#fff',
              fontFamily: 'Tomorrow, sans-serif',
              fontWeight: 700,
              textTransform: 'uppercase',
              textAlign: 'center',
            }}
          >
            Task 3 data is missing or not in the expected format.
          </div>
        )}
      </div>

      <FlyItemsLayer items={flyItems} />
      <CorrectFlash open={flashOpen} label="GOOD MOVE" />
      <InfoModal open={modalOpen} onClose={() => setModalOpen(false)} text={modalText} />

      <TaskCompletionModal
        open={endOpen}
        onClose={() => navigate(MAIN_MENU_ROUTE, { state: player })}
        title={`BRAVO ${nameUpper} YOU CHOSE TO ACT!`}
        stats={[
          { label: 'POINTS', value: points },
          { label: 'CURIOSITY POINTS', value: curiosityPoints },
        ]}
        badges={earnedBadges}
        actions={[
          { label: 'GO TO TASK 4', onClick: () => navigate(NEXT_TASK_ROUTE, { state: player }) },
          { label: 'GO BACK TO MAIN MENU', onClick: () => navigate(MAIN_MENU_ROUTE, { state: player }) },
        ]}
      />
    </GameplayShell>
  );
}