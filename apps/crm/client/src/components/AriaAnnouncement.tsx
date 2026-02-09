import type { AriaAttributes } from 'react';

import type { UiEvent, UiEventScope } from '@Redux/reducers/uiSlice';

import { useEffect, useState } from 'react';

import { useReduxDispatch } from '@Redux/hooks';
import { uiEventConsume } from '@Redux/reducers/uiSlice';

export type AriaLiveLevel = Extract<AriaAttributes['aria-live'], 'polite' | 'assertive'>;

type Props = {
  scope: UiEventScope;
  uiEvent: UiEvent;
};

function setLiveRegion(setter: (value: string) => void, message: string) {
  setter('');
  setTimeout(() => setter(message), 0);
}

function AriaAnnouncement({ scope, uiEvent }: Props): React.JSX.Element {
  const [politeAnnouncement, setPoliteAnnouncement] = useState<string>('');
  const [assertiveAnnouncement, setAssertiveAnnouncement] = useState<string>('');
  const reduxDispatch = useReduxDispatch();

  useEffect(() => {
    if (scope !== uiEvent.scope || uiEvent.type !== 'aria') return;
    if (uiEvent.data.politeness === 'polite') setLiveRegion(setPoliteAnnouncement, uiEvent.data.message);
    if (uiEvent.data.politeness === 'assertive') setLiveRegion(setAssertiveAnnouncement, uiEvent.data.message);
    reduxDispatch(uiEventConsume(uiEvent));

    // eslint-disable-next-line react-hooks/exhaustive-deps -- "uiEvent object immutable per id"
  }, [scope, uiEvent.id]);

  return (
    <div className="sr-only">
      <div aria-live="polite" aria-atomic="true" aria-relevant="text">
        {politeAnnouncement}
      </div>
      <div role="alert" aria-atomic="true">
        {assertiveAnnouncement}
      </div>
    </div>
  );
}

export default AriaAnnouncement;
