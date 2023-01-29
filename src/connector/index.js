import AppleConvert from "../util/AppleConvert";

const API_ENDPOINT = "https://u8m0btl997.execute-api.us-east-1.amazonaws.com";


export const getGroupByType = async (
  type,
  page = 1,
  sort = "ID",
  direction = "DESC"
) => {
  const endpoint = `request/${sort}/${direction}/${page}/${type}`;
  const response = await fetch(`${API_ENDPOINT}/${endpoint}`);
  return await response.json();
};


export const getAppleMatches = async (title) => { 
  const address = `${API_ENDPOINT}/apple/${title}`;
  const response = await fetch(address);
  const json = await response.json();
  if (json.results?.length) {
    return json?.results?.map((r) => AppleConvert(r));
  } 
};



export const getArtistInfo = async (artistFk) => {
  const endpoint = `request/albumFk, discNumber, trackNumber/ASC/1/artist/${artistFk}`;
  const response = await fetch(`${API_ENDPOINT}/${endpoint}`);
  return await response.json();
};

export const getGroupById = async (
  type,
  id,
  page = 1,
  sort = "ID",
  direction = "DESC"
) => {
  const endpoint = `request/${sort}/${direction}/${page}/${type}/${id}`;
  const response = await fetch(`${API_ENDPOINT}/${endpoint}`);
  return await response.json();
};

export const serialSearch = async (param) => {
  const groups = [];
  const types = ["album", "artist", "music"];
  const next = async () => {
    if (!types.length) return groups;
    return await run(types.pop());
  };
  const run = async (type) => {
    console.log("Getting %s for %s", type, param);
    const data = await searchGroupByType(type, param);
    groups.push({ ...data, type });
    return await next();
  };
  return await next();
};

export const decorateTracks = async (tracks) => {
  const param = tracks.map((f) => f.artistFk).join(",");
  const response = await fetch(`${API_ENDPOINT}/home/artist/${param}`);
  const json = await response.json();

  console.log({ json, param });
  return tracks.map((t) => {
    const { artistImage: Thumbnail } =
      json.records.find((f) => f.ID === t.artistFk) ?? {};
    return { ...t, Thumbnail };
  });

  // const groups = [];

  // const next = async () => {
  //   if (!tracks.length) return groups;
  //   return await run(tracks.pop());
  // };
  // const run = async (track) => {
  //   console.log("Getting artist %s", track.artistName);
  //   const data = await getGroupById("artist", track.artistFk);
  //   const { Thumbnail } = data.row[0];
  //   groups.push({ ...track, Thumbnail });
  //   return await next();
  // };
  // return await next();
};

export const searchGroupByType = async (type, param, page = 1) => {
  const endpoint = `search/${page}/${type}/${param}`;
  const response = await fetch(`${API_ENDPOINT}/${endpoint}`);
  return await response.json();
};

export const getDashboard = async () => {
  const response = await fetch(`${API_ENDPOINT}/dash`);
  return await response.json();
};

export const savePlaylist = async (json) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  };
  const response = await fetch(`${API_ENDPOINT}/playlist`, requestOptions);
  return await response.json();
};

export const updateTable = async (table = "s3Music", json = {}) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  };
  const response = await fetch(
    `${API_ENDPOINT}/update/${table}`,
    requestOptions
  );
  return await response.json();
};

export const insertTable = async (table, json = {}) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  };
  const response = await fetch(`${API_ENDPOINT}/add/${table}`, requestOptions);
  return await response.json();
};

export const getAlbumorArtistId = async (type, name, image) => {
  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, name, image }),
  };
  const response = await fetch(`${API_ENDPOINT}/find`, requestOptions);
  return await response.json();
};

export const saveTrack = async (track) => {
  return await updateTable("s3Music", stripTrack({ ...track }));
};

const stripTrack = (track) => {
  const {
    Genre,
    Title,
    albumFk,
    artistFk,
    discNumber,
    trackNumber,
    ID,
    albumImage,
    trackTime,
  } = track;
  return {
    Genre,
    Title,
    albumFk,
    artistFk,
    discNumber,
    trackNumber,
    ID,
    trackTime,
    albumImage,
  };
};
