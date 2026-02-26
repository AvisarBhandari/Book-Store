import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { LuDownload } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { HiOutlineEye } from "react-icons/hi";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import {
  getAdminOrdersTable,
  adminDeleteOrders,
} from "../../../api/AdminDashboard.api.js";

const SORT_FIELDS = [
  { key: "id", label: "Order ID" },
  { key: "username", label: "User" },
  { key: "amount", label: "Amount" },
  { key: "date", label: "Date" },
];

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const selectAllRef = React.useRef(null);

  const fetchOrders = async (
    pageNum = 1,
    searchTerm = "",
    sortF = sortField,
    order = sortOrder,
  ) => {
    try {
      setLoading(true);
      const res = await getAdminOrdersTable({
        page: pageNum,
        limit: 10,
        search: searchTerm,
        sortField: sortF,
        sortOrder: order,
      });
      setOrders(res.data || []);
      setTotalPages(res.totalPages || 1);
      setTotalResults(res.totalResults ?? 0);
      setError(null);
    } catch (err) {
      console.error("Failed to load orders:", err);
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page, search, sortField, sortOrder);
  }, [page, search, sortField, sortOrder]);

  useEffect(() => {
    const el = selectAllRef.current;
    if (!el) return;
    el.indeterminate = selectedIds.size > 0 && selectedIds.size < orders.length;
  }, [selectedIds.size, orders.length]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === orders.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(orders.map((o) => o.id)));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteSelected = async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    if (!window.confirm(`Delete ${ids.length} selected order(s)?`)) return;
    try {
      await adminDeleteOrders(ids);
      setSelectedIds(new Set());
      fetchOrders(page, search, sortField, sortOrder);
    } catch (err) {
      console.error("Failed to delete orders:", err);
      alert("Failed to delete orders.");
    }
  };

  const handleExportCsv = () => {
    if (!orders.length) return;
    const headers = ["Order ID", "User", "Amount", "Date"];
    const rows = orders.map((o) => [
      o.id,
      o.username ?? "",
      o.amount ?? 0,
      o.date ?? "",
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((field) =>
            `"${String(field).replace(/"/g, '""').replace(/\n/g, " ")}"`,
          )
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <IoChevronUp className="inline ml-0.5" size={14} />
    ) : (
      <IoChevronDown className="inline ml-0.5" size={14} />
    );
  };

  return (
    <div className="bg-base-100 rounded-xl shadow p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h3 className="font-semibold text-lg">Orders Table</h3>

        <div className="flex flex-wrap items-center gap-2">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 md:w-56 min-w-0"
          >
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search"
              className="input input-bordered input-sm w-full pl-8"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </form>

          <button
            type="button"
            className="btn btn-sm btn-outline gap-1"
            onClick={() => setViewOrder(selectedIds.size === 1 ? orders.find((o) => o.id === [...selectedIds][0]) : null)}
            disabled={selectedIds.size !== 1}
            title={selectedIds.size !== 1 ? "Select one order to view" : "View selected order"}
          >
            <HiOutlineEye size={16} />
            See
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline gap-1"
            onClick={handleExportCsv}
          >
            <LuDownload size={16} />
            Export
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline gap-1 text-error border-error hover:bg-error hover:text-error-content"
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0}
          >
            <MdDeleteOutline size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="space-y-2">
            <div className="skeleton h-8 w-full" />
            <div className="skeleton h-8 w-full" />
            <div className="skeleton h-8 w-full" />
          </div>
        ) : error ? (
          <div className="alert alert-error">{error}</div>
        ) : (
          <table className="table table-compact w-full border">
            <thead>
              <tr>
                <th className="w-10">
                  <label className="cursor-pointer flex items-center justify-center">
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={orders.length > 0 && selectedIds.size === orders.length}
                      onChange={toggleSelectAll}
                    />
                  </label>
                </th>
                {SORT_FIELDS.map(({ key, label }) => (
                  <th
                    key={key}
                    className="cursor-pointer select-none hover:bg-base-200"
                    onClick={() => handleSort(key)}
                  >
                    {label}
                    {renderSortIcon(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <label className="cursor-pointer flex items-center justify-center">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedIds.has(o.id)}
                        onChange={() => toggleSelect(o.id)}
                      />
                    </label>
                  </td>
                  <td>{o.id}</td>
                  <td>{o.username}</td>
                  <td>Rs. {Number(o.amount).toLocaleString()}</td>
                  <td>{o.date}</td>
                </tr>
              ))}
              {!orders.length && (
                <tr>
                  <td colSpan={5} className="text-center text-sm py-4">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-base-content/70">
            Showing page {page} of {totalPages} ({totalResults} total)
          </p>
          <div className="join">
            <button
              type="button"
              className="join-item btn btn-xs"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              «
            </button>
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 10) pageNum = i + 1;
              else if (page <= 5) pageNum = i + 1;
              else if (page >= totalPages - 4) pageNum = totalPages - 9 + i;
              else pageNum = page - 5 + i;
              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`join-item btn btn-xs ${page === pageNum ? "btn-active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              type="button"
              className="join-item btn btn-xs"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              »
            </button>
          </div>
        </div>
      )}

      {/* View order modal */}
      {viewOrder && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Order Details</h3>
            <div className="py-2 space-y-1 text-sm">
              <p><span className="font-medium">Order ID:</span> {viewOrder.id}</p>
              <p><span className="font-medium">User:</span> {viewOrder.username}</p>
              <p><span className="font-medium">Amount:</span> Rs. {Number(viewOrder.amount).toLocaleString()}</p>
              <p><span className="font-medium">Date:</span> {viewOrder.date}</p>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setViewOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={() => setViewOrder(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default OrdersTable;
