'use client';

import React from 'react';
import HowItWorks from '@/components/HowItWorks';
import { useHomeContext } from './HomeContext';

export function HomeHowItWorksSection() {
  const { openBooking } = useHomeContext();

  return <HowItWorks onOpenBooking={() => openBooking()} />;
}
