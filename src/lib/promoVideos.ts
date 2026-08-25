import { PromoVideoData } from '@/components/PromoVideoModal';

export const PROMO_VIDEOS: Record<string, PromoVideoData> = {
  overview: {
    title: 'How TuitionForHome Works (80s Overview)',
    subtitle: 'Learn how we verify, screen, and match experienced 1-on-1 home teachers within 3.5 km of your sector in Gurgaon.',
    videoUrl: 'https://res.cloudinary.com/jhwajyyw/video/upload/q_auto:eco,f_auto/v1787649409/tuitionforhome/marketing/tuitionforhome_overview_explainer.mp4',
    posterUrl: 'https://res.cloudinary.com/jhwajyyw/video/upload/so_3,w_800,q_auto/v1787649409/tuitionforhome/marketing/tuitionforhome_overview_explainer.jpg',
    badge: 'Official Platform Overview',
    aspectRatio: '16/9',
  },
  tutorVisit: {
    title: 'Verified In-Home Tutoring Experience',
    subtitle: 'See our background-checked educators delivering punctual, 1-on-1 personalized academic sessions at your doorstep.',
    videoUrl: 'https://res.cloudinary.com/jhwajyyw/video/upload/q_auto:eco,f_auto/v1787649418/tuitionforhome/marketing/tuitionforhome_tutor_home_visit.mp4',
    posterUrl: 'https://res.cloudinary.com/jhwajyyw/video/upload/so_2,w_800,q_auto/v1787649418/tuitionforhome/marketing/tuitionforhome_tutor_home_visit.jpg',
    badge: '100% In-Person KYC Audited',
    aspectRatio: '16/9',
  },
  parentDiscussion: {
    title: 'Why Gurgaon Parents Trust TuitionForHome',
    subtitle: 'Real parent discussion on finding reliable, consistent subject mentors without middleman commission hassles.',
    videoUrl: 'https://res.cloudinary.com/jhwajyyw/video/upload/q_auto:eco,f_auto/v1787649423/tuitionforhome/marketing/tuitionforhome_parent_discussion_reel.mp4',
    posterUrl: 'https://res.cloudinary.com/jhwajyyw/video/upload/so_2,w_600,q_auto/v1787649423/tuitionforhome/marketing/tuitionforhome_parent_discussion_reel.jpg',
    badge: 'Parent Story & Reel',
    aspectRatio: '9/16',
  },
};
