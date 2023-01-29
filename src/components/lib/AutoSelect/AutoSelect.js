import React from 'react';
import { styled, Autocomplete, Avatar, TextField, Box } from '@mui/material';
import throttle from 'lodash/throttle';
 import { searchGroupByType } from '../../../connector';
 
 
const Layout = styled(Box)(({ theme }) => ({
 margin: theme.spacing(0)
}));
 
const AutoSelect = (props) => {
  const { onValueSelected, type } = props;

  // const onSelected = async (option)  => {
   
  //   onValueSelected && onValueSelected(option)
  // }

  const onValueChanged = React.useCallback(async ({ value })  =>  {
    if (!value?.length) return;
     const opts =  await searchGroupByType(type, value, 1);
     if (opts.records?.length) {
      setOptions(opts.records.map(rec => ({
        name: rec.Name || rec.Genre,
        image: rec.Thumbname,
        ID: rec.ID
      })))
     } 
  }, [type])
  const [value] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');
  const [options, setOptions] = React.useState( []);

  const renderOption = (props, option) => {
    if (option.image) return <Box {...props}
      ><Avatar sx={{mr: 1}} src={option.image} alt={option.name}/>{option.name}</Box>
    return <Box {...props}>{option.name}</Box> 
  }

  const fetch = React.useMemo(
    () =>
      throttle((request, callback) => {
        onValueChanged && onValueChanged( request);
      }, 1000),
    [onValueChanged],
  );
 
  React.useEffect(() => {
    let active = true;
 
 
    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ value: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions([{
          name: `Create new model named ${inputValue}`,
          create: 1
        }].concat(newOptions));
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, onValueChanged, fetch]);


 
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
