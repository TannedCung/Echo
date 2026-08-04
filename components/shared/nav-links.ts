import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * The primary app destinations. Shared so the desktop top nav and the mobile
 * user-menu fall-through render the exact same set (single source of truth).
 */
export const PRIMARY_NAV: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/practice", label: "Practice", icon: GraduationCap },
  { href: "/exams", label: "Exams", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: TrendingUp },
];
