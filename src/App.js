import React from 'react';
import Particles from 'react-particles-js';
import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
import Signin from './Components/SignIn/singin'
import Register from './Components/Register/Register'
import Rank from './Components/Rank/Rank'
import './App.css';

const params = {
  particles: {
    line_linked: {
      shadow: {
        enable: true,
        color: "#3CA9D1",
        blur: 5
      }
    }
  }
}

// const intialState = {
  
// }

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedin: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = image.width;
    const height = image.height;
    return{
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  diplayFaceBox = (box) => {
    this.setState({box: box})
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    fetch('https://warm-fjord-23432.herokuapp.com/imageurl', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            input: this.state.input
          })
        })
       .then(repsonse => repsonse.json()) 
    .then(response => {
      if(response) {
        fetch('https://warm-fjord-23432.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, {entries: count}));
        })
      }
       return  this.diplayFaceBox(this.calculateFaceLocation(response));
      },
        function(err) {console.log(err)}
    );
  }

  onRouteChange = (route) => {
    if(route === 'signout'){
      this.setState({isSignedin: false})
    }else if(route === 'home'){
      this.setState({isSignedin: true})
    }
    this.setState({route: route});
  }

  render(){
    return (
      <div className="App">
        <Particles params={params} className='paritcles'/>
        <Navigation onRouteChange={this.onRouteChange} isSignedin={this.state.isSignedin}/>
        {this.state.route === 'home'?
      <div>
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
         />
         <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
      </div>
      : (
        this.state.route === 'signin'
        ?
        <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        :
        <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      )
    }
      </div>
    )
  }
  
}

export default App;
