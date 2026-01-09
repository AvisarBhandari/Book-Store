import { useEffect, useState, useRef } from "react";
import axios from "axios";

const AdvancedSearchDialog = ({ onResults }) => {
  const modalRef = useRef(null);

  const [filtersOptions, setFiltersOptions] = useState(null);
  const [filters, setFilters] = useState({
    categories: [],
    genres: [],
    authors: [],
    publisher: "",
    language: "",
    minRating: 0,
    minPages: 0,
    maxPages: 1000,
    minPrice: 0,
    maxPrice: 1000,
    discount: false,
    sellerId: "",
    sorts: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          "http://localhost:5001/api/search/filter/options"
        );
        if (data.success) {
          const min = data.filters.priceRange?.minPrice || 0;
          const max = data.filters.priceRange?.maxPrice || 1000;
          setFiltersOptions(data.filters);
          setFilters((prev) => ({
            ...prev,
            minPrice: min,
            maxPrice: max,
            minPages: 0,
            maxPages: 1000,
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFilters();
  }, []);

  const handleCheckbox = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const buildQuery = () => {
    const params = new URLSearchParams();

    // Multi-select filters
    ["categories", "genres", "authors", "sorts"].forEach((key) => {
      filters[key].forEach((v) => params.append(key, v));
    });

    // Single value filters
    if (filters.publisher) params.append("publisher", filters.publisher);
    if (filters.language) params.append("language", filters.language);
    if (filters.sellerId) params.append("sellerId", filters.sellerId);

    // Numeric filters
    if (filters.minRating) params.append("minRating", filters.minRating);
    if (filters.minPages) params.append("minPages", filters.minPages);
    if (filters.maxPages) params.append("maxPages", filters.maxPages);
    if (filters.minPrice) params.append("minPrice", filters.minPrice);
    if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

    // Discount
    if (filters.discount) params.append("discount", true);

    return params.toString();
  };

  const applyFilters = async () => {
    try {
      const query = buildQuery();
      const { data } = await axios.get(
        `http://localhost:5001/api/search/filter?${query}`
      );
      onResults?.(data);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const resetFilters = () => {
    if (!filtersOptions) return;
    const min = filtersOptions.priceRange?.minPrice || 0;
    const max = filtersOptions.priceRange?.maxPrice || 1000;
    setFilters({
      categories: [],
      genres: [],
      authors: [],
      publisher: "",
      language: "",
      minRating: 0,
      minPages: 0,
      maxPages: 1000,
      minPrice: min,
      maxPrice: max,
      discount: false,
      sellerId: "",
      sorts: [],
    });
  };

  const openModal = () => modalRef.current?.showModal();
  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <button
        className="btn btn-ghost btn-sm hover:bg-transparent relative inline-block
               after:content-[''] after:absolute after:left-0 after:bottom-0
               after:h-[2px] after:w-full after:bg-current
               after:scale-x-0 after:origin-left after:transition-transform after:duration-500
               hover:after:scale-x-100"
        onClick={openModal}
      >
        Advanced Search
      </button>

      <dialog ref={modalRef} className="modal w-full  rounded-lg p-0 border-0">
        <form
          method="dialog"
          className="modal-box max-h-[80vh] right-4 w-[90vh] overflow-y-auto p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Advanced Search</h2>

          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-300 rounded-md"></div>
              ))}
            </div>
          ) : (
            filtersOptions && (
              <div className="space-y-4">
                {/* Categories */}
                {filtersOptions.categories?.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Categories</p>
                    <div className="flex gap-4 flex-wrap max-h-36 overflow-y-auto">
                      {filtersOptions.categories.map((c) => (
                        <label key={c} className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={filters.categories.includes(c)}
                            onChange={() => handleCheckbox("categories", c)}
                          />
                          {c}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Genres */}
                {filtersOptions.genres?.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Genres</p>
                    <div className="flex gap-4 flex-wrap max-h-36 overflow-y-auto">
                      {filtersOptions.genres.map((g) => (
                        <label key={g} className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={filters.genres.includes(g)}
                            onChange={() => handleCheckbox("genres", g)}
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Authors */}
                {filtersOptions.authors?.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Authors</p>
                    <div className="flex gap-4 flex-wrap max-h-36 overflow-y-auto">
                      {filtersOptions.authors.map((a) => (
                        <label key={a} className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-sm"
                            checked={filters.authors.includes(a)}
                            onChange={() => handleCheckbox("authors", a)}
                          />
                          {a}
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publisher */}
                <div>
                  <p className="font-medium mb-2">Publisher</p>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={filters.publisher}
                    onChange={(e) =>
                      setFilters({ ...filters, publisher: e.target.value })
                    }
                  />
                </div>

                {/* Language */}
                <div>
                  <p className="font-medium mb-2">Language</p>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={filters.language}
                    onChange={(e) =>
                      setFilters({ ...filters, language: e.target.value })
                    }
                  />
                </div>

                {/* Rating */}
                <div>
                  <p className="font-medium mb-2">
                    Minimum Rating: {filters.minRating}★
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={5}
                    step={0.5}
                    value={filters.minRating}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minRating: Number(e.target.value),
                      })
                    }
                    className="range range-accent w-full"
                  />
                </div>
                {/* Pages */}
                <div>
                  <p className="font-medium mb-2">Pages</p>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Min"
                      value={filters.minPages}
                      onChange={(e) =>
                        setFilters({ ...filters, minPages: e.target.value })
                      }
                    />
                    <span>-</span>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      placeholder="Max"
                      value={filters.maxPages}
                      onChange={(e) =>
                        setFilters({ ...filters, maxPages: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p className="font-medium mb-2">
                    Price: ${filters.minPrice} - ${filters.maxPrice}
                  </p>
                  <input
                    type="range"
                    min={filtersOptions.priceRange.minPrice}
                    max={filtersOptions.priceRange.maxPrice}
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minPrice: Number(e.target.value),
                      })
                    }
                    className="range range-primary w-full"
                  />
                  <input
                    type="range"
                    min={filtersOptions.priceRange.minPrice}
                    max={filtersOptions.priceRange.maxPrice}
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: Number(e.target.value),
                      })
                    }
                    className="range range-primary w-full"
                  />
                </div>

                {/* Seller */}
                {filtersOptions.sellers?.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Seller</p>
                    <select
                      className="select select-bordered w-full"
                      value={filters.sellerId}
                      onChange={(e) =>
                        setFilters({ ...filters, sellerId: e.target.value })
                      }
                    >
                      <option value="">All</option>
                      {filtersOptions.sellers.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.storeName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Discount */}
                {filtersOptions.discountAvailable && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="checkbox"
                      checked={filters.discount}
                      onChange={(e) =>
                        setFilters({ ...filters, discount: e.target.checked })
                      }
                    />
                    Discount Only
                  </label>
                )}

                {/* Sort Options */}
                <div>
                  <p className="font-medium mb-2">Sort By</p>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      "new",
                      "bestseller",
                      "discount",
                      "rating",
                      "price-low",
                      "price-high",
                    ].map((s) => (
                      <label key={s} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={filters.sorts.includes(s)}
                          onChange={() => handleCheckbox("sorts", s)}
                        />
                        {s}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}

          <div className="modal-action mt-4 flex justify-between">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={applyFilters}
              >
                Apply
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default AdvancedSearchDialog;
