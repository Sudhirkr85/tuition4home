'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useHomeContext } from './HomeContext';

export function HomeNavbar() {
  const { openBooking } = useHomeContext();

  return <Navbar onOpenBooking={() => openBooking()} />;
}
