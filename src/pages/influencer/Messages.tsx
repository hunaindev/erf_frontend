import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';
import echo from "../echo";
import InfluencerNavbar from '@/components/InfluencerNavbar';
import SideMenu from '@/pages/influencer/side-menu';
import { baseUrl, imageUrl } from '@/utils/constants';

const Mesajlar = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [messageText, setMessageText] = useState('');
  const [contacts, setContacts] = useState([]);
  const [searchUser, setSearchUser] = useState('');
  const [receiverId, setReceiverId] = useState(0);
  const [checkUser, setCheckUser] = useState(false);
  const [users, setKullanıcılar] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMesajlar] = useState([]);
  const messagesContainerRef = useRef(null);
  const [image, setImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const fileInputRef = useRef(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [isLoadingMesajlar, setIsLoadingMesajlar] = useState(true);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [onlineKullanıcılar, setOnlineKullanıcılar] = useState([]);

  const { id } = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const listeners = [
      {
        channel: `chat.${id}`,
        event: 'MessageSent',
        handler: (e) => {
          setMesajlar(prev => [...prev, e]);
        }
      },
      {
        channel: `read.${id}`,
        event: 'MessageRead',
        handler: (e) => {
          console.log('influ', e);
          setMesajlar(prev =>
            prev.map(msg =>
              msg.id === e.id ? { ...msg, seen: e.seen } : msg
            )
          );
        }
      },
      {
        channel: 'user-status',
        event: '.UserStatus',
        isPublic: true,
        handler: (e) => {
          setContacts(prevContacts =>
            prevContacts.map(contact =>
              contact.id === e.id
                ? { ...contact, online: e.online }
                : contact
            )
          );
        }
      }
    ];

    listeners.forEach(({ channel, event, handler, isPublic }) => {
      const echoChannel = isPublic ? echo.channel(channel) : echo.private(channel);
      echoChannel.listen(event, handler);
    });

    return () => {
      listeners.forEach(({ channel, event, isPublic }) => {
        const echoChannel = isPublic ? echo.channel(channel) : echo.private(channel);
        echoChannel.stopListening(event);
        echo.leave(channel);
      });
    };
  }, [id]);

  const read = () => {
    messages.forEach(msg => {
      if (msg.sender !== 'me' && !msg.seen) {
        axios.post(`${baseUrl}/api/messages/${msg.id}/read`, {}, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
          },
        });
      }
    });
  };

  const changeUser = () => {
    setCheckUser(true);
    scrollToBottom();
  };

  const fetchMesajlar = () => {
    setIsLoadingMesajlar(true);
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-messages/${receiverId}`,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
    };

    axios.request(config)
      .then((response) => {
        setTimeout(() => {
          setMesajlar(response.data);
          setIsLoadingMesajlar(false);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
        setIsLoadingMesajlar(false);
      });
  };

  useEffect(() => {
    fetchMesajlar();
    read();
  }, [receiverId]);

  const getUser = () => {
    setIsLoadingContacts(true);
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-users?search=${searchUser}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
    };

    axios.request(config)
      .then((response) => {
        setContacts(response.data);
        setIsLoadingContacts(false);
      })
      .catch((error) => {
        setIsLoadingContacts(false);
        console.log(error);
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const [IsSending, setIsSending] = useState(false)

  const sendMessage = () => {
    setIsSending(true)
    const data = JSON.stringify({
      "message": messageText,
      "sender_id": JSON.parse(localStorage.getItem('user')).id,
      "receiver_id": contacts[selectedChat]?.id,
      "role": JSON.parse(localStorage.getItem('user')).role,
      "chat_id": selectedChat,
      "timestamp": new Date().toISOString(),
      "channel_id": 'chat_' + JSON.parse(localStorage.getItem('user')).name + '_' + contacts[selectedChat]?.name
    });
    const formData = new FormData();
    formData.append("image", image);
    formData.append("data", data);
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/send-message`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      data: formData
    };

    axios.request(config)
      .then((response) => {
        setImage('');
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
          setPreviewImage('');
        }
        fetchMesajlar();
      })
      .catch((error) => {
        console.log(error);
      }).finally(() => setIsSending(false))
    setMessageText('');
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
    getUser();
  }, [searchUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const ShimmerContact = () => (
    <div className="p-3 border-b flex items-start animate-pulse">
      <div className="mr-3">
        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );

  const ShimmerMessage = () => (
    <div className="flex justify-start animate-pulse">
      <div className="h-8 w-8 bg-gray-200 rounded-full mr-2 mt-1"></div>
      <div>
        <div className="max-w-md rounded-lg px-4 py-2 bg-gray-200 rounded-bl-none">
          <div className="h-4 bg-gray-300 rounded w-40"></div>
        </div>
        <div className="h-3 bg-gray-200 rounded w-20 mt-1"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <InfluencerNavbar />
      <main className="flex-1 px-0 pt-0 pb-28 md:p-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="hidden text-xl font-semibold mb-4 md:block">Mesajlar</h2>

          <div className="flex h-[calc(100dvh-8rem)] overflow-hidden bg-white md:h-[calc(100vh-100px)] md:rounded-lg md:border md:bg-transparent">
            {/* Sidebar - Contact List */}
            <div className={`bg-white ${checkUser ? 'hidden md:block md:w-80 md:border-r' : 'block w-full md:w-80 md:border-r'}`}>
              <div className="border-b px-3 py-3 md:p-3">
                <div className="relative ">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    placeholder="Konusmalarda ara"
                    className="h-11 rounded-2xl border-0 bg-[#f7f2fb] px-10 text-sm shadow-none"
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-[calc(100%-57px)]">
                {isLoadingContacts ? (
                  <>
                    <ShimmerContact />
                    <ShimmerContact />
                    <ShimmerContact />
                  </>
                ) : contacts.length === 0 ? (
                  <div className="text-center text-sm text-gray-400 mt-20">Kullanıcı Bulunamadı</div>
                ) : (contacts.map((getUser, index) => (
                  <div
                    key={getUser.id}
                    className={`p-3 border-b flex items-start cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === getUser.id ? 'bg-gray-50' : ''}`}
                    onClick={() => {
                      setSelectedChat(index);
                      setReceiverId(getUser.id);
                    }}
                  >
                    <div className="relative mr-3">
                      <Avatar onClick={() => {
                        changeUser()
                        read();
                      }} className="h-12 w-12">
                        <AvatarFallback>{getUser?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {!!getUser.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                      )}
                    </div>
                    <div onClick={() => {
                      changeUser();
                      read();
                    }} className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-medium text-sm truncate">{getUser?.name}</h3>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{getUser?.role}</p>
                    </div>
                    {getUser?.unread > 0 && (
                      <span className="ml-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {getUser?.unread}
                      </span>
                    )}
                  </div>))
                )}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className={`${checkUser ? 'block w-full md:flex-1' : 'hidden md:block md:flex-1'}`}>
              {checkUser ? (
                <div className="flex h-full flex-col bg-[#f8f4fb]">
                  {/* Chat Header with Back Button */}
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 px-3 py-3 backdrop-blur-sm md:static md:px-3 md:py-3">
                    <div className="flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2 h-9 w-9 rounded-full md:hidden"
                        onClick={() => setCheckUser(false)}
                      >
                        <ArrowLeft size={20} />
                      </Button>
                      <Avatar className="mr-3 h-10 w-10">
                        <AvatarFallback>{contacts[selectedChat]?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <h3 className="truncate font-medium text-sm">{contacts[selectedChat]?.name}</h3>
                        <p className="text-xs text-gray-500">{contacts[selectedChat]?.online ? 'Cevrimici' : 'Cevrimdisi'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mesajlar */}
                  <div
                    ref={messagesContainerRef}
                    className="flex-1 overflow-y-auto px-3 py-4 space-y-3 border border-border/60 bg-[#f8f4fb] md:p-4 md:space-y-4"
                  >
                    <div className="text-xs text-center text-gray-500 my-2">Bugün</div>
                    {messages.length === 0 ? (
                      <div className="text-center text-sm text-gray-400">Mesaj bulunamadı</div>
                    ) : (messages.map((message, key) => (
                      <div
                        key={key}
                        className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        {message.sender !== 'me' && (
                          <Avatar className="h-8 w-8 mr-2 flex-shrink-0 mt-1">
                            <AvatarFallback>{contacts[selectedChat] ? contacts[selectedChat]?.name.charAt(0) : ''}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className="max-w-[78vw] md:max-w-md">
                          {message.text != "" && (
                            <div
                              className={`rounded-2xl px-3 py-2.5 shadow-sm ${message.sender === 'me'
                                ? 'bg-primary text-white rounded-br-md'
                                : 'bg-white border border-border/60 text-foreground rounded-bl-md'
                                }`}
                            >
                              <p className="text-sm flex items-center gap-1">
                                {message.text}
                                {message.sender === 'me' && (
                                  message.seen ? (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 256 256"
                                      width="16"
                                      height="16"
                                      className="inline ml-1 text-white"
                                    >
                                      <rect width="256" height="256" fill="none" />
                                      <polyline
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="16"
                                        points="148 84 60 172 16 128.002"
                                      />
                                      <polyline
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="16"
                                        points="240 84 152 172 128.627 148.628"
                                      />
                                    </svg>
                                  ) : (
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      width="16"
                                      height="16"
                                      className="inline ml-1 text-white"
                                    >
                                      <path d="M10,17.75h-.015c-.217-.004-.422-.103-.562-.27l-5-6c-.266-.318-.223-.791.096-1.056.318-.265.79-.223,1.057.096l4.445,5.334,8.421-9.356c.278-.308.752-.332,1.06-.056.308.277.333.751.056,1.06l-9,10c-.143.158-.345.248-.558.248Z" />
                                    </svg>
                                  )
                                )}
                              </p>
                            </div>
                          )}
                          {message.text != "" && (
                            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                          )}
                          {message.image && (
                            <>
                              <img
                                className="mt-4 cursor-pointer hover:opacity-80 transition"
                                src={`${imageUrl}/${message.image}`}

                                alt=""
                                width={100}
                                onClick={() => {
                                  setPreviewImageUrl(message.image);
                                  setPreviewModalOpen(true);
                                }}
                              />
                              <p className="text-xs text-gray-500 mt-1">{message.time}</p>
                            </>
                          )}
                        </div>
                      </div>
                    )))}
                  </div>
                  {previewImage && (
                    <div className="border-t border-border/60 bg-white px-3 pt-3">
                      <img src={previewImage} alt="Önizleme" className="max-w-[140px] rounded-2xl border border-border/60" />
                      <Button variant="ghost" size="sm" onClick={() => {
                        setPreviewImage(null);
                        setImage('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}>Kaldir</Button>
                    </div>
                  )}

                  {/* Message Input */}
                  <div className="mb-[calc(env(safe-area-inset-bottom)+5.75rem)] border-t border-border/60 bg-white/95 p-2.5 backdrop-blur-sm md:mb-0 md:bg-white md:p-3">
                    <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-[#f8f4fb] p-2">
                      <label htmlFor="image">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full shrink-0" asChild>
                          <div>
                            <input
                              type="file"
                              name="image"
                              id="image"
                              onChange={handleFileChange}
                              accept="image/*"
                              ref={fileInputRef}
                              className="hidden"
                            />
                            <Paperclip size={18} className="text-gray-500" />
                          </div>
                        </Button>
                      </label>
                      <Input
                        placeholder="Mesaj yazin..."
                        className="h-10 flex-1 border-0 bg-transparent px-1 text-sm shadow-none focus-visible:ring-0"
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                      />
                      <Button className="h-10 w-10 rounded-full shrink-0" size="icon" onClick={sendMessage} disabled={IsSending}>
                        <Send size={18} />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-sm text-gray-400">Sohbete başlamak için bir konuşma seçin</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {previewModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewModalOpen(false)}
        >
          <div className="relative max-w-3xl w-full p-4" onClick={e => e.stopPropagation()}>
            <img
              src={previewImageUrl}
              alt="Önizleme"
              className="max-h-[90vh] w-auto mx-auto rounded shadow-lg"
            />
            <Button
              variant="ghost"
              className="absolute top-2 right-2 text-white"
              onClick={() => setPreviewModalOpen(false)}
            >
              Kapat
            </Button>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Mesajlar;
