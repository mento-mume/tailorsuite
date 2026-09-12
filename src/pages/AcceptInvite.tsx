import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { useAuth } from "../context/AuthContext";
import type { Invite } from "../data/inviteTypes";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

type LoadState =
  | { status: "loading" }
  | { status: "not-found" }
  | { status: "expired" }
  | { status: "already-used" }
  | { status: "ready"; invite: Invite };

export default function AcceptInvite() {
  const { token } = useParams<{ token: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setState({ status: "not-found" });
      return;
    }

    getDoc(doc(db, "invites", token))
      .then((snapshot) => {
        if (!snapshot.exists()) {
          setState({ status: "not-found" });
          return;
        }

        const invite = { id: snapshot.id, ...snapshot.data() } as Invite;

        if (invite.status !== "pending") {
          setState({ status: "already-used" });
          return;
        }

        if (invite.expiresAt < Date.now()) {
          setState({ status: "expired" });
          return;
        }

        setState({ status: "ready", invite });
      })
      .catch(() => {
        setState({ status: "not-found" });
      });
  }, [token]);

  async function handleSubmit() {
    if (state.status !== "ready" || !token) return;

    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        state.invite.email,
        password,
      );

      await setDoc(doc(db, "Users", credential.user.uid), {
        uid: credential.user.uid,
        email: state.invite.email,
        role: state.invite.role,
        status: "active",
        username,
        inviteToken: token,
      });

      await updateDoc(doc(db, "invites", token), {
        status: "accepted",
        acceptedAt: Date.now(),
      });

      navigate("/", { replace: true });
    } catch {
      setError("Could not create your account. The email may already be in use.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (state.status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg p-4">
        <p className="text-text-secondary">Loading invite…</p>
      </div>
    );
  }

  if (state.status === "not-found") {
    return (
      <InviteMessage title="Invite not found" body="This invite link is invalid." />
    );
  }

  if (state.status === "expired") {
    return (
      <InviteMessage
        title="Invite expired"
        body="This invite link has expired. Ask the owner to send you a new one."
      />
    );
  }

  if (state.status === "already-used") {
    return (
      <InviteMessage
        title="Invite already used"
        body="This invite has already been accepted or revoked."
      />
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg p-4">
        <Card className="w-full max-w-[380px]">
          <h1 className="text-lg font-semibold mb-1">You're already signed in</h1>
          <p className="text-sm text-text-secondary mb-6">
            Sign out first to accept this invite as {state.invite.email}.
          </p>
          <Button className="w-full" onClick={() => signOut(auth)}>
            Sign out
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg p-4">
      <Card className="w-full max-w-[380px]">
        <h1 className="text-lg font-semibold mb-1">Join TailorSuite</h1>
        <p className="text-sm text-text-secondary mb-6">
          You've been invited as {state.invite.role}. Set up your account below.
        </p>

        <div className="flex flex-col gap-4">
          <Input label="Email" value={state.invite.email} disabled />
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={error || undefined}
          />
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            className="w-full mt-2"
          >
            Create account
          </Button>
        </div>
      </Card>
    </div>
  );
}

function InviteMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg p-4">
      <Card className="w-full max-w-[380px]">
        <h1 className="text-lg font-semibold mb-1">{title}</h1>
        <p className="text-sm text-text-secondary">{body}</p>
      </Card>
    </div>
  );
}
