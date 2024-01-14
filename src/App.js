import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfigForm from './ConfigForm';
import './styles/index.css';
import './styles/style.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";


function App() {

  const addKind = () => {
    setConfigItems(prevConfigItems => [
      ...prevConfigItems,
      { kind: "", settings: [{ setting: "", subSettings: [{ subSetting: "", value: "" }] }] }
    ]);
  };

  const [configItems, setConfigItems] = useState([{
    kind: "",
    settings: [
      {
        setting: "",
        subSettings: [
          { subSetting: "", value: "" }
        ]
      }
    ]
  }]);
  const [yamlOutput, setYamlOutput] = useState('');

  const handleConfigChange = (index, newConfig) => {
    const updatedConfigs = [...configItems];
    updatedConfigs[index] = newConfig;
    setConfigItems(updatedConfigs);
  };

  const downloadYAML = () => {
    let blob = new Blob([yamlOutput], { type: 'text/yaml' }); // directly use the state
    let a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'config.yaml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const otherFunction = () => {
    // Implement other button's functionality here
  };

  const handleDeployClick = async () => {
    try {
      const response = await axios.post("http://localhost:8080/generateYAML", configItems, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        setYamlOutput(response.data);
      } else {
        console.error("Failed to generate YAML");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [showHelp, setShowHelp] = useState(true); // Introduce the new state variable

  // Help Modal
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleButtonClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  document.addEventListener('keyup', function (event) {
    if ( event.keyCode == 27 )   {
       document.getElementById('overlay').remove()
    }
  })


  return (
  <div>
        {/* Top section */}
        <section class="topSection">
                <div class="container">
                    <div class="sueLogo">
                        <img class="my-auto" src={require('./img/sue-logo.png')} alt="Sue Logo gradient Sue type only"></img>
                    </div>
                    <div class="appTitle">
                        <h2>QUARTERMASTER</h2>
                    </div>
                    <a class="helpButton" onClick={handleButtonClick} href="#">
                        ?
                    </a>
                    

                </div>
            </section>

            {/* Help button modal */}

              {isDialogOpen && (
                <div class="overlay" onClick={handleDialogClose}>
                  <dialog class="helpModal" open={isDialogOpen} id="helpDialog">
                    <div class="modalTop">
                        <div class="title">Kubernetes Help</div>
                        <button onClick={handleDialogClose}>&#10006;</button>
                    </div>
                    <div class="modalBottom">
                        <iframe src="https://jamesdefabia.github.io/docs/user-guide/"></iframe>
                    </div>
                  </dialog>
                </div>
              )}


            {/* App */}
            <section class="app">
              <div class="container row">
                <div class="col-6 addKindSection ">
                    {configItems.map((config, index) => (
                        <ConfigForm
                            key={index}
                            index={index}
                            config={config}
                            onConfigChange={handleConfigChange}
                            addKind={addKind} 
                        />
                      ))}
                </div> 

                <div class="col-6 generate">
                  <div>

                      <div>
                        <div class="d-flex generateButtonDiv col-12">
                          <h2>Generated YAML</h2>

                        </div>
              
                          <textarea class="yamlOverview mb-3"
                              value={yamlOutput} 
                              rows="10" 
                              readOnly={true} 
                              style={{ width: '100%', marginTop: '15px' }}
                          />
                      </div>
                      <div class="col-12 d-flex generateButtons">
                        <div class="yamlButtons">
                          <button class="clickButton" onClick={handleDeployClick}>Generate YAML</button>
                          <button class="clickButton downloadYamlButton" onClick={downloadYAML}>Download YAML</button>
                        </div>

                        <div class="deployButtons">
                          <button class="clickButton " onClick={handleDeployClick}>Local Deploy</button>
                          <button class="clickButton remoteDeploy" onClick={handleDeployClick}>Remote Deploy</button>
                        </div>
                      </div>




                  </div>
                </div>

              </div>
 



            </section>

            
            {/* <script src={require('./js/modalHelp.js')}></script> */}
  </div>

);
}


export default App;