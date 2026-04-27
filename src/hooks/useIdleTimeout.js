import { useEffect, useRef } from 'react';

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'visibilitychange'];

// Hook que ejecuta `onTimeout` después de `timeoutMs` sin actividad del usuario.
// Reset en cada interacción. SEC-020: cierra sesión por inactividad.
export function useIdleTimeout(onTimeout, timeoutMs = 30 * 60 * 1000) {
  const timerRef = useRef(null);

  useEffect(() => {
    const reset = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onTimeout, timeoutMs);
    };

    reset();

    ACTIVITY_EVENTS.forEach((evt) => window.addEventListener(evt, reset, { passive: true }));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((evt) => window.removeEventListener(evt, reset));
    };
  }, [onTimeout, timeoutMs]);
}
