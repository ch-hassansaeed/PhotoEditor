import createJSONFile from "./jsonFileService";
import { BUTTONS } from "../constants";

/**
 * Class for Edit/Process image inside canvas
 *
 */
export default class ImageEditor {
  constructor(imageObject, canvas, toolbar, fileSelector) {
    this.imageObject = imageObject;
    this.editorCanvas = {
      element: canvas,
      height: canvas.height,
      width: canvas.width,
      x: 0,
      y: 0,
    };
    this.toolbar = toolbar;
    this.fileSelector = fileSelector;
    this.image = {
      file: imageObject.file,
      base64data: imageObject.src,
      width: imageObject.width,
      height: imageObject.height,
      ratio: this.imageObject.ratio ? this.imageObject.ratio : "",
      scale: this.imageObject.scale ? this.imageObject.scale : 1,
    };
    this.coordinates = {
      x: this.imageObject.x ? this.imageObject.x : 0,
      y: this.imageObject.y ? this.imageObject.y : 0,
    };
    this.centerCoordinates = {
      x: "",
      y: "",
    };
    this.angleInDegrees = 0;
  }

  /**
   * for Setting image object details
   */
  setImageObjectDetails() {
    const { ratio } = this.getImageDimensions();
    this.image.width = this.editorCanvas.width;
    this.image.height = this.editorCanvas.height;
    this.image.ratio = ratio;
  }

  /**
   *  for get Minimal Image Dimensions
   */
  getImageDimensions() {
    const ratio = this.imageObject.width / this.imageObject.height; //given image aspect ratio
    return { ratio };
  }

  /**
   * for redraw the image inside the canvas
   * to fill the full surface of the canvas as required
   */
  redraw() {
    const width = this.image.width * this.image.scale;
    const height = this.image.height * this.image.scale;
    this.clear();
    this.editorCanvas.ctx.drawImage(
      this.image.file,
      this.coordinates.x,
      this.coordinates.y,
      width,
      height
    );
  }

  /**
   * Function to get the Mouse position
   *  @param {*} event
   */
  getMousePosition(event) {
    const canavas = this.editorCanvas.element.getBoundingClientRect();
    const mousePosition = {
      x: event.clientX - canavas.left,
      y: event.clientY - canavas.top,
    };
    return mousePosition;
  }

  /**
   *  Initialize Canvas
   */
  initCanvas(fromJson) {
    const self = this;
    //setting up image details
    if (!fromJson) {
      self.setImageObjectDetails();
    }

    //setting up the canvas
    const canvas = self.editorCanvas.element;
    const ctx = canvas.getContext("2d");
    self.editorCanvas.ctx = ctx;
    self.clear();
    self.editorCanvas.ctx.drawImage(
      self.image.file,
      self.coordinates.x,
      self.coordinates.y,
      self.image.width,
      self.image.height
    );

    //Adding the Event Listeners for all buttons
    self.toolbar.addEventListener("click", (event) => {
      const isButton = event.target.nodeName === BUTTONS.BUTTON;
      if (!isButton) {
        return;
      }
      switch (event.target.id) {
        case BUTTONS.DOWN:
          self.moveImageDown();
          event.stopPropagation();
          break;
        case BUTTONS.UP:
          self.moveImageUp();
          event.stopPropagation();
          break;
        case BUTTONS.LEFT:
          self.moveImageLeft();
          event.stopPropagation();
          break;
        case BUTTONS.RIGHT:
          self.moveImageRight();
          event.stopPropagation();
          break;
        case BUTTONS.RESET:
          document.getElementById(self.fileSelector.id).value = null;
          self.clear();
          event.stopPropagation();
          break;
        case BUTTONS.SAVE:
          self.save();
          event.stopPropagation();
          break;
        default:
          event.stopPropagation();
          return;
      }
    });

    //Adding Event Listeners for the mouse events - MouseUp and MouseDown
    window.addEventListener("mouseup", function () {
      window.removeEventListener("mousemove", self.dragPosition, false);
    });

    canvas.addEventListener("mousedown", function (event) {
      self.dragStart(event);
    });

    // Adding Event Listeners for scaling
    const scale = self.toolbar.querySelector(".image-scale");
    scale.addEventListener("input", function () {
      let value = self.toolbar.querySelector(".image-scale").value;
      value = value / 100;
      self.scale(value);
    });
  }

  /**
   * Function to clear the canvas data
   */
  clear() {
    this.editorCanvas.ctx.clearRect(
      this.editorCanvas.x,
      this.editorCanvas.y,
      this.editorCanvas.width,
      this.editorCanvas.height
    );
  }

  /**
   * Function to move the image up by 10
   */
  moveImageUp() {
    this.coordinates.y = this.coordinates.y - 10;
    this.redraw();
    this.centerCoordinates = {
      x: this.coordinates.x + (this.image.width * this.image.scale) / 2,
      y: this.coordinates.y + (this.image.height * this.image.scale) / 2,
    };
  }

  /**
   * Function to move the image down by 10
   */
  moveImageDown() {
    this.coordinates.y = this.coordinates.y + 10;
    this.redraw();
    this.centerCoordinates = {
      x: this.coordinates.x + (this.image.width * this.image.scale) / 2,
      y: this.coordinates.y + (this.image.height * this.image.scale) / 2,
    };
  }

  /**
   * Function for scale between 10 and 200
   * @param {*} scale
   *
   **/
  scale(scale) {
    this.image.scale = scale;
    this.redraw();
  }

  /**
   * Function for move image to left position by 10
   */
  moveImageLeft() {
    this.coordinates.x = this.coordinates.x - 10;
    this.redraw();
    this.centerCoordinates = {
      x: this.coordinates.x + (this.image.width * this.image.scale) / 2,
      y: this.coordinates.y + (this.image.height * this.image.scale) / 2,
    };
  }

  /**
   * Fcuntion for move image to right position by 10
   */
  moveImageRight() {
    this.coordinates.x = this.coordinates.x + 10;
    this.redraw();
    this.middlcenterCoordinateseCoord = {
      x: this.coordinates.x + (this.image.width * this.image.scale) / 2,
      y: this.coordinates.y + (this.image.height * this.image.scale) / 2,
    };
  }

  /**
   * Function foe add event listener to capture mouse drag
   * @param {*} event
   */
  dragStart(event) {
    const mousePosition = this.getMousePosition(event);
    this.difference = {
      x: this.coordinates.x - mousePosition.x,
      y: this.coordinates.y - mousePosition.y,
    };
    this.dragPosition = this.dragPosition.bind(this);
    window.addEventListener("mousemove", this.dragPosition, false);
  }

  /**
   * Function for move the position to dragged position
   * @param {*} event
   */
  dragPosition(event) {
    const mousePosition = this.getMousePosition(event);
    this.coordinates.x = mousePosition.x + this.difference.x;
    this.coordinates.y = mousePosition.y + this.difference.y;
    this.redraw();
    this.centerCoordinates = {
      x: this.coordinates.x + (this.image.width * this.image.scale) / 2,
      y: this.coordinates.y + (this.image.height * this.image.scale) / 2,
    };
  }

  /**
   * Saving canvas data to the json file export file
   */
  save() {
    const canvasObj = {
      canvasdata: {
        width: this.editorCanvas.width,
        height: this.editorCanvas.height,
        photo: {
          id: this.image.base64data,
          width: this.image.width,
          height: this.image.height,
          x: this.coordinates.x,
          y: this.coordinates.y,
          scale: this.image.scale,
          ratio: this.image.ratio,
        },
      },
    };
    createJSONFile(canvasObj);
  }
}
