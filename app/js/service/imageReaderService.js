/**
 * Function to read the image from file system
 * using the file input's id
 *
 **/
import ImageEditor from "./imageEditorService";
import { VALID_FILE_FORMATS } from "../constants";

export default function ImageReader(fileId, canvas, toolbar) {
  const fileInput = document.getElementById(fileId.id);
  try {
    const file = fileInput.files[0]; //Processing only for single file
    const imgObj = {};
    if (file.type.match(VALID_FILE_FORMATS)) {
      const reader = new FileReader();
      reader.onloadend = function () {
        const img = new Image();
        img.src = reader.result;
        img.onload = function () {
          // grabbing the original dimensions from image
          imgObj.file = img;
          imgObj.src = img.src;
          imgObj.width = img.naturalWidth;
          imgObj.height = img.naturalHeight;
          let imageEditor = new ImageEditor(imgObj, canvas, toolbar, fileId);
          imageEditor.initCanvas(false);
        };
      };
      reader.readAsDataURL(file);
    } else {
      const message = "Cannot read file. We only accept Image files.";
      document.getElementById(fileId.id).value = null;
      document.getElementById("info").innerHTML = message;
    }
  } catch (error) {
    const message = "Cannot read file now. Please try again later.";
    document.getElementById(fileId.id).value = null;
    document.getElementById("info").innerHTML = message;
  }
}
