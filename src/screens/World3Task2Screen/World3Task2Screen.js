import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CorrectFlash from '../../components/game/CorrectFlash';
import FlyItemsLayer from '../../components/game/FlyItemsLayer';
import GameplayShell from '../../components/game/GameplayShell';
import InfoModal from '../../components/game/InfoModal';
import MatchAnswerGrid from '../../components/game/MatchAnswerGrid';
import QuestionCard from '../../components/game/QuestionCard';
import TaskCompletionModal from '../../components/game/TaskCompletionModal';
import TaskTopBar from '../../components/game/TaskTopBar';
import { WORLD3_FEEDBACK_MESSAGES, WORLD3_TASK2 } from '../../game/content/world3Tasks';
import { getPlayerFromLocationState } from '../../game/utils/player';
import { safeRead, safeWrite } from '../../game/utils/storage';

const MAIN_MENU_ROUTE = '/world-3';
const NEXT_TASK_ROUTE = '/world-3/task-3-intro';

const resolveSkillBadge = (points) => {
  if (points <= 6) return { id: 'beginner', src: WORLD3_TASK2.badges.beginner };
  if (points <= 12) return { id: 'advanced', src: WORLD3_TASK2.badges.advanced };
  return { id: 'expert', src: WORLD3_TASK2.badges.expert };
};

function normalizeRound(round) {
  if (!round) {
    return {
      id: 'round',
      title: '',
      prompt: '',
      leftItems: [],
      rightItems: [],
      matches: {},
      feedbackText: '',
    };
  }

  if (Array.isArray(round.items) && Array.isArray(round.options)) {
    const trimmedOptions = round.options.slice(0, 2);

    return {
      id: round.id || round.title || 'round',
      title: round.title || '',
      prompt: round.prompt || 'Match each barrier with the most effective solution.',
      leftItems: round.items.map((item) => ({
        key: item.key,
        label: item.barrier || item.label || item.text || '',
      })),
      rightItems: trimmedOptions.map((option) => ({
        key: option.key,
        label: option.label || option.text || '',
      })),
      matches: Object.fromEntries(round.items.map((item) => [item.key, item.correctKey])),
      feedbackText: round.feedback || '',
    };
  }

  if (Array.isArray(round.pairs) && Array.isArray(round.solutions)) {
    const usedSolutionIds = round.pairs.map((pair) => pair.correctSolutionId);
    const filteredSolutions = round.solutions.filter((solution) => usedSolutionIds.includes(solution.id));

    return {
      id: round.id || round.title || 'round',
      title: round.title || '',
      prompt: round.prompt || 'Match each barrier with the most effective solution.',
      leftItems: round.pairs.map((pair) => ({
        key: pair.barrierId,
        label: pair.barrier || '',
      })),
      rightItems: filteredSolutions.map((solution) => ({
        key: solution.id,
        label: solution.label || '',
      })),
      matches: Object.fromEntries(round.pairs.map((pair) => [pair.barrierId, pair.correctSolutionId])),
      feedbackText: round.feedback || '',
    };
  }

  return {
    id: round.id || round.title || 'round',
    title: round.title || '',
    prompt: round.prompt || 'Match each barrier with the most effective solution.',
    leftItems: [],
    rightItems: [],
    matches: {},
    feedbackText: round.feedback || '',
  };
}

function buildWrongAnswerText(payload, roundFeedback) {
  const attempts = payload?.attempts || [];
  const correctAnswers = payload?.correctAnswers || [];

  const wrongAttempts = attempts.filter((entry) => !entry.isCorrect);

  const wrongText =
    wrongAttempts.length > 0
      ? wrongAttempts
          .map(
            (entry) =>
              `FOR "${entry.leftLabel}" THE CORRECT ANSWER IS:\n${entry.correctRightLabel}`
          )
          .join('\n\n')
      : 'NOT QUITE.';

  const allCorrectMatches = correctAnswers
    .map((item) => `${item.leftLabel} → ${item.rightLabel}`)
    .join('\n');

  return `${wrongText}\n\nCORRECT MATCHES:\n${allCorrectMatches}${roundFeedback ? `\n\n${roundFeedback}` : ''}`;
}

export default function World3Task2Screen() {
  const navigate = useNavigate();
  const location = useLocation();
  const player = useMemo(() => getPlayerFromLocationState(location.state), [location.state]);
  const nameUpper = (player?.name || 'PLAYER').toUpperCase();

  const [roundIndex, setRoundIndex] = useState(0);
  const currentRaw = WORLD3_TASK2.rounds?.[roundIndex] || null;
  const current = useMemo(() => normalizeRound(currentRaw), [currentRaw]);

  const [points, setPoints] = useState(0);
  const [curiosityPoints] = useState(0);
  const [flashOpen, setFlashOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalText, setModalText] = useState('');
  const [topMessage, setTopMessage] = useState(`${nameUpper} KEEP GOING`);
  const [endOpen, setEndOpen] = useState(false);
  const [roundLocked, setRoundLocked] = useState(false);

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
    setRoundLocked(false);
  }, [roundIndex]);

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
    safeWrite('yd_world3_task2', {
      points: taskPoints,
      curiosityPoints: 0,
      badges,
      totalRounds: WORLD3_TASK2.rounds.length,
      finishedAt: Date.now(),
    });

    if (!safeRead('yd_world3_task2_counted')) {
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

      safeWrite('yd_world3_task2_counted', true);
    }
  }, []);

  const finishTask = useCallback(() => {
    const badges = [resolveSkillBadge(points)];
    saveResults(points, badges);
    setEndOpen(true);
  }, [points, saveResults]);

  const nextRound = useCallback(() => {
    setRoundIndex((prev) => {
      const next = prev + 1;

      if (next >= WORLD3_TASK2.rounds.length) {
        window.setTimeout(() => finishTask(), 120);
        return prev;
      }

      return next;
    });
  }, [finishTask]);

  const handleRoundResolved = useCallback(
    (payload) => {
      if (!current || roundLocked || modalOpen || endOpen) return;

      setRoundLocked(true);
      pickTopMessage();

      if (payload?.isPerfect) {
        const earned = current.leftItems.length * 3;

        showFlash();
        makeFly({
          type: 'points',
          icon: WORLD3_TASK2.pointsIcon,
          delta: `+${earned}`,
        });

        window.setTimeout(() => setPoints((v) => v + earned), 320);
        window.setTimeout(() => nextRound(), 850);
        return;
      }

      setModalText(buildWrongAnswerText(payload, current.feedbackText));
      setModalOpen(true);

      window.setTimeout(() => {
        setModalOpen(false);
        nextRound();
      }, 1300);
    },
    [current, endOpen, makeFly, modalOpen, nextRound, pickTopMessage, roundLocked, showFlash]
  );

  const earnedBadges = useMemo(() => [resolveSkillBadge(points)], [points]);

  return (
    <GameplayShell backgroundUrl={WORLD3_TASK2.backgroundUrl}>
      <TaskTopBar
        message={topMessage}
        points={points}
        curiosityPoints={curiosityPoints}
        pointsIcon={WORLD3_TASK2.pointsIcon}
        curiosityIcon={WORLD3_TASK2.curiosityIcon}
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
          title={current.title || ''}
          text={current.prompt || 'Match each barrier with the most effective solution.'}
          whyIcon={WORLD3_TASK2.whyIcon}
          onWhy={() => {
            setModalText(
              'Match both barriers. Correct matches disappear. If one is wrong, you will see the correct solutions and move to the next round.'
            );
            setModalOpen(true);
          }}
        />

        <MatchAnswerGrid
          key={current.id}
          leftItems={current.leftItems}
          rightItems={current.rightItems}
          matches={current.matches}
          disabled={modalOpen || endOpen || roundLocked}
          onRoundResolved={handleRoundResolved}
        />
      </div>

      <FlyItemsLayer items={flyItems} />
      <CorrectFlash open={flashOpen} label="NICE MATCH" />
      <InfoModal open={modalOpen} onClose={() => setModalOpen(false)} text={modalText} />

      <TaskCompletionModal
        open={endOpen}
        onClose={() => navigate(MAIN_MENU_ROUTE, { state: player })}
        title={`BRAVO ${nameUpper} YOU BROKE THE WALL!`}
        stats={[
          { label: 'POINTS', value: points },
          { label: 'CURIOSITY POINTS', value: curiosityPoints },
        ]}
        badges={earnedBadges}
        actions={[
          { label: 'GO TO TASK 3', onClick: () => navigate(NEXT_TASK_ROUTE, { state: player }) },
          { label: 'GO BACK TO MAIN MENU', onClick: () => navigate(MAIN_MENU_ROUTE, { state: player }) },
        ]}
      />
    </GameplayShell>
  );
}