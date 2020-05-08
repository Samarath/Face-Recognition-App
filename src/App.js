import React from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './Components/Navigation/Navigation'
import Logo from './Components/Logo/Logo'
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'
import FaceRecognition from './Components/FaceRecognition/FaceRecognition'
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
      imageUrl: ''
    }
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
    .then(function(response) {
        // do something with responseconsole.log(response);
        console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
        },
        function(err) {console.log(err)}
    );
  }

  render(){
    return (
      <div className="App">
        <Particles params={params} className='paritcles'/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange}
          onButtonSubmit={this.onButtonSubmit}
         />
      <FaceRecognition imageUrl={this.state.imageUrl}/>
      </div>
    )
  }
  
}

export default App;
