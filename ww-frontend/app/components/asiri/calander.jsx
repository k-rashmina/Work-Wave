import React from 'react';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const CalendarPopupComponent = ({ isVisible, onConfirm, onCancel }) => {
  return (
    <DateTimePickerModal
      isVisible={isVisible}
      mode="date"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default CalendarPopupComponent;


