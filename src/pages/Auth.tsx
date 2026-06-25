import React, { useState } from "react";
import { motion } from "motion/react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Loader2, Cookie, Info, LockKeyhole, Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { KronLogo } from "../components/KronLogo";
import { useAuth } from "@/src/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { safeGetItem, safeSetItem } from "@/src/lib/safeStorage";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<{ title: string; desc: string; solution?: string } | null>(null);
  const [acceptCookies, setAcceptCookies] = useState<boolean>(() => {
    const saved = safeGetItem("auratech_accept_cookies", "true");
    return saved !== "false";
  });

  const formatAuthError = (error: any): { title: string; desc: string } => {
    const code = error?.code || "";
    console.warn("Auth process feedback code:", code);

    if (isForgotPassword) {
      return {
        title: "Error resetting password",
        desc: "Please wait a minute and try again, or report this issues if you think it's a bug."
      };
    }

    if (!isLogin) {
      return {
        title: "Error in signing up",
        desc: "Report this issues if you think it's a bug."
      };
    }

    return {
      title: "Error in signing in",
      desc: "Report this issues if you think it's a bug."
    };
  };

  const handleToggleCookies = (enabled: boolean) => {
    setAcceptCookies(enabled);
    safeSetItem("auratech_accept_cookies", enabled ? "true" : "false");
    if (enabled) {
      toast.success("Essential session cookies accepted for secure access.");
    } else {
      toast.info("Cookies declined. Sessions are limited to temporary browser memory.");
    }
  };
  
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPasswordReset } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (isForgotPassword) {
        if (!email) {
          toast.error("Please enter your email address first.");
          setLoading(false);
          return;
        }
        await sendPasswordReset(email);
        setIsForgotPassword(false);
      } else if (isLogin) {
        await signInWithEmail(email, password);
        navigate("/dashboard");
      } else {
        await signUpWithEmail(email, password);
        navigate("/dashboard");
      }
    } catch (error: any) {
      const formatted = formatAuthError(error);
      setAuthError(formatted);
      toast.error(formatted.title);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (error: any) {
      console.warn("Google authentication state: error-handled");
      const formatted = formatAuthError(error);
      setAuthError(formatted);
      toast.error(formatted.title);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(#D3C7B5_1px,transparent_1px)] [background-size:16px_16px] opacity-35" />
      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <KronLogo variant="combined" size="lg" direction="col" glow={true} />
          </div>
          <p className="text-muted-foreground text-sm font-body">
            {isForgotPassword 
              ? "Account Recovery & Password Reset" 
              : isLogin 
                ? "Sign in to access your dashboard" 
                : "Register a new screenwriting account"
            }
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-[4px_4px_0px_0px_rgba(51,37,29,1)]">
          {!isForgotPassword && (
            <Button
              type="button"
              variant="outline"
              className="w-full mb-4 font-display flex items-center justify-center bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 font-semibold cursor-pointer py-2.5 rounded-lg active:scale-[0.98] transition-transform"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          )}

          {isForgotPassword && (
            <button
              onClick={() => {
                setAuthError(null);
                setIsForgotPassword(false);
              }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 font-display font-medium cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
            </button>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {!isForgotPassword && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="flex items-center gap-1.5">
                    <LockKeyhole className="h-3.5 w-3.5 text-slate-400" /> Password
                  </Label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthError(null);
                        setIsForgotPassword(true);
                      }}
                      className="text-xs text-purple-600 hover:text-purple-700 hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center justify-center p-1 rounded-md"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic Cookie Acceptance Consent */}
            <div className="pt-2 pb-1 text-left space-y-2 border-t border-border/40">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 hover:opacity-90">
                  <Cookie className="h-3.5 w-3.5 text-purple-400" /> Cookie Acceptance Consent
                </span>
                <span className={`text-[8px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  acceptCookies ? "bg-purple-500/15 text-purple-400 border border-purple-500/15" : "bg-red-500/15 text-red-400 border border-red-500/15"
                }`}>
                  {acceptCookies ? "Accepted" : "Declined"}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2" id="cookie-consent-options">
                <button
                  type="button"
                  onClick={() => handleToggleCookies(true)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-[10px] font-semibold transition-all duration-300 uppercase font-mono cursor-pointer ${
                    acceptCookies 
                      ? "bg-purple-600/10 border-purple-500/40 text-purple-400 shadow-[0_4px_12px_rgba(168,85,247,0.1)] font-bold scale-102"
                      : "bg-transparent border-border hover:bg-zinc-800/10 text-zinc-400"
                  }`}
                >
                  Accept Cookies
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleCookies(false)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-[10px] font-semibold transition-all duration-300 uppercase font-mono cursor-pointer ${
                    !acceptCookies 
                      ? "bg-red-600/10 border-red-500/45 text-red-400 font-bold scale-102"
                      : "bg-transparent border-border hover:bg-zinc-800/10 text-zinc-400"
                  }`}
                >
                  Decline Cookies
                </button>
              </div>

              <p className="text-[9px] text-muted-foreground leading-relaxed flex items-start gap-1">
                <Info className="h-2.5 w-2.5 shrink-0 mt-0.5 text-muted-foreground" />
                <span>
                  {acceptCookies 
                    ? "Essential session markers will be activated to maintain clean dashboards and layout configs."
                    : "Session tokens are restricted to transient React state memory. Browser refreshes trigger sign-out."}
                </span>
              </p>
            </div>

            <Button type="submit" className="w-full font-display glow-primary cursor-pointer mt-2" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin text-primary-foreground" />}
              {isForgotPassword 
                ? "Send Reset Link" 
                : isLogin 
                  ? "Sign In" 
                  : "Sign Up"
              }
            </Button>
          </form>

  {authError && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-left text-xs font-sans"
            >
              <div className="flex items-start gap-2.5 text-red-600 dark:text-red-400">
                <span className="text-sm shrink-0 mt-0.5">⚠️</span>
                <div className="space-y-1">
                  <p className="font-bold uppercase tracking-wider text-[10px] font-mono">{authError.title}</p>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">{authError.desc}</p>
                </div>
              </div>
            </motion.div>
          )}

          {!isForgotPassword && (
            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setAuthError(null);
                  setIsLogin(!isLogin);
                }}
                className="text-sm text-primary font-display font-medium hover:underline cursor-pointer"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-display font-semibold">
            ← Back to Home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
export { Auth };
