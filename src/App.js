import React, { useState } from "react";
import "./App.css";
import Particles from "react-particles-js";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

function App() {
  const [input, setInput] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [route, setRoute] = useState("signin");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });

  const initialState = () => {
    setInput("");
    setImageURL("");
    setBoxes([]);
    setRoute("signin");
    setIsSignedIn(false);
    setUser({
      id: "",
      name: "",
      email: "",
      entries: 0,
      joined: "",
    });
  };

  const calculateFaceLocation = (data) => {
    const faces = data.outputs[0].data.regions;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);

    const clarifaiFaces = faces.map((face) => {
      return {
        leftCol: face.region_info.bounding_box.left_col * width,
        topRow: face.region_info.bounding_box.top_row * height,
        rightCol: width - face.region_info.bounding_box.right_col * width,
        bottomRow: height - face.region_info.bounding_box.bottom_row * height,
      };
    });

    return clarifaiFaces;
  };

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  const displayFaceBox = (boxes) => {
    setBoxes(boxes);
  };

  const onInputChange = (event) => {
    setInput(event.target.value);
  };

  const onPictureSubmit = () => {
    setImageURL(input);

    fetch("https://blooming-beyond-31498.herokuapp.com/imageurl", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: input,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        fetch("https://blooming-beyond-31498.herokuapp.com/image", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: user.id,
          }),
        })
          .then((response) => response.json())
          .then((count) => {
            setUser({ ...user, entries: count });
          })
          .catch(console.log);

        displayFaceBox(calculateFaceLocation(response));
      })
      .catch((err) => console.log(err));
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setIsSignedIn(initialState);
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  return (
    <div className="App">
      <Particles className="particles" params={{ particlesOptions }} />

      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onPictureSubmit={onPictureSubmit}
          />
          <FaceRecognition boxes={boxes} imageURL={imageURL} />
        </div>
      ) : route === "signin" ? (
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
