import React from "react";
import { Avatar, Box } from "@mui/material";
import { TuneList, Nowrap } from "../../../styled";
import moment from "moment";

const DataList = ({
  onPlay,
  onList,
  onMenu,
  records,
  FileKey,
  playlist_db,
  navigate,
  type,
  page,
  id,
  direction ,
  sort: sortKey
}) => {
  if (!records?.length) {
    return <>No records to display</>;
  }
  // 'albumImage','Title','artistName','albumName','Genre','trackTime'
  const fields = [
    {
      key: "albumImage",
    },
    {
      key: "Title",
      play: 1,
      id: "Title",
      label: "Title"
    },
    {
      key: "artistName",
      href: "artist",
      id: "artistFk",
      label: "Artist"
    },
    {
      key: "albumName",
      href: "album",
      id: "albumFk",
      label: "Album"
    },
    {
      key: "Genre",
      href: "genre",
      id: "Genre",
      label: "Genre"
    },
    {
      key: "trackTime",
      time: 1,
      id: "trackTime",
      label: "Time"
    },
    {
      key: "favorite",
      favorite: 1,
    },
    {
      key: "menu",
      menu: 1,
    },
  ];

  const trueProp = (record, field) => {
    if (field.favorite) {
      const ok = playlist_db && playlist_db.indexOf(record.FileKey) > -1;
      return <i className={`fa-${ok ? "solid" : "regular"} fa-heart`} />;
    }
    if (field.menu) {
      return (
        <Box onClick={() => onMenu(record)}>
          <i className="fa-solid fa-ellipsis-vertical"></i>
        </Box>
      );
    }

    if (field.time) {
      return !record[field.key]
        ? "0:00"
        : moment.utc(record[field.key]).format("mm:ss");
    }

    return record[field.key];
  };

  const prefix = [type === 'music' ? 'grid' : 'list',type,id,page||1].filter(f => !!f).join('/')
  const dir = direction === 'DESC' ? 'ASC' : 'DESC'
  const sortIcon = <i className={`fa-solid fa-caret-${dir === 'ASC' ? 'up' : 'down'}`}></i>

  return (
<>
{/* [{type}][{page}][{id}][{direction}]---[{prefix}][{sortKey}] */}
<TuneList sx={{ m: 2 }}>
      {fields.map(field =>  <Nowrap hover bold={sortKey === field.key} onClick={() => navigate(`/${prefix}/${field.key}/${dir}`)} variant="subtitle2"
        >{!!field.key ? field.label : <>&nbsp;</>}{" "}{sortKey === field.key && <>{sortIcon}</>}</Nowrap>)}
      {/* <Box>&nbsp;</Box>
      <Nowrap variant="subtitle2">Title</Nowrap>
      <Nowrap variant="subtitle2">Artist</Nowrap>
      <Nowrap variant="subtitle2">Album</Nowrap>
      <Nowrap variant="subtitle2">Genre</Nowrap>
      <Nowrap variant="subtitle2">Time</Nowrap>
      <Box>&nbsp;</Box>
      <Box>&nbsp;</Box> */}
      {records.map((record) =>
        fields.map((field) => (
          <Nowrap
            variant="body2"
            bold={FileKey === record.FileKey}
            hover={!!field.href || !!field.play}
            onClick={() => {
              !!field.favorite && onList && onList(record);
              !!field.href &&
                navigate(`/list/${field.href}/${record[field.id]}`);
              !!field.play && onPlay && onPlay(record);
            }}
            key={field.key}
          >
            {field.key === "albumImage" ? (
              <Avatar src={record[field.key]} alt={field.key} />
            ) : (
              <>
                {!!field.play && FileKey === record.FileKey && (
                  <i class="fa-solid fa-volume-high"></i>
                )}
                {/* <i class="fa-solid fa-volume"></i> */}{" "}
                {trueProp(record, field)}
              </>
            )}
          </Nowrap>
        ))
      )}
    </TuneList>
</>
  );
};
DataList.defaultProps = {};
export default DataList;
