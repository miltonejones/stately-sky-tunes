import React from 'react';
import { styled, Box } from '@mui/material';
import { TuneGrid, InfoCard } from '../../../styled'; 
 
 
const DataGrid = ({ records, navigate, type }) => {
 return (
   <> 
    <TuneGrid sx={{m: 2}}>
        {records.map(record  => <InfoCard 
        onClick={() => navigate(`/list/${type}/${record.ID || record.listKey}`)} 
        key={record.ID} 
        {...record} />)}
    </TuneGrid> 
   </>
 );
}
DataGrid.defaultProps = {};
export default DataGrid;
