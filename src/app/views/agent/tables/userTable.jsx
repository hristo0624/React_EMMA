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
import { Firestore, Functions } from '../../../services/firebase/firebaseAuthService';
import { TextField, CircularProgress, MenuItem, Select } from "@material-ui/core";
import AsyncAutoComplete from './autoComplete';
import Update from '@material-ui/icons/Update';

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

function sleep(delay = 0) {
  return new Promise(resolve => {
    setTimeout(resolve, delay);
  });
}

function UserTable(props) {
  const { useState, useEffect } = React;
  const docId = props.docId;
  const tableRef = React.createRef();
  let homeBaseId = null;
  

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
  const [selId, setSelId] = useState(null);

  

  const getTotalDocs = (search = '') => {
    if (search == '') {
      return new Promise((resolve, reject) => {
        Firestore.collection('users')
        .where('organization_id', '==', docId).get().then(docs=> {
          setTotalDoc(docs.size);
          resolve(docs.size);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        Firestore.collection('users')
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
          Firestore.collection('users')
          .where('organization_id', '==', docId)
          .orderBy('first_name', 'asc')
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
          Firestore.collection('users')
          .where('organization_id', '==', docId)
          .orderBy('first_name', 'asc')
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
          Firestore.collection('users')
          .where('organization_id', '==', docId)
          .where('search_keys', 'array-contains', search.toLowerCase())
          .orderBy('first_name', 'asc')
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
          Firestore.collection('users')
          .where('organization_id', '==', docId)
          .where('search_keys', 'array-contains', search.toLowerCase())
          .orderBy('first_name', 'asc')
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
        title="Into Plane Agent Staff"
        icons={tableIcons}
        columns={[
          { 
            title: 'First Name', field: 'first_name',
            validate: rowData => rowData.first_name && rowData.first_name.length > 0 ? '' : 'First Name can not be empty!'
          },
          { 
            title: 'Last Name', field: 'last_name',
            validate: rowData => rowData.last_name && rowData.last_name.length > 0 ? '' : 'Last Name can not be empty!'
          },
          { 
            title: 'Email', field: 'email',
            validate: rowData => validateEmail(rowData.email) ? '' : 'Invalid Email',
            cellStyle: {
              textAlign: 'left',
            },
            headerStyle: {
              textAlign: 'left',
            }
          },
          {
            title: 'Phone Number',
            field: 'contact_number',
          },
          {
            title: 'Home Base',
            field: 'home_base_name',
            cellStyle: {
              paddingLeft: 10,
              paddingRight: 10,
            },
            editComponent: t => 
              <AsyncAutoComplete onChange={(value) => t.onChange(value)} onChangeId={(id) => {homeBaseId = id;}} onClear={() => {t.onChange('')}}/>,
            // validate: rowData => rowData.home_base_name && rowData.home_base_name.length > 0 ? '' : 'Home Base can not be empty!', 
          }
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            let searchStr = query.search.length > 2 ? query.search.toLowerCase() : '';
            if (searchStr != '' && searchStr != searchKey) {
              clearState(searchStr).then(() => {
                getTotalDocs(searchStr).then((totalResult) => {
                  getDocuments(searchStr, true).then((docResult) => {
                    console.log("Doc Result === ", docResult);
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
        }}
        actions={[
          {
            icon: 'update',
            tooltip: 'Password Reset',
            onClick: (event, rowData) => 
              new Promise((resolve, reject) => {
                console.log("RowData === ", rowData);
                const ResetFunc = Functions.httpsCallable('passwordReset');
                ResetFunc({
                  userId: rowData.userId,
                  name: rowData.first_name + ' ' + rowData.last_name
                }).then((result) => {
                  if (result.data && result.data.errorReason) {
                    alert(result.data.errorReason);
                    reject();
                  } else {
                    alert('Password Reset Email Sent!');
                    resolve();
                  }
                }).catch(error => {
                  console.log("Reset Function Call Error === ", error);
                  alert("Password Reset failed!");
                  reject();
                })
            })
          }
        ]}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              //https://us-central1-emma-prototype.cloudfunctions.net/createUser
              // Firestore.collection('users').add({
              //   ...newData,
              //   organization_id: docId,
              //   organization_name: orgName,
              //   home_base: homeBaseId,
              //   search_keys: getSearchWordsArray(newData.first_name.toLowerCase() + ' ' + newData.last_name.toLowerCase() +  ' ' + newData.email.toLowerCase() + ' ' + newData.phone_number)
              // }).then(() => {
              //   setSearchKey('');
              //   setData([]);
              //   setTotalDoc(0);
              //   setLastDoc(null);
              //   tableRef.current && tableRef.current.onQueryChange()
              //   resolve();
              // })
              // resolve();

              // axios.post('https://us-central1-emma-prototype.cloudfunctions.net/createUser', {
              //   ...newData,
              //   organization_id: docId,
              //   organization_name: orgName,
              //   home_base_id: homeBaseId,
              //   type: 'ipa',
              //   search_keys: getSearchWordsArray(newData.first_name.toLowerCase() + ' ' + newData.last_name.toLowerCase() +  ' ' + newData.email.toLowerCase() + ' ' + newData.phone_number)
              // }).then(res => {
              //   console.log("Res === ", res);
              //   if (res.status == 200) {
              //     resolve();
              //   }
              //   // if (res.status == 500 && res.message) {
              //   //   alert(err.message)
              //   // }
              // }).catch(error => {
              //   console.log("Res === ", error);
              // });

              const AddFunc = Functions.httpsCallable('createUser');
              AddFunc({
                first_name: newData.first_name ? newData.first_name : '',
                last_name: newData.last_name ? newData.last_name : '',
                email: newData.email ? newData.email : '',
                contact_number: newData.contact_number ? newData.contact_number : '',
                home_base_name: newData.home_base_name ? newData.home_base_name : '',
                organization_id: docId,
                organization_name: orgName,
                home_base: newData.home_base_name ? homeBaseId : null,
                type: 'ipa',
                search_keys: getSearchWordsArray(newData.first_name.toLowerCase() + ' ' + newData.last_name.toLowerCase() +  ' ' + newData.email.toLowerCase())
              }).then(result => {
                console.log("Function Result === ", result);
                if (result.data && result.data.errorReason) {
                  alert(result.data.errorReason);
                  reject()
                } else {
                  setSearchKey('');
                  setData([]);
                  setTotalDoc(0);
                  setLastDoc(null);
                  tableRef.current && tableRef.current.onQueryChange()
                  resolve();
                }
              }).catch(error => {
                console.log("Function Error == ", error);
                alert('User creation is failed!');
                reject();
              });
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              const dataUpdate = [...data];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData([...dataUpdate]);
              console.log("Data Update oldData === ", oldData, newData, homeBaseId);
              let updateObject = {}
              if (oldData.home_base_name != newData.home_base_name) {
                updateObject = {
                  first_name: newData.first_name ? newData.first_name : '',
                  last_name: newData.last_name ? newData.last_name : '',
                  contact_number: newData.contact_number ? newData.contact_number : '',
                  email: newData.email ? newData.email : '',
                  home_base: homeBaseId,
                  home_base_name: newData.home_base_name,
                  search_keys: getSearchWordsArray(newData.first_name.toLowerCase() + ' ' + newData.last_name.toLowerCase() +  ' ' + newData.email.toLowerCase())
                }
              } else {
                updateObject = {
                  first_name: newData.first_name,
                  last_name: newData.last_name,
                  contact_number: newData.contact_number ? newData.contact_number : '',
                  email: newData.email ? newData.email : '',
                  search_keys: getSearchWordsArray(newData.first_name.toLowerCase() + ' ' + newData.last_name.toLowerCase() +  ' ' + newData.email.toLowerCase())
                }
              }
              Firestore.collection('users').doc(oldData.docId)
              .update(updateObject).then(() => {
                console.log("Row Update Success === ");
                setSearchKey('');
                setData([]);
                setTotalDoc(0);
                setLastDoc(null);
                tableRef.current && tableRef.current.onQueryChange()
                resolve();
              })
              // resolve();
            }),
          onRowDelete: oldData =>
            new Promise((resolve, reject) => {
              //https://us-central1-emma-prototype.cloudfunctions.net/deleteUser
              // Firestore.collection('users').doc(oldData.docId).delete()
              // .then(() => {
              //   setSearchKey('');
              //   setData([]);
              //   setTotalDoc(0);
              //   setLastDoc(null);
              //   tableRef.current && tableRef.current.onQueryChange()
              //   resolve()
              // })
              // axios.post('https://us-central1-emma-prototype.cloudfunctions.net/deleteUser', {
              //   userId: oldData.docId,
              // }).then(res => {
              //   if (res.status == 200) {
              //     resolve();
              //   }
              // });

              const DeleteFunc = Functions.httpsCallable('deleteUser');
              DeleteFunc({userId: oldData.docId}).then(result => {
                console.log("Delete Function Result == ", result);
                setSearchKey('');
                setData([]);
                setTotalDoc(0);
                setLastDoc(null);
                tableRef.current && tableRef.current.onQueryChange()
                resolve()
              }).catch(error => {
                console.log("Function Error == ", error);
                alert('User Deletion is failed!');
                reject()
              })
            }),
        }}
      />
    </div>
  )
}

export default UserTable;
