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

const tableIcons = {
  Add: (props, ref) => <div className="empty-div"></div>,
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

function DetailTable(props) {
  const { useState, useEffect } = React;
  const docId = props.docId;
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
      validate: rowData => validateEmail(rowData.contact_email) ? '' : 'Invalid Email'
    },
  ]);

  return (
    <div className="">
      <MaterialTable
        title="Operator Detail"
        icons={tableIcons}
        columns={columns}
        // components={{
        //     Toolbar: props => (
        //       <div className="MuiToolbar-root MuiToolbar-regular MTableToolbar-root-157 MuiToolbar-gutters">
        //         <div className="MTableToolbar-title-161">
        //             <h6 className="MuiTypography-root MuiTypography-h6">Operator Detail</h6>
        //         </div>
        //       </div>
        //     ),
        // }}
        data={query =>
            new Promise((resolve, reject) => {
                Firestore.collection('organizations')
                .doc(docId)
                .get().then(doc => {
                    let result = [];
                    let docData = { ...doc.data(), docId: doc.id};
                    result.push(docData)
                    resolve({
                        data: result,
                        page: 0,
                        totalCount: 1
                    });
                });
            })
        }
        options={{
          sorting: false,
          draggable: false,
          paging: false,
          search: false,
          padding: "dense",
        }}
        
        onSearchChange={(searchText) => {
          console.log("Search Key Change === ", searchText);
        }}
        editable={{
          onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
              
            //   const dataUpdate = [...data];
            //   const index = oldData.tableData.id;
            //   dataUpdate[index] = newData;
            //   setData([...dataUpdate]);
            //   console.log("Data Update oldData === ", oldData, newData);
              Firestore.collection('organizations').doc(oldData.docId)
              .update({
                name: newData.name,
                address: newData.address ? newData.address : '',
                contact_email: newData.contact_email ? newData.contact_email : '',
                organization_type: '1',
                search_keys: getSearchWordsArray(newData.name)
              }).then(() => {
                console.log("Row Update Success === ");
                // setSearchKey('');
                // setData([]);
                // setTotalDoc(0);
                // setLastDoc(null);
                // tableRef.current && tableRef.current.onQueryChange()
                resolve();
              })
            }),
        }}
      />
    </div>
  )
}

export default DetailTable;
