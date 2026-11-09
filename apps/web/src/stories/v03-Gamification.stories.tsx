import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { XPBar, LevelBadge, Streak, AchievementToast, Button } from '@pixelmist/react';

const meta: Meta = { title: 'Pixelmist/v0.3/Gamification' };
export default meta;

export const XP: StoryObj = {
  render: () => {
    const [xp, setXp] = useState(120);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 420 }}>
        <XPBar value={xp} max={200} level={3} hint="Earn XP by completing work items" />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="sm" variant="secondary" onClick={() => setXp((v) => Math.min(200, v + 20))}>
            +20 XP
          </Button>
          <Button size="sm" variant="tertiary" onClick={() => setXp(0)}>
            Reset
          </Button>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <XPBar value={64} max={100} size="sm" />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <XPBar value={80} max={100} size="lg" showValue={false} />
        </div>
      </div>
    );
  },
};

export const LevelsAndStreaks: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <LevelBadge level={1} size="sm" />
      <LevelBadge level={7} />
      <LevelBadge level={12} size="md" />
      <Streak days={0} />
      <Streak days={1} size="sm" />
      <Streak days={9} />
    </div>
  ),
};

export const Achievement: StoryObj = {
  render: () => {
    const [show, setShow] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
        <Button size="sm" onClick={() => setShow(true)}>
          Unlock achievement
        </Button>
        {show ? (
          <AchievementToast
            title="First merge"
            description="You merged your first pull request."
            action={{ label: 'View PR', onClick: () => setShow(false) }}
            onClose={() => setShow(false)}
            duration={6000}
          />
        ) : null}
        <AchievementToast title="Streak kept" description="7 days in a row." duration={0} icon="flame" />
      </div>
    );
  },
};
