const Loader = ({ fullPage = true }) => {
  return (
    <div className={fullPage ? "loader-full" : "loader-inline"}>
      <div className="spinner" />
    </div>
  );
};

export default Loader;