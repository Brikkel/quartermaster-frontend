import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import {setConfigItems, configItems} from './App';
import {showDiv} from './js/informationBox';
import addKind from './App';



function ConfigForm({ index, config = {}, onConfigChange, addKind }) {
  const [kinds, setKinds] = useState([]);
  const [availableSettings, setAvailableSettings] = useState([]);
  const [availableSubSettings, setAvailableSubSettings] = useState([]);
  const $hrefApi = "http://34.241.187.71:8080/v3";


    useEffect(() => {
      const fetchKinds = async () => {
        try {
          const response = await axios.get($hrefApi+"/kinds");
          setKinds(response.data);
        } catch (error) {
          console.error("Error fetching kinds:", error);
        }
      };
  
      fetchKinds();
    }, []);
  

  useEffect(() => {
    // Fetch settings when kind is selected
    if (config.kind) {
      axios.get(`http://localhost:8080/${config.kind}`)
        .then(response => {
          setAvailableSettings(response.data);
        })
        .catch(error => {
          console.error("Error fetching settings:", error);
        });
    }
  }, [config.kind]);

  const fetchSubSettings = (kind, setting) => {
    // Fetch subsettings when setting is chosen
    axios.get(`http://localhost:8080/${kind}/${setting}`)
      .then(response => {
        setAvailableSubSettings(response.data);
      })
      .catch(error => {
        console.error("Error fetching subsettings:", error);
      });
  };

  const handleAddSetting = () => {
    const newSettings = [...(config.settings || []), { setting: "", value: "", subSettings: [] }];
    onConfigChange(index, { ...config, settings: newSettings });
  };

  const handleAddSubSetting = (settingIndex) => {
    const newSubSettings = [
      ...(config.settings[settingIndex].subSettings || []),
      { subSetting: "", value: "" }
    ];
    const newSettings = [...config.settings];
    newSettings[settingIndex].subSettings = newSubSettings;
    onConfigChange(index, { ...config, settings: newSettings });
  };

  return (
    <div class="row mb-4">
      <div class="col-6">
        <div class="addKind d-flex">
          <h2>Add Kind</h2>
          <a class="buttonAddKind" href="#" onClick={() => addKind()}>&#43;</a>
        </div>
      </div>
      {/* Select Kind */}
      <div class="col-12 mt-4 d-flex">
        <select class="selectDropDown col-6"
          value={config.kind} 
          onChange={e => onConfigChange(index, { ...config, kind: e.target.value })}>
          <option value="">Select Kind</option>
          {kinds.map(ApiVersion => (
          ApiVersion.Kinds.map(Kind => (
            <option key={Kind.Name} value={Kind.Name}>
              {Kind.Name}
            </option>
          ))
        ))}

        </select>
        <div class="informationIcon" onClick={showDiv}>
            &#9432;
            <span class="informationBox" id="informationBox"><iframe src="https://kubernetes.io/docs/concepts/workloads/pods" frameBorder="0"></iframe></span>
        </div>
      </div>
    
    {/* Select Setting */}
      {(config.settings || []).map((setting, settingIndex) => (
        <div class="col-12 mt-4" key={settingIndex}>
          <select className="selectDropDown col-6"
            value={setting.setting} 
            onChange={e => {
              const newConfig = { ...config };
              newConfig.settings[settingIndex].setting = e.target.value;
              onConfigChange(index, newConfig);
              fetchSubSettings(config.kind, e.target.value);
            }}>
            <option value="">Select Setting</option>
            {availableSettings.map(s => <option key={s} value={s}>{s}</option>)}
            
          </select>



          

          {/* Name Kind */}
          <div class="col-12 mt-4">
            <input class="col-6"
                type="text" 
                placeholder="Value for setting "
                value={setting.value || ""} 
                onChange={e => {
                    const newConfig = { ...config };
                    newConfig.settings[settingIndex].value = e.target.value;
                    onConfigChange(index, newConfig);
                }} 
            />
          </div>

          {/* Select SubSetting */}
          {(setting.subSettings || []).map((subSetting, subSettingIndex) => (
            <div class="col-12 mt-4" key={subSettingIndex}>
              <select className="selectDropDown col-5 offset-1"
                value={subSetting.subSetting} 
                onChange={e => {
                  const newConfig = { ...config };
                  newConfig.settings[settingIndex].subSettings[subSettingIndex].subSetting = e.target.value;
                  onConfigChange(index, newConfig);
                }}>
                <option  value="">Select SubSetting</option>
                {availableSubSettings.map(ss => <option key={ss} value={ss}>{ss}</option>)}
              </select>

            {/* Value for subsetting */}
            <div class="col-12 mt-4">
              <input class="col-5 offset-1"
                type="text" 
                placeholder="Value for subsetting"
                value={subSetting.value} 
                onChange={e => {
                  const newConfig = { ...config };
                  newConfig.settings[settingIndex].subSettings[subSettingIndex].value = e.target.value;
                  onConfigChange(index, newConfig);
                }} />
            </div>
         


    </div>
            
            
          ))}
          <div class="addButtons col-6">
            <button className="clickButton buttonAddSubsetting" onClick={() => handleAddSubSetting(settingIndex)}>Add Subsetting</button>
            <button className="clickButton buttonAddSetting" onClick={handleAddSetting}>Add Setting</button><br></br>
          </div>

      </div>
    ))}


    
    </div>
  );
  // End of return
}


export default ConfigForm;
