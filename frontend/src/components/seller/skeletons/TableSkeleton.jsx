const TableSkeleton = () => (
  <div className="bg-base-100 p-4 rounded-xl shadow mt-6">
    <div className="skeleton h-5 w-56 mb-4"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 mb-3">
        <div className="skeleton w-10 h-14"></div>
        <div className="skeleton h-4 w-48"></div>
      </div>
    ))}
  </div>
);

export default TableSkeleton;
