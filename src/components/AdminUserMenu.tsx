
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import ProfilePictureDialog from "./ProfilePictureDialog";
import ProfileDialog from '@/components/ProfileDialog';
import echo from '../pages/echo';
import { useToast } from '@/components/ui/use-toast';
import { baseUrl } from "@/utils/constants";
import axios from "axios";

interface UserMenuProps {
    onOpenWhatsNew: () => void;
    userType?: 'brand' | 'influencer';
}

const UserMenu = ({ onOpenWhatsNew, userType = 'brand' }: UserMenuProps) => {
    const [isProfilePictureDialogOpen, setIsProfilePictureDialogOpen] = useState(false);
    const navigate = useNavigate();
    const [brandInfo, setBrandInfo] = useState('');

    const { toast } = useToast();

    const handleSignOut = () => {

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseUrl}/api/logout`,
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
                'Content-Type': 'application/json',
            },
        };

        axios.request(config)
            .then((response) => {

                localStorage.clear();
                navigate('/signin');

            })
            .catch((error) => {
                console.log(error);

            });
    };

    useEffect(() => {

    }, [])

    useEffect(() => {
        const handleUserUpdate = () => {
            setBrandInfo(JSON.parse(localStorage.getItem("user")));
        };

        window.addEventListener("user", handleUserUpdate);

        // Initial load
        handleUserUpdate();

        return () => {
            window.removeEventListener("user", handleUserUpdate);
        };
    }, []);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={brandInfo?.image ? brandInfo?.image : 'https://placehold.co/400x400'} />
                            {/* <AvatarFallback>{userType === 'influencer' ? 'MU' : 'AT'}</AvatarFallback> */}
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">

                    <div className="px-2 py-2">
                        <div className="font-medium capitalize">{brandInfo?.name}</div>
                        <div className="text-xs text-gray-500">{brandInfo?.email}</div>
                    </div>
                    <DropdownMenuSeparator />
                    {/* Admin items here */}
                    <DropdownMenuItem onClick={() => navigate('/admin/dashboard')}>
                        Kontrol Paneli
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                Yönetici Ayarları
              </DropdownMenuItem> */}
                    <DropdownMenuItem onClick={handleSignOut}>
                        Çıkış Yap
                    </DropdownMenuItem>




                </DropdownMenuContent>
            </DropdownMenu >

            <ProfilePictureDialog
                open={isProfilePictureDialogOpen}
                onOpenChange={setIsProfilePictureDialogOpen}
            />

        </>
    );
};

export default UserMenu;
