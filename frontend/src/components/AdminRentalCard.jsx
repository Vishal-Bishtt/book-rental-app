import React from "react";

const AdminRentalCard = ({ rental }) => {
  const {
    user: { name, email },
    book: { title, genre },
    rented_at,
    returned_at,
  } = rental;

  return (
    <div className="border p-4 rounded shadow-md bg-white">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-sm text-gray-600">Genre: {genre}</p>

      <div className="mt-2 text-sm">
        <p className="text-gray-800 font-semibold">Rented by: {name}</p>
        <p className="text-gray-600">Email: {email}</p>
      </div>

      <div className="mt-2 text-sm text-gray-700">
        <p>Rented at: {new Date(rented_at).toLocaleString()}</p>
        <p>
          Returned at:{" "}
          {returned_at ? new Date(returned_at).toLocaleString() : "Not yet returned"}
        </p>
      </div>
    </div>
  );
};

export default AdminRentalCard;
