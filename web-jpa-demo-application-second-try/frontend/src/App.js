import React, { Component } from 'react';
import './css/App.css';
import Home from './js/Home';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import ParkingList from './js/parking/ParkingList';
import NewParkingForm from "./js/parking/ParkingCreate";
import EditParkingForm from "./js/parking/ParkingEdit";
import ParkingView from "./js/parking/ParkingView";
import UserList from "./js/user/UserList";
import UserView from "./js/user/UserView";
import EditUserForm from "./js/user/UserEdit";
import RegisterForm from "./js/basic_operations/Register";
import VehicleList from "./js/vehicle/VehicleList";
import VehicleView from "./js/vehicle/VehicleView";
import NewVehicleForm from "./js/vehicle/VehicleCreate";
import EditVehicleForm from "./js/vehicle/VehicleEdit";
import ParkingListVehicles from "./js/parking/ParkingListVehicles";
import UserListRequests from "./js/user/UserListRequests";
import UserListRides from "./js/user/UserListRides";
import RideView from "./js/ride/RideView";
import NewRequestForm from "./js/request/RequestCreate";
import LoginForm from "./js/basic_operations/Login";
import ResetPasswordForm from "./js/basic_operations/ResetPassword";
import RequestView from "./js/request/RequestView";
import EditRequestForm from "./js/request/RequestEdit";
import AdminDashboard from "./js/dashboard/AdminDashboard";
import VerifyEmail from "./js/basic_operations/VerifyEmail";
import VerifyEmailForm from "./js/basic_operations/VerifyEmail";
import SendResetPasswordCodeForm from "./js/basic_operations/SendResetPasswordCode";
import UserGeneralStatistic from "./js/user/UserGeneralStatistics";
import ParkingStatistics from "./js/parking/ParkingGeneralStatistics";
import VehicleStatistics from "./js/vehicle/VehicleGeneralStatistics";
import UserDashboard from "./js/dashboard/UserDashboard";
import ParkingAddVehicles from "./js/parking/ParkingAddVehicle.js";
import ParkingRemoveVehicles from "./js/parking/ParkingRemoveVehicle";
import Rebalancing from "./js/Rebalancing";
import RebalancingPage from "./js/Rebalancing";
import DepotVehicles from "./js/depot/DepotVehicle";
import DepotView from "./js/depot/DepotView";

const LogRouteChanges = () => {
  const history = useHistory();

  history.listen((location, action) => {
    console.log('Route changed:', location);
    console.log('Action:', action);
  });

  return null;
};

class App extends Component {
  render() {
    return (
        <Router>
          <LogRouteChanges /> {/* Add this component */}
          <Switch>
            <Route path='/' exact={true} component={Home}/>
            <Route path='/home' exact={true} component={Home}/>
            <Route path='/parking/create' exact={true} component={NewParkingForm}/>
            <Route
                  path='/parking/:id/edit'
                  exact={true}
                  render={(props) => (
                      <EditParkingForm {...props} parkingId={props.match.params.id} />
                  )}
            />
            <Route
                  path='/parking/:id'
                  exact={true}
                  render={(props) => (
                      <ParkingView {...props} parkingId={props.match.params.id} />
                  )}
            />
            <Route
              exact path='/parking/:id/vehicles'
              render={(props) => (
                  <ParkingListVehicles {...props} parkingId={props.match.params.id} />
              )}
            />
            <Route
                  exact path='/parking/:id/add-vehicles'
                  render={(props) => (
                      <ParkingAddVehicles {...props} parkingId={props.match.params.id} />
                  )}
            />
            <Route
                  exact path='/parking/:id/remove-vehicles'
                  render={(props) => (
                      <ParkingRemoveVehicles {...props} parkingId={props.match.params.id} />
                  )}
            />
            <Route path="/parking/statistics/general" exact={true} component={ParkingStatistics}/>
            <Route exact path="/parking" component={ParkingList} />
            <Route path='/user/:id/view'
                   exact={true}
                   render={(props) => (
                       <UserView {...props} userId={props.match.params.id} />
                   )}
            />
            <Route
                  exact path='/user/:id/request'
                  render={(props) => (
                      <UserListRequests {...props} userId={props.match.params.id} />
                  )}
            />
            <Route
                  exact path='/user/:id/ride'
                  render={(props) => (
                      <UserListRides {...props} userId={props.match.params.id} />
                  )}
            />
            <Route path='/user/:id/create-request'
                     exact={true}
                     render={(props) => (
                         <NewRequestForm {...props} userId={props.match.params.id} />
                     )}
            />
            <Route
                  path='/user/:id/edit'
                  exact={true}
                  render={(props) => (
                      <EditUserForm {...props} userId={props.match.params.id} />
                  )}
            />
            <Route
                  path='/user/:userId/request/:id/edit'
                  exact={true}
                  render={(props) => (
                      <EditRequestForm {...props} requestId={props.match.params.id} userId = {props.match.params.userId}/>
                  )}
            />
            <Route
                  path='/user/:userId/request/:id/view'
                  exact={true}
                  render={(props) => (
                      <RequestView{...props} requestId={props.match.params.id} userId = {props.match.params.userId}/>
                  )}
            />
            <Route
                  path='/user/:userId/ride/:id/view'
                  exact={true}
                  render={(props) => (
                      <RideView{...props} rideId={props.match.params.id} userId = {props.match.params.userId}/>
                  )}
            />
            <Route path="/user/general-statistics" exact={true} component={UserGeneralStatistic}/>
            <Route exact path="/user" component={UserList} />
            <Route path='/vehicle/create' exact={true} component={NewVehicleForm}/>
            <Route
                  path='/vehicle/:id'
                  exact={true}
                  render={(props) => (
                      <VehicleView {...props} vehicleId={props.match.params.id} />
                  )}
            />
            <Route
                  path='/vehicle/:id/edit'
                  exact={true}
                  render={(props) => (
                      <EditVehicleForm {...props} vehicleId={props.match.params.id} />
                  )}
            />
            <Route exact path="/vehicle" component={VehicleList} />
            <Route exact path="/vehicle/statistics/general" component={VehicleStatistics} />
            <Route
                  path='/ride/:id'
                  exact={true}
                  render={(props) => (
                      <RideView {...props} rideId={props.match.params.id} />
                  )}
            />
            {/*<Route
                  path='user/${userId}/request/${id}/view'
                  exact={true}
                  render={(props) => (
                      <RequestView {...props} requestId={props.match.params.id} />
                  )}
            />*/}
            <Route path='/register' exact={true} component={RegisterForm}/>
            <Route path='/login' exact={true} component={LoginForm} />
            <Route path='/send-reset-password-code' exact={true} component={SendResetPasswordCodeForm}/>
            <Route path='/reset-your-password' exact={true} component={ResetPasswordForm}/>
            <Route path='/admin-dashboard' exact={true} component={AdminDashboard}/>
            <Route path='/dashboard' exact={true} component={UserDashboard}/>
            <Route path='/verify-email' exact={true} component={VerifyEmailForm}/>
            <Route path='/rebalancing' exact={true} component={RebalancingPage}/>
            <Route path='/depot/vehicles' exact={true} component={DepotVehicles}/>
            <Route path='/depot/view' exact={true} component={DepotView}/>
          </Switch>
        </Router>
    );
  }
}

export default App;
