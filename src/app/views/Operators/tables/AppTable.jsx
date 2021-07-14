import React from "react";
import PaginationTable from "./PaginationTable";

const AppTable = (props) => {
  
  return (
    <div className="m-sm-30">
      <PaginationTable props={{...props}}/>
    </div>
  );
};

export default AppTable;
