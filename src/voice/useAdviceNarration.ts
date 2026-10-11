import { useAction } from 'convex/react';
import { useEffect, useRef, useState } from 'react';
import { api } from '../../convex/_generated/api';
import { AdviceNarrationController, type NarrationSnapshot } from './adviceNarration';
import type { VoiceAdviceId } from './adviceCatalog';
import type { SynthesizeAdviceResult } from './synthesizeAdvice';

export function useAdviceNarration(adviceId: VoiceAdviceId | null): NarrationSnapshot & {
  setMuted: (muted: boolean) => void;
  play: () => void;
  pause: () => void;
  replay: () => void;
} {
  const synthesize = useAction(api.voice.synthesizeAdvice);
  const fetchRef = useRef(synthesize);
  fetchRef.current = synthesize;
  const [, setTick] = useState(0);
  const notify = () => {
    setTick((value) => value + 1);
  };

  const controllerRef = useRef<AdviceNarrationController | null>(null);
  if (controllerRef.current === null) {
    controllerRef.current = new AdviceNarrationController(
      {
        fetchAdvice: (args) => fetchRef.current(args) as Promise<SynthesizeAdviceResult>,
        createAudio: (src) => {
          const element = new Audio(src);
          return {
            pause: () => {
              element.pause();
            },
            play: () => element.play(),
            get currentTime() {
              return element.currentTime;
            },
            set currentTime(value: number) {
              element.currentTime = value;
            },
            get onended() {
              return element.onended as (() => void) | null;
            },
            set onended(handler: (() => void) | null) {
              element.onended = handler;
            },
          };
        },
        createObjectUrl: (data) => URL.createObjectURL(data),
        revokeObjectUrl: (url) => {
          URL.revokeObjectURL(url);
        },
      },
      notify,
    );
  }

  useEffect(() => {
    controllerRef.current?.setAdvice(adviceId);
  }, [adviceId]);

  useEffect(() => {
    return () => {
      controllerRef.current?.dispose();
    };
  }, []);

  const controller = controllerRef.current;
  return {
    ...controller.snapshot(),
    setMuted: (muted: boolean) => {
      controller.setMuted(muted);
    },
    play: () => {
      controller.play();
    },
    pause: () => {
      controller.pause();
    },
    replay: () => {
      controller.replay();
    },
  };
}
