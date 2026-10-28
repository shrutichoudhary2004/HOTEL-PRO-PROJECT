import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  // Tomorrow and 3 days later as defaults
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const checkoutDefault = new Date();
  checkoutDefault.setDate(checkoutDefault.getDate() + 4);

  const [searchParams, setSearchParams] = useState({
    checkIn: tomorrow.toISOString().split('T')[0],
    checkOut: checkoutDefault.toISOString().split('T')[0],
    adults: 2,
    children: 0,
    roomType: 'All',
  });

  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [activeInvoice, setActiveInvoice] = useState(null);

  const updateSearchParams = (newParams) => {
    setSearchParams((prev) => ({ ...prev, ...newParams }));
  };

  const openBookingModal = (room) => {
    setSelectedRoomForBooking(room);
  };

  const closeBookingModal = () => {
    setSelectedRoomForBooking(null);
  };

  const openInvoice = (booking) => {
    setActiveInvoice(booking);
  };

  const closeInvoice = () => {
    setActiveInvoice(null);
  };

  return (
    <BookingContext.Provider
      value={{
        searchParams,
        updateSearchParams,
        selectedRoomForBooking,
        openBookingModal,
        closeBookingModal,
        activeInvoice,
        openInvoice,
        closeInvoice,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
