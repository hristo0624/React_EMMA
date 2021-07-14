import React, { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table'
import { getSearchWordsArray, validateEmail } from '../../../../utils';
import { Firestore } from '../../../services/firebase/firebaseAuthService';
import { TextField } from "@material-ui/core";
import AsyncAutoComplete from './autoComplete';

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const suggestions = [
  { label: "Afghanistan" },
  { label: "Aland Islands" },
  { label: "Albania" },
  { label: "Algeria" },
  { label: "American Samoa" },
  { label: "Andorra" },
  { label: "Angola" },
  { label: "Anguilla" },
  { label: "Antarctica" },
  { label: "Antigua and Barbuda" },
  { label: "Argentina" },
  { label: "Armenia" },
  { label: "Aruba" },
  { label: "Australia" },
  { label: "Austria" },
  { label: "Azerbaijan" },
  { label: "Bahamas" },
  { label: "Bahrain" },
  { label: "Bangladesh" },
  { label: "Barbados" },
  { label: "Belarus" },
  { label: "Belgium" },
  { label: "Belize" },
  { label: "Benin" },
  { label: "Bermuda" },
  { label: "Bhutan" },
  { label: "Bolivia, Plurinational State of" },
  { label: "Bonaire, Sint Eustatius and Saba" },
  { label: "Bosnia and Herzegovina" },
  { label: "Botswana" },
  { label: "Bouvet Island" },
  { label: "Brazil" },
  { label: "British Indian Ocean Territory" },
  { label: "Brunei Darussalam" }
];

const EquipmentTable = (props) => {
  const { useState, useEffect } = React;
  const docId = props.docId;
  const tableRef = React.createRef();
  let airportId = null;

  // const [columns, setColumns] = useState([
  //   { 
  //     title: 'Name', field: 'fuel_equipment_name',
  //     validate: rowData => rowData.fuel_equipment_name && rowData.fuel_equipment_name.length > 0 ? '' : 'Name can not be empty'
  //   },
  //   { title: 'Airport', field: 'airport_name',
  //     headerStyle: {
  //       textAlign: 'left',
  //     },
  //     cellStyle: {
  //       textAlign: 'left',
  //       paddingLeft: 10,
  //       paddingRight: 10,
  //     },
  //     editComponent: t => 
  //       <AsyncAutoComplete onChange={(value) => t.onChange(value)} onChangeId={(id) => {airportId = id;}}/>,
  //     validate: rowData => rowData.home_base_name && rowData.home_base_name.length > 0 ? '' : 'Airport can not be empty!', 
  //   }
  // ]);
  
  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalDoc, setTotalDoc] = useState(0);
  const [searchKey, setSearchKey] = useState('');

  // useEffect(() => {
  //   Firestore.collection('aircraft_types').get().then(docs => {
  //       if (!docs.empty) {
  //           let lookUpObj = {}
  //           docs.forEach(doc => {
  //               let typeName =  doc.data().type_name;
  //               lookUpObj[typeName] = typeName
  //           })
  //           console.log("Types === ", lookUpObj);
  //           // setTypes(lookUpObj)
  //           setColumns([
  //               { 
  //                   title: 'Registration', field: 'registration',
  //                   validate: rowData => {
  //                       if (!rowData.registration || rowData.registration.length == 0)
  //                           return 'Registration can not be empty!';
  //                       if (rowData.registration && rowData.registration != rowData.registration.toUpperCase())
  //                           return 'Registration should be capital characters!'
  //                       return '';
  //                   }
  //               },
  //               { 
  //                   title: 'Aircraft Type', field: 'aircraft_type',
  //                   cellStyle: {
  //                       textAlign: 'left',
  //                   },
  //                   headerStyle: {
  //                       textAlign: 'left',
  //                   },
  //                   lookup: lookUpObj,
  //                   validate: rowData => (!rowData.aircraft_type || rowData.aircraft_type == '') ? 'Please select aircraft type!' : '' 
  //               },
  //               {

  //               }
  //           ])
  //       }
  //   });
  // }, []);

//   useEffect(() => {
    
//   }, [types]);

  const getTotalDocs = (search = '') => {
    if (search == '') {
      return new Promise((resolve, reject) => {
        Firestore.collection('fuel_equipment').where('organization_id', '==', docId).get().then(docs=> {
          setTotalDoc(docs.size);
          resolve(docs.size);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        Firestore.collection('fuel_equipment')
        .where('organization_id', '==', docId)
        .where('search_keys', 'array-contains', search.toLowerCase())
        .get().then(docs=> {
          setTotalDoc(docs.size);
          resolve(docs.size);
        });
      });
    }
    
  }

  const getDocuments = (search = '', init = false) => {
    if (search == '') {
      if (lastDoc == null || init == true) {
        return new Promise((resolve, reject) => {
          Firestore.collection('fuel_equipment')
          .where('organization_id', '==', docId)
          .orderBy('fuel_equipment_name', 'asc')
          .limit(20)
          .get().then(docs => {
            let result = [];
            if (docs.empty) {
              setData([]);
            } else {
              docs.forEach(doc => {
                let data = { ...doc.data(), docId: doc.id};
                result.push(data);
              })
              setData(result);
              setLastDoc(docs.docs[docs.size - 1]);
            }
            resolve(result);
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          Firestore.collection('fuel_equipment')
          .where('organization_id', '==', docId)
          .orderBy('fuel_equipment_name', 'asc')
          .startAfter(lastDoc)
          .limit(20)
          .get().then(docs => {
            let result = [];
            if (docs.empty) {
              // setData([]);
            } else {
              docs.forEach(doc => {
                let data = { ...doc.data(), docId: doc.id};
                result.push(data);
              })
              setData([...data, ...result]);
              setLastDoc(docs.docs[docs.size - 1]);
            }
            resolve(result);
          });
        });
      }
    } else {
      if (lastDoc == null || init == true) {
        return new Promise((resolve, reject) => {
          Firestore.collection('fuel_equipment')
          .where('organization_id', '==', docId)
          .where('search_keys', 'array-contains', search.toLowerCase())
          .orderBy('fuel_equipment_name', 'asc')
          .limit(20)
          .get().then(docs => {
            let result = [];
            if (docs.empty) {
              setData([]);
            } else {
              docs.forEach(doc => {
                let data = { ...doc.data(), docId: doc.id};
                result.push(data);
              })
              setData(result);
              setLastDoc(docs.docs[docs.size - 1]);
            }
            resolve(result) 
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          Firestore.collection('fuel_equipment')
          .where('organization_id', '==', docId)
          .where('search_keys', 'array-contains', search.toLowerCase())
          .orderBy('fuel_equipment_name', 'asc')
          .startAfter(lastDoc)
          .limit(20)
          .get().then(docs => {
            let result = [];
            if (docs.empty) {
              // setData([]);
            } else {
              docs.forEach(doc => {
                let data = { ...doc.data(), docId: doc.id};
                result.push(data);
              })
              setData([...data, ...result]);
              setLastDoc(docs.docs[docs.size - 1]);
            }
            resolve(result);
          });
        });
      }
    }
  }

  const clearState = (search) => {
    return new Promise((resolve, reject) => {
      setSearchKey(search.toLowerCase());
      setLastDoc(null);
      setData([]);
      setTotalDoc(0);
      
      resolve();
    })
  }

  return (
    <div className="">
      <MaterialTable
        title="Fuelling Equipment"
        icons={tableIcons}
        columns={
          [
            { 
              title: 'Name', field: 'fuel_equipment_name',
              validate: rowData => rowData.fuel_equipment_name && rowData.fuel_equipment_name.length > 0 ? '' : 'Name can not be empty'
            },
            { title: 'Airport', field: 'airport_name',
              headerStyle: {
                textAlign: 'left',
              },
              cellStyle: {
                textAlign: 'left',
                paddingLeft: 10,
                paddingRight: 10,
              },
              editComponent: t => 
                <AsyncAutoComplete onChange={(value) => t.onChange(value)} onChangeId={(id) => {airportId = id;}} onClear={() => {t.onChange('')}}/>,
              // validate: rowData => rowData.airport_name && rowData.airport_name.length > 0 ? '' : 'Airport can not be empty!', 
            }
          ]
        }
        data={query =>
          new Promise((resolve, reject) => {
            let searchStr = query.search.length > 2 ? query.search.toLowerCase() : '';
            if (searchStr != '' && searchStr != searchKey) {
              clearState(searchStr).then(() => {
                getTotalDocs(searchStr).then((totalResult) => {
                  getDocuments(searchStr, true).then((docResult) => {
                    resolve({
                      data: docResult,
                      page: query.page,
                      totalCount: totalResult
                    })
                  })
                })
              })
            } else if (searchStr == '' && searchKey != '') {
              clearState('').then(() => {
                getTotalDocs().then((totalResult) => {
                  getDocuments('', true).then((docResult) => {
                    resolve({
                      data: docResult,
                      page: query.page,
                      totalCount: totalResult
                    })
                  })
                })
              })
            } else if ((query.page + 1) * query.pageSize > data.length) {
              if (query.search.length < 3 && query.search.length > 0) {
                resolve({
                  data: data.slice(query.page  * query.pageSize, (query.page + 1)  * query.pageSize),
                  page: query.page,
                  totalCount: totalDoc
                })
                return;
              }
              getTotalDocs(searchStr).then((totalResult) => {
                getDocuments(searchStr).then((docResult) => {
                  if (query.page * query.pageSize < data.length && docResult.length == 0) {
                    resolve({
                      data: data.slice(query.page  * query.pageSize, data.length),
                      page: query.page,
                      totalCount: totalResult
                    })
                    return;
                  } 
                  resolve({
                    data: docResult,
                    page: query.page,
                    totalCount: totalResult
                  })
                })
              })
            } else {
              resolve({
                data: data.slice(query.page  * query.pageSize, (query.page + 1)  * query.pageSize),
                page: query.page,
                totalCount: totalDoc
              })
            }
          })
        }
        options={{
          sorting: false,
          draggable: false,
          padding: "dense"
        }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              Firestore.collection('fuel_equipment').add({
                fuel_equipment_name: newData.fuel_equipment_name ? newData.fuel_equipment_name : '',
                airport_name: newData.airport_name ? newData.airport_name : '',
                organization_id: docId,
                airport_id: newData.airport_name ? airportId : '',
                search_keys: newData.airport_name ? getSearchWordsArray(newData.fuel_equipment_name.toLowerCase() + ' ' + newData.airport_name.toLowerCase()) : getSearchWordsArray(newData.fuel_equipment_name.toLowerCase())
              }).then(() => {
                setSearchKey('');
                setData([]);
                setTotalDoc(0);
                setLastDoc(null);
                tableRef.current && tableRef.current.onQueryChange()
                resolve();
              })
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              Firestore.collection('fuel_equipment').doc(oldData.docId).delete()
              .then(() => {
                setSearchKey('');
                setData([]);
                setTotalDoc(0);
                setLastDoc(null);
                tableRef.current && tableRef.current.onQueryChange()
                resolve()
              })
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              const dataUpdate = [...data];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData([...dataUpdate]);
              console.log("Fuel Equipment Data === ", oldData, newData);
              Firestore.collection('fuel_equipment').doc(oldData.docId).update({
                fuel_equipment_name: newData.fuel_equipment_name ? newData.fuel_equipment_name : '',
                airport_name: newData.airport_name ? newData.airport_name : '',
                airport_id: newData.airport_name ? airportId : '',
                search_keys: newData.airport_name ? getSearchWordsArray(newData.fuel_equipment_name.toLowerCase() + ' ' + newData.airport_name.toLowerCase()) : getSearchWordsArray(newData.fuel_equipment_name.toLowerCase())
              }).then(() => {
                console.log("Updated !!!! ");
                setSearchKey('');
                setData([]);
                setTotalDoc(0);
                setLastDoc(null);
                tableRef.current && tableRef.current.onQueryChange()
                resolve();
              })
            }),
        }}
      />
    </div>
  )
}

export default EquipmentTable;
