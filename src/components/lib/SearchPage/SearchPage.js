import React from 'react';
import { styled, Box, Avatar, Divider, Typography, Stack } from '@mui/material';
import { Flex, LiteButton, Nowrap, TuneGrid, InfoCard} from "../../../styled"; 
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(4)
}));

const ListItem = ({ title, image, caption, onClick, active }) => (
  <Flex spacing={1} onClick={onClick} sx={{cursor: 'pointer'}}>
    <Avatar src={image} />
    <Stack>
    <Nowrap bold={active} hover>
      {!!active && <i class="fa-solid fa-volume-high"></i>}
    {title}
    </Nowrap>
    <Nowrap variant="caption" bold={active}>
    {caption}
    </Nowrap>
    </Stack>
  </Flex>
)

const SongList = ({ records, selected, onClick }) => {
  return <Stack spacing={1} sx={{m: 4}}>
    {records.map(record => ( <ListItem active={selected === record.FileKey} onClick={() => onClick(record)}  key={record.ID} title={record.Title} image={record.albumImage} caption={record.artistName} />  ))}
  </Stack>
}
 
const AlbumList = ({ records, onClick }) => {
  return <Stack spacing={1} sx={{m: 4}}>
    {records.map(record => ( <ListItem onClick={() => onClick(record.ID)} 
      key={record.collectionId} title={record.Name} image={record.Thumbnail} caption={record.artistName} />  ))}
  </Stack>
}
 
const ArtistList = ({ records, onClick }) => {
  return <Stack spacing={1} sx={{m: 4}}>
    {records.map(record => ( <ListItem onClick={() => onClick(record.ID)}  key={record.ID} title={record.Name} image={record.Thumbnail} caption={`${record.TrackCount} tracks`} />  ))}
  </Stack>
}
 
 

const SearchPage = ({searches, search_param, onPlay , memory, history, navigate, FileKey, onTab, selected_search}) => {
  if (!searches) return <>
  <Nowrap variant="h5" sx={{p: 2}}>Explore recent listens</Nowrap>
  <Divider textAlign="left" sx={{m: 1}}>Listen again</Divider>
  {!!memory && <TuneGrid sx={{m:  3}}>
    {memory.slice(memory.length - 15).map(rec => <InfoCard 
      selected={FileKey === rec.FileKey}
      onClick={() => onPlay(rec, [rec])}
      key={rec.ID}
      {...rec}
      Name={rec.Title}
      />)}
  </TuneGrid>}
  <Divider textAlign="left" sx={{m: 1}}>Jump back in</Divider>
  {!!history && <TuneGrid sx={{m:  3}}>
    {history.slice(history.length - 15).map(rec => <InfoCard 
      onClick={() => navigate(`/list/artist/${rec.ID}`)}
      key={rec.ID}
      {...rec} 
      />)}
  </TuneGrid>}
    {/* <pre>
      {JSON.stringify({memory, history}, 0, 2)}
    </pre> */}
  </>
  const icons = {
    music: <i class="fa-solid fa-music"></i>,
    artist: <i class="fa-solid fa-person"></i>,
    album: <i class="fa-solid fa-compact-disc"></i>
  }
 return (
   <Layout data-testid="test-for-SearchPage">
    <Typography variant="h6" sx={{mb: 2}}>Search results for "{search_param}"</Typography>
    <Flex spacing={2} >
      {Object.keys(searches)
        .filter(f => !!searches[f] && searches[f].records && searches[f].records.length)
        .map((found, f) => <LiteButton rounded key={found} label={found} 
        startIcon={icons[found]}
        onClick={() => onTab(f)}
        color="primary"
        size="small"
        variant={selected_search === f ? "contained" : "text"} >
          {found} ({searches[found].records.length})
        </LiteButton>)}
    </Flex>



    {!!searches.music?.records && 
      selected_search === 0 && 
      <SongList records={searches.music.records}
        onClick={rec => onPlay(rec, searches.music.records)}
        selected={FileKey} />}

    {!!searches.album?.records && 
      selected_search === 1 && 
      <AlbumList onClick={id => {
        navigate(`/list/album/${id}`)
      }} records={searches.album.records} />}

    {!!searches.artist?.records && 
      selected_search === 2 && 
      <ArtistList onClick={id => {
        navigate(`/list/artist/${id}`)
      }}  records={searches.artist.records} />}

     {/* <pre>
      {JSON.stringify(searches,0,2)}
     </pre> */}
   </Layout>
 );
}
SearchPage.defaultProps = {};
export default SearchPage;
