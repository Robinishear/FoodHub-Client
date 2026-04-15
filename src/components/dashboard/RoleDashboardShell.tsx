"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Role } from "@/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type QuickLink = {
  label: string;
  href: string;
};

interface RoleDashboardShellProps {
  roles: Role[];
  title: string;
  subtitle: string;
  quickLinks: QuickLink[];
}

export function RoleDashboardShell({
  roles,
  title,
  subtitle,
  quickLinks,
}: RoleDashboardShellProps) {
  return (
    <ProtectedRoute allowedRoles={roles}>
      <section className="min-h-screen bg-gray-50 pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-gray-950">{title}</h1>
            <p className="text-gray-500 font-medium">{subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((item) => (
              <Card key={item.href} className="p-6 rounded-2xl border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-bold text-gray-800">{item.label}</p>
                  <Link href={item.href}>
                    <Button variant="outline" className="rounded-xl">
                      Open <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </ProtectedRoute>
  );
}
