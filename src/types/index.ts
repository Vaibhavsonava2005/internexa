// ============================================================
// InterNexa — Types & Interfaces
// ============================================================

export interface Internship {
  id: string;
  title: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  banner: string;
  duration: string;
  durationDays: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  price: number;
  originalPrice: number;
  currency: string;
  rating: number;
  totalRatings: number;
  totalEnrolled: number;
  seatsAvailable: number;
  totalSeats: number;
  isLive: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  hasCertificate: boolean;
  hasProjects: boolean;
  hasMentorship: boolean;
  skills: string[];
  tools: string[];
  modules: Module[];
  projects: Project[];
  mentor: Mentor;
  requirements: string[];
  outcomes: string[];
  faqs: FAQ[];
  reviews: Review[];
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: "video" | "article" | "quiz" | "assignment" | "live";
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  skills: string[];
  estimatedHours: number;
}

export interface Mentor {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  companyLogo: string;
  bio: string;
  expertise: string[];
  experience: string;
  rating: number;
  totalStudents: number;
  linkedin: string;
  github: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  color: string;
  gradient: string;
}

export interface StudentProfile {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  bio: string;
  college: string;
  degree: string;
  year: string;
  skills: string[];
  interests: string[];
  github: string;
  linkedin: string;
  portfolio: string;
  xp: number;
  level: number;
  streak: number;
  badges: Badge[];
  enrollments: Enrollment[];
  certificates: Certificate[];
  achievements: Achievement[];
  createdAt: string;
  referralCode?: string;
  referredBy?: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  status: "Pending" | "Successful";
  createdAt: string;
  referredUser?: {
    name: string;
    avatar: string;
  };
}

export interface RewardClaim {
  id: string;
  clerkId: string;
  upiId: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface Enrollment {
  id: string;
  internshipId: string;
  internship: Internship;
  status: "active" | "completed" | "paused" | "expired";
  progress: number;
  startDate: string;
  endDate: string;
  completedModules: string[];
  grade: string;
}

export interface Certificate {
  id: string;
  internshipId: string;
  internshipTitle: string;
  studentName: string;
  issueDate: string;
  certificateId: string;
  qrCode: string;
  downloadUrl: string;
  grade: string;
  skills: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  earnedAt: string;
  color: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  readTime: string;
  publishedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  type: "webinar" | "hackathon" | "workshop" | "meetup";
  date: string;
  time: string;
  duration: string;
  thumbnail: string;
  speaker: string;
  attendees: number;
  maxAttendees: number;
  isRegistered: boolean;
  link: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  internshipsCompleted: number;
  streak: number;
  badges: number;
}

export interface AdminStats {
  totalStudents: number;
  totalMentors: number;
  totalInternships: number;
  totalEnrollments: number;
  totalRevenue: number;
  activeStudents: number;
  completionRate: number;
  avgRating: number;
  monthlyGrowth: number;
  dailySignups: number[];
  revenueByMonth: number[];
  enrollmentsByCategory: { category: string; count: number }[];
}
