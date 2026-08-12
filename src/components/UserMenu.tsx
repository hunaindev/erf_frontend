import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ProfilePictureDialog from "./ProfilePictureDialog";
import echo from "../pages/echo";
import { useToast } from "@/components/ui/use-toast";
import { baseUrl, imageUrl } from "@/utils/constants";
import axios from "axios";

interface UserMenuProps {
  onOpenWhatsNew: () => void;
  userType?: "brand" | "influencer";
  mobileNav?: boolean;
  mobileActive?: boolean;
}

interface MenuEntry {
  label: string;
  path: string;
}

const UserMenu = ({
  onOpenWhatsNew,
  userType = "brand",
  mobileNav = false,
  mobileActive = false,
}: UserMenuProps) => {
  const [isProfilePictureDialogOpen, setIsProfilePictureDialogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [brandInfo, setBrandInfo] = useState<any>(null);
  const navigate = useNavigate();

  const { toast } = useToast();
  const { id } = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    const listeners = [
      {
        channel: `chat.${id}`,
        event: "MessageSent",
        handler: (e) => {
          toast({
            title: "Mesaj",
            description: e.text,
          });
        },
      },
      {
        channel: `user-active.${id}`,
        event: "UserActive",
        handler: (e) => {
          toast({ title: e.message });
          handleSignOut();
        },
      },
    ];

    listeners.forEach(({ channel, event, handler }) => {
      echo.private(channel).listen(event, handler);
    });

    return () => {
      listeners.forEach(({ channel, event }) => {
        echo.private(channel).stopListening(event);
        echo.leave(channel);
      });
    };
  }, [id]);

  const handleSignOut = () => {
    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/logout`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .request(config)
      .then(() => {
        localStorage.clear();
        navigate("/signin");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleMobileSignOut = () => {
    setIsMobileMenuOpen(false);
    handleSignOut();
  };

  useEffect(() => {
    const handleUserUpdate = () => {
      setBrandInfo(JSON.parse(localStorage.getItem("user")));
    };

    window.addEventListener("user", handleUserUpdate);
    handleUserUpdate();

    return () => {
      window.removeEventListener("user", handleUserUpdate);
    };
  }, []);

  const menuEntries: MenuEntry[] =
    userType === "influencer"
      ? [
          { label: "Kontrol Paneli", path: "/influencer/dashboard" },
          { label: "Mesajlar", path: "/influencer/messages" },
          { label: "Kampanyalar", path: "/influencer/for-you/all-campaigns" },
          { label: "Ayarlar", path: "/influencer/settings" },
          { label: "Profil", path: "/influencer/profile" },
        ]
      : [
          { label: "Kontrol Paneli", path: "/dashboard" },
          { label: "Kampanyalar", path: "/campaigns" },
          { label: "Nasıl Yapılır", path: "/how-to" },
          { label: "Marka Ekle", path: "/add-brands" },
          { label: "Abonelik", path: "/subscription" },
          { label: "Ayarlar", path: "/settings" },
          { label: "Finansal", path: "/financials" },
          { label: "Mesajlar", path: "/messages" },
        ];

  const avatarNode = (
    <Avatar className="h-8 w-8">
      <AvatarImage src={brandInfo?.image ? `${imageUrl}/${brandInfo.image}` : "https://placehold.co/400x400"} />
      <AvatarImage src={userType === "influencer" ? "https://placehold.co/400x400" : ""} />
      <AvatarFallback className="bg-primary/10 text-[hsl(var(--primary-deep))]">
        {brandInfo?.name?.charAt(0) || "U"}
      </AvatarFallback>
    </Avatar>
  );

  const desktopMenuContent = (
    <>
      <div className="px-2 py-2">
        <div className="font-medium">{brandInfo?.name}</div>
        <div className="text-xs text-gray-500">{brandInfo?.email}</div>
      </div>
      <DropdownMenuSeparator />
      {menuEntries.map((entry) => (
        <DropdownMenuItem key={entry.path} onClick={() => navigate(entry.path)}>
          {entry.label}
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleSignOut}>Çıkış Yap</DropdownMenuItem>
    </>
  );

  const mobileTrigger = (
    <button
      type="button"
      className={`relative flex min-w-0 w-full flex-col items-center justify-center gap-1 rounded-[1.2rem] px-1 py-2 text-[11px] font-semibold transition-all duration-200 active:scale-[0.96] ${
        mobileActive
          ? "text-[hsl(var(--primary-deep))]"
          : "text-foreground/45 hover:text-[hsl(var(--primary-deep))]"
      }`}
    >
      <span
        className={`absolute left-1/2 top-0 h-0.5 w-8 -translate-x-1/2 rounded-full transition-opacity duration-200 ${
          mobileActive ? "bg-primary opacity-100" : "bg-transparent opacity-0"
        }`}
      />
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
          mobileActive ? "bg-primary/12 shadow-[0_10px_18px_-14px_rgba(77,28,91,0.45)]" : ""
        }`}
      >
        {avatarNode}
      </span>
      <span className="truncate">Profil</span>
    </button>
  );

  return (
    <>
      {mobileNav ? (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>{mobileTrigger}</SheetTrigger>
          <SheetContent
            side="left"
            className="w-[18.5rem] border-r border-primary/12 bg-white/95 px-5 py-6 sm:max-w-[18.5rem]"
          >
            <SheetHeader className="mb-6 text-left">
              <SheetTitle className="text-[hsl(var(--primary-deep))]">Profil Menusu</SheetTitle>
            </SheetHeader>

            <div className="mb-6 rounded-3xl border border-primary/12 bg-primary/5 px-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11 border border-primary/10">
                  <AvatarImage
                    src={brandInfo?.image ? `${imageUrl}/${brandInfo.image}` : "https://placehold.co/400x400"}
                  />
                  <AvatarImage src={userType === "influencer" ? "https://placehold.co/400x400" : ""} />
                  <AvatarFallback className="bg-primary/10 text-[hsl(var(--primary-deep))]">
                    {brandInfo?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-[hsl(var(--primary-deep))]">{brandInfo?.name}</div>
                  <div className="truncate text-xs text-foreground/60">{brandInfo?.email}</div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {menuEntries.map((entry) => (
                <button
                  key={entry.path}
                  type="button"
                  onClick={() => handleNavigate(entry.path)}
                  className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-[hsl(var(--primary-deep))] transition-all duration-200 hover:bg-primary/8 active:scale-[0.99]"
                >
                  {entry.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleMobileSignOut}
              className="mt-6 flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 active:scale-[0.99]"
            >
              Çıkış Yap
            </button>
          </SheetContent>
        </Sheet>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full">
              {avatarNode}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {desktopMenuContent}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <ProfilePictureDialog
        open={isProfilePictureDialogOpen}
        onOpenChange={setIsProfilePictureDialogOpen}
      />
    </>
  );
};

export default UserMenu;
