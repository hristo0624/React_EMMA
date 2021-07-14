// *https://www.registers.service.gov.uk/registers/country/use-the-api*
import fetch from "cross-fetch";
import React from "react";
import { TextField, CircularProgress } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Firestore } from '../../../services/firebase/firebaseAuthService';
import PropTypes from "prop-types";
import _ from 'lodash';

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

export default function AsyncAutocomplete(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [checkOptions, setCheckOptions] = React.useState({});

  const getAirports = (value) => {
    console.log("Get Airports Start");
    setLoading(true);
    // loading = true;
    // airports = [];
    setOpen(false);
    Firestore.collection('airports').where('search_keys', 'array-contains', value.toLowerCase()).get()
    .then(docs => {
      
      // loading = false;
      if (!docs.empty) {
        let result = [];
        let objResult = {};
        docs.forEach(doc => {
            let oneData = doc.data();
          result.push({
            name: oneData.name + ' (' + oneData.icao_code + '/' + oneData.iata_code + ')'
          })
          objResult[oneData.name + ' (' + oneData.icao_code + '/' + oneData.iata_code + ')'] = {
              id: doc.id,
              name: oneData.name
          }
        })
        
        let sortedResult = _.sortBy(result, ['name']);
        console.log("Get Airports Result == ", sortedResult);
        setCheckOptions(objResult);
        setOptions(sortedResult);
        setLoading(false);
        setOpen(true)
        // airports = result.slice(0);
      } else {
        setLoading(false);
        setOpen(false);
      }
    })
  }


  return (
    <Autocomplete
      id="asynchronous-demo"
      className="w-300"
      open={open}
    //   onOpen={() => {
    //     setOpen(true);
    //   }}
    //   onClose={() => {
    //     setOpen(false);
    //   }}
      getOptionSelected={(option, value) => {
          if (option.name === value.name)
            return value;
        }}
      getOptionLabel={option => option.name}
      options={options}
      loading={loading}
      filterOptions={(options, state) => options}
      onInputChange={(event, value, reason) => {
          console.log("Change === ", event.target.value, value, reason);
          if (reason == 'input') {
              if (value.length > 2) {
                getAirports(value);
              } else {
                setLoading(false);
                setCheckOptions({});
                setOptions([]);
                
              }
          } 
          if (reason == 'reset') {
            //   props.onChange(value);
            props.onChange(checkOptions[value].name);
            props.onChangeId(checkOptions[value].id);
            setOpen(false);
          }

          if (reason == 'clear') {
            setOpen(false);
            setCheckOptions({});
            setOptions([]);
            props.onClear();
          }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label="Airport code"
          fullWidth
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}

AsyncAutocomplete.propTypes = {
    onChange: PropTypes.func.isRequired,
    onChangeId: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
}
