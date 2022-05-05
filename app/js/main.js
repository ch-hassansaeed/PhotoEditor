import "../css/main.scss";
import ImageReader from "./service/imageReaderService";
import { readFromJsonFile } from "./service/jsonFileService";
import { BUTTONS } from "./constants";

const AppView = () => {
  /* set the canvas width 1440 and 960 to match 15” x 10” in size */
  document.body.innerHTML =
    ` 
    <h1>Photo Editor</h1>
    <div class="main-wrapper" id="main">
    <div id="editor-toolbar">
    <div class="image-action-buttons">
    <div class="move-actions-buttons">
    <div class='mt-1'>
    <button id="` +
    BUTTONS.UP +
    `">&#8593</button>
    </div>
    <div class='mt-1'>        
    <button id="` +
    BUTTONS.LEFT +
    `"> &#8592
    </button> 
    <button id="` +
    BUTTONS.RESET +
    `">&#x2715</button> 
    <button id="` +
    BUTTONS.RIGHT +
    `">&#8594
    </button>
    </div>
    <div class='mt-1'>
    <button id="` +
    BUTTONS.DOWN +
    `">&#8595
    </button>
    </div>
    </div> 
          
    <div class="action-scale-print">
                <div class="image-input-scaling">
                    <input type="range" name="size" min="10" max="200" class="image-scale" value="100">
                </div>
              
                <button id="` +
    BUTTONS.SAVE +
    `">Save as JSON File</button>   
                                                    
            <input type="file" id="` +
    BUTTONS.IMPORTFILE +
    `" value="Import" style="display:none"/>
            <button id="` +
    BUTTONS.IMPORT +
    `">Import from JSON File</button>
    </div>
        </div>
    </div> 
    <div class="file-selector>
        <form action="#">
            <fieldset>
                <label for="fileSelector" class="custom-file-upload">Choose an Image file: </label>
                <input type="file" id="fileSelector" />
            </fieldset>
        </form>
    </div>
    <div class="editor-canvas">
        <canvas id="editorCanvas" width="1440" height="960"></canvas>      
    <div id="info"></div>
    </div>
                                `;

  //bind the on change event handler after entire page loads
  window.onload = function () {
    //grab the DOM elements inside index.html
    const fileSelector = document.getElementById("fileSelector");
    const canvas = document.getElementById("editorCanvas");
    const toolbar = document.getElementById("editor-toolbar");
    const importButton = document.getElementById(BUTTONS.IMPORT);
    const jsonFileInput = document.getElementById(BUTTONS.IMPORTFILE);
    //changing onchange to addEventListener since we can attach multiple event listeners
    fileSelector.addEventListener("change", function () {
      //setting scale to default value
      document.querySelector(".image-scale").value = 100;
      new ImageReader(fileSelector, canvas, toolbar);
    });
    importButton.addEventListener("click", function () {
      document.getElementById(BUTTONS.IMPORTFILE).click();
    });
    jsonFileInput.addEventListener("change", function () {
      readFromJsonFile(jsonFileInput, canvas, toolbar, fileSelector);
    });
  };
};

AppView();
