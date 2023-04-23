import React from "react";
import { createKey } from "../../../machines/playlistMachine"; 
import { TuneGrid, InfoCard } from "../../../styled"; 


const DataGrid = ({ records, navigate, sortPage, type, page, direction, sort: sortKey }) => { 
  if (!records) return <i /> 
  return (
    <> 
 

      <TuneGrid sx={{ m: 2 }}>
        {records.map(({selected, ...record}) => (
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
