
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { format, addDays } from "date-fns";
import { baseUrl } from '@/utils/constants';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (timeSlot: string, day: string) => void;
  onCancel?: () => void;
  title?: string;
  id: number;
}

const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  onCancel,
  title = "Kampanyaya Başvur",
  id
}) => {
  const [selectedDay, setSelectedDay] = useState("Wednesday");
  const [selectedTime, setSelectedTime] = useState("6:00 PM");
  const [getId, setGetId] = useState();
  const [slots, setSlots] = useState();
  const [timeSlots, setTimeSlots] = useState();


  // const days = [
  //   { name: "Sunday", },
  //   { name: "Monday", },
  //   { name: "Tuesday", },
  //   { name: "Wednesday ", },
  //   { name: " Thursday ", },
  //   { name: "Friday", },
  //   { name: "Saturday", }
  // ];

  // const times = ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"];

  const handleConfirm = () => {
    onConfirm(selectedTime, selectedDay);
    const data = {
      time: selectedTime,
      day: selectedDay,
      id: getId
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
      })
      .catch((error) => {
        console.log(error);

      });
  };

  const getSlot = () => {

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/get-slot/${getId}`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
      }
    };

    axios.request(config)
      .then((response) => {

        if (response.data.slot) {
          const slots = response.data.slot;

          const groupedSlots = slots.reduce((acc, slot) => {
            const existing = acc.find(item => item.date === slot.date);

            if (existing) {
              existing.times.push(slot.time);
            } else {
              acc.push({
                date: slot.date,
                times: [slot.time]
              });
            }

            return acc;
          }, []);

          setSlots(groupedSlots);

        }
        console.log(slots);
      })
      .catch((error) => {
        console.log(error);

      });
  };

  useEffect(() => {
    getSlot()
  }, [getId])


  useEffect(() => {
    setGetId(id);

  }, [id]);

  useEffect(() => {
    if (slots && slots.length > 0) {
      const firstSlot = slots[0];
      setSelectedDay(firstSlot.date);
      setTimeSlots(firstSlot.times || []);
      setSelectedTime(firstSlot.times?.[0] || "");
      return;
    }

    setTimeSlots([]);
    setSelectedTime("");
  }, [slots, open]);

  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    const row = slots.find(item => item.date === day);
    setTimeSlots(row?.times || [])
    setSelectedTime(row?.times?.[0] || "")

  };

  const handleTimeClick = (time: string) => {
    setSelectedTime(time);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto max-w-md rounded-2xl border-0 bg-white p-4 shadow-2xl sm:p-6">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center text-xl font-semibold text-slate-900 sm:text-2xl">{title}</DialogTitle>
        </DialogHeader>
        <div className="py-2 sm:py-4">
          <div className="mb-4">
            <p className="text-sm text-center mb-3">Ziyaret için tercih edilen tarih ve saat</p>

            <div className="grid grid-cols-3 gap-2 text-center sm:grid-cols-4">
              {slots && slots.map((item, key) => (
                <div key={key} className="flex flex-col">

                  <button
                    className={`min-h-11 rounded-full border mb-2 px-3 py-2 text-sm font-medium transition-colors ${selectedDay === item.date ? 'border-primary/20 bg-primary/10 text-primary' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}
                    onClick={() => handleDayClick(item.date)}
                  >
                    {item.date}
                  </button>
                </div>
              ))}


            </div>

            <div className="grid grid-cols-1 gap-3">
              {timeSlots && timeSlots.map((item, key) => (
                <button
                  key={key}
                  className={`min-h-14 rounded-2xl border px-4 py-4 text-center text-lg font-semibold transition-colors ${selectedTime === item
                    ? 'border-primary/20 bg-primary/10 text-primary'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  onClick={() => handleTimeClick(item)}
                >
                  {item}
                </button>
              ))}
            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {onCancel && (
              <Button
                variant="destructive"
                className="h-12 w-full rounded-xl bg-red-700 text-sm font-semibold hover:bg-red-800"
                onClick={onCancel}
              >
                Kampanyadan Ayrıl
              </Button>
            )}
            <Button
              className="h-12 w-full rounded-xl bg-[hsl(var(--primary-ink))] text-sm font-semibold text-white hover:bg-[hsl(var(--primary-deep))]"
              onClick={handleConfirm}
              disabled={!selectedTime || !selectedDay}
            >
              Başvur
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};

export default AppointmentDialog;
