import { UserProfile } from "@/components/user-profile";

export default function SettingsPage() {
  return (
    <div className="h-full flex-1 overflow-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Cài đặt tài khoản</h1>
      <UserProfile />
    </div>
  );
}
