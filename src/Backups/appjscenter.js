 
    {/* <center>



            <h1>QuarterMaster For K8S</h1>
            <left>
            <button className="btn btn__secondary"
                onClick={() => setShowHelp(!showHelp)} 
                style={{ marginBottom: '10px' }}
            >
              
                {showHelp ? "Close Help" : "Show Help"} {/* Toggle button text based on showHelp value */}
            </button>
            </left>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1400px', margin: 'auto' }}>
                
                {/* iframe - Conditionally rendered */}
                {showHelp && (
                    <iframe 
                        title="Kubernetes Docs"
                        src="https://kubernetes.io/docs/reference/kubernetes-api/_print/" 
                        width="40%" 
                        height="600px" 
                        style={{ border: '1px solid #ddd', flexShrink: 0 }}
                    />
                )}
                
                {/* Main Content */}
                <div className="App" style={{ width: '30%', marginLeft: '10px', marginRight: '10px' }}>
                    {configItems.map((config, index) => (
                        <ConfigForm
                            key={index}
                            index={index}
                            config={config}
                            onConfigChange={handleConfigChange}
                        />
                    ))}
                </div>

                {/* Buttons */}
                <div style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <button className="btn btn__primary" onClick={() => setConfigItems([...configItems, { kind: "", settings: [{ setting: "", subSettings: [{ subSetting: "", value: "" }] }] }])}>Add Kind</button>
                    <button className="btn btn__primary" onClick={handleDeployClick} style={{ marginTop: '10px' }}>Generate</button>
                    <div style={{ marginTop: '20px' }}>
                        <h3>Generated YAML:</h3>
                        <textarea 
                            value={yamlOutput} 
                            rows="10" 
                            readOnly={true} 
                            style={{ width: '100%', marginTop: '15px' }}
                        />
                    </div>
                    <button className="btn btn__primary" onClick={downloadYAML} style={{ marginTop: '15px' }}>Download YAML</button>
                </div>
            </div>
      </center> 