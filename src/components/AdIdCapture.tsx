'use client';

import { useEffect } from 'react';
import { captureCustomId } from '@/lib/adTracking';

export default function AdIdCapture() {
  useEffect(() => {
    captureCustomId();
  }, []);

  return null;
}