document.addEventListener("DOMContentLoaded", () => {
  const bookedSlotsTableBody = document.querySelector("#booked-slots-table tbody");
  const timeSlotContainer = document.querySelector(".time-slot-container");
  const modal = document.getElementById("confirmation-modal");
  const cancelModal = document.getElementById("cancel-modal");
  const selectedSlotDisplay = document.getElementById("selected-slot");
  const cancelSlotMessage = document.getElementById("cancel-slot-message");
  const confirmBtn = document.getElementById("confirm-btn");
  const cancelBtn = document.getElementById("cancel-btn");
  const confirmCancelBtn = document.getElementById("confirm-cancel-btn");
  const closeCancelBtn = document.getElementById("close-cancel-btn");
  const datePicker = document.getElementById("booking-date");

  let bookings = {}; // Disable localStorage persistence

  let selectedSlot = null;
  let selectedDate = null;

  function getTimeSlotsForDay(dateStr) {
    if (!dateStr) return [];
    const date = new Date(dateStr);
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    let startHour, endHour;
    if (day >= 1 && day <= 5) { // Monday to Friday
      startHour = 11;
      endHour = 21;
    } else { // Saturday or Sunday
      startHour = 14;
      endHour = 23; // 00:00 next day
    }
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    if (endHour === 24) {
      slots.push('00:00');
    }
    return slots;
  }

  function renderTimeSlots(date) {
    timeSlotContainer.innerHTML = "";
    if (!date) return;
    const bookedSlots = bookings[date] || [];
    renderTable();
    const slots = getTimeSlotsForDay(date);
    slots.forEach((slot) => {
      const slotDiv = document.createElement("div");
      slotDiv.classList.add("time-slot");
      slotDiv.setAttribute(
        "data-tooltip",
        bookedSlots.includes(slot) ? "Booked" : "Available"
      );

      if (bookedSlots.includes(slot)) {
        slotDiv.classList.add("booked");
        slotDiv.textContent = `${slot} (Booked)`;
        slotDiv.addEventListener("click", () => promptCancel(slot));
      } else {
        slotDiv.textContent = slot;
        slotDiv.addEventListener("click", () => selectSlot(slot, slotDiv));
      }
      timeSlotContainer.appendChild(slotDiv);
    });
  }

  function renderTable() {
    bookedSlotsTableBody.innerHTML = "";

    if (Object.keys(bookings).length === 0) {
      const noBookingsRow = document.createElement("tr");
      const noBookingsCell = document.createElement("td");
      noBookingsCell.colSpan = 4;
      noBookingsCell.textContent = "Inga bokade tider.";
      noBookingsRow.appendChild(noBookingsCell);
      bookedSlotsTableBody.appendChild(noBookingsRow);
      return;
    }

    Object.keys(bookings).forEach((date) => {
      const bookedSlots = bookings[date];

      bookedSlots.forEach((slot) => {
        const row = document.createElement("tr");

        const dateCell = document.createElement("td");
        dateCell.textContent = date;
        row.appendChild(dateCell);

        const slotCell = document.createElement("td");
        slotCell.textContent = slot;
        row.appendChild(slotCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = "Booked";
        row.appendChild(statusCell);

        bookedSlotsTableBody.appendChild(row);
      });
    });
  }

  function selectSlot(slot, element) {
    if (!selectedDate) {
      alert("Vänligen välj ett datum först.");
      return;
    }
    document.querySelectorAll(".time-slot").forEach((slotEl) => {
      slotEl.classList.remove("selected");
    });
    element.classList.add("selected");
    selectedSlot = slot;
    showModal(slot);
  }

  function showModal(slot) {
    selectedSlotDisplay.textContent = `Du har valt: ${slot} den ${selectedDate}`;
    modal.classList.remove("hidden");
  }

  function promptCancel(slot) {
    selectedSlot = slot;
    cancelSlotMessage.textContent = `Vill du avboka tiden ${slot} den ${selectedDate}?`;
    cancelModal.classList.remove("hidden");
  }

  confirmBtn.addEventListener("click", () => {
    if (selectedSlot) {
      if (!bookings[selectedDate]) bookings[selectedDate] = [];
      bookings[selectedDate].push(selectedSlot);
      // localStorage.setItem("bookings", JSON.stringify(bookings)); // Disabled persistence
      alert(`Bokning bekräftad för ${selectedSlot} den ${selectedDate}!`);
      modal.classList.add("hidden");
      renderTimeSlots(selectedDate);
    }
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  confirmCancelBtn.addEventListener("click", () => {
    const index = bookings[selectedDate].indexOf(selectedSlot);
    if (index > -1) {
      bookings[selectedDate].splice(index, 1);
      // localStorage.setItem("bookings", JSON.stringify(bookings)); // Disabled persistence
      alert(`Bokningen för ${selectedSlot} den ${selectedDate} har avbokats.`);
      cancelModal.classList.add("hidden");
      renderTimeSlots(selectedDate);
    }
  });

  closeCancelBtn.addEventListener("click", () => {
    cancelModal.classList.add("hidden");
  });

  datePicker.addEventListener("change", (e) => {
    selectedDate = e.target.value;
    if (!selectedDate) {
      alert("Vänligen välj ett giltigt datum.");
      return;
    }
    renderTimeSlots(selectedDate);
  });

  renderTimeSlots(selectedDate);
});