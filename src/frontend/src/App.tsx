import React from "react";
import RestaurantList from "../src/components/RestaurantList";

const App = () => {
  return (
      <div style={{ padding: "10px", paddingInline: "10px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
      <RestaurantList />
      </div>
  );
};

export default App;