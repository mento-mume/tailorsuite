import { useState } from "react";
import { Copy, Check } from "lucide-react";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Table from "../components/ui/Table";
import { useFirestoreCollection } from "../hooks/useFirestoreCollection";
import type { Role, UserProfile } from "../data/roleTypes";
import type { Invite } from "../data/inviteTypes";

const ROLES: Role[] = ["owner", "receptionist", "accountant"];

const selectClass =
  "h-11 px-4 rounded-[10px] text-base w-full border border-[#E5E7EB] focus:outline-none focus:border-primary bg-white";

interface StaffProps {
  currentUid: string;
  onInvite: (email: string, role: Role) => Promise<string>;
  onRevokeInvite: (inviteId: string) => Promise<void>;
  onUpdateStaffRole: (uid: string, role: Role) => Promise<void>;
  onUpdateStaffStatus: (
    uid: string,
    status: UserProfile["status"],
  ) => Promise<void>;
}

export default function Staff({
  currentUid,
  onInvite,
  onRevokeInvite,
  onUpdateStaffRole,
  onUpdateStaffStatus,
}: StaffProps) {
  const { data: staff, isLoading: staffLoading } =
    useFirestoreCollection<UserProfile>("Users");
  const { data: invites, isLoading: invitesLoading } =
    useFirestoreCollection<Invite>("invites");
  const isLoading = staffLoading || invitesLoading;
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("receptionist");
  const [isInviting, setIsInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const pendingInvites = invites.filter((invite) => invite.status === "pending");

  async function handleInvite() {
    setInviteError("");
    if (!email.trim()) {
      setInviteError("Enter an email address.");
      return;
    }

    setIsInviting(true);
    try {
      const token = await onInvite(email.trim(), role);
      setGeneratedLink(`${window.location.origin}/accept-invite/${token}`);
      setEmail("");
      setIsCopied(false);
    } catch {
      setInviteError("Could not create invite. Try again.");
    } finally {
      setIsInviting(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generatedLink);
    setIsCopied(true);
  }

  if (isLoading) {
    return <p className="text-text-secondary">Loading…</p>;
  }

  return (
    <div className="flex flex-col gap-6">
      <Card title="Invite staff">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
          <div className="flex-1">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={inviteError || undefined}
            />
          </div>
          <div className="w-full sm:w-48">
            <label className="text-sm font-medium text-text-primary mb-1.5 block">
              Role
            </label>
            <select
              className={selectClass}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleInvite} isLoading={isInviting}>
            Send invite
          </Button>
        </div>

        {generatedLink && (
          <div className="mt-4 flex items-center gap-2 bg-gray-50 rounded-[10px] p-3">
            <span className="text-sm flex-1 truncate">{generatedLink}</span>
            <Button variant="secondary" onClick={handleCopy}>
              {isCopied ? <Check size={18} /> : <Copy size={18} />}
            </Button>
          </div>
        )}

        {pendingInvites.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-text-secondary mb-2">
              Pending invites
            </h4>
            <Table
              data={pendingInvites}
              keyExtractor={(invite) => invite.id}
              columns={[
                { header: "Email", render: (invite) => invite.email },
                {
                  header: "Role",
                  render: (invite) => (
                    <span className="capitalize">{invite.role}</span>
                  ),
                },
                {
                  header: "Expires",
                  render: (invite) =>
                    new Date(invite.expiresAt).toLocaleDateString(),
                },
                {
                  header: "",
                  render: (invite) => (
                    <Button
                      variant="danger"
                      onClick={() => onRevokeInvite(invite.id)}
                    >
                      Revoke
                    </Button>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Card>

      <Card title="Team">
        <Table
          data={staff}
          keyExtractor={(member) => member.uid}
          columns={[
            {
              header: "Email",
              render: (member) => member.email,
            },
            {
              header: "Username",
              render: (member) => member.username || "—",
            },
            {
              header: "Role",
              render: (member) =>
                member.uid === currentUid ? (
                  <span className="capitalize">{member.role}</span>
                ) : (
                  <select
                    className={selectClass}
                    value={member.role}
                    onChange={(e) =>
                      onUpdateStaffRole(member.uid, e.target.value as Role)
                    }
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                ),
            },
            {
              header: "Status",
              render: (member) => (
                <span className="capitalize">
                  {member.status ?? "active"}
                </span>
              ),
            },
            {
              header: "",
              render: (member) =>
                member.uid === currentUid ? null : (
                  <Button
                    variant="secondary"
                    onClick={() =>
                      onUpdateStaffStatus(
                        member.uid,
                        member.status === "disabled" ? "active" : "disabled",
                      )
                    }
                  >
                    {member.status === "disabled" ? "Reactivate" : "Disable"}
                  </Button>
                ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
