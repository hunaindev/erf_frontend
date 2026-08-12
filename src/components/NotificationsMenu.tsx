
import React, { useEffect, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import echo from "./../pages/echo";
import axios from 'axios';
import { baseUrl } from '@/utils/constants';

const NotificationsMenu: React.FC = () => {

  const { toast } = useToast();

  const { id, role } = JSON.parse(localStorage.getItem('user')) || {};
  const [notify, setNotify] = useState([])
  const [countNotify, setCountNotify] = useState([])


  // useEffect(() => {
  //   const channel = echo.private(`apply.${id}`)
  //     .listen('ApplyCampaignNotification', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()
  //       setCountNotify(prev => [...prev, e]);

  //     });

  //   return () => {
  //     channel.stopListening('ApplyCampaignNotification');
  //     echo.leave(`apply.${id}`);
  //   };
  // }, [id]);
  // useEffect(() => {

  //   const channel = echo.private(`accept.${id}`)
  //     .listen('AcceptCampaignNotification', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()

  //       setCountNotify(prev => [...prev, e]);
  //     });

  //   return () => {
  //     channel.stopListening('AcceptCampaignNotification');
  //     echo.leave(`accept.${id}`);
  //   };
  // }, [id]);

  // useEffect(() => {
  //   const channel = echo.private(`upload-content.${id}`)
  //     .listen('UploadContent', (e) => {
  //       // console.log(e)
  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()

  //       setCountNotify(prev => [...prev, e]);
  //     });

  //   return () => {
  //     channel.stopListening('UploadContent');
  //     echo.leave(`upload-content.${id}`);
  //   };
  // }, [id]);

  // useEffect(() => {
  //   const channel = echo.private(`upload-content-accept.${id}`)
  //     .listen('UploadContentAccept', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()

  //       setCountNotify(prev => [...prev, e]);
  //     });

  //   return () => {
  //     channel.stopListening('UploadContentAccept');
  //     echo.leave(`upload-content-accept.${id}`);
  //   };
  // }, [id]);

  // useEffect(() => {
  //   const channel = echo.private(`upload-content-reject.${id}`)
  //     .listen('UploadContentReject', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()

  //       setCountNotify(prev => [...prev, e]);
  //     });

  //   return () => {
  //     channel.stopListening('UploadContentReject');
  //     echo.leave(`upload-content-reject.${id}`);
  //   };
  // }, [id]);

  // useEffect(() => {
  //   const channel = echo.private(`upload-content-link.${id}`)
  //     .listen('UploadContentLink', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()
  //       setCountNotify(prev => [...prev, e]);
  //     });

  //   return () => {
  //     channel.stopListening('UploadContentLink');
  //     echo.leave(`upload-content-link.${id}`);
  //   };
  // }, [id]);

  // useEffect(() => {
  //   echo.private(`apply.${id}`)
  //     .listen('ApplyCampaignNotification', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()
  //       setCountNotify(prev => [...prev, e]);

  //     });

  //   echo.private(`accept.${id}`)
  //     .listen('AcceptCampaignNotification', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()

  //       setCountNotify(prev => [...prev, e]);
  //     });

  //   echo.private(`upload-content.${id}`)
  //     .listen('UploadContent', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()

  //       setCountNotify(prev => [...prev, e]);
  //     });

  //   echo.private(`upload-content-accept.${id}`)
  //     .listen('UploadContentAccept', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()

  //       setCountNotify(prev => [...prev, e]);
  //     });


  //   echo.private(`upload-content-reject.${id}`)
  //     .listen('UploadContentReject', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()

  //       setCountNotify(prev => [...prev, e]);
  //     });

  //   echo.private(`upload-content-link.${id}`)
  //     .listen('UploadContentLink', (e) => {

  //       toast({
  //         title: e.data.title,

  //       });
  //       getNotification()
  //       setCountNotify(prev => [...prev, e]);
  //     });

  // }, [id]);
  useEffect(() => {
    const channels = [
      { channel: `apply.${id}`, event: 'ApplyCampaignNotification' },
      { channel: `accept.${id}`, event: 'AcceptCampaignNotification' },
      { channel: `upload-content.${id}`, event: 'UploadContent' },
      { channel: `upload-content-accept.${id}`, event: 'UploadContentAccept' },
      { channel: `upload-content-reject.${id}`, event: 'UploadContentReject' },
      { channel: `upload-content-link.${id}`, event: 'UploadContentLink' },
    ];

    channels.forEach(({ channel, event }) => {
      echo.private(channel).listen(event, (e) => {
        toast({ title: e.data.title });
        getNotification();
        setCountNotify((prev) => [...prev, e]);
      });
    });

    return () => {
      channels.forEach(({ channel, event }) => {
        echo.private(channel).stopListening(event);
      });
    };
  }, [id]);


  const getNotification = () => {

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-notification`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      },
    };

    axios.request(config)
      .then((response) => {

        if (response.data.message) {
          setNotify(response.data.data)
        }

      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getNotification()
  }, [])

  return (


    <Popover>
      <PopoverTrigger asChild>
        <button className="relative text-gray-600 hover:text-gray-900">
          <Bell size={20} />
          {countNotify?.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-semibold min-w-[18px] h-[18px] flex items-center justify-center rounded-full shadow-md">
              {countNotify.length}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-4 py-3 border-b border-gray-100">
          <h3 className="font-medium">Bildirimler</h3>
        </div>
        {notify && notify.length > 0 ? (notify.map((item, key) => (

          <div key={key} className="max-h-[300px] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-start gap-3">

              <div>
                <Link to={item.page_link}>
                  <p className="text-sm">{item.title}..</p>
                  <p className="text-sm text-gray-500">{item.time}</p>
                </Link>
              </div>
            </div>
          </div>
        ))) : (
          <div className="max-h-[300px] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex items-start gap-3">

              <div>

                <p className="text-sm text-gray-500">Bildirim bulunamadı.</p>
              </div>
            </div>
          </div>
        )}

        <div className="px-4 py-2 border-t border-gray-100 text-center">
          {/* {
            role === 'brand' ? <Link to="/notifications" className="text-sm text-gray-600 flex items-center justify-center w-full gap-1 py-1 hover:text-gray-800">
              Tümünü Gör
            </Link> :
              <Link to="/influencer/notifications" className="text-sm text-gray-600 flex items-center justify-center w-full gap-1 py-1 hover:text-gray-800">
                Tümünü Gör
              </Link>
          } */}

        </div>
      </PopoverContent>
    </Popover >
  );
};

export default NotificationsMenu;
