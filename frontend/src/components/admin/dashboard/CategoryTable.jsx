import React from "react";
import { MdOutlineEdit, MdDeleteOutline } from "react-icons/md";

const CategoryTable = ({
  categories,
  sortCategories,
  handleEditCategory,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto mb-8">
      <table className="table table-compact w-full border">
        <thead>
          <tr>
            <th onClick={() => sortCategories("name")}>Name</th>
            <th onClick={() => sortCategories("description")}>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>{c.description}</td>
              <td className="flex gap-2">
                <button
                  onClick={() => handleEditCategory(c)}
                  className="btn btn-sm btn-outline"
                >
                  <MdOutlineEdit />
                </button>
                <button
                  onClick={() => onDelete(c._id)}
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

export default CategoryTable;
