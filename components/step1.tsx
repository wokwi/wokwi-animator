import { Box, Button, makeStyles, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { IAnimationParams } from '../src/animation';
import { icon8Url } from '../src/icons8';
import { loadAnimation } from '../src/load-animation';
import { AnimationPicker } from './animation-picker';
import { SSD1306Preview } from './sdd1306-preview';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    width: 0,
    minWidth: '100%',
  },
}));

export interface IStep1Props {
  onComplete(animation: IAnimationParams): void;
}

export function Step1({ onComplete }: IStep1Props) {
  const [icon, setIcon] = useState<string>('walk');
  const [size, setSize] = useState(64);
  const [animation, setAnimation] = useState<IAnimationParams>();
  const classes = useStyles();

  useEffect(() => {
    if (icon) {
      loadAnimation(icon8Url(icon), size).then(setAnimation);
    }
  }, [icon, size]);

  return (
    <Box className={classes.container}>
      <Box flex="1" width="0">
        <Typography variant="h6">Icons8 Animations</Typography>
        <AnimationPicker selectedIcon={icon} onAnimationSelected={setIcon} />

        <Typography>
          Find more animations on{' '}
          <a href="https://icons8.com/animated-icons/" target="_blank" rel="noopener">
            icons8.com
          </a>
        </Typography>
        <Box my={2} display="flex" alignItems="center">
          <Typography>Size:</Typography>
          &nbsp;
          <ToggleButtonGroup
            value={size}
            exclusive
            onChange={(e, size: number) => setSize(size)}
            aria-label="Size"
          >
            <ToggleButton value={32} aria-label="32 pixels">
              32
            </ToggleButton>
            <ToggleButton value={48} aria-label="48 pixels">
              48
            </ToggleButton>
            <ToggleButton value={64} aria-label="64 pixels">
              64
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <Box my={2}>
          <Button
            color="primary"
            variant="contained"
            disabled={!animation}
            onClick={() => animation && onComplete(animation)}
          >
            Get the Code &gt;
          </Button>
        </Box>
      </Box>
      <Box ml={2}>
        <Typography align="center">Preview</Typography>
        <Box my={1}>
          <SSD1306Preview animation={animation} />
        </Box>
      </Box>
    </Box>
  );
}
