import React from "react";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

const BookTable = ({ books, sortBooks, handleEditBook, onDelete }) => {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="table table-compact w-full border">
        <thead>
          <tr>
            <th>Cover</th>
            <th onClick={() => sortBooks("title")}>Title</th>
            <th onClick={() => sortBooks("author")}>Author</th>
            <th onClick={() => sortBooks("category")}>Category</th>
            <th onClick={() => sortBooks("soldCount")}>Downloads</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b._id}>
              <td>
                <img
                  src={`http://localhost:5001/${b.coverImage}`}
                  className="w-12 h-12"
                  alt={b.title}
                />
              </td>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.category}</td>
              <td>{b.soldCount}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => handleEditBook(b)}
                  className="btn btn-sm btn-outline"
                >
                  <MdOutlineEdit />
                </button>
                <button
                  onClick={() => onDelete(b._id)}
                  className="btn btn-sm btn-outline"
                >
                  <MdDeleteOutline />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;
