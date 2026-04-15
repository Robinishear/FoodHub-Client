"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Search, ShieldCheck, Mail, User as UserIcon, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";
import { User } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { formatRoleLabel } from "@/lib/roleLabels";
import { motion } from "framer-motion";
import { ManagementPage } from "@/components/dashboard/ManagementPage";
import { useAuth } from "@/context/AuthContext";

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
      <AdminUsersPageContent />
    </ProtectedRoute>
  );
}

function AdminUsersPageContent() {
  const { user: currentUser } = useAuth();
  const canChangeAccess = currentUser?.role === "ADMIN";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Use our platform service to fetch the user directory
      const usersData = await adminService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Global user list load failed:", error);
      toast.error("Failed to load system users. Please check your admin privileges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      // High-level access management using admin service
      await adminService.updateUserStatus(userId, !currentStatus);
      const actionLabel = currentStatus ? "Suspended" : "Activated";
      toast.success(`User access successfully ${actionLabel}.`);
      fetchUsers();
    } catch (error) {
      const message =
        (error as { userMessage?: string })?.userMessage ||
        "Failed to modify user access.";
      console.error("User status update failed:", error);
      toast.error(message);
    }
  };

  const deleteAccount = async (userId: string, displayName: string) => {
    if (
      !window.confirm(
        `Permanently delete "${displayName}" from the database? This cannot be undone. For providers, linked order lines, empty orders, reviews, and meals are removed first, then the account.`
      )
    ) {
      return;
    }
    try {
      await adminService.deleteUser(userId);
      toast.success("Account deleted.");
      fetchUsers();
    } catch (error) {
      const message =
        (error as { userMessage?: string })?.userMessage ||
        "Failed to delete account.";
      console.error("User delete failed:", error);
      toast.error(message);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ManagementPage
      title="User Directory"
      description="Manage all platform users and their access levels."
      loading={loading}
      action={
        <div className="relative w-full md:w-80">
          <Input
            placeholder="Search users..."
            className="pl-11 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="premium-card group overflow-hidden border-none shadow-sm h-full">
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gray-50 rounded-md flex items-center justify-center text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 shadow-sm overflow-hidden">
                        <UserIcon size={28} />
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-gray-900 leading-tight">{user.name}</h3>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Joined{" "}
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(undefined, {
                                month: "short",
                                year: "numeric",
                              })
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-sm",
                      user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {user.isActive ? "Active Account" : "Access Revoked"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-50">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Email Address</p>
                      <div className="flex items-center text-sm font-bold text-gray-700">
                        <Mail size={14} className="mr-2 text-orange-500" /> {user.email}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Platform Role</p>
                      <div className="flex items-center text-sm font-bold text-gray-700">
                        <ShieldCheck size={14} className="mr-2 text-orange-500" />{" "}
                        {formatRoleLabel(user.role)}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black">U{i}</div>)}
                    </div>
                    {canChangeAccess && user.role !== "ADMIN" && (
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button
                          size="sm"
                          variant={user.isActive ? "destructive" : "default"}
                          className={cn("rounded-md font-black px-6", !user.isActive && "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20")}
                          onClick={() => toggleStatus(user.id, user.isActive)}
                        >
                          {user.isActive ? "Revoke Access" : "Grant Access"}
                        </Button>
                        {currentUser?.id !== user.id && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-md font-black px-6 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => deleteAccount(user.id, user.name)}
                          >
                            <Trash2 size={14} className="mr-2" />
                            Delete account
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="lg:col-span-2 py-32 text-center bg-white rounded-[3rem] border-2 border-gray-50 border-dashed">
            <p className="text-gray-500 font-bold text-lg tracking-tight">System holds no records for your search.</p>
          </div>
        )}
      </div>
    </ManagementPage>
  );
}

