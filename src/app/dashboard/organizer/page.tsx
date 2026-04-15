"use client";

import { StandardRoleDashboard } from "@/components/dashboard/StandardRoleDashboard";
import { BadgePercent, Newspaper, Users, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { organizerService, type OrganizerStats } from "@/services/organizerService";

export default function OrganizerDashboardPage() {
  const [stats, setStats] = useState<OrganizerStats | null>(null);

  useEffect(() => {
    organizerService
      .getStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const statItems = [
    {
      title: "Active offers",
      value: stats != null ? String(stats.activeOffers) : "—",
      trend: "Live codes",
      color: "bg-orange-50 text-orange-600",
      icon: <BadgePercent size={20} />,
    },
    {
      title: "Newsletter subscribers",
      value: stats != null ? String(stats.newsletterSubscribers) : "—",
      trend: "Audience",
      color: "bg-blue-50 text-blue-600",
      icon: <Users size={20} />,
    },
    {
      title: "Published blogs",
      value: stats != null ? String(stats.publishedBlogs) : "—",
      trend: "Content",
      color: "bg-green-50 text-green-600",
      icon: <Newspaper size={20} />,
    },
    {
      title: "Home sections live",
      value: stats != null ? String(stats.homeContentActive) : "—",
      trend: "Landing",
      color: "bg-purple-50 text-purple-600",
      icon: <Activity size={20} />,
    },
  ];

  return (
    <StandardRoleDashboard
      roles={["ORGANIZER"]}
      title="Organizer Dashboard"
      description="Campaigns, content, and growth signals from the live API."
      statItems={statItems}
      quickLinks={[
        { title: "Public offers", href: "/offers", cta: "Open" },
        { title: "Blog", href: "/blog", cta: "Open" },
        { title: "Contact / help", href: "/contact", cta: "Open" },
        { title: "Organizer profile", href: "/dashboard/organizer/profile", cta: "Edit" },
      ]}
    />
  );
}
