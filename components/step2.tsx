import { Box, Button, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useMemo } from 'react';
import { IAnimationParams } from '../src/animation';
import { downloadFile } from '../src/download-file';
import { arduino_ssd1306 } from '../src/templates/arduino-ssd1306';
import { SSD1306Preview } from './sdd1306-preview';
import useClipboard from 'react-use-clipboard';

const useStyles = makeStyles(() => ({
  copied: {
    color: 'green',
  },
}));

export interface IStep2Props {
  animation: IAnimationParams;
  goBack: () => void;
}

export function Step2({ animation, goBack }: IStep2Props) {
  const classes = useStyles();
  const code = useMemo(() => arduino_ssd1306(animation), [animation]);
  const [copied, copyToClipboard] = useClipboard(code, { successDuration: 2000 });

  const downloadCode = () => {
    const sketchName = `wokwi_${animation.name.split(' ').join('_')}.ino`;
    downloadFile(sketchName, code);
  };

  return (
    <Box>
      <SSD1306Preview animation={animation} />
      <Typography>
        Please share an image/video of your project and tag{' '}
        <b>
          <a href="https://twitter.com/wokwimakes" target="_blank" rel="noopener">
            @WokwiMakes
          </a>
        </b>
        .
      </Typography>
      <Typography>
        You can also share it on our{' '}
        <a href="https://wokwi.com/discord" target="_blank" rel="noopener">
          Discord server
        </a>
        .
      </Typography>
      <Box>
        <Button onClick={goBack}>&lt; Go back</Button>
        <Tooltip title="Download code" aria-label="download code">
          <IconButton onClick={downloadCode}>
            <CloudDownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Copy to clipboard" aria-label="Copy to clipboard">
          <IconButton onClick={copyToClipboard}>
            <FileCopyIcon />
          </IconButton>
        </Tooltip>
        {copied && <span className={classes.copied}>Copied!</span>}
      </Box>
      <Box maxWidth="100%">
        <textarea rows={40} cols={100} readOnly>
          {code}
        </textarea>
      </Box>
    </Box>
  );
}
