AFRAME.registerComponent("hover-color", {
  schema: {
    color: { default: "red" },
  },

  init: function () {
    var data = this.data;
    // el is short for element
    var el = this.el; // <a-box>
    // default color is whatever was set in the html attribute
    var defaultColor = el.getAttribute("material").color;

    // add event lisetener to element with hover-color attribute
    // change color to hover-color
    el.addEventListener("mouseenter", function () {
      el.setAttribute("material", "color", data.color);
    });

    el.addEventListener("mouseleave", function () {
      el.setAttribute("material", "color", defaultColor);
    });
  },
});

AFRAME.registerComponent("hover-text", {
  schema: {
    color: { type: "string" },
  },

  init: function () {
    var data = this.data;
    var el = this.el; // <a-box>
    var init = "";

    // const paragraph = document.getElementById("hovered-portal-title");
    const paragraph = document.getElementById(data + "Menu");
    // console.log("this is paragraph:"+paragraph);
    // console.log(paragraph);

    el.addEventListener("mouseenter", function () {
      if (paragraph) {
        paragraph.classList.add("hovered");
      }
    });

    el.addEventListener("mouseleave", function () {
      if (paragraph) {
        paragraph.classList.remove("hovered");
      }
    });
  },
});

AFRAME.registerComponent("click-page", {
  schema: {
    url: { type: "string" },
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    // console.log(data.https);

    el.addEventListener("mouseup", function () {
      location.href = data.https;
    });
  },
});

AFRAME.registerComponent("move-sine-wave", {
  schema: {
    amplitude: { type: "number", default: 1 },
    frequency: { type: "number", default: 1 },
    offset: { type: "number", default: 1 },
  },

  tick: function (time, timeDelta) {
    const position = this.el.object3D.position;
    var oX = position.x;
    var oY = position.y;

    // console.log(position);
    const elapsedSeconds = time / 1000; // Convert time to seconds
    // Update the x position based on sine function
    position.y =
      this.data.amplitude *
        Math.sin(this.data.frequency * elapsedSeconds + this.data.offset) +
      oY / 2;
    position.x =
      this.data.amplitude *
        Math.cos(
          (this.data.frequency / 2) * elapsedSeconds + this.data.offset
        ) - 2;
  },
});

//     var sceneElement = document.querySelector('a-scene');
//     var redElement = sceneElement.querySelector('#redSphere');

//     var position = redElement.object3D.position;
//     // position.x++;

//     redElement.setAttribute('position', position);
//     console.log(position);

document.querySelector("a-scene").addEventListener("loaded", function () {
  // Get the A-Frame camera entity
  const cameraEntity = document.querySelector("[camera]");

  // Get the Three.js camera object from the A-Frame camera entity
  const cameraObject3D = cameraEntity.getObject3D("camera");

  // Remove the existing camera component from the entity
  cameraEntity.removeAttribute("camera");

  // Create a new Three.js orthographic camera
  const orthoCamera = new THREE.OrthographicCamera(-50, 50, 30, -30, 0.1, 1000);

  // Replace the existing camera object with the orthographic camera
  cameraEntity.setObject3D("camera", orthoCamera);
});
