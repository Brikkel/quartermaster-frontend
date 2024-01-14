import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import {setConfigItems, configItems} from './App';
import { showDiv } from './js/informationBox';
import addKind from './App';


function ConfigForm({ index, config = {}, onConfigChange, addKind }) {
  const [kinds, setKinds] = useState([]);
  const [selectedKind, setSelectedKind] = useState("");
  const $hrefApi = "http://34.241.187.71:8080/v3";

  const [availableSettings, setAvailableSettings] = useState([]);
  const [availableParameters, setAvailableParameters] = useState([]);

  const [availableSubSettings, setAvailableSubSettings] = useState([]);
  const [availableSubParameters, setAvailableSubParameters] = useState([]);


  useEffect(() => {
    const fetchKinds = async () => {
      try {
        const response = await axios.get($hrefApi + "/kinds");
        setKinds(response.data);
      } catch (error) {
        console.error("Error fetching kinds:", error);
      }
    };

    fetchKinds();
  }, []);

  const fetchParameters = async (versionPath, resourceName) => {
    try {
      const response = await axios.get($hrefApi + `/parameters/${versionPath}/${resourceName}`);
      setAvailableParameters(response.data);
    } catch (error) {
      console.error("Error fetching parameters:", error);
    }
  };

  useEffect(() => {
    console.log("Available Parameters beer!:", availableParameters);
  }, [availableParameters]);




  const handleKindSelection = async (selectedKind) => {
    const selectedApiVersion = kinds.find(apiVersion =>
      apiVersion.Kinds.some(kind => kind.Name === selectedKind)
    );
    

    if (selectedApiVersion) {
      const selectedKindDetails = selectedApiVersion.Kinds.find(kind => kind.Name === selectedKind);

      setSelectedKind(selectedKind);
      const encodedApiVersionPath = encodeURIComponent(`/openapi/v3/${selectedApiVersion.ApiVersionPath}`);

      onConfigChange(index, { ...config, kind: selectedKind });

      console.log('Encoded API Version Path:', encodedApiVersionPath);
      console.log('ResourceName:', selectedKindDetails.ResourceName);


      // Fetch parameters for the selected kind
      await fetchParameters(encodedApiVersionPath, selectedKindDetails.ResourceName);
    }
  };

  useEffect(() => {
    // When parameters are updated, extract the Names and set them as available settings
    if (availableParameters && availableParameters.Parameters) {
      const parameterNames = availableParameters.Parameters.map(parameter => parameter.name);
      setAvailableSettings(parameterNames);

      console.log("Available Settings:", parameterNames);
    }
  }, [availableParameters]);

  const handleAddSetting = () => {
    const newSettings = [
      ...(config.settings || []),
      { setting: "", value: "", subSettings: [] }
    ];
    onConfigChange(index, { ...config, settings: newSettings });
  };

  const handleSettingSelection = async (settingIndex, selectedSetting) => {
    const newConfig = { ...config };
    newConfig.settings[settingIndex].setting = selectedSetting;
    onConfigChange(index, newConfig);

    // Check if the selected setting has a resourceReference
    const selectedParameter = availableParameters.Parameters.find(
      (parameter) => parameter.name === selectedSetting
    );

    if (selectedParameter && selectedParameter.resourceReference) {
      try {
        const selectedApiVersion = kinds.find(apiVersion =>
          apiVersion.Kinds.some(kind => kind.Name === selectedKind)
        );

        // Make a call to fetch subsettings using the resourceReference
        const encodedApiVersionPath = encodeURIComponent(`/openapi/v3/${selectedApiVersion.ApiVersionPath}`);
        const response = await axios.get($hrefApi + `/parameters/${encodedApiVersionPath}/${selectedParameter.resourceReference}`);
        
        console.log("Response subParameters:", response.data);
        setAvailableSubParameters(response.data)
      } catch (error) {
        console.error("Error fetching subsettings:", error);
      }
    }
  };

  useEffect(() => {
    // When parameters are updated, extract the Names and set them as available settings
    if (availableSubParameters && availableSubParameters.Parameters) {
      const subParameterNames = availableSubParameters.Parameters.map(parameter => parameter.name);
      setAvailableSubSettings(subParameterNames);

      console.log("Available Sub Settings:", subParameterNames);
    }
  }, [availableSubParameters]);


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
        <select className="selectDropDown col-6"
          value={selectedKind}
          onChange={e => handleKindSelection(e.target.value)}>
          <option value="">Select Kind</option>
          {kinds
            .flatMap(ApiVersion => ApiVersion.Kinds)
            .sort((a, b) => a.Name.localeCompare(b.Name))
            .map(Kind => (
              <option
                key={Kind.Name}
                value={Kind.Name}
                title={Kind.Description}
              >
                {Kind.Name}
              </option>
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
            onChange={e => handleSettingSelection(settingIndex, e.target.value)}>
            <option value="">Select Setting</option>
            {availableSettings.map((availableSetting) => {
              // Find the corresponding parameter object
              const parameter = availableParameters.Parameters.find(
                (param) => param.name === availableSetting
              );

              // Use optional chaining to handle cases where parameter is not found
              const description = parameter?.description || '';

              return (
                <option key={availableSetting} value={availableSetting} title={description}>
                  {availableSetting}
                </option>
              );
            })}
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
                <option value="">Select SubSetting</option>
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
