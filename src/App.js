import React from "react";
import "./App.css";
import { useSkytunes, usePlaylist, useTrackmenu } from "./machines";
import {
  LiteButton,
  Flex,
  IconTextField,
  Spacer,
  Toolbar,
  Hero,
  // Nowrap,
  FlexMenu,
  Responsive,
  Rotation
} from "./styled";

import {
  Avatar,
  Box,
  Collapse,
  Pagination,
  IconButton,
  Stack, 
  LinearProgress, 
  styled
} from "@mui/material";

import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  DataList,
  PlaylistDrawer,
  StateCarousel,
  PageHead,
  NavLinks,
  TrackMenuDrawer,
  ChipMenu,
  Splash,
  SearchPage,
  SettingsMenu,
  AppFooter,
  BottomNav
} from "./components/lib";
import { DataGrid, Diagnostics } from "./components/lib";
import { getPagination } from "./util/getPagination";
import { StatePlayer, useStatePlayer } from "./components/lib";
import { typeIcons, Logo } from "./styled"; 
import { AppContext } from "./context";
import { isWakeLockActive } from "./util/isWakeLockActive";

 

const Title = styled(props => <Flex {...props} />)(( { theme }) => ({ 
  marginRight: theme.spacing(6),
  marginLeft: theme.spacing(1),
  fontSize: '1.3rem',
  [theme.breakpoints.down('md')]: {  
    marginRight: theme.spacing(0),
    fontSize: '1rem'
  }
}));


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
  const stateList = usePlaylist(() => stateSkyTunes.send("OPEN"));
  const stateSkyTunes = useSkytunes((files) =>
    statePlayer.handlePlay(files[0].FileKey, files, files[0])
  );
  const statePlayer = useStatePlayer((artistFk) =>
    stateSkyTunes.send({ type: "HERO", artistFk })
  );
  const stateMenu = useTrackmenu(() => stateSkyTunes.send("OPEN"));
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
    bannerOpen,
  } = stateSkyTunes.state.context;

  const { playlist_db } = stateList.state.context;
  const { memory } = statePlayer.state.context;

  const forms = {
    hero: DataList,
    splash: Splash,
    find: SearchPage,
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
  const isLoaded = ["list", "grid", "load"].find(stateSkyTunes.state.matches);
  const isGrid = stateSkyTunes.state.matches("grid.loaded");
  const Form = forms[listKey];
  const pages = {
    music: "Library",
    album: "Albums",
    artist: "Artists",
    genre: "Genres",
    playlist: "Playlists",
  };

  const typeKey = mediaType === "music" ? "grid" : types[listKey];

  const handlePlay = (file, records) => {
    statePlayer.handlePlay(file.FileKey, records || response.records, file);
  };

  const handleShuffle = (records) => {
    statePlayer.send({
      type: 'SHUFFLE',
      trackList: records || response.records
    })
  };

  const handleChange = (value) => {
    stateSkyTunes.send({
      type: "CHANGE",
      value,
    });
  };

  const selectedKey = Object.keys(pages).find((key) => key === mediaType);
  const selectedPage = !!search_param ? "Search" : pages[selectedKey];

  const sortPage = (num, field, dir) => {
    const url = [typeKey, mediaType, mediaID, num, field, dir]
      .filter((k) => !!k)
      .join("/");
    navigate(`/${url}`);
  };

  const interfaceProps = {
    onPlay: handlePlay,
    onList: stateList.handleOpen,
    onMenu: prop => stateMenu.handleOpen(prop, mediaType),
    onAuto: stateSkyTunes.handleAuto,
    onTab: (value) => stateSkyTunes.send({ type: "TAB", value }),
    FileKey: statePlayer.state.context.FileKey,
    sortPage,
    navigate,
    memory,
    playlist_db,
    records: response?.records || response,
    ...stateSkyTunes.state.context,
  };

  const openPage = (num) => {
    sortPage(num, sortKey, direction);
  };

  const playerOffset = statePlayer.idle ? '0px' : "var(--player-offset)";

  const homeButtons = [
    {
      target: '/',
      states: ['splash'],
      label:  'home',
      icon: <i className="fa-solid fa-house"></i>
    },
    {
      target: '/grid/music/1',
      states: ["list.loaded", "grid.loaded", "list"],
      label:  'library',
      icon: <i className="fa-solid fa-book"></i>
    },
    {
      target: 'find',
      states: ['find'],
      label:  'search',
      icon: <i className="fa-solid fa-magnifying-glass"></i>
    },
  ]

  // const forensics = `${ window.innerWidth}x${ window.innerHeight}`

  return (
    <AppContext.Provider
      value={{
        ...stateSkyTunes.state.context,
        send: stateSkyTunes.send,
      }}
    >
      <Box
        sx={{
          width: "100vw", 
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {/* page header */}
        <PageHead page={selectedPage} pageTitle={pageTitle} />
        {/* toolbar */}
 


        <Rotation show>

        <Toolbar>
         
          <Logo onClick={() => navigate("/")} src={logo} alt="sky-tunes" />

          <Title
            wrap
            width="fit-content"
            hover
            onClick={() => navigate("/")} 
        >
          {stateSkyTunes.appTitle}  
        </Title>

          <Responsive>
            {homeButtons.map(btn => (
              <LiteButton
                key={btn.label}
                onClick={() => navigate(btn.target)}
                variant={
                  btn.states.some(stateSkyTunes.state.matches) ? "contained" : "text"
                }
            >
              {btn.label}
            </LiteButton>
            ))} 
          </Responsive>
          <Spacer />
        
          {/* search box */}
          <IconTextField
            label="Find Music"
            placeholder="Type a song, album or artist" 
            endIcon={  <i
              onClick={() => {
                handleChange("");
                navigate("/grid/music/1");
              }}
              className={!search_param ? "fa-solid fa-magnifying-glass" : "fa-solid fa-xmark"}
            />
            } 
            startIcon={ <i className="fa-solid fa-music"></i> } 
            value={search_param}
            onKeyUp={(e) =>
              e.keyCode === 13 &&
              navigate(
                stateSkyTunes.state.matches("find")
                  ? `/find/${search_param}`
                  : `/search/${search_param}/1`
              )
            }
            onChange={(e) => {
              handleChange(e.target.value);
            }}
          />

          {/* search button */}
          <Responsive>
            <LiteButton
              variant="contained"
              color={isWakeLockActive() ? "primary" : "error"}
              onClick={() => navigate(`/search/${search_param}/1`)}
            >
              search
            </LiteButton>
          </Responsive>

          {/* debugger toggle button */}
          <Responsive sx={{ mr: 2 }}> 
            <SettingsMenu handler={statePlayer} machine={stateSkyTunes} />
          </Responsive>


        </Toolbar>

        </Rotation>


        {/* main workspace */}
        <Stack 
          sx={{ 
            mt: 9,  
            height: `calc(100svh - var(--bottom-bar-offset) - var(--top-bar-offset) - ${playerOffset} - var(--bottom-menu-offset))`,
            overflow: 'auto', 
            backgroundColor: 'white' ,
            '@media screen and (max-width: 912px) and (orientation: landscape)': {
              mt:  0
            }
          }}
        >
 
          {/* breadcrumbs  */}
            <Flex between>

            
                {["grid", "list"].some(stateSkyTunes.state.matches) &&
                !!selectedKey && (
                  <>
                    <Responsive show>
                      <BottomNav title={stateSkyTunes.appTitle} logo={logo} options={homeButtons} onClick={(value) => navigate(value)}   >
                        <SettingsMenu handler={statePlayer} machine={stateSkyTunes} />
                      </BottomNav>
                    </Responsive>

                    <Collapse
                      in={!!hero?.imageLg && !bannerOpen}
                      orientation="horizontal"
                    >
                      <Avatar
                        sx={{ ml: 2 }}
                        src={hero?.imageLg}
                        onClick={() =>
                          stateSkyTunes.send({
                            type: "CHANGE",
                            key: "bannerOpen",
                            value: !bannerOpen,
                          })
                        }
                      />
                    </Collapse>
                    <NavLinks
                      navigate={navigate}
                      page={selectedPage}
                      href={`/grid/${selectedKey}/1`}
                      pageTitle={pageTitle}
                    />
                  </>
                )}


              <Spacer />

              {/* navigation window  */}
              {!["splash", "find"].some(stateSkyTunes.state.matches) && isLoaded && (
                <ChipMenu
                  value={mediaType}
                  onChange={(val) =>
                    navigate(!val ? "/grid/music/1" : `/grid/${val}/1`)
                  }
                  options={Object.keys(pages).map((value) => ({
                    value,
                    label: pages[value],
                    icon: typeIcons[value],
                  }))}

                />
              )}

              {/* sort menu  */}
              {isGrid && (
                <>
                  <Box sx={{ pr: 2 }}>
                    <i
                      className="fa-solid fa-arrow-up-a-z"
                      onClick={() => {
                        stateSkyTunes.send({
                          type: "CHANGE",
                          key: "showSort",
                          value: !showSort,
                        });
                      }}
                    ></i>
                  </Box>

                  <FlexMenu component={Collapse} 
                    orientation="horizontal" 
                    in={showSort}
                    open={showSort}
                    onClose={() => {
                      stateSkyTunes.send({
                        type: "CHANGE",
                        key: "showSort",
                        value: !showSort,
                      });
                    }}
                    >
                    <Flex sx={{ mr: 3, p: showSort ? 2 : 0 }}>
                      {[
                        mediaType === "genre"
                          ? "Genre"
                          : mediaType === "playlist"
                          ? "Title"
                          : "Name",
                        "TrackCount",
                      ].map((key) => (
                        <LiteButton
                          size="small"
                          rounded
                          onClick={() =>
                            sortPage(
                              currentPage,
                              key,
                              direction === "ASC" ? "DESC" : "ASC"
                            )
                          }
                          variant={sortKey === key ? "contained" : "text"}
                          key={key}
                        >
                          {key}
                        </LiteButton>
                      ))}

                        {!!headerSort && isLoaded && (
                          <LiteButton
                            sx={{ mr: 2 }}
                            size="small"
                            onClick={() =>
                              navigate(
                                "/" +
                                  [typeKey, mediaType, mediaID, currentPage]
                                    .filter((e) => !!e)
                                    .join("/")
                              )
                            }
                            startIcon={<i className="fa-solid fa-arrow-up-a-z" />}
                          >
                            reset sort
                          </LiteButton>
                        )}

                    </Flex>
                  </FlexMenu>
                </>
              )}
 

            </Flex>
          {stateSkyTunes.busy && (
            <LinearProgress
              variant="indeterminate"
              sx={{ width: "100vw" }}
              color="primary"
            />
          )}

          {/* carousel  */}
          {!!carouselImages && <StateCarousel images={carouselImages} />}

          {/* hero image banner */}
          <Hero
            {...hero}
            page={pages[mediaType]}
            onClick={() =>
              stateSkyTunes.send({
                type: "CHANGE",
                key: "bannerOpen",
                value: !bannerOpen,
              })
            }
            sx={{ mb: bannerOpen ? 1 : 0 }}
            open={bannerOpen}
          />

          {/* pagination */}
          <Flex sx={{ ml: 1, mr: 4 }} spacing={2}>
            {counter.pageCount > 1 && (
              <Pagination
                count={Number(counter.pageCount)}
                page={Number(currentPage)}
                onChange={(a, b) => openPage(b)}
              />
            )}

            {/* shuffle button (TBD) */}

            {/* {!isGrid && <IconButton onClick={() => handleShuffle(interfaceProps.records)}>
              <i className="fa-solid fa-shuffle"></i>
              </IconButton>} */}


          </Flex>
 
          {/* records returned from the state machine  */}
          {!!Form && <Form {...interfaceProps} />}
        </Stack>

        <AppFooter />

        {/* audio player */}
        <StatePlayer
          {...statePlayer}
          onMenu={stateMenu.handleOpen}
          onList={stateList.handleOpen}
          playlist_db={playlist_db}
        />

        <PlaylistDrawer {...stateList} />

        <TrackMenuDrawer
          {...stateMenu}
          handler={statePlayer}
          onMove={(file, offset) => stateList.handleMove(mediaID, file, offset)}
          onListEdit={(track) => stateList.handleEdit(mediaID, track)}
          onList={stateList.handleOpen}
          onQueue={(track) => {
            statePlayer.send({
              type: "QUEUE",
              track,
            });
          }}
        />

        {/* debugger window */}
        <Diagnostics {...stateSkyTunes.diagnosticProps} open={debug} />
      </Box>
    </AppContext.Provider>
  );
}

export default App;
