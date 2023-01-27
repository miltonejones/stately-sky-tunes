import React from 'react';
import { styled, Avatar, Box } from '@mui/material';
import { TuneList, Nowrap } from '../../../styled'; 
import moment from 'moment';
 
 
const DataList = ({ onPlay, records, FileKey, playlist_db,navigate }) => {
  if (!records?.length) {
    return <>No records to display</>
  }
  // 'albumImage','Title','artistName','albumName','Genre','trackTime'
  const fields = [
    {
      key: 'albumImage'
    },
    {
      key: 'Title',
      play: 1
    },
    {
      key: 'artistName',
      href: 'artist',
      id: 'artistFk'
    },
    {
      key: 'albumName',
      href: 'album',
      id: 'albumFk'
    },
    {
      key: 'Genre',
      href: 'genre',
      id: 'Genre'
    },
    {
      key: 'trackTime',
      time: 1
    },
    {
      key: 'favorite',
      favorite: 1
    }
  ];

 const  trueProp = (record, field) => {
    if (field.favorite) {
      const ok = playlist_db && playlist_db.indexOf(record.FileKey) > -1;
      return <i className={`fa-${ok?"solid":"regular"} fa-heart`}/> 
    }
    if (field.time) {
      return !record[field.key]
        ? '0:00'
        : moment.utc(record[field.key]).format('mm:ss');

    }

    return record[field.key];
 }

 return (
  <TuneList sx={{m: 2}}>

  <Box>&nbsp;</Box>
  <Nowrap variant="subtitle2">Title</Nowrap>
  <Nowrap variant="subtitle2">Artist</Nowrap>
  <Nowrap variant="subtitle2">Album</Nowrap>
  <Nowrap variant="subtitle2">Genre</Nowrap>
  <Nowrap variant="subtitle2">Time</Nowrap>
  <Box>&nbsp;</Box>
    {records.map(record => fields.map(field =>  (
    <Nowrap 
      variant="body2"
      bold={FileKey === record.FileKey}
      hover={!!field.href || !!field.play}
      onClick={() => {
        !!field.href && navigate(`/list/${field.href}/${record[field.id]}`);
        !!field.play && onPlay && onPlay(record)
      }}
      key={field.key}>{ field.key === 'albumImage' ? <Avatar src={record[field.key]}  alt={field.key} /> : <>
      {!!field.play && (FileKey === record.FileKey) && <i class="fa-solid fa-volume-high"></i>}
      {/* <i class="fa-solid fa-volume"></i> */}
     {" "} {trueProp(record, field)}</>}</Nowrap>
    )))}
  </TuneList>
 );
}
DataList.defaultProps = {};
export default DataList;
