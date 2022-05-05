"use strict";
import { JSON_FILE_NAME, JSON_FILE_FORMAT } from "../constants";
import ImageEditor from "./imageEditorService";

/**
 *Function to create or export the JSON file
 *Params: input data for json file passed as dataObj
 */
const createJSONFile = (dataObj) => {
  let data = JSON.stringify(dataObj, null, 2);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(
    new Blob([data], {
      type: "application/json",
    })
  );
  a.setAttribute("download", JSON_FILE_NAME);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
//read or import json file
const readFromJsonFile = (jsonFileInput, canvas, toolbar, fileSelector) => {
  const files = jsonFileInput.files;
  if (files.length <= 0 && files.type !== JSON_FILE_FORMAT) {
    return false;
  }
  try {
    const reader = new FileReader();
    reader.onload = function (e) {
      let jsonFile = JSON.parse(e.target.result);
      const {
        canvasdata: { photo: imageData },
      } = jsonFile;
      const imgObj = {};
      if (imageData) {
        const image = new Image();
        image.src = imageData.id;
        image.onload = function () {
          // grabbing the original dimensions from image
          imgObj.file = image;
          imgObj.src = image.src;
          imgObj.width = imageData.width;
          imgObj.height = imageData.height;
          imgObj.x = imageData.x;
          imgObj.y = imageData.y;
          imgObj.scale = imageData.scale;
          imgObj.ratio = imageData.ratio;
          document.querySelector(".image-scale").value = imgObj.scale;
          let imageEditor = new ImageEditor(
            imgObj,
            canvas,
            toolbar,
            fileSelector
          );
          imageEditor.initCanvas(true);
          //restore to the previous location
          imageEditor.moveImageUp();
          imageEditor.moveImageDown();
        };
      }
    };
    reader.readAsText(files[0]);
  } catch (error) {
    const message = "Cannot read file now. Please try again later.";
    document.getElementById(fileSelector.id).value = null;
    document.getElementById("info").innerHTML = message;
  }
};

export default createJSONFile;
export { readFromJsonFile };
