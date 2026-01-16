import React from "react";
import { NavLink } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <div>
      <NavLink to={`/search?categories=${category.name}`} className="">
        <div className="card bg-base-100 shadow-md hover:shadow-lg transition">
          <div className="card-body">
            <h2 className="card-title capitalize">{category.name}</h2>

            <p className="text-sm text-gray-600">{category.description}</p>

            {/* keywords */}
            <div className="flex flex-wrap gap-2 mt-3">
              {category.keywords?.filter(Boolean).map((keyword, index) => (
                <NavLink to={`/search?categories=${keyword}`} className=" ">
                  <span key={index} className="badge badge-outline text-xs">
                    {keyword}
                  </span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </NavLink>
    </div>
  );
};

export default CategoryCard;
