import { useEffect, useState } from 'react';
import Joyride, { CallBackProps, STATUS } from 'react-joyride';
import { steps } from '@/lib/toursteps';

const AppTour = () => {
  const [run, setRun] = useState(false); // trigger the tour

  useEffect(() => {
    const isTourDone = localStorage.getItem('tour_status');
    if (!isTourDone) {
      setRun(true);
    }
  }, []);
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status as any)) {
      localStorage.setItem('tour_status', 'true');
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      callback={handleJoyrideCallback}
      showSkipButton
      showProgress
      styles={{
        options: {
          primaryColor: '#2D3E50', // IBM blue or use your brand color
        },
      }}
    />
  );
};

export default AppTour;
