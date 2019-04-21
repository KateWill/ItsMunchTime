import React, { Fragment, Component } from 'react';
import { AuthConsumer, } from '../../providers/AuthProvider';
import { Form, Grid, Image, Container, Header, Button, Segment, Divider } from 'semantic-ui-react';
// import Dropzone from 'react-dropzone';
import axios from 'axios';
import UserProfile from './UserProfile';
import OrderHistory from '../orders/OrderHistory';

const defaultImage = 'https://d30y9cdsu7xlg0.cloudfront.net/png/15724-200.png';

class Profiles extends Component {
  state = { users: [] };

  componentDidMount() {
    axios.get('/api/users')
       .then( res => {
         this.setState({ users: res.data })
       })
      .catch( err => {
        console.log(err)
      })
  }
  
  render() {
    const { users, } = this.state
    const user_count = users.length
    return (
        <div>
          <Header as='h1'>All Users</Header>
          <Header as='h2'>Viewing {user_count} users </Header>
          {
            users.map( (u, i) => {
            return(
              <>
                <br />
                <br />
                <UserProfile
                  key={u.id}
                  {...u}
                  {...this.state.users}
                />
                <OrderHistory userId = {u.id}/>
                <Divider />
              </>
              )
            })
          }
    
        </div>
    )
  }
}
 export default Profiles