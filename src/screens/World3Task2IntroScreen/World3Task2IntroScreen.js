import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import IntroScreen from '../../components/game/IntroScreen';
import { WORLD3_INTROS } from '../../game/content/world3Tasks';
import { getPlayerFromLocationState } from '../../game/utils/player';

export default function World3Task2IntroScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const player = useMemo(() => getPlayerFromLocationState(location.state), [location.state]);
  const config = WORLD3_INTROS.task2;

  return (
    <IntroScreen
      player={player}
      navigate={navigate}
      backgroundUrl={config.backgroundUrl}
      introText={config.introText}
      infoTitle={config.infoTitle}
      infoRows={config.infoRows}
      primaryAction={{ label: 'BREAK THE WALL', onClick: () => navigate(config.startRoute, { state: player }) }}
    />
  );
}