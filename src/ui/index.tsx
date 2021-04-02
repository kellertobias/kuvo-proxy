import React from "react";

const MainApplication: React.FC<{ theme: "dark" | "light" }> = ({ theme }) => {
  return (
    <div className={"app theme-" + (theme ?? "dark")}>
      <div className="title">
        <h1>Tobisk KUVO Proxy</h1>
      </div>
    </div>
  );
};

export default MainApplication;
