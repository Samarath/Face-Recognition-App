import React from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
import Signin from './Components/SignIn/singin'
import Register from './Components/Register/Register'
import Rank from './Components/Rank/Rank'
import './App.css';

const app = new Clarifai.App({
  apiKey: '24706fc619724752b6498fcdd0689d05'
})

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

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedin: false
    }
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
    console.log(box);
    this.setState({box: box})
  }


  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})

    app.models
    .predict(
     Clarifai.FACE_DETECT_MODEL,
        // URL
        this.state.input
    )
    .then(response => {
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
          <Rank />
          <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
         />
         <FaceRecognition imageUrl={this.state.imageUrl} box={this.state.box}/>
      </div>
      : (
        this.state.route === 'signin'
        ?
        <Signin onRouteChange={this.onRouteChange}/> 
        :
        <Register onRouteChange={this.onRouteChange}/>
      )
    }
      </div>
    )
  }
  
}

export default App;
