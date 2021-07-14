import React from "react";
import DetailTable from "./detailTable";
import UserTable from './userTable';
import AircraftTable from './aircraftTable';
import TicketTable from './ticketTable';
import { SimpleCard } from "matx";

const operatorTable = (props) => {

    const docId = props.history.location.state;
    
  
  return (
    <div className="m-sm-30">
      <div className="py-3" />
      <DetailTable props={{...props}} docId={docId.docId}/>
      <div className="py-6" />
      <UserTable props={{...props}} docId={docId.docId}/>
      <div className="py-6" />
      <AircraftTable props={{...props}} docId={docId.docId}/>
      <div className="py-6" />
      <TicketTable props={{...props}} docId={docId.docId}/>
    </div>
  );
};

export default operatorTable;
