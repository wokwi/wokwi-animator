import { Step, StepLabel, Stepper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React, { useState } from 'react';
import { Step1 } from '../components/step1';
import { Step2 } from '../components/step2';
import { IAnimationParams } from '../src/animation';

export default function Index() {
  const [activeStep, setActiveStep] = useState(0);
  const [animation, setAnimation] = useState<IAnimationParams>();

  const step2 = animation && activeStep === 1;

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h4" component="h1">
          Wokwi Animator
        </Typography>
        <Typography gutterBottom variant="caption">
          Create animations for Arduino
        </Typography>
        <Stepper activeStep={activeStep}>
          <Step>
            <StepLabel onClick={() => setActiveStep(0)}>Choose Animation</StepLabel>
          </Step>
          <Step>
            <StepLabel>Get the Code</StepLabel>
          </Step>
        </Stepper>

        {!step2 && (
          <Step1
            onComplete={(animation) => {
              setActiveStep(1);
              setAnimation(animation);
            }}
          />
        )}
        {step2 && animation && <Step2 animation={animation} goBack={() => setActiveStep(0)} />}
      </Box>
    </Container>
  );
}
