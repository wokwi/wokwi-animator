import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import { icon8Url, iconCategories } from '../src/icons8';
import { LottiePlayer } from './lottie-player';
import clsx from 'clsx';

const useStyles = makeStyles(() => ({
  iconList: {
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: '450px',
    justifyContent: 'center',
  },

  iconTile: {
    display: 'inline-block',
    cursor: 'pointer',
    borderRadius: '4px',
    width: '50px',
    height: '50px',
    padding: '2px',
    margin: '8px',
    background: 'transparent',
    border: 'none',

    '&.active': {
      background: 'rgb(170, 228, 255)',
    },
  },
}));

export interface IAnimationPickerProps {
  selectedIcon?: string;
  onAnimationSelected?: (iconName: string) => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

export function AnimationPicker({ onAnimationSelected, selectedIcon }: IAnimationPickerProps) {
  const [activeTab, setActiveTab] = useState(0);
  const classes = useStyles();

  const handleChangeIndex = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div>
      <AppBar position="static" color="default">
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => {
            setActiveTab(newValue);
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Animation picker"
        >
          {iconCategories.map((category) => (
            <Tab label={category.name} key={category.name} />
          ))}
        </Tabs>
      </AppBar>
      <SwipeableViews index={activeTab} onChangeIndex={handleChangeIndex}>
        {iconCategories.map((category, index) => (
          <TabPanel key={category.name} value={activeTab} index={index}>
            <Box p={3} className={classes.iconList}>
              {category.icons.map((icon) => (
                <button
                  key={icon}
                  onClick={() => onAnimationSelected?.(icon)}
                  className={clsx(classes.iconTile, { active: icon === selectedIcon })}
                >
                  <LottiePlayer src={icon8Url(icon)} />
                </button>
              ))}
            </Box>
          </TabPanel>
        ))}
      </SwipeableViews>
    </div>
  );
}
