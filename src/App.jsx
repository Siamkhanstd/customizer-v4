import React, { useState, useEffect, useRef, startTransition } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls} from "@react-three/drei";
import * as THREE from "three";
import logo from "/Logo.jpeg";
import { FaCartPlus } from "react-icons/fa";

function Controls({ enabled }) {
  const controls = useRef();

  useFrame(() => {
    if (controls.current) {
      controls.current.enabled = enabled;
      controls.current.minPolarAngle = Math.PI / 2;
      controls.current.maxPolarAngle = Math.PI / 2;
      controls.current.minAzimuthAngle = -Math.PI / 2;
      controls.current.maxAzimuthAngle = Math.PI / 2;
    }
  });

  return <OrbitControls enableZoom={false} ref={controls} />;
}

function Room({ height, width, depth, selectedTexture, position, controlsEnabled }) {
  const texture = useLoader(THREE.TextureLoader, selectedTexture);

  useEffect(() => {
    if (texture) {
      texture.encoding = THREE.sRGBEncoding;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(width, height); // Set repeat values according to geometry size
      texture.needsUpdate = true;
    }
  }, [texture, width, height]);

  const materials = [
    new THREE.MeshBasicMaterial({ color: 'grey' }), // Left side
    new THREE.MeshBasicMaterial({ color: 'grey' }), // Right side
    new THREE.MeshBasicMaterial({ color: 'grey' }), // Top side
    new THREE.MeshBasicMaterial({ color: 'grey' }), // Bottom side
    new THREE.MeshBasicMaterial({ map: texture }),  // Front side
    new THREE.MeshBasicMaterial({ color: 'grey' })  // Back side
  ];

  return (
    <Canvas className="room">
      <Controls enabled={controlsEnabled} />
      <ambientLight intensity={1} />
      <directionalLight intensity={1} position={[5, 10, 7]} />
      
      {/* Wall which is going to be customized */}
      <mesh position={position} material={materials}>
        <boxGeometry args={[width, height, depth]} />
      </mesh>

      {/* Front facing wall */}
      <mesh position={[0, 0, -5]}>
        <boxGeometry args={[40, 50, 0.1]} />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 1]}>
        <planeGeometry args={[40, 100]} />
        <meshStandardMaterial color="grey" />
      </mesh>
    </Canvas>
  );
}

function App() {
  const [selectedTexture, setSelectedTexture] = useState(
    "https://images.pexels.com/photos/3312671/pexels-photo-3312671.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
  );
  const [height, setHeight] = useState(10);
  const [width, setWidth] = useState(10);
  const [depth, setDepth] = useState(0.5); // Add depth state
  const [position, setPosition] = useState([5, -2.5, -4.9]);
  const [controlsEnabled, setControlsEnabled] = useState(false); // Default to unchecked
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const images = {
    image1: "https://images.pexels.com/photos/3312671/pexels-photo-3312671.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    image2: "https://images.pexels.com/photos/3064258/pexels-photo-3064258.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    image3: "https://images.pexels.com/photos/3310691/pexels-photo-3310691.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    image4: "https://images.pexels.com/photos/310452/pexels-photo-310452.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    image5: "https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    image6: "https://images.pexels.com/photos/1509582/pexels-photo-1509582.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    image7: "https://images.pexels.com/photos/2259232/pexels-photo-2259232.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    image8: "https://images.pexels.com/photos/2387819/pexels-photo-2387819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    image9: "https://images.pexels.com/photos/4418713/pexels-photo-4418713.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
  };

  function toggleTextures() {
    document.getElementById("textures").classList.toggle("hidden");
    document.getElementById("toggle-textures").classList.toggle("sectionOpen");
    document.getElementById("toggle-sizePanel").classList.remove("sectionOpen");
    document.getElementById("toggle-positionPanel").classList.remove("sectionOpen");
    if (!document.getElementById("sizingPanel").classList.contains("hidden")) {
      document.getElementById("sizingPanel").classList.add("hidden");
    }
    if (!document.getElementById("positionPanel").classList.contains("hidden")) {
      document.getElementById("positionPanel").classList.add("hidden");
    }
  }

  function toggleSizingPanel() {
    document.getElementById("sizingPanel").classList.toggle("hidden");
    document.getElementById("toggle-sizePanel").classList.toggle("sectionOpen");
    document.getElementById("toggle-textures").classList.toggle("sectionOpen");
    document.getElementById("toggle-positionPanel").classList.remove("sectionOpen");
    if (!document.getElementById("textures").classList.contains("hidden")) {
      document.getElementById("textures").classList.add("hidden");
    }
    if (!document.getElementById("positionPanel").classList.contains("hidden")) {
      document.getElementById("positionPanel").classList.add("hidden");
    }
  }

  function togglePositionPanel() {
    document.getElementById("positionPanel").classList.toggle("hidden");
    document.getElementById("toggle-positionPanel").classList.toggle("sectionOpen");
    document.getElementById("toggle-sizePanel").classList.remove("sectionOpen");
    document.getElementById("toggle-textures").classList.remove("sectionOpen");
    if (!document.getElementById("textures").classList.contains("hidden")) {
      document.getElementById("textures").classList.add("hidden");
    }
    if (!document.getElementById("sizingPanel").classList.contains("hidden")) {
      document.getElementById("sizingPanel").classList.add("hidden");
    }
  }

  const move = (direction) => {
    setPosition((prevPosition) => {
      const newPosition = [...prevPosition];
      const floorY = -5; // Y position of the floor plane
      if (direction === "left") newPosition[0] -= 0.5;
      if (direction === "right") newPosition[0] += 0.5;
      if (direction === "up") newPosition[1] += 0.5;
      if (direction === "down") newPosition[1] = Math.max(newPosition[1] - 0.5, floorY + height / 2); // Ensure it doesn't go below the floor
      return newPosition;
    });
  };

  const updateHeight = (newHeight) => {
    setHeight(newHeight);
    setPosition((prevPosition) => {
      const floorY = -5; // Y position of the floor plane
      return [prevPosition[0], floorY + newHeight / 2, prevPosition[2]]; // Adjust y position to stick to the floor
    });
  };

  const calculateValuePosition = (value, min, max) => {
    const percent = ((value - min) / (max - min)) * 100;
    return `calc(${percent}% + (${8 - percent * 0.15}px))`;
  };

  return (
    <div className="app">
      <div className={`control-panel ${isLoaded ? "slide-in" : ""}`}>
        <div className="settings">
          <img src={logo} alt="Logo" className="logo" />
          <div className="toggles">
            <div className="toggle-container">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={controlsEnabled}
                  onChange={(e) => setControlsEnabled(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
              <span>View in 3D</span>
            </div>
            <button onClick={toggleSizingPanel} id="toggle-sizePanel" className="toggle-btn">
              Define wall sizes
            </button>
            <div id="sizingPanel" className="hidden">
              <div className="range-container">
                <label htmlFor="height">Height (ft) (between 0 and 10):</label>
                <input
                  type="range"
                  id="height"
                  name="height"
                  min="0"
                  max="15"
                  value={height}
                  onChange={(e) => updateHeight(e.target.value)}
                />
                <div
                  className="value"
                  style={{
                    left: calculateValuePosition(height, 0, 15),
                  }}
                >
                  {height}
                </div>
              </div>
              <div className="range-container">
                <label htmlFor="width">Width (ft) (between 0 and 15):</label>
                <input
                  type="range"
                  id="width"
                  name="width"
                  min="0"
                  max="15"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                />
                <div
                  className="value"
                  style={{
                    left: calculateValuePosition(width, 0, 15),
                  }}
                >
                  {width}
                </div>
              </div>
              <div className="range-container">
                <label htmlFor="depth">Thickness (ft) (between 0 and 2):</label>
                <input
                  type="range"
                  id="depth"
                  name="depth"
                  min="0"
                  max="2"
                  step="0.1"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                />
                <div
                  className="value"
                  style={{
                    left: calculateValuePosition(depth, 0, 2),
                  }}
                >
                  {depth}
                </div>
              </div>
            </div>
            <button onClick={togglePositionPanel} id="toggle-positionPanel" className="toggle-btn">
              Set Position
            </button>
            <div id="positionPanel" className="hidden">
              <div className="button-container">
                <button onClick={() => move("up")}>Up</button>
                <button onClick={() => move("down")}>Down</button>
                <button onClick={() => move("left")}>Left</button>
                <button onClick={() => move("right")}>Right</button>
              </div>
            </div>
            <button onClick={toggleTextures} id="toggle-textures" className="toggle-btn">
              Select textures
            </button>
            <div id="textures" className="image-gallery hidden">
              {Object.entries(images).map(([key, url]) => (
                <img
                  className="cp-texture"
                  key={key}
                  src={url}
                  alt={`Texture ${key}`}
                  onClick={() => startTransition(() => setSelectedTexture(url))}
                  width="300"
                  height="auto"
                  style={{ cursor: "pointer", margin: "10px" }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="pricing">
          <p className="offerText">Extended by three days - save up to 23% until 03.06.2024</p>
          <div className="price">
            <div className="totalPrice">500 USD</div>
            <div className="delivery">
              <span className="deliveryText">Free Delivery</span>
              <br />
              Delivery 5-8 days
              <br />
              <span className="vat">incl.VAT</span>
            </div>
            <div className="addToCart">
              <FaCartPlus />
              Add to Cart
            </div>
          </div>
        </div>
      </div>
      <Room height={height} width={width} depth={depth} selectedTexture={selectedTexture} position={position} controlsEnabled={controlsEnabled} />
    </div>
  );
}

export default App;
