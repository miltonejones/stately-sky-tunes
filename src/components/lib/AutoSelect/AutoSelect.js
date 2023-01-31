import React from 'react';
import { styled, Autocomplete, Avatar, TextField, Box } from '@mui/material';
import throttle from 'lodash/throttle'; 
import { useAutoselect } from '../../../machines';
 
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const AutoSelect = (props) => {
  const { onValueSelected, valueChanged, type } = props;
  const auto = useAutoselect(
    {
      valueChanged, 
      valueSelected: onValueSelected
    } 
  );
 
  const [inputValue, setInputValue] = React.useState(''); 
  const { options = [] } =  auto;

  const renderOption = (props, option) => {
    if (option.image) return <Box {...props}
      ><Avatar sx={{mr: 1}} src={option.image} alt={option.name}/>{option.name}</Box>
    return <Box {...props}>{option.name}</Box> 
  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        auto.send({
          type: 'CHANGE',
          ...request
        }) 
      }, 1000),
    [auto],
  );
 
  React.useEffect(() => { 
 
    if (inputValue === '') { 
      return undefined;
    }

    fetch({ value: inputValue }); 
  }, [inputValue, fetch]);


 
 return (
   <Layout data-testid="test-for-AutoSelect"> 
    <Autocomplete
          sx={{ width: '100%', minWidth: 400 }}
          renderOption={renderOption}
          getOptionLabel={option => option.name || option} 
          options={options}
          value={props.value}
          onChange={(event, newValue) => {
            onValueSelected && onValueSelected(newValue);
            // setValue(newValue);
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => <TextField fullWidth label={`Choose ${type}`} placeholder="Type a model name" {...params}  size={'small'} />
          }
      />
   </Layout>
 );
}
AutoSelect.defaultProps = {};
export default AutoSelect;
