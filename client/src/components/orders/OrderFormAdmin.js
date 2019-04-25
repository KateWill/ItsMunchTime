import React, { Component } from 'react';
import { Form, Button, Icon, Container} from "semantic-ui-react";
import { AuthConsumer, } from "../../providers/AuthProvider";
import axios from 'axios';
import './orderFormAdmin.css'

class OrderFormAdin extends Component {

  state = {
    current: true,
    orderDate: '',
    ticket: '',
    restaurants: [],
    restaurantData: [],
    restaurant: '',
    r_id: '',
    current_exists: '',
    current_rest: '',
    current_order_date: '',
    users_not_included: [],
    usersOptions: [],
    added_user: ''
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { auth: { restaurant, } } = this.props
    if (restaurant !== null) {
      alert('Order in Progress')
    } else {
      const { current, orderDate, ticket, r_id  } = this.state
      const order_date = orderDate
      const restaurant_id = r_id

      axios.post('/api/orders', { current, order_date, ticket, restaurant_id })
        .then(res => {
          this.props.history.push("/")
          alert("Order has been created successfully");
        })
        .catch(err => {
          console.log(err);
        })
      this.setState({ orderDate: '', restaurant: '', restaurants: [], restaurantData: [], r_id: '', current_exists: ''})
    }
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value, });
  }

  handleSelect = (e, data) => {

    this.setState({ restaurant: data.value, r_id: data.key });
    this.state.restaurantData.map(rd => {
      if (rd.value === data.value)
        this.setState({ r_id: rd.key })
    })
  }

  check_order_exists() {
    axios.get('api/check_current_order')
      .then(res => {
        if (res.data.length == 0)
          this.setState({ current_exists: false, current_rest: '', current_order_date: '', })
        else
          this.setState({ current_exists: true, current_rest: res.data[0].rest_name, current_order_date: res.data[0].order_date })
      })
  }

  componentDidMount() {
    this.check_order_exists();
    axios.get('/api/restaurants')
      .then(res => {
        this.setState({ restaurants: res.data })
        const { restaurants, restaurantData } = this.state
        restaurants.map(r => {
          var temp = restaurantData;
          temp.push({ key: r.id, text: r.name, value: r.name })
          this.setState({ restaurantData: temp })
        })
      })
      .catch(err => {
        console.log(err)
      });
      this.getPeopleNotInOrder()
  }

  getPeopleNotInOrder() {
    axios.get('api/users_not_in_order')
      .then(res=> {
      this.setState({users_not_included: res.data})
      const { users_not_included, usersOptions } = this.state
      users_not_included.map(u => {
        var temp = usersOptions;
        temp.push({ key: u.id, text: u.first_name + ' ' + u.last_name, value: u.id })
        this.setState({ usersOptions: temp })
        })
      })
  }

  addPersonToOrder = (e) => {
    e.preventDefault();
    axios.post('api/add_person_to_order', {params: {user_id: this.state.added_user}})
      .then(res => {
        if (res.data.length != 0)
        alert("User has been added to order");
        this.setState({ added_user: '', usersOptions: [], users_not_included: []})
        this.componentDidMount() 
      })
  }

  deleteOrder() {
    axios.delete('/api/delete_orders')
    .then(res => {
      alert(res.data.message)
      window.location.reload()
      this.setState({ orderDate: '', restaurant: '', restaurants: [], restaurantData: [], r_id: '', current_exists: ''})
    })
    .catch( err => {
      alert(err.response.data.message)
    })
  }

  render() {

    const { 
      restaurantData, 
      orderDate, 
      restaurant, 
      current_exists,
      current_rest,
      current_order_date,
      added_user,
      usersOptions
      } = this.state

    if (current_exists == false) {
      return (
        
        <>
          <br />
          <Form onSubmit={this.handleSubmit}>
            <Form.Group widths="equal">
              <Form.Dropdown
                label='Select Restaurant'
                placeholder="Restaurants"
                required
                fluid
                search
                selection
                name='restaurant'
                value={restaurant}
                options={restaurantData}
                onChange={this.handleSelect}
              />
              <Form.Input
                label="Order Date"
                name="orderDate"
                type="date"
                onChange={this.handleChange}
                value={orderDate}
                required
              />
              <Form.Button color="blue">Create Order</Form.Button>
            </Form.Group>
          </Form>
          <br />
        </>
      )
    } else {
      return (
        <>
        <Container style={{padding: '40px' }}>
          <p>Order currently in progress, please archive order to set new resturant.</p>
          <h1>Current Order: </h1>
          <p>Restaurant: {current_rest}</p>
          <p>Order Date: {current_order_date}</p>
          <Button
            icon
            color="red"
            size="medium"
            style={{ marginBottom: "15px", }}
            onClick = {() => this.deleteOrder()}
          >
            Delete  <Icon name="trash" />
          </Button>
        </Container>

          <Form onSubmit={this.addPersonToOrder}>
            <Form.Group id="add-user" widths="equal">
              <Form.Dropdown
                label='Select User To Add'
                placeholder="Users"
                required
                fluid
                search
                selection
                name='added_user'
                value={added_user}
                options={usersOptions}
                onChange={this.handleChange}
              />
            <Form.Button color="green">Add User</Form.Button>
            </Form.Group>
          </Form>
        </>
      )
    }
  }
}

export class ConnectedOrderFormAdin extends React.Component {
  render() {
    return (
      <AuthConsumer>
        {auth =>
          <OrderFormAdin {...this.props} auth={auth} />
        }
      </AuthConsumer>
    )
  }
}

export default ConnectedOrderFormAdin;
