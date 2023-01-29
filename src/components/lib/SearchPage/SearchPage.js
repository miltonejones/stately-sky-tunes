import React from 'react';
import { styled, Box, Avatar, Typography, Stack, Chip } from '@mui/material';
import { Flex, LiteButton, Nowrap} from "../../../styled"; 
 
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
 

/**
       "ID": 1319,
        "Name": "Kagamine Rin and Hatsune Miku",
        "Thumbnail": "https://c-sf.smule.com/rs-s30/arr/e1/9d/775a7a65-024b-4102-a5b4-887e41f63e69.jpg",
        "iArtistID": null,
        "amgArtistID": null,
        "imageLg": null,
        "TrackCount": 1
 */


const SearchPage = ({searches, search_param, onPlay ,navigate, FileKey, onTab, selected_search}) => {
  if (!searches) return <i />
  const icons = {
    music: <i class="fa-solid fa-music"></i>,
    artist: <i class="fa-solid fa-person"></i>,
    album: <i class="fa-solid fa-compact-disc"></i>
  }
 return (
   <Layout data-testid="test-for-SearchPage">
    <Typography variant="h6" sx={{mb: 2}}>Search results for "{search_param}"</Typography>
    <Flex spacing={2} >
      {Object.keys(searches).map((found, f) => <LiteButton rounded key={found} label={found} 
        startIcon={icons[found]}
        onClick={() => onTab(f)}
        color="primary"
        variant={selected_search === f ? "contained" : "text"} >
          {found}
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
