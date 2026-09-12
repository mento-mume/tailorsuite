// import Input from "../ui/Input";
// import { Bell, Search, PanelLeft } from "lucide-react";
// import { signOut } from "firebase/auth";
// import { auth } from "../../lib/firebase";
// import { useState } from "react";
// import Modal from "../ui/Modal";
// import type { UserProfile } from "../../data/roleTypes";
// import Button from "../ui/Button";

// interface TopNavProps {
//   profile: UserProfile | null;
//   onUpdateProfile: (
//     updates: Partial<Pick<UserProfile, "username" | "phone">>,
//   ) => Promise<void>;
//   onSearch?: (value: string) => void;
//   onToggleSidebar: () => void;
// }

// export default function TopNav({
//   profile,
//   onUpdateProfile,
//   onSearch,
//   onToggleSidebar,
// }: TopNavProps) {
//   const [isPanelOpen, setIsPanelOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [username, setUsername] = useState(profile?.username ?? "");
//   const [phone, setPhone] = useState(profile?.phone ?? "");
//   const [submitError, setSubmitError] = useState("");

//   const displayName = profile?.username || profile?.email || "User";
//   const initials = displayName
//     .split(" ")
//     .map((word) => word[0])
//     .join("")
//     .toUpperCase();

//   async function handleSave() {
//     setSubmitError("");
//     try {
//       await onUpdateProfile({ username, phone });
//       setIsEditing(false);
//     } catch {
//       setSubmitError("Could not save changes. Try again.");
//     }
//   }

//   function closePanel() {
//     setIsPanelOpen(false);
//     setIsEditing(false);
//     setUsername(profile?.username ?? "");
//     setPhone(profile?.phone ?? "");
//     setSubmitError("");
//   }
//   return (
//     <header className="h-[72px] bg-white border-b border-[#E5E7EB] flex items-center  px-8 gap-6">
//       <button
//         className="w-9 h-9 rounded-[10px] flex items-center justify-center text-text-secondary hover:bg-gray-100"
//         onClick={onToggleSidebar}
//       >
//         <PanelLeft size={20} />
//       </button>
//       <div className="max-w-[360px] w-full">
//         <Input
//           icon={<Search size={18} />}
//           placeholder="Search orders, customers…"
//           onChange={(e) => onSearch?.(e.target.value)}
//         />
//       </div>

//       <div className="flex items-center gap-5 ml-auto">
//         <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-gray-100">
//           <Bell size={20} />
//           <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger border-2 border-white" />
//         </button>

//         <div className="flex items-center gap-2.5 pl-4 border-l border-[#E5E7EB]">
//           <button
//             onClick={() => setIsPanelOpen(true)}
//             className="flex items-center gap-2.5 pl-4 border-l border-[#E5E7EB]"
//           >
//             <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-semibold">
//               {initials}
//             </div>
//             <div className="text-left">
//               <p className="text-sm font-semibold">{displayName}</p>
//               <p className="text-xs text-text-secondary capitalize">
//                 {profile?.role}
//               </p>
//             </div>
//           </button>
//         </div>
//       </div>
//       <Modal isOpen={isPanelOpen} onClose={closePanel} title="My Account">
//         {isEditing ? (
//           <div className="flex flex-col gap-4">
//             <Input
//               label="Username"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <Input
//               label="Phone number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//             />
//             {submitError && (
//               <p className="text-xs text-danger">{submitError}</p>
//             )}
//             <div className="flex justify-end gap-3 mt-2">
//               <Button variant="secondary" onClick={() => setIsEditing(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSave}>Save Changes</Button>
//             </div>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-3">
//             <div>
//               <span className="text-xs text-text-secondary">Email</span>
//               <p className="text-sm font-medium">{profile?.email}</p>
//             </div>
//             <div>
//               <span className="text-xs text-text-secondary">Role</span>
//               <p className="text-sm font-medium capitalize">{profile?.role}</p>
//             </div>
//             <div>
//               <span className="text-xs text-text-secondary">Username</span>
//               <p className="text-sm font-medium">{profile?.username || "—"}</p>
//             </div>
//             <div>
//               <span className="text-xs text-text-secondary">Phone</span>
//               <p className="text-sm font-medium">{profile?.phone || "—"}</p>
//             </div>

//             <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-[#E5E7EB]">
//               <Button variant="secondary" onClick={() => setIsEditing(true)}>
//                 Edit Details
//               </Button>
//               <Button variant="danger" onClick={() => signOut(auth)}>
//                 Sign Out
//               </Button>
//             </div>
//           </div>
//         )}
//       </Modal>
//     </header>
//   );
// }
import Input from "../ui/Input";
import { Bell, Search, PanelLeft } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { useEffect, useRef, useState } from "react";
import type { UserProfile } from "../../data/roleTypes";
import Button from "../ui/Button";

interface TopNavProps {
  profile: UserProfile | null;
  onUpdateProfile: (
    updates: Partial<Pick<UserProfile, "username" | "phone">>,
  ) => Promise<void>;
  onSearch?: (value: string) => void;
  onToggleSidebar: () => void;
}

export default function TopNav({
  profile,
  onUpdateProfile,
  onSearch,
  onToggleSidebar,
}: TopNavProps) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [submitError, setSubmitError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);

  const displayName = profile?.username || profile?.email || "User";
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  async function handleSave() {
    setSubmitError("");
    try {
      await onUpdateProfile({ username, phone });
      setIsEditing(false);
    } catch {
      setSubmitError("Could not save changes. Try again.");
    }
  }

  function closePanel() {
    setIsPanelOpen(false);
    setIsEditing(false);
    setUsername(profile?.username ?? "");
    setPhone(profile?.phone ?? "");
    setSubmitError("");
  }

  // Close on outside click
  useEffect(() => {
    if (!isPanelOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        closePanel();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPanelOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isPanelOpen) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") closePanel();
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isPanelOpen]);

  return (
    <header className="h-[72px] bg-white border-b border-[#E5E7EB] flex items-center px-8 gap-6">
      <button
        className="w-9 h-9 rounded-[10px] flex items-center justify-center text-text-secondary hover:bg-gray-100"
        onClick={onToggleSidebar}
      >
        <PanelLeft size={20} />
      </button>

      <div className="max-w-[360px] w-full">
        <Input
          icon={<Search size={18} />}
          placeholder="Search orders, customers…"
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-5 ml-auto">
        <button className="relative w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-danger border-2 border-white" />
        </button>

        <div ref={panelRef} className="relative pl-4 border-l border-[#E5E7EB]">
          <button
            onClick={() => setIsPanelOpen((prev) => !prev)}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center text-sm font-semibold">
              {initials}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">{displayName}</p>
              <p className="text-xs text-text-secondary capitalize">
                {profile?.role}
              </p>
            </div>
          </button>

          {isPanelOpen && (
            <div className="absolute right-0 top-[calc(100%+12px)] w-[320px] bg-white rounded-xl border border-[#E5E7EB] shadow-lg p-5 z-50">
              {isEditing ? (
                <div className="flex flex-col gap-4">
                  <Input
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Input
                    label="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  {submitError && (
                    <p className="text-xs text-danger">{submitError}</p>
                  )}
                  <div className="flex justify-end gap-3 mt-2">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>Save Changes</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-xs text-text-secondary">Email</span>
                    <p className="text-sm font-medium">{profile?.email}</p>
                  </div>
                  <div>
                    <span className="text-xs text-text-secondary">Role</span>
                    <p className="text-sm font-medium capitalize">
                      {profile?.role}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-text-secondary">
                      Username
                    </span>
                    <p className="text-sm font-medium">
                      {profile?.username || "—"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-text-secondary">Phone</span>
                    <p className="text-sm font-medium">
                      {profile?.phone || "—"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-2 pt-4 border-t border-[#E5E7EB]">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Details
                    </Button>
                    <Button variant="danger" onClick={() => signOut(auth)}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
