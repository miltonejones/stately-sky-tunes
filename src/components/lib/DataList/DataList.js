import React from "react";
import { styled, Box } from "@mui/material";
import { TuneList, Nowrap, Flex, Circle } from "../../../styled";
import { jsonLink } from "../../../util/jsonLink";
import { useMediaQuery, useTheme } from "@mui/material";
import moment from "moment";

const Columns = styled(Box)(({ theme, spacing = 1 }) => ({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.spacing(spacing),
  alignItems: "center",
  transition: "all 0.2s linear",
  "@media screen and (max-width: 912px) and (orientation: landscape)": {
    gridTemplateColumns: "1fr 1fr 1fr",
  },
}));

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
  direction,
  sort: sortKey,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  // const rotated = useMediaQuery('@media screen and (max-width: 912px) and (orientation: landscape)');

  if (!records?.length) {
    return <>No records to display</>;
  }

  const pins = records.map((rec) => ({
    trackName: rec.Title,
    artistName: rec.artistName,
  }));

  const fields = [
    {
      key: "albumImage",
      json: 1,
      label: (
        <a download="playlist.json" href={jsonLink(pins)}>
          <i className="fa-solid fa-code" />
        </a>
      ),
    },
    {
      key: "Title",
      play: 1,
      id: "Title",
      label: "Title",
    },
    {
      key: "artistName",
      href: "artist",
      id: "artistFk",
      label: "Artist",
    },
    {
      key: "albumName",
      href: "album",
      id: "albumFk",
      label: "Album",
    },
    {
      key: "Genre",
      href: "genre",
      id: "Genre",
      label: "Genre",
    },
    {
      key: "trackTime",
      time: 1,
      id: "trackTime",
      label: "Time",
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

    return <Nowrap bold={FileKey === record.FileKey} small={field.play || !isMobile} tiny={isMobile}>{record[field.key]}</Nowrap>;
  };

  const prefix = [type === "music" ? "grid" : "list", type, id, page || 1]
    .filter((f) => !!f)
    .join("/");
  const dir = direction === "DESC" ? "ASC" : "DESC";
  const sortIcon = (
    <i className={`fa-solid fa-caret-${dir === "ASC" ? "up" : "down"}`}></i>
  );

  return (
    <>
      <TuneList header sx={{ m: 2, pt: 2 }}>

        {fields.map((field) => (
          <Nowrap
            hover
            bold={sortKey === field.key}
            onClick={() =>
              !field.json &&
              !!field.key &&
              navigate(`/${prefix}/${field.key}/${dir}`)
            }
            variant="subtitle2"
          >
            {!!field.key ? field.label : <>&nbsp;</>}{" "}
            {sortKey === field.key && <>{sortIcon}</>}
          </Nowrap>
        ))}
        
      </TuneList>

      <Columns>
        {records.map((record, o) => (
          <TuneList>
            {fields.map((field) => (
              <Nowrap
                odd={o % 2 !== 0}
                sx={{ p: (t) => t.spacing(1, 0) }}
                variant="body2"
                bold={FileKey === record.FileKey}
                hover={!!field.href || !!field.play}
                onClick={() => {
                  if (!!field.menu) {
                    return;
                  }
                  if (!!field.favorite) {
                    return onList && onList(record);
                  }
                  if (isMobile) {
                    return onPlay && onPlay(record);
                  }
                  !isMobile &&
                    !!field.href &&
                    navigate(`/list/${field.href}/${record[field.id]}`);
                  !!field.play && onPlay && onPlay(record);
                }}
                className={field.key}
                key={field.key}
              >
                {field.key === "albumImage" ? (
                  <Circle
                    sx={{ ml: 1 }}
                    size="small"
                    src={record[field.key]}
                    alt={field.key}
                  />
                ) : (
                  <Flex spacing={1}>
                    {!!field.play && FileKey === record.FileKey && (
                      <i class="fa-solid fa-volume-high"> </i>
                    )}
                    {trueProp(record, field)}
                  </Flex>
                )}
              </Nowrap>
            ))}
          </TuneList>
        ))}
      </Columns>
    </>
  );
};
DataList.defaultProps = {};
export default DataList;
