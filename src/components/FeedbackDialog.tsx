
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X } from 'lucide-react';
import axios from 'axios';
import { baseUrl } from '@/utils/constants';

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onHandleLeaveCampaignConfirm: () => void;
  onLeaveFeedback: () => void;
  id: number;
}

const FeedbackDialog: React.FC<FeedbackDialogProps> = ({
  open,
  onOpenChange,
  onHandleLeaveCampaignConfirm,
  onLeaveFeedback,
  id
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherFeedback, setOtherFeedback] = useState("");
  const [likeliness, setLikeliness] = useState<string | null>(null);
  const [getId, setGetId] = useState();

  const reasons = [
    "Kampanya gereksinimleri net değildi",
    "Kampanya takvimi çok sıkışıktı",
    "Yaratıcı yönlendirme influencer'ın markasıyla uyumlu değildi",
    "Çakışan bir fırsat bulundu",
    "Diğer (Lütfen aşağıda belirtin)"
  ];

  const handleReasonToggle = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleLikelinessChange = (value: string) => {
    setLikeliness(value);
  };

  const onSubmit = () => {

    const data = {
      id: getId,
      reasons: selectedReasons,
      feedback: otherFeedback
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/feedback`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        //   setCampaign(response.data.campaign);
        console.log(response.data)
        onHandleLeaveCampaignConfirm()
      })
      .catch((error) => {
        console.log(error);

      });
  };

  const onLeaveWithoutFeedback = () => {
    //  onConfirm(selectedTime, selectedDay);
    const data = {
      id: getId,
    }

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/with-out-feedback`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        //   setCampaign(response.data.campaign);
        console.log(response.data)
        onLeaveFeedback()
      })
      .catch((error) => {
        console.log(error);

      });
  };
  useEffect(() => {
    setGetId(id);
  }, [id]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[32vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <button
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Kapat</span>
          </button>
          <DialogTitle className="text-center">Geri Bildirim</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <h3 className="text-lg font-semibold text-center">Her şeyin iyi gitmemesine üzüldük!</h3>

          <div className="text-center text-sm">
            <p>Ayrılmadan önce geri bildiriminizi duymak isteriz.</p>
            <p>Geri bildiriminiz hem bize hem de markaya gelecekteki kampanyaları geliştirmede yardımcı olacaktır.</p>
            <p className="italic mt-2">Bu bilgiler markaya iletilecektir.</p>
          </div>

          <div className="space-y-3">
            <p className="font-medium">Bu kampanyadan neden ayrılıyorsunuz? (Uygun olanların tümünü seçin)</p>

            <div className="space-y-2">
              {reasons.map((reason) => (
                <div key={reason} className="flex items-start">
                  <input
                    type="checkbox"
                    id={reason}
                    checked={selectedReasons.includes(reason)}
                    onChange={() => handleReasonToggle(reason)}
                    className="mt-1 mr-2"
                  />
                  <label htmlFor={reason} className="text-sm">{reason}</label>
                </div>
              ))}

            </div>
          </div>

          <div className="space-y-2">
            <p className="font-medium">Gelecekte bu markanın kampanyalarına başvurma olasılığınız nedir?</p>

            {/* <div className="flex space-x-3 items-center">
              {["Very Likely", "Likely", "Neutral", "Unlikely", "Very Unlikely"].map((option) => (
                <div key={option} className="flex items-center">
                  <input
                    type="radio"
                    id={option}
                    name="likeliness"
                    checked={likeliness === option}
                    onChange={() => handleLikelinessChange(option)}
                    className="mr-1"
                  />
                  <label htmlFor={option} className="text-xs">{option}</label>
                </div>
              ))}
            </div> */}
          </div>

          <div className="space-y-2">
            <p className="font-medium">Başka bir geri bildiriminiz var mı?</p>
            <Textarea
              placeholder="Eklemek istediğiniz başka bir geri bildirimi buraya yazın..."
              value={otherFeedback}
              onChange={(e) => setOtherFeedback(e.target.value)}
              className="h-24"
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <Button
              variant="outline"
              onClick={onLeaveWithoutFeedback}
              className="w-1/2 bg-gray-200 hover:bg-gray-300"
            >
              Geri Bildirim Vermeden Ayrıl
            </Button>
            <Button
              onClick={onSubmit}
              className="w-1/2 bg-black hover:bg-gray-800"
            >
              Kampanyadan Ayrıl
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
