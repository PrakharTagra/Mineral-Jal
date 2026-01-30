import BottomNav from "./BottomNav";

const MainLayout = ({ children }) => {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
};

export default MainLayout;