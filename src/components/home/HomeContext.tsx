'use client';

import React, { createContext, useContext, useState } from 'react';
import dynamic from 'next/dynamic';
import { MockTutor } from '@/lib/data';
import { PromoVideoData } from '@/components/PromoVideoModal';

const BookingModal = dynamic(() => import('@/components/BookingModal'), { ssr: false });
const VideoModal = dynamic(() => import('@/components/VideoModal'), { ssr: false });
const PromoVideoModal = dynamic(() => import('@/components/PromoVideoModal'), { ssr: false });
const StickyMobileBar = dynamic(() => import('@/components/StickyMobileBar'), { ssr: false });

interface HomeContextType {
  openBooking: (tutor?: MockTutor, prefill?: { grade?: string; mode?: string }) => void;
  openVideo: (tutor: MockTutor) => void;
  openPromoVideo: (video: PromoVideoData) => void;
}

const HomeContext = createContext<HomeContextType | null>(null);

export function useHomeContext() {
  const ctx = useContext(HomeContext);
  if (!ctx) {
    throw new Error('useHomeContext must be used within HomeClientProvider');
  }
  return ctx;
}

export function HomeClientProvider({ children }: { children: React.ReactNode }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<{
    tutorName?: string;
    tutorAvatar?: string;
    tutorDegree?: string;
    tutorRate?: number;
    tutorId?: string;
    grade?: string;
    mode?: string;
    subject?: string;
  } | undefined>(undefined);

  const [activeVideoTutor, setActiveVideoTutor] = useState<MockTutor | null>(null);
  const [activePromoVideo, setActivePromoVideo] = useState<PromoVideoData | null>(null);

  const openBooking = (tutor?: MockTutor, prefill?: { grade?: string; mode?: string }) => {
    if (tutor) {
      setSelectedTutorForBooking({
        tutorName: tutor.name,
        tutorAvatar: tutor.avatarUrl,
        tutorDegree: tutor.highestDegree,
        tutorRate: tutor.hourlyRateHome,
        tutorId: tutor.id,
        grade: tutor.classes?.[0],
        subject: tutor.subjects?.[0],
      });
    } else if (prefill) {
      setSelectedTutorForBooking(prefill);
    } else {
      setSelectedTutorForBooking(undefined);
    }
    setBookingOpen(true);
  };

  const openVideo = (tutor: MockTutor) => {
    setActiveVideoTutor(tutor);
  };

  const openPromoVideo = (video: PromoVideoData) => {
    setActivePromoVideo(video);
  };

  return (
    <HomeContext.Provider value={{ openBooking, openVideo, openPromoVideo }}>
      {children}

      {/* Global Client Modals */}
      {bookingOpen && (
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          initialData={selectedTutorForBooking}
        />
      )}

      {activeVideoTutor && (
        <VideoModal
          tutor={activeVideoTutor}
          onClose={() => setActiveVideoTutor(null)}
          onSelectTutor={(t) => {
            setActiveVideoTutor(null);
            openBooking(t);
          }}
        />
      )}

      {activePromoVideo && (
        <PromoVideoModal
          video={activePromoVideo}
          onClose={() => setActivePromoVideo(null)}
          onOpenBooking={() => {
            setActivePromoVideo(null);
            openBooking();
          }}
        />
      )}

      <StickyMobileBar onOpenBooking={() => openBooking()} />
    </HomeContext.Provider>
  );
}
