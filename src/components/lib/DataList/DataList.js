import React from "react";
import { Box } from "@mui/material";
import { TuneList, Nowrap, Circle } from "../../../styled";
import { useMediaQuery, useTheme  } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); 
  
  if (!records?.length) {
    return <>No records to display</>;
  }
  
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

    <TuneList header sx={{ m: 2, pt: 2 }}>
      {fields.map(field =>  (
        <Nowrap  
          hover 
          bold={sortKey === field.key} 
          onClick={() => !!field.key && navigate(`/${prefix}/${field.key}/${dir}`)} 
          variant="subtitle2"
        >
          {!!field.key ? field.label : <>&nbsp;</>}{" "}{sortKey === field.key && <>{sortIcon}</>}
        </Nowrap>))}
    </TuneList>


    {records.map((record, o) => (
      <TuneList>
        {  fields.map((field) => (
        <Nowrap
          odd={o % 2 !== 0}
          sx={{ p: t => t.spacing(1, 0)}}
          variant="body2"
          bold={FileKey === record.FileKey}
          hover={!!field.href || !!field.play} 

          onClick={() => {
            !isMobile && !!field.favorite && onList && onList(record);
            !isMobile && !!field.href &&
              navigate(`/list/${field.href}/${record[field.id]}`);
            !!field.play && onPlay && onPlay(record);
          }}

          className={field.key}
          key={field.key}
        >
          {field.key === "albumImage" ? (
            <Circle sx={{ ml: 1 }} size="small" src={record[field.key]} alt={field.key} />
          ) : (
            <>
              {!!field.play && FileKey === record.FileKey && (
                <i class="fa-solid fa-volume-high">{" "}</i>
              )} 
              {trueProp(record, field)}
            </>
          )}
        </Nowrap>  
      ))}
        
      </TuneList> ) 
    )}
  </>
  );
};
DataList.defaultProps = {};
export default DataList;
