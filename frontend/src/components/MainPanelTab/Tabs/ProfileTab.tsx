import { Container, Typography } from '@material-ui/core'
import React from 'react'
import { v4 as uuidv4 } from 'uuid';
import './Profile.css'

export const ProfileTab: React.FC = () => {

    const initialList = [
        { 
          id: 'a',
          image: "https://www.wonderwall.com/wp-content/uploads/sites/2/2021/04/4235381f.jpg?w=700",
          name: 'Anthony Peters',
          attributes:{
            'Age': 31,
            'Height': '5\'11\"',
            'Weight': '150 pounds',
            'Build': 'Slender',
            'Occupation': 'Stock Broker',
            'Scars and Marks': 'Right Shoulder',
            'Eyes': 'Hazel',
            'Complexion': 'Pale',
            'Race': 'Caucasian',
            'Nationality': 'American',
          },
          criminalrecord: 'Previous arrests for money laundering, insider trading.',
        },
    ];

    const listReducer = (state, action) => {
      switch (action.type) {
        case 'ADD_ITEM':
          return {
            ...state,
            list: state.list.concat({ name: action.name, id: action.id }),
          }
        default:
          throw new Error();
      }
    }

    const [listData, dispatchListData] = React.useReducer(listReducer, {
      list: initialList,
      isShowList: true,
    });

    const [name, setName] = React.useState('');

    function handleChange(event) {
      setName(event.target.value);
    }

    function handleAdd() {
      dispatchListData({type: 'ADD_ITEM', name, id: uuidv4() });
      setName('');
    }

    const AddItem = ({ name, onChange, onAdd}) => (
      <div>
        <input type="text" value={name} onChange={onChange} />
        <button type="button" onClick={onAdd}> Add </button>
      </div>
    )

    const List = ({ list }) => (
      <ul>
        {list.map((item) => (
          <li
            key={item.id}
            //style={{ height: '500px', border: '1px solid black'}}
            //style={{ height: '500em', width: '250em'}}
          >
            <div><strong><h3>NAME: {item.name}</h3></strong></div>
            <div className="profile-content" >
              <img className="profile-image" src={item.image}/>
              <div className="profile-attributes">
                {Object.keys(item.attributes).map(key => 
                  <div className="profile-attribute">
                    <div className="attribute-key">{key}:</div> <div>{item.attributes[key]}</div>
                  </div>
                )}
              </div>
            </div>
            <div><p><strong><h3>Criminal Record</h3></strong></p>{item.criminalrecord}</div>
            <div><u>See Details</u></div>
          </li>
        ))}
      </ul>
    )

    return (
        <>
            <div>
            {listData.isShowList && <List list={listData.list} />}
              <AddItem
                name={name}
                onChange={handleChange}
                onAdd={handleAdd}
              />
            </div>
        </>
    );
}

