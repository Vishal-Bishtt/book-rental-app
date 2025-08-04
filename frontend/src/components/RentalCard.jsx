import React from "react";

const RentalCard = ({ rental }) => {
  const {
    book: { title, genre },
    rented_at,
    returned_at,
  } = rental;

  return (
    <div className="border p-4 rounded shadow-sm bg-gray-100">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-700">Genre: {genre}</p>
      <p className="text-sm text-gray-700">Rented at: {new Date(rented_at).toLocaleString()}</p>
      <p className="text-sm text-gray-700">
        Returned: {returned_at ? new Date(returned_at).toLocaleString() : "Not yet returned"}
      </p>
    </div>
  );
};

export default RentalCard; 
