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
import Update from '@material-ui/icons/Update';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table'
import { getSearchWordsArray, validateEmail } from '../../../../utils';
import { Firestore, Functions } from '../../../services/firebase/firebaseAuthService';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Restaurant } from '@material-ui/icons';

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
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
  Update: forwardRef((props, ref) => <Update {...props} ref={ref} />),
};

function TicketTable(props) {
  const { useState, useEffect } = React;
  const docId = props.docId;
  const tableRef = React.createRef();
  const [dlgOpen, setDlgOpen] = useState(false);

  const [columns, setColumns] = useState([
    { 
      title: 'Airport', field: 'airport',
      validate: rowData => rowData.airport && rowData.airport.length > 0 ? '' : 'Airport can not be empty'
    },
    { 
        title: 'Destination', field: 'destination',
        validate: rowData => rowData.destination && rowData.destination.length > 0 ? '' : 'Destination can not be empty'
    },
    { 
        title: 'Operator', field: 'operator_name',
        validate: rowData => rowData.operator_name && rowData.operator_name.length > 0 ? '' : 'Operator can not be empty'
    },
    { 
        title: 'Aircraft', field: 'aircraft',
        validate: rowData => rowData.aircraft && rowData.aircraft.length > 0 ? '' : 'Aircraft can not be empty'
    },
    { 
        title: 'Flight Number', field: 'flight_number',
        // validate: rowData => rowData.flight_number && rowData.flight_number.length > 0 ? '' : 'Flight Number can not be empty'
    },
    { 
        title: 'Flight Type', field: 'flight_type',
        lookup: {
            private : 'Private',
            nonPrivate: 'Non-Private (Commercial)',
            diplomatci :'Diplomatic'
        },
    },
    { 
        title: 'Payment', field: 'payment',
        validate: rowData => rowData.payment && rowData.payment.length > 0 ? '' : 'Flight Type can not be empty'
    },
    { 
        title: 'Bower/Pump Used', field: 'fuel_equipment_name',
        validate: rowData => rowData.fuel_equipment_name && rowData.fuel_equipment_name.length > 0 ? '' : 'Bower/Pump can not be empty'
    },
    { 
        title: 'Fuel Type', field: 'fuel_type',
        lookup: {
            jet : 'JET A1',
            avgas: 'AVGAS',
        },
    },
    { 
        title: 'Meter Start', field: 'meter_start',
        validate: rowData => rowData.meter_start && !isNaN(rowData.meter_start) && rowData.meter_start > 0 ? '' : 'Meter Start can not be smaller than 0'
    },
    { 
        title: 'Meter End', field: 'meter_end',
        validate: rowData => rowData.meter_end && !isNaN(rowData.meter_end) && rowData.meter_end > 0 ? '' : 'Meter End can not be smaller than 0'
    },
    { 
        title: 'Uplift Quantity', field: 'uplift_quantity',
        // validate: rowData => rowData.uplift_quantity && !isNaN(rowData.uplift_quantity) && rowData.uplift_quantity > 0 ? '' : 'Meter End can not be smaller than 0'
    },
    { 
        title: 'Uplift Unit', field: 'uplift_unit',
        validate: rowData => rowData.uplift_unit && rowData.uplift_unit.length > 0 ? '' : 'Uplift Unit can not be empty.'
    },
    { 
        title: 'Air Temperature', field: 'air_temperature',
        validate: rowData => rowData.air_temperature && !isNaN(rowData.air_temperature) && rowData.air_temperature > 0 ? '' : 'Air Temperature can not be smaller than 0.'
    },
    { 
        title: 'Temperature Unit', field: 'air_temperature_unit',
        lookup: {
            celsius : 'Celsius',
            fahrenheit: 'Fahrenheit',
        },
    },
    { 
        title: 'Uplift Date', field: 'uplift_date',
        validate: rowData => rowData.uplift_date && rowData.uplift_date.length > 0 ? '' : 'Uplift Date can not be empty.'
    },
    { 
        title: 'Customer', field: 'customer',
        // validate: rowData => rowData.customer && rowData.customer.length > 0 ? '' : 'Uplift Date can not be empty.'
    },
    { 
        title: 'Captain/Customer Name', field: 'customer_name',
        validate: rowData => rowData.customer_name && rowData.customer_name.length > 0 ? '' : 'Captain/Customer Name can not be empty.'
    },
    { 
        title: 'Captain/Customer Email', field: 'customer_email',
        validate: rowData => rowData.customer_email && rowData.customer_email.length > 0 ? '' : 'Captain/Customer Email can not be empty.'
    },
    { 
        title: 'Pilot Comment', field: 'fueler_comment',
        // validate: rowData => rowData.customer_email && rowData.customer_email.length > 0 ? '' : 'Captain/Customer Email can not be empty.'
    },
  ]);

  useEffect(() => {
    Firestore.collection('organizations').doc(docId).get().then(doc => {
        setOrgName(doc.data().name);
    })
  });

  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalDoc, setTotalDoc] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [orgName, setOrgName] = useState('');
  const [orgUsers, setOrgUsers] = useState([]);

  const getTotalDocs = (search = '') => {
    if (search == '') {
      return new Promise((resolve, reject) => {
        Firestore.collection('users')
        .where('organization_id', '==', docId).get().then(docs=> {
            //Firstly get Users array involved in that organization
            let array = [];
            docs.forEach(doc => {
                array.push(doc.id);
            });
            setOrgUsers(array);
          Firestore.collection('fuel_ticket_submissions_ipa')
          .where('created_by', 'in', array )
          .get().then(tDocs => {
            setTotalDoc(tDocs.size);
            resolve({
                size: tDocs.size,
                users: array
            });
          })
        }).then((tDocs) => {
            
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        Firestore.collection('users')
        .where('organization_id', '==', docId)
        .get().then(docs=> {
            //Firstly get Users array involved in that organization
            let array = [];
            docs.forEach(doc => {
                array.push(doc.id);
            })
            setOrgUsers(array);
            Firestore.collection('fuel_ticket_submissions_ipa')
            .where('created_by', 'in', array )
            .get().then(tDocs => {
                setTotalDoc(tDocs.size);
                resolve({
                    size: tDocs.size,
                    user: array
                });
            })
        })
      });
    }
    
  }

  const getDocuments = (search = '', init = false, users = []) => {
    if (search == '') {
      if (lastDoc == null || init == true) {
        return new Promise((resolve, reject) => {
          Firestore.collection('fuel_ticket_submissions_ipa')
          .where('created_by', 'in', users )
          .orderBy('airport_id', 'asc')
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
          Firestore.collection('fuel_ticket_submissions_ipa')
          .where('created_by', 'in', users )
          .orderBy('airport_id', 'asc')
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
          Firestore.collection('fuel_ticket_submissions_ipa')
          .where('created_by', 'in', users )
        //   .where('search_keys', 'array-contains', search.toLowerCase())
          .orderBy('airport_id', 'asc')
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
          Firestore.collection('fuel_ticket_submissions_ipa')
          .where('created_by', 'in', users)
        //   .where('search_keys', 'array-contains', search.toLowerCase())
          .orderBy('airport_id', 'asc')
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

  const onChangePage = (page) => {

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

  const handleClose = () => {
      setDlgOpen(false);
  }

  return (
    <div className="">
      <MaterialTable
        title="Tickets"
        icons={tableIcons}
        columns={columns}
        data={query =>
          new Promise((resolve, reject) => {
            let searchStr = query.search.length > 2 ? query.search.toLowerCase() : '';
            if (searchStr != '' && searchStr != searchKey) {
              clearState(searchStr).then(() => {
                getTotalDocs(searchStr).then((totalResult) => {
                  getDocuments(searchStr, true, totalResult.users).then((docResult) => {
                    resolve({
                      data: docResult,
                      page: query.page,
                      totalCount: totalResult.size
                    })
                  })
                })
              })
            } else if (searchStr == '' && searchKey != '') {
              clearState('').then(() => {
                getTotalDocs().then((totalResult) => {
                  getDocuments('', true, totalResult.users).then((docResult) => {
                    resolve({
                      data: docResult,
                      page: query.page,
                      totalCount: totalResult.size
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
                getDocuments(searchStr, false, totalResult.users).then((docResult) => {
                  if (query.page * query.pageSize < data.length && docResult.length == 0) {
                    resolve({
                      data: data.slice(query.page  * query.pageSize, data.length),
                      page: query.page,
                      totalCount: totalResult.size
                    })
                    return;
                  } 
                  resolve({
                    data: docResult,
                    page: query.page,
                    totalCount: totalResult.size
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
          search: false
        }}
        editable={{
        //   onRowAdd: newData =>
        //     new Promise((resolve, reject) => {
        //     //   Firestore.collection('users').add({
        //     //     ...newData,
        //     //     organization_id: docId,
        //     //     organization_name: orgName,
        //     //     search_keys: getSearchWordsArray(newData.first_name.toLowerCase() + ' ' + newData.last_name.toLowerCase() +  ' ' + newData.email.toLowerCase() + ' ' + newData.phone_number)
        //     //   }).then(() => {
        //     //     setSearchKey('');
        //     //     setData([]);
        //     //     setTotalDoc(0);
        //     //     setLastDoc(null);
        //     //     tableRef.current && tableRef.current.onQueryChange()
        //     //     resolve();
        //     //   })
        //         const AddFunc = Functions.httpsCallable('createUser');
        //         AddFunc({
        //             first_name: newData.first_name ? newData.first_name : '',
        //             last_name: newData.last_name ? newData.last_name : '',
        //             email: newData.email ? newData.email : '',
        //             contact_number: newData.contact_number ? newData.contact_number : '',
        //             organization_id: docId,
        //             organization_name: orgName,
        //             type: 'operator',
        //             search_keys: getSearchWordsArray(newData.first_name.toLowerCase() + ' ' + newData.last_name.toLowerCase() +  ' ' + newData.email.toLowerCase())
        //         }).then((result) => {
        //             console.log("Function Call Result === ", result);
        //             if (result.data && result.data.errorReason) {
        //               alert(result.data.errorReason);
        //               reject()
        //             } else {
        //               setSearchKey('');
        //               setData([]);
        //               setTotalDoc(0);
        //               setLastDoc(null);
        //               tableRef.current && tableRef.current.onQueryChange()
        //               resolve();
        //             }
                    
        //         }).catch(error => {
        //             console.log("Function Call Error === ", error);
        //             alert("User Creation is failed!");
        //             reject();
        //         })
        //     }),
        //   onRowUpdate: (newData, oldData) =>
        //     new Promise((resolve, reject) => {
        //       const dataUpdate = [...data];
        //       const index = oldData.tableData.id;
        //       dataUpdate[index] = newData;
        //       setData([...dataUpdate]);
        //       console.log("Data Update oldData === ", oldData, newData);
        //       Firestore.collection('users').doc(oldData.docId)
        //       .update({
        //         first_name: newData.first_name,
        //         last_name: newData.last_name,
        //         contact_number: newData.contact_number ? newData.contact_number : '',
        //         email: newData.email ? newData.email : '',
        //         organization_id: docId,
        //         search_keys: getSearchWordsArray(newData.first_name.toLowerCase() + ' ' + newData.last_name.toLowerCase() +  ' ' + newData.email.toLowerCase())
        //       }).then(() => {
        //         console.log("Row Update Success === ");
        //         setSearchKey('');
        //         setData([]);
        //         setTotalDoc(0);
        //         setLastDoc(null);
        //         tableRef.current && tableRef.current.onQueryChange()
        //         resolve();
        //       })
        //     }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              Firestore.collection('fuel_ticket_submissions_ipa').doc(oldData.docId).delete()
              .then(() => {
                setSearchKey('');
                setData([]);
                setTotalDoc(0);
                setLastDoc(null);
                tableRef.current && tableRef.current.onQueryChange()
                resolve()
              })
            }),
        }}
      />
    </div>
  )
}

export default TicketTable;
