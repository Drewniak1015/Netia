/**
 * components/AdIdCapture.tsx
 *
 * WERSJA GLOBALNA - nie trzeba już nic dodawać do pojedynczych komponentów.
 *
 * Ten komponent robi DWIE rzeczy:
 * 1. Przy wejściu na stronę zapisuje custom_id z URL do localStorage (jak wcześniej)
 * 2. Nasłuchuje KLIKNIĘĆ NA CAŁEJ STRONIE (event delegation) - jeśli ktoś kliknie
 *    w jakikolwiek link zaczynający się od "tel:" lub "sms:", automatycznie
 *    wysyła dane do trackingu - NIEZALEŻNIE w którym komponencie/pliku ten link się znajduje.
 *
 * Wstaw ten komponent RAZ w app/layout.tsx - działa dla całej aplikacji.
 * Możesz teraz USUNĄĆ ręcznie dodane onClick={() => trackPhoneClick()} z poszczególnych
 * komponentów (Hero, ContactSection itd.) - nie są już potrzebne, bo ten globalny
 * listener złapie każde kliknięcie automatycznie. Możesz je też zostawić bez szkody -
 * po prostu zadziałają "podwójnie" ale to nie jest błąd, tylko redundancja.
 */
'use client';

import { useEffect } from 'react';
import { captureCustomId, trackPhoneClick, trackSmsClick } from '@/lib/adTracking';

export default function AdIdCapture() {
  useEffect(() => {
    // Krok 1: zapisz custom_id z URL (jak wcześniej)
    captureCustomId();

    // Krok 2: globalny listener na kliknięcia w całym dokumencie
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement;

      // Szukamy najbliższego elementu <a>, nawet jeśli kliknięto np. w ikonę/tekst wewnątrz linku
      const link = target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href') || '';

      if (href.startsWith('tel:')) {
        trackPhoneClick();
      } else if (href.startsWith('sms:')) {
        trackSmsClick();
      }
    }

    // "capture: true" żeby złapać kliknięcie zanim ewentualnie coś je zatrzyma (stopPropagation)
    document.addEventListener('click', handleClick, { capture: true });

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);

  return null;
}