 
import './App.css';
import { useSkytunes, usePlaylist } from './machines';
import { LiteButton, Flex, IconTextField, TuneGrid, Spacer, Toolbar, Hero } from './styled';
import { Avatar, Box, Pagination , Stack, Typography} from '@mui/material';

import { 
  BrowserRouter,  
  Routes, 
  Route,
  useNavigate, 
} from "react-router-dom";  
import { DataList, PlaylistDrawer, StateCarousel, PageHead, NavLinks } from './components/lib';
import { DataGrid, Diagnostics } from './components/lib';
import { getPagination } from './util/getPagination';
import { StatePlayer, useStatePlayer } from './components/lib';

function App () {
  return <BrowserRouter>
    <Routes>
      <Route path="/" element={<Application  />} /> 
      <Route path="/search/:param/:page" element={<Application  />} /> 
      <Route path="/list/:type/:id" element={<Application  />} /> 
      <Route path="/list/:type/:id/:page" element={<Application  />} />  
      <Route path="/list/:type/:id/:page/:sort" element={<Application  />} />  
      <Route path="/list/:type/:id/:page/:sort/:direction" element={<Application  />} />  
      <Route path="/grid/:type" element={<Application  />} /> 
      <Route path="/grid/:type/:page" element={<Application  />} />  
      <Route path="/grid/:type/:page/:sort" element={<Application  />} />  
      <Route path="/grid/:type/:page/:sort/:direction" element={<Application  />} />  
    </Routes>
</BrowserRouter>
}

function Application() {
  const stateList = usePlaylist();
  const media = useStatePlayer();
  const tunes = useSkytunes();
  const navigate = useNavigate()
  const { response, logo,  search_param, pageTitle,  carouselImages } =  tunes.state.context; 
  const { playlist_db } =  stateList.state.context; 

  const lists =  {
    'list.loaded': DataList,
    'grid.loaded': DataGrid
  }
  const types =  {
    'list.loaded': 'list',
    'grid.loaded': 'grid'
  }

  const counter = getPagination([], {
    page: tunes.state.context.page,
    count:  response?.count,
    pageSize: 100, 
  })

  const listKey = Object.keys(lists).find(tunes.state.matches)
  const Form = lists[listKey];
  const pages = {
    music: 'Library',
    album: 'Albums',
    artist: 'Artists',
    genre: 'Genres',
    playlist: 'Playlists',
  }

  const typeKey =  tunes.state.context.type === 'music'
    ? 'grid'
    : types[listKey]

  const prefix = typeKey === 'list' 
    ? `/${typeKey}/${tunes.state.context.type}/${tunes.state.context.id}/`
    : `/${typeKey}/${tunes.state.context.type}/`

  const handlePlay = file => {
    media.handlePlay(file.FileKey, response.records, file)
  }

  const handleChange = value  => {
    tunes.send({
      type: 'CHANGE',
      value 
     })
  }

  const selectedKey = Object.keys(pages).find(key => key === tunes.state.context.type);;
  const selectedPage = pages[selectedKey];

  return (
    <> 

      {/* page header */}
      <PageHead page={selectedPage} pageTitle={pageTitle}/>

      {/* toolbar */}
      <Toolbar >

        {/* logo  */}
        <Avatar src={logo} alt="sky-tunes" />
        <Typography variant="h6" sx={{mr: 6, ml: 1}}>Skytunes</Typography>

        {/* navigation buttons */}
        {Object.keys(pages).map(page => <LiteButton 
        onClick={() => navigate('/grid/' + page + '/1')}
        variant={page === tunes.state.context.type ? 'contained' : 'text'}
        key={page}>{pages[page]}</LiteButton>)}

        <Spacer />

        {/* search box */}
        <IconTextField 
          label="Search"
          placeholder="Type a song, album or artist"
          startIcon={<i className="fa-solid fa-magnifying-glass" />}
          endIcon={ !search_param ? null : <i onClick={() => handleChange('')} className="fa-solid fa-xmark"/>}
          value={search_param}
          onChange={e => {
            handleChange(e.target.value)
          }}
        />

        <LiteButton variant="contained" onClick={() => navigate(`/search/${search_param}/1`)}>search</LiteButton>
          
      </Toolbar>

      {/* main workspace */}
      <Stack sx={{mt: 10, mb: 20}}>

        {/* breadcrumbs  */}
        <Flex between>
          {!!selectedKey && <NavLinks page={selectedPage} href={`/grid/${selectedKey}/1`} pageTitle={pageTitle} />}

          {/* debugger toggle button */}
          <Box onClick={() => tunes.send('DEBUG')} sx={{ mr: 2 }}><i class="fa-solid fa-gear"></i></Box>
        </Flex>

        {/* carousel  */}
        {!!carouselImages && <StateCarousel images={carouselImages} />}

        {/* hero image banner */}
        <Hero {...tunes.state.context.hero} page={pages[tunes.state.context.type]}/>

        {/* pagination */}
        {counter.pageCount > 1 && <Pagination
          count={Number(counter.pageCount)}
          page={Number(tunes.state.context.page)}
          onChange={(a,b) => navigate(prefix + b)}
        />}

        {/* records returned from the state machine  */}
        {!!Form && <Form 
          onPlay={handlePlay} 
          onList={stateList.handleOpen}
          FileKey={media.state.context.FileKey} 
          {...tunes.state.context} 
          navigate={navigate} 
          playlist_db={playlist_db}
          records={response?.records}
          />}
  
      </Stack>
 
    {/* audio player */}
    <StatePlayer {...media} />

    <PlaylistDrawer {...stateList} />

    {/* debugger window */}
    <Diagnostics {...tunes.diagnosticProps} open={tunes.state.context.debug} />
 
    </>
  );
}

export default App;
