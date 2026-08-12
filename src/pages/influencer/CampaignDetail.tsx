import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import InfluencerNavbar from "@/components/InfluencerNavbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Eye, Heart, Info } from "lucide-react";
import AppointmentDialog from "@/components/AppointmentDialog";
import FeedbackDialog from "@/components/FeedbackDialog";
import axios from "axios";
import CountdownTimer from "../../components/Timer";
import { Input } from "@/components/ui/input";
import { baseUrl, imageUrl } from '@/utils/constants';
import echo from "../../pages/echo";

const CampaignDetail = () => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [waitingApproval, setWaitingApproval] = useState(false);
  const [cannotJoin, setCannotJoin] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [updateAppointmentDialogOpen, setUpdateAppointmentDialogOpen] =
    useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("9pm Mar 26 2025");
  const [campaign, setCampaign] = useState([]);
  const [confirmApproval, setConfirmApproval] = useState(false);
  const [viewDocumentsDialogOpen, setViewDocumentsDialogOpen] = useState(false);
  const [selectedFileStory, setSelectedFileStory] = useState(null);
  const [selectedFilePost, setSelectedFilePost] = useState(null);
  const [selectedStoryPreview, setSelectedStoryPreview] = useState("");
  const [selectedPostPreview, setSelectedPostPreview] = useState("");
  const [contentType, setContentType] = useState();
  const [approvedContent, setApprovedContent] = useState(false);
  const [storyContent, setStoryContent] = useState(false);
  const [postContent, setPostContent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewLinkDialogOpen, setViewLinkDialogOpen] = useState(false);
  const [storyLink, setStoryLink] = useState("");
  const [postLink, setPostLink] = useState("");
  const [checkApply, setCheckApply] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const { id, role } = JSON.parse(localStorage.getItem("user"));
  // useEffect(() => {

  //   const channel = echo.private(`accept.${id}`)
  //     .listen('AcceptCampaignNotification', (e) => {
  //       getCampaign()

  //     });

  //   return () => {
  //     channel.stopListening('AcceptCampaignNotification');
  //     echo.leave(`accept.${id}`);
  //   };
  // }, [id]);

  // useEffect(() => {
  //   const channel = echo.private(`upload-content-accept.${id}`)
  //     .listen('UploadContentAccept', (e) => {

  //       getCampaign()
  //     });

  //   return () => {
  //     channel.stopListening('UploadContentAccept');
  //     echo.leave(`upload-content-accept.${id}`);
  //   };
  // }, [id]);

  // useEffect(() => {
  //   const channel = echo.private(`upload-content-reject.${id}`)
  //     .listen('UploadContentReject', (e) => {

  //       getCampaign()
  //     });

  //   return () => {
  //     channel.stopListening('UploadContentReject');
  //     echo.leave(`upload-content-reject.${id}`);
  //   };
  // }, [id]);

  // useEffect(() => {
  //   const channel = echo.private(`upload-content-link.${id}`)
  //     .listen('UploadContentLink', (e) => {

  //       getCampaign()
  //     });

  //   return () => {
  //     channel.stopListening('UploadContentLink');
  //     echo.leave(`upload-content-link.${id}`);
  //   };
  // }, [id]);

  useEffect(() => {
    const listeners = [
      {
        channel: `accept.${id}`,
        event: "AcceptCampaignNotification",
      },
      {
        channel: `upload-content-accept.${id}`,
        event: "UploadContentAccept",
      },
      {
        channel: `upload-content-reject.${id}`,
        event: "UploadContentReject",
      },
      {
        channel: `upload-content-link.${id}`,
        event: "UploadContentLink",
      },
    ];

    // Register all listeners with same handler
    listeners.forEach(({ channel, event }) => {
      echo.private(channel).listen(event, () => {
        getCampaign(); // common handler
      });
    });

    // Cleanup
    return () => {
      listeners.forEach(({ channel, event }) => {
        echo.private(channel).stopListening(event);
        echo.leave(channel);
      });
    };
  }, [id]);

  const handleFileChangeStory = (e) => {
    setSelectedFileStory(e.target.files[0]);
  };
  const handleFileChangePost = (e) => {
    setSelectedFilePost(e.target.files[0]);
  };

  useEffect(() => {
    if (!selectedFileStory) {
      setSelectedStoryPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFileStory);
    setSelectedStoryPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFileStory]);

  useEffect(() => {
    if (!selectedFilePost) {
      setSelectedPostPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFilePost);
    setSelectedPostPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFilePost]);

  const { ids } = useParams();

  const getCampaign = () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-influencer-campaign/${ids}`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data)
        setContentType(JSON.parse(response.data?.campaign?.content_type));
        const type = JSON.parse(response.data?.campaign?.content_type);
        setCampaign(response.data.campaign);
        if (response.data.campaign.apply.status === "applied") {
          setSelectedTimeSlot(
            response.data.campaign.apply.time +
            " " +
            response.data.campaign.apply.day
          );
          setHasApplied(true);
          setWaitingApproval(true);
        }
        if (response.data.campaign.apply.status === "active") {
          setSelectedTimeSlot(
            response.data.campaign.apply.time +
            " " +
            response.data.campaign.apply.day
          );
          setConfirmApproval(true);
          setHasApplied(true);
          setWaitingApproval(false);
        }


        if (Array.isArray(type) && type.length > 0) {
          if (type.includes('Story') && type.includes('Post')) {

            if (response.data.campaign.apply.story_status === "accepted" &&
              response.data.campaign.apply.post_status === "accepted") {
              setSelectedTimeSlot(
                response.data.campaign.apply.time + " " + response.data.campaign.apply.day
              );
              setConfirmApproval(true);
              setHasApplied(true);
              setPostContent(true);
              setStoryContent(true);
              setApprovedContent(true);
            }
          } else if (type.includes('Story')) {
            if (response.data.campaign.apply.story_status === "accepted") {
              setSelectedTimeSlot(
                response.data.campaign.apply.time + " " + response.data.campaign.apply.day
              );
              setConfirmApproval(true);
              setHasApplied(true);
              setStoryContent(true);
              setApprovedContent(true);
            }
          } else if (type.includes('Post')) {
            console.log('Post');
            if (response.data.campaign.apply.post_status === "accepted") {
              setSelectedTimeSlot(
                response.data.campaign.apply.time + " " + response.data.campaign.apply.day
              );
              setConfirmApproval(true);
              setHasApplied(true);
              setPostContent(true);
              setApprovedContent(true);
            }
          }
        }




        if (response.data.campaign.apply?.status == "leave") {
          setSelectedTimeSlot(
            response.data.campaign.apply.time +
            " " +
            response.data.campaign.apply.day
          );
          setHasApplied(false);
          setWaitingApproval(false);
          setCannotJoin(true);
        }

        if (response.data.campaign.apply?.status == "completed") {
          setSelectedTimeSlot(
            response.data.campaign.apply.time +
            " " +
            response.data.campaign.apply.day
          );
          setConfirmApproval(false);
          setHasApplied(false);
          setCheckApply(true);
          setHasCompleted(true);
        }
        setStoryLink(campaign?.apply?.story_link);
        setPostLink(campaign?.apply?.post_link);
      })
      .catch((error) => {
        console.log(error);
      });

  };

  useEffect(() => {
    getCampaign();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("story", selectedFileStory);
    formData.append("post", selectedFilePost);
    formData.append("id", campaign?.apply?.id);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/upload-content`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        setIsSubmitting(false);

        getCampaign();
        setViewDocumentsDialogOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);
      });
  };

  const handleLinkSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("storyLink", storyLink ?? "");
    formData.append("postLink", postLink ?? "");
    formData.append("id", campaign?.apply?.id);

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/upload-content-link`,
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem("token"))}`,
      },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        // console.log(response.data);
        setIsSubmitting(false);

        getCampaign();
        setViewLinkDialogOpen(false);
      })
      .catch((error) => {
        console.log(error);
        setIsSubmitting(false);
      });
  };

   const handleConfirm = () => {
    const data = {
      time: "",
      day: "",
      id: campaign?.id
    }
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/apply-campaign`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        console.log(response.data)
        setConfirmationOpen(true);
      })
      .catch((error) => {
        console.log(error);

      });
  };

  const handleApply = () => {
    if (campaign?.mode === 'physical') {
      setAppointmentDialogOpen(true);
    }else{
      handleConfirm()
    }
  };

  

  const handleUploadContent = () => {
    setViewDocumentsDialogOpen(true);
  };
  const handleUploadLink = () => {
    setViewLinkDialogOpen(true);
  };

  const handleAppointmentConfirm = (timeSlot: string, day: string) => {
    setSelectedTimeSlot(`${timeSlot} ${day} 2025`);
    setAppointmentDialogOpen(false);
    setConfirmationOpen(true);
  };

  const handleConfirmApply = () => {
    setHasApplied(true);
    setWaitingApproval(true);
    setConfirmationOpen(false);
  };

  const handleUpdateAppointment = () => {
    setUpdateAppointmentDialogOpen(true);
  };

  const handleUpdateAppointmentConfirm = (timeSlot: string, day: string) => {
    setSelectedTimeSlot(`${timeSlot} ${day} 2025`);
    setUpdateAppointmentDialogOpen(false);
  };

  const handleLeaveCampaign = () => {
    setFeedbackDialogOpen(true);
  };

  const handleLeaveCampaignConfirm = () => {
    setFeedbackDialogOpen(false);
    setHasApplied(false);
    setWaitingApproval(false);
    setCannotJoin(true);
  };

  const handleLeaveWithoutFeedback = () => {
    setFeedbackDialogOpen(false);
    setHasApplied(false);
    setWaitingApproval(false);
    setCannotJoin(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const getType = (url) => {
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (["mp4", "webm", "ogg", "mov", "m4v"].includes(ext)) return "video";
    return "unknown";
  };

  const getUploadStatusClass = (status) => {
    if (status === "accepted") {
      return "inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700";
    }

    if (status === "rejected") {
      return "inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700";
    }

    return "inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700";
  };

  const getUploadStatusLabel = (status) => {
    if (status === "accepted") return "Kabul Edildi";
    if (status === "rejected") return "Reddedildi";
    return "Yüklenmeyi Bekliyor";
  };



  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTimer(true);
    }, 5000); // 2 second

    return () => clearTimeout(timer); // cleanup
  }, []);
 // console.log('j', cannotJoin)
 // console.log('a', hasApplied)
  //console.log('c', hasCompleted)

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  const campaignInfoSections = [
    { title: "Kampanya Amacı", value: campaign?.goals },
    { title: "Ürün Tipi", value: campaign?.product_type },
    {
      title: "İçerik Türü",
      value: Array.isArray(contentType) ? contentType.join(", ") : "",
    },
    { title: "Kategori", value: campaign?.category },
    { title: "Gereksinimler", value: campaign?.requirements },
    {
      title: "Gerekli Konum Etiketi",
      value: `${campaign?.user?.company_name || ""}${campaign?.user?.location ? ` - ${campaign.user.location}` : ""}`,
    },
    { title: "Promosyon Kodları", value: campaign?.codes },
    { title: "Gerekli Hashtagler", value: campaign?.hashtags },
  ].filter((section) => section.value);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <InfluencerNavbar />
      <main className="flex-1 px-4 pb-36 pt-4 sm:p-6 sm:pb-32 lg:px-8 lg:pb-10">
        <div className="mx-auto max-w-6xl">
          {/* Back button */}
          <button
            onClick={handleBack}
            className="mb-4 inline-flex items-center rounded-full border border-slate-200 bg-white p-3 text-gray-600 shadow-sm transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-semibold text-slate-900 sm:text-3xl">
                {campaign.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {campaign?.user?.company_name || "Kampanya detayı"}
              </p>
            </div>

            {!hasApplied && !cannotJoin && !checkApply && !hasCompleted && (
              <button
                onClick={handleApply}
                className="w-full rounded-xl bg-[hsl(var(--primary-ink))] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[hsl(var(--primary-deep))] sm:ml-auto sm:w-auto"
              >
                Kampanyaya Başvur
              </button>
            )}

            {cannotJoin && (
              <button
                className="w-full cursor-not-allowed rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 sm:ml-auto sm:w-auto"
                disabled
              >
                Bu Kampanyaya Katilamazsin
              </button>
            )}

            {hasApplied && (
              <button
                className="w-full cursor-default rounded-xl border border-primary/20 bg-primary/10 px-5 py-3 text-sm font-semibold text-primary sm:ml-auto sm:w-auto"
                disabled
              >
                Kampanyaya Başvuruldu
              </button>
            )}

            {hasCompleted && (
              <button
                className="w-full cursor-default rounded-xl border border-green-200 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 sm:ml-auto sm:w-auto"
                disabled
              >
                Kampanya Tamamlandı
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            {/* Left Column - Image and About */}
            <div className="col-span-1">
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="relative aspect-[4/3] bg-slate-100">
                  <img
                    src={`${imageUrl}/${campaign.image}`}

                    alt={campaign.name}
                    className="h-full w-full object-cover"
                  />
                  {/* <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="absolute top-3 left-3 bg-white p-2 rounded-full"
                  >
                    <Heart
                      className={`h-5 w-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                    />
                  </button> */}
                  <div className="absolute bottom-3 right-3 inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-sm font-medium text-primary shadow-sm">
                    <Eye className="h-4 w-4 mr-1" />
                    {campaign?.count ? campaign?.count : 0}
                  </div>
                </div>

                <div className="space-y-2 p-4 sm:p-5">
                  <h3 className="font-medium mb-1">Hakkında</h3>
                  <p className="break-words text-sm leading-6 text-slate-600">
                    {campaign?.user?.about || "Marka hakkında bilgi bulunmuyor."}
                  </p>
                </div>
              </div>

              {/* {waitingApproval && (
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium">Marka onayi icin kalan sure</h3>
                    <Info className="h-4 w-4 text-red-500" />
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    <span className="countdown-block">
                      ## : ## : ## : ##
                    </span>
                  </div>
                </div>
              )} */}
            </div>

            {/* Right Column - Campaign Details */}
            <div className="col-span-1">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
                <div className="border-b border-gray-200 pb-5 mb-5">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-gray-600">Katılım Tarihi:
                      </p>
                      <p className="font-medium">{`${new Date(campaign?.start_date).getDate().toString().padStart(2, "0")}-${(new Date(campaign?.start_date).getMonth() + 1).toString().padStart(2, "0")}-${new Date(campaign?.start_date).getFullYear()}`}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-sm text-gray-600">
                        Kampanya Suresi

                      </p>
                      <p className="font-medium">{`${new Date(campaign?.end_date).getDate().toString().padStart(2, "0")}-${(new Date(campaign?.end_date).getMonth() + 1).toString().padStart(2, "0")}-${new Date(campaign?.end_date).getFullYear()}`}</p>
                    </div>
                  </div>

                  {waitingApproval && (
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                       {campaign?.mode === 'physical' &&
                       <>
                      <p className="text-sm text-gray-600">Zaman Araliği:</p>
                      <p className="break-words text-base font-semibold text-slate-900">{selectedTimeSlot}</p>
</>}
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <Button
                          variant="outline"
                          className="h-auto w-full justify-center rounded-xl border-amber-200 bg-amber-100 px-4 py-3 text-center text-sm font-semibold text-amber-700 hover:bg-amber-200 hover:text-amber-800"
                        >
                          Onay Bekleniyor

                        </Button>
                        {campaign?.mode === 'physical' &&
                        <Button
                          variant="outline"
                          className="h-auto w-full justify-center whitespace-normal rounded-xl border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          onClick={handleUpdateAppointment}
                        >
                          Randevu Saatini Güncelle

                        </Button>
                        }
                       
                        <Button
                          variant="outline"
                          className="h-auto w-full justify-center whitespace-normal rounded-xl border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-600 hover:bg-red-100 hover:text-red-700"
                          onClick={handleLeaveCampaign}
                        >
                          Kampanyadan Ayril

                        </Button>
                      </div>
                    </div>
                  )}

                  {confirmApproval && (
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                       {campaign?.mode === 'physical' &&
                       <>
                      <p className="text-sm text-gray-600">Zaman Araliği:</p>
                      <p className="break-words text-base font-semibold text-slate-900">{selectedTimeSlot}</p>
                      </>
                       }
                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        <Button
                          variant="outline"
                          className="h-auto w-full justify-center rounded-xl border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-semibold text-green-700 hover:bg-green-100 hover:text-green-800"
                        >
                          Onaylandı
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto w-full justify-center whitespace-normal rounded-xl border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
                          onClick={handleUploadContent}
                        >
                          İçerik Yükle

                        </Button>
                        {approvedContent && (
                          <Button
                            variant="outline"
                            className="h-auto w-full justify-center whitespace-normal rounded-xl border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 hover:bg-slate-100"
                            onClick={handleUploadLink}
                          >
                            Bağlantı Yükle

                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-b border-gray-200 pt-2 pb-4 mb-4">
                  <h3 className="text-sm font-medium mb-3">Kampanya Amacı

                  </h3>
                  <p className="mb-4 break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {campaign?.goals}
                  </p>
                </div>

                <div className="border-b border-gray-200 pt-2 pb-4 mb-4">
                  <h3 className="text-sm font-medium mb-3">Ürün Tipi

                  </h3>
                  <p className="mb-4 break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {campaign?.product_type}
                  </p>
                </div>

                  <div className="border-b border-gray-200 pt-2 pb-4 mb-4">
                  <h3 className="text-sm font-medium mb-3">Toplantı Türü

                  </h3>
                  <p className="mb-4 break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {campaign?.mode === 'physical' ? 'Fiziksel' : 'Online'}
                  </p>
                </div>

                <h3 className="text-sm font-medium mb-3">İçerik Türü
                </h3>
                <p className="mb-4 break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
                  {campaign?.content_type
                    ? JSON.parse(campaign?.content_type).join(", ")
                    : ""}
                </p>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-medium mb-2">Kategori
                  </h3>
                  <p className="break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">{campaign?.category}</p>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <h3 className="text-sm font-medium mb-3">Gereksinimler</h3>
                  <p className="mb-1 break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {campaign?.requirements}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="text-sm font-medium mb-2">
                      Gerekli Konum Etiketi
                    </h3>
                    <p className="break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {campaign.user?.company_name} - {campaign.user?.location}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="text-sm font-medium mb-2">
                      Promosyon Kodlari
                    </h3>
                    <p className="break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {campaign?.codes}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <h3 className="text-sm font-medium mb-2">
                      Gerekli Hashtagler
                    </h3>
                    <p className="break-words whitespace-pre-wrap text-sm leading-6 text-slate-600">
                      {campaign?.hashtags}
                    </p>
                  </div>
                  <div className="hidden lg:block"></div>
                </div>
                {/* {
                  showTimer &&
                  (hasCompleted || hasApplied || cannotJoin) && (
                    <CountdownTimer endDate={campaign.end_date} />
                  )
                } */}

                {
                  showTimer &&
                  !(hasCompleted || hasApplied || cannotJoin) && (
                    <CountdownTimer endDate={campaign.end_date} />
                  )
                }

              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />


      {/* Application Confirmation Dialog */}
      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              Başvurunuz başarıyla tamamlandı.
            </DialogTitle>
            <div className="text-center font-medium text-lg">
              {campaign.title}
            </div>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center mb-6">
              {/* Please wait for {campaign.user.company_name} to review your application. You will receive an email and notification in the coming days with their decision. */}
            </p>
            <Button className="w-full" onClick={handleConfirmApply}>
              Tamamla
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Apply For Campaign Dialog */}
      <AppointmentDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        onConfirm={handleAppointmentConfirm}
        id={campaign.id}
        title="Kampanyaya Başvur"
      />

      {/* Update Appointment Dialog */}
      <AppointmentDialog
        open={updateAppointmentDialogOpen}
        onOpenChange={setUpdateAppointmentDialogOpen}
        onConfirm={handleUpdateAppointmentConfirm}
        onCancel={handleLeaveCampaign}
        id={campaign.id}
        title="Randevu Saatini Güncelle"
      />

      {/* Feedback Dialog */}
      <FeedbackDialog
        open={feedbackDialogOpen}
        onOpenChange={setFeedbackDialogOpen}
        onHandleLeaveCampaignConfirm={handleLeaveCampaignConfirm}
        onLeaveFeedback={handleLeaveWithoutFeedback}
        id={campaign.id}
      />

      {/* View Documents Dialog */}
      <Dialog
        open={viewDocumentsDialogOpen}
        onOpenChange={setViewDocumentsDialogOpen}
      >
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border-0 bg-white p-4 shadow-2xl sm:p-6">
          <DialogTitle className="text-center">İçerik Yükleme
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

          <div className="space-y-4 pt-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h4 className="font-medium mb-3"></h4>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {contentType &&
                    contentType?.map((type, index) => type === "Story" ? (
                      <div
                        key={index}
                        className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                      >
                        {/* Story  */}
                        {type === "Story" && (
                          <div className="space-y-3">
                            {campaign?.apply?.story_status === "rejected" ? (
                              <>
                                <label
                                  className="block text-sm font-semibold text-slate-900"
                                  htmlFor="FileChangeStory"
                                >
                                  Hikaye Yükle

                                </label>
                                <input
                                  required
                                  type="file"
                                  id="FileChangeStory"
                                  onChange={handleFileChangeStory}
                                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-[hsl(var(--primary-ink))] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary-deep))]"
                                />
                                {selectedFileStory && (
                                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                                    <div className="hidden">
                                      Seçilen dosya: {selectedFileStory.name}
                                    </div>
                                    {selectedFileStory.type.startsWith("image/") && selectedStoryPreview ? (
                                      <img
                                        src={selectedStoryPreview}
                                        alt="Hikaye önizleme"
                                        className="h-28 w-full rounded-xl object-cover"
                                      />
                                    ) : selectedFileStory.type.startsWith("video/") && selectedStoryPreview ? (
                                      <video
                                        src={selectedStoryPreview}
                                        controls
                                        className="h-28 w-full rounded-xl object-cover"
                                      />
                                    ) : (
                                      <div className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-600">
                                        Önizleme desteklenmiyor
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            ) : campaign?.apply?.story_status === "accepted" ? (
                              <span className={getUploadStatusClass("accepted")}>
                                {getUploadStatusLabel("accepted")}
                              </span>
                            ) : (
                              <>
                                <label
                                  className="block text-sm font-semibold text-slate-900"
                                  htmlFor="FileChangeStory"
                                >
                                  Hikaye Yükle
                                </label>
                                <input
                                  required
                                  type="file"
                                  id="FileChangeStory"
                                  onChange={handleFileChangeStory}
                                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-[hsl(var(--primary-ink))] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary-deep))]"
                                />
                                {selectedFileStory && (
                                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                                    <div className="hidden">
                                      Seçilen dosya: {selectedFileStory.name}
                                    </div>
                                    {selectedFileStory.type.startsWith("image/") && selectedStoryPreview ? (
                                      <img
                                        src={selectedStoryPreview}
                                        alt="Hikaye önizleme"
                                        className="h-28 w-full rounded-xl object-cover"
                                      />
                                    ) : selectedFileStory.type.startsWith("video/") && selectedStoryPreview ? (
                                      <video
                                        src={selectedStoryPreview}
                                        controls
                                        className="h-28 w-full rounded-xl object-cover"
                                      />
                                    ) : (
                                      <div className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-600">
                                        Önizleme desteklenmiyor
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                            {campaign?.apply?.story_status === "rejected" && (
                              <span className={getUploadStatusClass("rejected")}>
                                {getUploadStatusLabel("rejected")}
                              </span>
                            )}
                          </div>
                        )}
                        {/* {type === 'Story' && campaign?.apply?.story && (
                      <img src={campaign.apply.story} alt="Uploaded Story" width={120} />
                    )} */}
                        {type === "Story" &&
                          campaign?.apply?.story &&
                          (() => {
                            const type = getType(campaign.apply.story);

                            return (
                              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                                {type === "image" && (
                                  <img
                                    src={`${imageUrl}/${campaign.apply.story}`}

                                    alt="media"
                                    className="h-auto w-full rounded-xl object-cover"
                                  />
                                )}
                                {type === "video" && (
                                  <video
                                    src={`${imageUrl}/${campaign.apply.story}`}

                                    controls
                                    className="h-auto w-full rounded-xl"
                                  />
                                )}
                              </div>
                            );
                          })()}
                      </div>
                    ) : null)}


                  {contentType &&
                    contentType.map((type, index) => type === "Post" ? (
                      <div
                        key={index}
                        className="space-y-4 rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                      >
                        {/* Post  */}
                        {type === "Post" && (
                          <div className="space-y-3">
                            {campaign?.apply?.post_status === "rejected" ? (
                              <>
                                <label
                                  className="block text-sm font-semibold text-slate-900"
                                  htmlFor="FileChangeSPost"
                                >
                                  Gönderi
                                  Yükle
                                </label>
                                <input
                                  required
                                  type="file"
                                  id="FileChangePost"
                                  onChange={handleFileChangePost}
                                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-[hsl(var(--primary-ink))] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary-deep))]"
                                />
                                {selectedFilePost && (
                                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                                    <div className="hidden">
                                      Seçilen dosya: {selectedFilePost.name}
                                    </div>
                                    {selectedFilePost.type.startsWith("image/") && selectedPostPreview ? (
                                      <img
                                        src={selectedPostPreview}
                                        alt="Gönderi önizleme"
                                        className="h-28 w-full rounded-xl object-cover"
                                      />
                                    ) : selectedFilePost.type.startsWith("video/") && selectedPostPreview ? (
                                      <video
                                        src={selectedPostPreview}
                                        controls
                                        className="h-28 w-full rounded-xl object-cover"
                                      />
                                    ) : (
                                      <div className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-600">
                                        Önizleme desteklenmiyor
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            ) : campaign?.apply?.post_status === "accepted" ? (
                              <span className={getUploadStatusClass("accepted")}>
                                {getUploadStatusLabel("accepted")}
                              </span>
                            ) : (
                              <>
                                <label
                                  className="block text-sm font-semibold text-slate-900"
                                  htmlFor="FileChangePost"
                                >
                                  Gönderi
                                  Yükle
                                </label>
                                <input
                                  required
                                  type="file"
                                  id="FileChangePost"
                                  onChange={handleFileChangePost}
                                  className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-[hsl(var(--primary-ink))] file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-[hsl(var(--primary-deep))]"
                                />
                                {selectedFilePost && (
                                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                                    <div className="hidden">
                                      Seçilen dosya: {selectedFilePost.name}
                                    </div>
                                    {selectedFilePost.type.startsWith("image/") && selectedPostPreview ? (
                                      <img
                                        src={selectedPostPreview}
                                        alt="Gönderi önizleme"
                                        className="h-28 w-full rounded-xl object-cover"
                                      />
                                    ) : selectedFilePost.type.startsWith("video/") && selectedPostPreview ? (
                                      <video
                                        src={selectedPostPreview}
                                        controls
                                        className="h-28 w-full rounded-xl object-cover"
                                      />
                                    ) : (
                                      <div className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-600">
                                        Önizleme desteklenmiyor
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                            {campaign?.apply?.post_status === "rejected" && (
                              <span className={getUploadStatusClass("rejected")}>
                                {getUploadStatusLabel("rejected")}
                              </span>
                            )}
                          </div>
                        )}

                        {/* {type === 'Post' && campaign?.apply?.post && (
                      <img src={campaign.apply.post} alt="Uploaded Post" width={120} />
                    )} */}
                        {type === "Post" &&
                          campaign?.apply?.post &&
                          (() => {
                            const type = getType(campaign.apply.post);

                            return (
                              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
                                {type === "image" && (
                                  <img
                                    src={`${imageUrl}/${campaign.apply.post}`}
                                    //src={campaign.apply.post}
                                    alt="media"
                                    className="h-auto w-full rounded-xl object-cover"
                                  />
                                )}
                                {type === "video" && (
                                  <video
                                    src={`${imageUrl}/${campaign.apply.post}`}

                                    controls
                                    className="h-auto w-full rounded-xl"
                                  />
                                )}
                              </div>
                            );
                          })()}
                      </div>
                    ) : null)}

                  <div className="pt-2 text-center">
                    {!(
                      campaign?.apply?.story_status === "accepted" &&
                      campaign?.apply?.post_status === "accepted"
                    ) && (
                        <Button type="submit" disabled={isSubmitting} className="h-12 w-full rounded-xl bg-[hsl(var(--primary-ink))] text-sm font-semibold text-white hover:bg-[hsl(var(--primary-deep))]" >
                          Yükle
                        </Button>
                      )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Link Dialog */}
      <Dialog open={viewLinkDialogOpen} onOpenChange={setViewLinkDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-lg rounded-2xl border-0 bg-white p-4 shadow-2xl sm:p-6">
          <DialogTitle className="text-center text-xl font-semibold text-slate-900">Bağlantı Yükleme</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 shadow-sm">
              <form onSubmit={handleLinkSubmit}>
                <div className="space-y-4">
                  {storyContent && (
                    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <label htmlFor="storyLink" className="text-sm font-semibold text-slate-800">
                          Hikaye Bağlantısi

                        </label>
                      </div>
                      
                      <input
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-fuchsia-300 focus:bg-white focus:ring-4 focus:ring-fuchsia-100"
                        id="storyLink"
                        placeholder="Hikaye Bağlantısi girin..."
                        value={storyLink}
                        onChange={(e) => setStoryLink(e.target.value)}
                      />
                    </div>)
                  }
                  {storyContent && postContent && <div className="border-b border-slate-200" />}
                  {postContent && (
                    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2">
                        <label htmlFor="postLink" className="text-sm font-semibold text-slate-800">
                          Gönderi
                          Bağlantısi

                        </label>
                      </div>
                      <input
                        required
                        className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-fuchsia-300 focus:bg-white focus:ring-4 focus:ring-fuchsia-100"
                        id="postLink"
                        placeholder="Gönderi
 Bağlantısi girin..."
                        value={postLink}
                        onChange={(e) => setPostLink(e.target.value)}
                      />

                    </div>
                  )}

                  <div className="pt-2">
                    <Button disabled={isSubmitting} type="submit" className="h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white shadow-sm hover:bg-primary/90" >
                      Yükle
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignDetail;
