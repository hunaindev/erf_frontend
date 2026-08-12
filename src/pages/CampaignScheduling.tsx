


import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { ArrowLeft, RefreshCw, Heart, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { baseUrl, imageUrl } from '@/utils/constants';

interface TimeSlot {
  day: string;
  date: string;
  time: string;
  selected: boolean;
}

interface SelectedTimeSlot {
  day: string;
  date: string;
  time: string;
  formattedDay: string;
}

const CampaignScheduling: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCount, setSelectedCount] = useState(0);
  const [maxSelections] = useState(100);
  const [oneAppointmentPerDay, setOneAppointmentPerDay] = useState(false);
  const [ongoingCampaign, setOngoingCampaign] = useState(false);
  const [launchDialogOpen, setLaunchDialogOpen] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);

  const [data, setData] = useState('')
  const [searchParams] = useSearchParams();
  const [days, setDays] = useState([]);
  const [activeMobileDayIndex, setActiveMobileDayIndex] = useState(0);

  useEffect(() => {

    const data = JSON.parse(searchParams.get('data'));
    setData(data)


  }, [])


  function getWeekStartingToday() {
    const today = new Date();
    const week = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i); // Add i days to today

      const dayName = date.toLocaleDateString('tr-TR', { weekday: 'long' }); // Pazartesi, Sali
      // const dayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // Apr 21

      week.push({ name: dayName });
    }

    return week;
  }


  useEffect(() => {
    setDays(getWeekStartingToday());
  }, []);

  useEffect(() => {
    if (activeMobileDayIndex > Math.max(days.length - 1, 0)) {
      setActiveMobileDayIndex(0);
    }
  }, [days, activeMobileDayIndex]);


  // Time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00', '21:00'
  ];

  const getShortDayName = (day: string) => {
    const shortNames = {
      pazartesi: 'Pzt',
      sali: 'Sal',
      salı: 'Sal',
      carsamba: 'Cars',
      çarşamba: 'Cars',
      persembe: 'Pers',
      perşembe: 'Pers',
      cuma: 'Cuma',
      cumartesi: 'Cmt',
      pazar: 'Paz',
    };

    return shortNames[day?.toLocaleLowerCase('tr-TR')] || day?.slice(0, 3) || '';
  };

  const activeMobileDay = days[activeMobileDayIndex];

  // Handle time slot selection
  const handleTimeSlotSelect = (day: string, time: string) => {
    console.log(selectedTimeSlots);

    //const formattedDay = formatDayDate(day, time);
    const timeKey = `${day}-${time}`;

    // Check if the slot is already selected
    const existingIndex = selectedTimeSlots.findIndex(
      slot => `${slot.day}-${slot.time}` === timeKey
    );
    // -${slot.date}-${slot.time}
    if (existingIndex >= 0) {
      // Remove slot if already selected
      const updatedSlots = [...selectedTimeSlots];
      updatedSlots.splice(existingIndex, 1);
      setSelectedTimeSlots(updatedSlots);
      setSelectedCount(prevCount => prevCount - 1);
    } else {
      // Add slot if not at max and not conflicting with oneAppointmentPerDay
      if (selectedCount < maxSelections) {
        if (oneAppointmentPerDay) {
          // Check if there's already a slot for this day
          const dayHasSlot = selectedTimeSlots.some(
            slot => slot.day === day //&& slot.date === date
          );

          if (!dayHasSlot) {
            setSelectedTimeSlots([...selectedTimeSlots, { day, time }]);
            setSelectedCount(prevCount => prevCount + 1);
          }
        } else {
          setSelectedTimeSlots([...selectedTimeSlots, { day, time }]);
          setSelectedCount(prevCount => prevCount + 1);
        }
      }
    }
  };
  // , date: string, 
  // Check if a time slot is selected
  const isTimeSlotSelected = (day: string, time: string) => {
    return selectedTimeSlots.some(
      slot => slot.day === day && slot.time === time
    );
  };

  // Handle finish button click
  const handleFinish = () => {

    const sendData = JSON.stringify({
      "campaign_id": data.id,
      "brand_id": data.brand_id,
      "time_slot": selectedTimeSlots,

    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/create-time-slots`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
        'Content-Type': 'application/json',
      },
      data: sendData
    };

    axios.request(config)
      .then((response) => {

        if (selectedCount > 0) {
          setLaunchDialogOpen(true);
        }
      }

      )
      .catch((error) => {
        console.log(error);

      });

  };



  // Handle campaign launch
  const handleLaunchCampaign = () => {
    setLaunchDialogOpen(false);
    // Navigate back to the campaigns page or show success message
    navigate('/campaigns');
  };

  // Remove a selected time slot
  const removeSelectedTimeSlot = (index: number) => {
    const updatedSlots = [...selectedTimeSlots];
    updatedSlots.splice(index, 1);
    setSelectedTimeSlots(updatedSlots);
    setSelectedCount(prevCount => prevCount - 1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <DashboardNavbar />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 pb-36 sm:px-6 lg:px-8 lg:pb-8">
        <div className="grid grid-cols-1 gap-6 py-6 sm:py-8 lg:grid-cols-12">
          {/* Left Column - Campaign Preview */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm lg:col-span-3 lg:rounded-none lg:border-0 lg:border-r lg:p-0 lg:pr-6 lg:shadow-none">
            <div className="mb-4 sm:mb-6">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={20} />
              </button>
            </div>

            <h2 className="text-xl font-medium mb-4">Kampanya Önizleme</h2>

            {/* <div className="mb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="flex items-center">
                    <p className="font-medium">Dine & Dash</p>
                    <span className="ml-2 text-xs text-white bg-orange-500 px-1.5 py-0.5 rounded-md">CTA</span>
                  </div>
                  <p className="text-sm text-gray-500">by</p>
                </div>
              </div>
            </div> */}

            <div className="relative mb-4 overflow-hidden rounded-xl">
              <img
                src={`${imageUrl}/${data?.image}`}

                alt="Kampanya Önizleme"
                className="w-full rounded-xl border border-gray-200"
              />

            </div>

            <p className="break-words text-sm text-gray-600">
              {data.name}
            </p>
          </div>

          {/* Middle and Right Columns - Time Slots */}
          <div className="lg:col-span-9">
            <div className="flex flex-col h-full">
              <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold leading-tight">Erfluencer Planlama</h1>
                <div className="flex items-center justify-between gap-3 sm:justify-end sm:gap-4">
                  <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                    <RefreshCw size={20} />
                  </button>
                  <Button
                    onClick={handleFinish}
                    className="min-w-[120px] bg-indigo-500 px-6 text-white hover:bg-indigo-600 sm:px-8"
                  >
                    Bitir
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {/* Left side - Selected Timeslots */}
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:col-span-1 md:self-start">
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-1">Seçilen Zaman Dilimleri</h3>
                    <p className="text-gray-800 font-medium">{selectedCount} / {maxSelections}</p>
                  </div>

                  <div className="mb-2 max-h-[18rem] space-y-2 overflow-y-auto pr-1 sm:mb-6">
                    {selectedTimeSlots.length > 0 ? (
                      selectedTimeSlots.map((slot, index) => (
                        <div
                          key={index}
                          className="relative rounded-xl border border-indigo-100 bg-indigo-50 p-3 pr-10"
                        >
                          <button
                            onClick={() => removeSelectedTimeSlot(index)}
                            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                          >
                            <X size={14} />
                          </button>
                          <p className="break-words text-sm font-medium text-slate-900">{slot.day}</p>
                          <p className="mt-1 text-xs text-slate-600">{slot.time}</p>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                        Henüz zaman dilimi seçilmedi.
                      </div>
                    )}
                  </div>


                </div>

                {/* Right side - Calendar view */}
                <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:col-span-2 lg:col-span-3">
                  {/* Calendar Header */}
                  <div className="mb-4 hidden grid-cols-7 gap-2 md:grid">
                    {days.map((day, i) => (
                      <div key={i} className="text-center">
                        <p className="break-words text-sm font-medium leading-tight">{day.name}</p>
                        {/* <p className="text-sm text-gray-500">{day.date}</p> */}
                      </div>
                    ))}
                  </div>

                  <div className="mb-4 md:hidden">
                    <div className="mb-3 grid grid-cols-4 gap-2">
                      {days.map((day, i) => {
                        const isActive = i === activeMobileDayIndex;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setActiveMobileDayIndex(i)}
                            className={`min-w-0 rounded-full border px-2 py-2 text-sm font-medium transition-colors ${
                              isActive
                                ? 'border-primary bg-primary text-white'
                                : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            {getShortDayName(day.name)}
                          </button>
                        );
                      })}
                    </div>

                    {activeMobileDay ? (
                      <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                        {activeMobileDay.name}
                      </div>
                    ) : null}
                  </div>

                  {/* Time Slots Grid */}
                  <div className="hidden grid-cols-7 gap-2 md:grid">
                    {timeSlots.map((time, timeIndex) => (
                      <React.Fragment key={timeIndex}>
                        {days.map((day, dayIndex) => {
                          const isSelected = isTimeSlotSelected(day.name, time);
                          return (
                            <button
                              key={`${dayIndex}-${timeIndex}`}
                              className={`rounded-md p-2 text-center text-sm ${isSelected
                                ? 'bg-primary text-white'
                                : 'bg-blue-100 hover:bg-blue-200 text-gray-700'
                                }`}
                              onClick={() => handleTimeSlotSelect(day.name, time)}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-3 md:hidden">
                    {activeMobileDay ? (
                      timeSlots.map((time, timeIndex) => {
                        const isSelected = isTimeSlotSelected(activeMobileDay.name, time);

                        return (
                          <button
                            key={`${activeMobileDay.name}-${timeIndex}`}
                            type="button"
                            className={`flex min-h-[88px] w-full items-center justify-center rounded-2xl px-4 py-5 text-center transition-colors [&>span:first-child]:text-xl [&>span:first-child]:font-semibold [&>span:first-child]:tracking-wide [&>span:last-child]:hidden ${
                              isSelected
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-blue-50 text-slate-700 hover:bg-blue-100'
                            }`}
                            onClick={() => handleTimeSlotSelect(activeMobileDay.name, time)}
                          >
                            <span>{time}</span>
                            <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                              {isSelected ? 'Seçildi' : 'Seç'}
                            </span>
                          </button>
                        );
                      })
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Launch Campaign Dialog */}
      <Dialog open={launchDialogOpen} onOpenChange={setLaunchDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-2xl border-0 bg-white p-5 shadow-2xl sm:max-w-md sm:p-6">
          <DialogTitle className="text-center text-xl">Kampanyanızı Başlatın</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />

          <div className="py-4 sm:py-5">
            <p className="mx-auto max-w-[18rem] text-center text-sm leading-6 text-gray-600 sm:max-w-none sm:text-base">
              Kampanya başlatıldıktan sonra düzenlenebilir
            </p>
          </div>

          <div className="mt-2 flex justify-center">
            <Button
              onClick={handleLaunchCampaign}
              className="w-full rounded-xl bg-[hsl(var(--primary-ink))] py-3 text-sm font-semibold text-white hover:bg-[hsl(var(--primary-deep))] sm:w-auto sm:min-w-[240px]"
            >
              Kampanyayı Başlat
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>





  );
};

export default CampaignScheduling;
