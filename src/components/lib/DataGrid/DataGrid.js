import React from "react";
import { createKey } from "../../../machines/playlistMachine";
import { TuneGrid, InfoCard } from "../../../styled";

const DataGrid = ({ records, navigate, type }) => {
  if (!records) return <i /> 
  return (
    <>
      <TuneGrid sx={{ m: 2 }}>
        {records.map((record) => (
          <InfoCard
            onClick={() =>
              navigate(`/list/${type}/${record.ID || record.listKey || createKey(record.Title)}`)
            }
            key={record.ID}
            {...record}
          />
        ))}
      </TuneGrid>
    </>
  );
};
DataGrid.defaultProps = {};
export default DataGrid;
