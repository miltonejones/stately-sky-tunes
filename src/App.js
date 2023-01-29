import React from 'react';
import "./App.css";
import { useSkytunes, usePlaylist, useTrackmenu } from "./machines";
import {
  LiteButton,
  Flex,
  IconTextField,
  Spacer,
  Toolbar,
  Hero,
} from "./styled";
import { Avatar, Box, Collapse, Pagination, Stack, Typography, LinearProgress } from "@mui/material";

import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import {
  DataList,
  PlaylistDrawer,
  StateCarousel,
  PageHead,
  NavLinks,
  TrackMenuDrawer,
  ChipMenu,
  Splash,
  SearchPage
} from "./components/lib";
import { DataGrid, Diagnostics } from "./components/lib";
import { getPagination } from "./util/getPagination";
import { StatePlayer, useStatePlayer } from "./components/lib";
import { typeIcons } from './styled';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Application />} />
        <Route path="/find" element={<Application />} />
        <Route path="/find/:param" element={<Application />} />
        <Route path="/search/:param/:page" element={<Application />} />
        <Route path="/list/:type/:id" element={<Application />} />
        <Route path="/list/:type/:id/:page" element={<Application />} />
        <Route path="/list/:type/:id/:page/:sort" element={<Application />} />
        <Route
          path="/list/:type/:id/:page/:sort/:direction"
          element={<Application />}
        />
        <Route path="/grid/:type" element={<Application />} />
        <Route path="/grid/:type/:page" element={<Application />} />
        <Route path="/grid/:type/:page/:sort" element={<Application />} />
        <Route
          path="/grid/:type/:page/:sort/:direction"
          element={<Application />}
        />
      </Routes>
    </BrowserRouter>
  );
}

function Application() { 
  const { sort: headerSort } = useParams();
  const stateList = usePlaylist();
  const stateSkyTunes = useSkytunes(files =>  statePlayer.handlePlay(files[0].FileKey, files, files[0]));
  const statePlayer = useStatePlayer((artistFk) => stateSkyTunes.send({ type: 'HERO',  artistFk }));
  const stateMenu = useTrackmenu(() => stateSkyTunes.send('OPEN'));
  const navigate = useNavigate();
 

  const {
    response,
    logo,
    search_param,
    pageTitle,
    carouselImages,
    hero,
    debug, 
    sort: sortKey,
    showSort,
    direction,
    page: currentPage,
    type: mediaType,
    id: mediaID,
  } = stateSkyTunes.state.context;

  const { playlist_db } = stateList.state.context;
  const { memory } = statePlayer.state.context;

  const forms = {
    "hero": DataList,
    "splash": Splash,
    "find": SearchPage,
    "list.loaded": DataList,
    "grid.loaded": DataGrid,
  };
  const types = {
    "list.loaded": "list",
    "grid.loaded": "grid",
  };

  const counter = getPagination([], {
    page: currentPage,
    count: response?.count,
    pageSize: 100,
  });

  const listKey = Object.keys(forms).find(stateSkyTunes.state.matches);
  const isLoaded = ["list","grid"].find(stateSkyTunes.state.matches);
  const isGrid = stateSkyTunes.state.matches("grid.loaded");
  const Form = forms[listKey];
  const pages = {
    music: "Library",
    album: "Albums",
    artist: "Artists",
    genre: "Genres",
    playlist: "Playlists",
  };

  const typeKey =
    mediaType === "music" ? "grid" : types[listKey];

  const prefix =
    typeKey === "list"
      ? `/${typeKey}/${mediaType}/${mediaID}/`
      : `/${typeKey}/${mediaType}/`;

  const handlePlay = (file, records) => {
    statePlayer.handlePlay(file.FileKey, records || response.records, file);
  };

  const handleChange = (value) => {
    stateSkyTunes.send({
      type: "CHANGE",
      value,
    });
  };

  const selectedKey = Object.keys(pages).find(
    (key) => key === mediaType
  );
  const selectedPage = !!search_param ? "Search" : pages[selectedKey];

  const sortPage = (num, field, dir) => {
    const url = [
      typeKey,
      mediaType,
      mediaID,
      num,
      field,
      dir

    ].filter(k => !!k)
    .join('/')
    navigate(`/${url}`);
  }
 
  const interfaceProps = {
    onPlay: handlePlay,
    onList: stateList.handleOpen,
    onMenu: stateMenu.handleOpen,
    onAuto: stateSkyTunes.handleAuto,
    onTab: (value) => stateSkyTunes.send({type: 'TAB', value}),
    FileKey: statePlayer.state.context.FileKey,
    sortPage,
    navigate,
    memory,
    playlist_db,
    records: response?.records || response,
    ...stateSkyTunes.state.context
  }

  const openPage = num => {
    sortPage(num, sortKey, direction) 
  }
 

  return (
    <Box sx={{width: '100vw', height: '100vh', overflowY: 'auto', overflowX: 'hidden'}}>
      {/* page header */}
      <PageHead page={selectedPage} pageTitle={pageTitle} />

      {/* toolbar */}
      <Toolbar>
 
        {/* logo  */}
        <Avatar src={logo} alt="sky-tunes" />
        <Typography variant="h6" sx={{ mr: 6, ml: 1 }}>
          Skytunes
        </Typography>

        <LiteButton
          onClick={() => navigate("/")}
          variant={stateSkyTunes.state.matches("splash") ? "contained" : "text"}
        >
          home
        </LiteButton>

        <LiteButton
          onClick={() => navigate("/grid/music/1")}
          variant={['list.loaded', 'grid.loaded', 'list'].some(stateSkyTunes.state.matches) ? "contained" : "text"}
        >
          library
        </LiteButton>

        <LiteButton
          variant={stateSkyTunes.state.matches("find") ? "contained" : "text"}
          onClick={() => navigate(`/find`)}
        >
          search
        </LiteButton>

        {/* navigation buttons */}
        {/* {Object.keys(pages).map((pageType) => (
          <LiteButton
            onClick={() => navigate("/grid/" + pageType + "/1")}
            variant={pageType === mediaType ? "contained" : "text"}
            key={pageType}
          >
            {pages[pageType]}
          </LiteButton>
        ))} */}

        <Spacer /> 
        {/* search box */}
        <IconTextField
          label="Search"
          placeholder="Type a song, album or artist"
          startIcon={<i className="fa-solid fa-magnifying-glass" />}
          endIcon={
            !search_param ? null : (
              <i
                onClick={() => {
                  handleChange("");
                  navigate("/grid/music/1");
                }}
                className="fa-solid fa-xmark"
              />
            )
          }
          value={search_param}
          onKeyUp={e => e.keyCode === 13 && navigate(stateSkyTunes.state.matches("find")
            ? `/find/${search_param}`
            : `/search/${search_param}/1`)}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
        />

        <LiteButton
          variant="contained"
          onClick={() => navigate(`/search/${search_param}/1`)}
        >
          search
        </LiteButton>

      {/* debugger toggle button */}
      <Box onClick={() => stateSkyTunes.send("DEBUG")} sx={{ mr: 2 }}>
        <i class="fa-solid fa-gear"></i>
      </Box>
      </Toolbar>
      {/* main workspace */}
      <Stack sx={{ mt: 9, mb: 20 }}>
        {/* breadcrumbs  */}
            <Flex between>
        { !['splash', 'find'].some(stateSkyTunes.state.matches) &&  
            !!selectedKey && !!selectedKey && (
              <NavLinks
                navigate={navigate}
                page={selectedPage}
                href={`/grid/${selectedKey}/1`}
                pageTitle={pageTitle}
              />
            )
             }
 
         {!['splash', 'find'].some(stateSkyTunes.state.matches) &&  isLoaded && <ChipMenu value={mediaType} 
            onChange={(val) => navigate(!val ? "/grid/music/1" : `/grid/${val}/1`)}
            options={Object.keys(pages).map(value => ({
            value,
            label: pages[value],
            icon: typeIcons[value]
          }))}/>}
          </Flex>
 
        {stateSkyTunes.busy &&  <LinearProgress variant="indeterminate" sx={{width: '100vw'}} color="primary"/> }
   
 
 
        {/* carousel  */}
        {!!carouselImages && <StateCarousel images={carouselImages} />}

        {/* hero image banner */}
        <Hero {...hero} page={pages[mediaType]} />
 
        {/* pagination */}
        <Flex sx={{ml: 1, mr: 4, mt: 2}} spacing={2}>
          {counter.pageCount > 1 && (
            <Pagination
              count={Number(counter.pageCount)}
              page={Number(currentPage)}
              onChange={(a, b) => openPage(b)}
            />
          )}
          
          <Spacer />

          {isGrid && <> 
            <i className="fa-solid fa-arrow-up-a-z"
              onClick={() => {
                stateSkyTunes.send({
                  type: "CHANGE",
                  key: 'showSort',
                  value: !showSort,
                });
              }}
              ></i>
              <Collapse orientation="horizontal" in={showSort}>
                 <Flex>
                 
                  {[mediaType === 'genre' ? 'Genre' : (
                    mediaType === 'playlist' ? 'Title' : 'Name'
                  ), 'TrackCount'].map(key => (
                    <LiteButton
                    size="small"
                      rounded onClick={() => sortPage(currentPage, key, direction === 'ASC' ? 'DESC' : 'ASC')}
                      variant={sortKey === key ? "contained" : "text"}
                      key={key}
                    >
                      {key}
                    </LiteButton>
                  ))}
                </Flex>                
              </Collapse>
          </>}
          {/* </>}`/${typeKey}/${mediaType}/1` */}

          { !!headerSort && isLoaded && <LiteButton
            size="small"
            onClick={() => navigate('/' + [typeKey,mediaType,mediaID, currentPage]
                .filter(e => !!e)
                .join('/'))}
            startIcon={<i className="fa-solid fa-arrow-up-a-z"/>}>
              reset sort
            </LiteButton>}

        </Flex>
        {/* records returned from the state machine  */}
        {!!Form &&  <Form {...interfaceProps}/> }
      </Stack>

      {/* audio player */}
      <StatePlayer {...statePlayer} onMenu={stateMenu.handleOpen} onList={stateList.handleOpen} playlist_db={playlist_db}/>

      <PlaylistDrawer {...stateList} />

      <TrackMenuDrawer {...stateMenu} />

      {/* debugger window */}
      <Diagnostics
        {...stateSkyTunes.diagnosticProps}
        open={debug}
      />
    </Box>
  );
}

export default App;
