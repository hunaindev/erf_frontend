
import React, { useEffect, useState } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { baseUrl, imageUrl } from '@/utils/constants';
const Bildirimler: React.FC = () => {

  const [getnotify, setGetNotify] = useState([])

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

        console.log(response.data)

        if (response.data.message) {
          setGetNotify(response.data.notify)
        }

      })
      .catch((error) => {
        console.log(error);
      });
  }
  const handleNotification = (id) => {

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${baseUrl}/api/accept-notification/${id}`,
      headers: {
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
      },
    };

    axios.request(config)
      .then((response) => {

        console.log(response.data)

        // if (response.data.message) {
        //   setGetNotify(response.data.notify)
        // }

      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    getNotification()
  }, [setGetNotify])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DashboardNavbar />

      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Notification</h1>

          </div>

          <div className="mt-6">
            {getnotify && getnotify.length > 0 ? (
              getnotify.map((item, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md border border-gray-200 rounded-xl p-5 mb-4 transition hover:shadow-lg"
                >
                  <p className="text-lg font-semibold text-gray-800 mb-2">{item.title}</p>

                  <div className="flex items-center mb-3">
                    <img
                      src={`${imageUrl}/${item.image}`}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                    />
                    <div className="ml-4">
                      <p className="text-gray-700 font-medium">{item.name}</p>
                      <p className="text-gray-600  text-sm">Visit {item.time + '-' + item.day}</p>
                      <p className="text-sm text-gray-500">{item.about}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">{item.start ?? 'Just now'}</p>

                  <div className="flex space-x-3 mt-4">
                    {item.apply_status === 'applied' ?
                      <button
                        onClick={() => handleNotification(item.apply_id)}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        To accept
                      </button>
                      :
                      <button disabled={true}
                        className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg transition"
                      >
                        Kabul Edildi
                      </button>
                    }



                  </div>
                </div>
              ))
            ) : (
              <div className="bg-yellow-50 text-yellow-800 p-6 rounded-md border border-yellow-200 text-center">
                <p>Bildirim bulunamadı.</p>
              </div>
            )}
          </div>



        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Bildirimler;
