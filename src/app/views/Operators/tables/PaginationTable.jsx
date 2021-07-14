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
import { Firestore, Auth } from '../../../services/firebase/firebaseAuthService';
import { withRouter } from 'react-router-dom';

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

const Editable = (props) => {
  const { useState, useEffect } = React;

  const tableRef = React.createRef();

  const [columns, setColumns] = useState([
    { 
      title: 'Name', field: 'name',
      validate: rowData => rowData.name && rowData.name.length > 2 ? '' : 'Name must have over 3 chars'
    },
    { title: 'Address', field: 'address',
      cellStyle: {
        textAlign: 'left',
      },
      headerStyle: {
        textAlign: 'left',
      }
    },
    {
      title: 'Contact Email',
      field: 'contact_email',
      // validate: rowData => rowData.contact_email != '' && validateEmail(rowData.contact_email) ? '' : 'Invalid Email'
      validate: rowData => {
        if (!rowData.contact_email || (rowData.contact_email && rowData.contact_email != '' && validateEmail(rowData.contact_email))) {
          return ''
        } else {
          return 'Invalid Email'
        }
      }
    },
  ]);

  const [data, setData] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [totalDoc, setTotalDoc] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [pageNum, setPageNum] = useState(0);

  useEffect(() => {
    // Update the document title using the browser API
    // getTotalDocs();
    // getDocuments();
  });

  const getTotalDocs = (search = '') => {
    if (search == '') {
      return new Promise((resolve, reject) => {
        Firestore.collection('organizations').where('organization_type', '==', '1').get().then(docs=> {
          
          setTotalDoc(docs.size);
          resolve(docs.size);
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        Firestore.collection('organizations')
        .where('organization_type', '==', '1')
        .where('search_keys', 'array-contains', search.toLowerCase())
        .get().then(docs=> {
          setTotalDoc(docs.size);
          console.log("Total Size === ", searchKey, docs.size);
          resolve(docs.size);
        });
      });
    }
  }

  const getDocuments = (search = '', init = false) => {
    if (search == '') {
      if (lastDoc == null || init == true) {
        return new Promise((resolve, reject) => {
          Firestore.collection('organizations')
          .where('organization_type', '==', '1')
          .orderBy('name', 'asc')
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
          Firestore.collection('organizations')
          .where('organization_type', '==', '1')
          .orderBy('name', 'asc')
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
          Firestore.collection('organizations')
          .where('organization_type', '==', '1')
          .where('search_keys', 'array-contains', search.toLowerCase())
          .orderBy('name', 'asc')
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
          Firestore.collection('organizations')
          .where('organization_type', '==', '1')
          .where('search_keys', 'array-contains', search.toLowerCase())
          .orderBy('name', 'asc')
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

  const navigateDetailPage = (docId) => {
    props.history.push(`/operatorDetail/${docId}`, {docId: docId});
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
        title="Operators"
        icons={tableIcons}
        columns={columns}
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
        onSearchChange={(searchText) => {
          console.log("Search Key Change === ", searchText);
        }}
        editable={{
          onRowAdd: newData =>
            new Promise((resolve, reject) => {
              Firestore.collection('organizations').add({
                ...newData,
                organization_type: '1',
                search_keys: getSearchWordsArray(newData.name.toLowerCase())
              }).then(() => {
                setSearchKey('');
                setData([]);
                setTotalDoc(0);
                setLastDoc(null);
                tableRef.current && tableRef.current.onQueryChange()
                resolve();
              })
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              
              const dataUpdate = [...data];
              const index = oldData.tableData.id;
              dataUpdate[index] = newData;
              setData([...dataUpdate]);
              Firestore.collection('organizations').doc(oldData.docId)
              .update({
                name: newData.name,
                address: newData.address ? newData.address : '',
                contact_email: newData.contact_email ? newData.contact_email : '',
                organization_type: '1',
                search_keys: getSearchWordsArray(newData.name.toLowerCase())
              }).then(() => {
                console.log("Row Update Success === ");
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
              // const dataDelete = [...data];
              // const index = oldData.tableData.id;
              // dataDelete.splice(index, 1);
              // setData([...dataDelete]);              
              Firestore.collection('organizations').doc(oldData.docId).delete()
              .then(() => {
                // Update This orgnization's users
                Firestore.collection('users').where('organization_id','==', oldData.docId).get().then(docs => {
                  if (!docs.empty) {
                    docs.forEach(doc => {
                      Firestore.collection('users').doc(doc.id).update({
                        organization_id: '',
                        organization_name: ''
                      })
                    })
                  }
                })
                // Update This orgnization's aircraft
                Firestore.collection('aircrafts').where('organization_id','==', oldData.docId).get().then(docs => {
                  if (!docs.empty) {
                    docs.forEach(doc => {
                      Firestore.collection('aircrafts').doc(doc.id).update({
                        organization_id: '',
                      })
                    })
                  }
                })
                setSearchKey('');
                setData([]);
                setTotalDoc(0);
                setLastDoc(null);
                tableRef.current && tableRef.current.onQueryChange()
                resolve()
              })
            }),
        }}
        onRowClick={(event, rowData) => {
          console.log("Row Click === ", rowData);
          navigateDetailPage(rowData.docId);
        }}
      />
    </div>
  )
}

export default withRouter(Editable);
