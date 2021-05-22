    const canvas = document.getElementById("renderCanvas")
    const engine = new BABYLON.Engine(canvas, true)
    canvas.style.width = "100%";
    canvas.style.height = "100%"; 
    engine.enableOfflineSupport = true
    /******* 創建場景 ******/
    const createScene = function () {
      // 實例化場景
      const scene = new BABYLON.Scene(engine)
      var lleSkyBlue = new BABYLON.Color3(0.27, 0.62, 1);
      var lleSkyBlueLi = new BABYLON.Color3(0.42, 0.78, 1);
      var lleSilver = new BABYLON.Color3(0.8, 0.8, 0.8);

      scene.clearColor = lleSkyBlue;
      scene.ambientColor = lleSilver;
      scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
      /*scene.fogColor = lleSkyBlueLi;*/
      scene.fogStart = 20.0;
      scene.fogEnd = 60.0;
      scene.collisionsEnabled = true;
      scene.gravity = new BABYLON.Vector3(0, -0.9, 0);

      var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
      var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.disableLighting = true;
      skybox.infiniteDistance = true;
      skybox.material = skyboxMaterial;
      // 創建相機並添加到canvas
      const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, new BABYLON.Vector3(0, 0, 5), scene)
      camera.attachControl(canvas, true)
      // 添加光
      const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene)
      const light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), scene)
      // 創建內容，一個球
      /*const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene)*/

      const ground = BABYLON.MeshBuilder.CreateGround("ground", {width:20, height:10}, scene)

      ground.position.y =-.5;
      ground.diffuseColor = new BABYLON.Color3(0, 0, 0);
      ground.checkCollisions = true;

      const box = BABYLON.MeshBuilder.CreateBox("box", {width:10, height:5, depth:5}, scene)

      box.position.y =2.5;
      box.checkCollisions = true;
      box.applyGravity = true;

      const sphere1 = BABYLON.MeshBuilder.CreateSphere("sphere", new BABYLON.Vector3(0, 0, 5), scene)

      sphere1.checkCollisions = true;
      sphere1.applyGravity = true;
      sphere1.occlusionRetryCount = 10;
      sphere1.occlusionType = BABYLON.AbstractMesh.OCCLUSION_TYPE_OPTIMISTIC;
      /*box1.isOcccluded = true;*/
      /*skybox.renderingGroupId = 0;*/
      /*box.renderingGroupId = 0;*/

      scene.registerBeforeRender(function () {
        if (sphere1.isOcccluded)
          scene.fogColor = lleSkyBlue;
      else
          scene.fogColor = lleSkyBlueLi;
      });

      var adt = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var xAddPos = 0;
        var yAddPos = 0;
        var xAddRot = 0;
        var yAddRot = 0;
        var sideJoystickOffset = 150;
        var bottomJoystickOffset = -50;
        var translateTransform;

      var leftThumbContainer = makeThumbArea("leftThumb", 2, "blue", null);
          leftThumbContainer.height = "200px";
          leftThumbContainer.width = "200px";
          leftThumbContainer.isPointerBlocker = true;
          leftThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
          leftThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
          leftThumbContainer.alpha = 0.4;
          leftThumbContainer.left = sideJoystickOffset;
          leftThumbContainer.top = bottomJoystickOffset;

      var leftInnerThumbContainer= makeThumbArea("leftInnterThumb", 4, "blue", null);
          leftInnerThumbContainer.height = "80px";
          leftInnerThumbContainer.width = "80px";
          leftInnerThumbContainer.isPointerBlocker = true;
          leftInnerThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          leftInnerThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

      var leftPuck = makeThumbArea("leftPuck",0, "blue", "blue");
            leftPuck.height = "60px";
            leftPuck.width = "60px";
            leftPuck.isPointerBlocker = true;
            leftPuck.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            leftPuck.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
          leftThumbContainer.onPointerDownObservable.add(function(coordinates) {
            leftPuck.isVisible = true;
            leftPuck.floatLeft = coordinates.x-(leftThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
            leftPuck.left = leftPuck.floatLeft;
            leftPuck.floatTop = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
            leftPuck.top = leftPuck.floatTop*-1;
            leftPuck.isDown = true;
            leftThumbContainer.alpha = 0.9;
          });

          leftThumbContainer.onPointerUpObservable.add(function(coordinates) {
            xAddPos = 0;
            yAddPos = 0;
            leftPuck.isDown = false;
            leftPuck.isVisible = false;
            leftThumbContainer.alpha = 0.4;
          });

          leftThumbContainer.onPointerMoveObservable.add(function(coordinates) {
            if (leftPuck.isDown) {
                xAddPos = coordinates.x-(leftThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
                yAddPos = adt._canvas.height - coordinates.y-(leftThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
                leftPuck.floatLeft = xAddPos;
                leftPuck.floatTop = yAddPos*-1;
                leftPuck.left = leftPuck.floatLeft;
                leftPuck.top = leftPuck.floatTop;
                }
          });

        adt.addControl(leftThumbContainer);
        leftThumbContainer.addControl(leftInnerThumbContainer);
        leftThumbContainer.addControl(leftPuck);
        leftPuck.isVisible = false;

        // rightThumbContainer

      var rightThumbContainer = makeThumbArea("rightThumb", 2, "red", null);
          rightThumbContainer.height = "200px";
          rightThumbContainer.width = "200px";
          rightThumbContainer.isPointerBlocker = true;
          rightThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
          rightThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
          rightThumbContainer.alpha = 0.4;
          rightThumbContainer.left = -sideJoystickOffset;
          rightThumbContainer.top = bottomJoystickOffset;

      var rightInnerThumbContainer= makeThumbArea("rightInnterThumb", 4, "red", null);
          rightInnerThumbContainer.height = "80px";
          rightInnerThumbContainer.width = "80px";
          rightInnerThumbContainer.isPointerBlocker = true;
          rightInnerThumbContainer.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
          rightInnerThumbContainer.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

      var rightPuck = makeThumbArea("rightPuck",0, "red", "red");
            rightPuck.height = "60px";
            rightPuck.width = "60px";
            rightPuck.isPointerBlocker = true;
            rightPuck.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            rightPuck.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
          rightThumbContainer.onPointerDownObservable.add(function(coordinates) {
            rightPuck.isVisible = true;
            rightPuck.floatLeft = adt._canvas.width - coordinates.x-(rightThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
            rightPuck.left = rightPuck.floatLeft*-1;
            rightPuck.floatTop = adt._canvas.height - coordinates.y-(rightThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
            rightPuck.top = rightPuck.floatTop*-1;
            rightPuck.isDown = true;
            rightThumbContainer.alpha = 0.9;
          });

          rightThumbContainer.onPointerUpObservable.add(function(coordinates) {
            xAddPos = 0;
            yAddPos = 0;
            rightPuck.isDown = false;
            rightPuck.isVisible = false;
            rightThumbContainer.alpha = 0.4;
          });

          rightThumbContainer.onPointerMoveObservable.add(function(coordinates) {
            if (rightPuck.isDown) {
                xAddPos = adt_canvas.width - coordinates.x-(rightThumbContainer._currentMeasure.width*.5)-sideJoystickOffset;
                yAddPos = adt._canvas.height - coordinates.y-(rightThumbContainer._currentMeasure.height*.5)+bottomJoystickOffset;
                rightPuck.floatLeft = xAddPos*-1;
                rightPuck.floatTop = yAddPos*-1;
                rightPuck.left = rightPuck.floatLeft;
                rightPuck.top = rightPuck.floatTop;
                }
          });

        adt.addControl(rightThumbContainer);
        rightThumbContainer.addControl(rightInnerThumbContainer);
        rightThumbContainer.addControl(rightPuck);
        rightPuck.isVisible = false;

          camara.attachControl(canvas, true);

        scene.registerBeforeRender(function() {
              translateTransform = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(xAddPos/3000, 0, yAddPos/3000), BABYLON.Matrix.RotationY(camera.rotation.y);
              camera.cameraDirection.addInPlace(translateTransform);
              camera.cameraRotation.y += xAddRot/15000*-1;
              camera.cameraRotation.x += yAddRot/15000*-1;
            });

      function makeThumbArea(name, thickness, color, background,curves){
        
        var rect = new BABYLON.GUI.Ellipse();
            rect.name= name;
            rect.thickness= thickness;
            rect.color = color;
            rect.background = background;
            rect.paddingLeft = "0px";
            rect.paddingRight = "0px";
            rect.paddingTop = "0px";
            rect.paddingBottom = "0px";



        return rect;
      }

      // 方向控制
      const btnLU = document.querySelector('#btnLU');
      const btnU = document.querySelector('#btnU');
      const btnRU = document.querySelector('#btnRU');
      const btnL = document.querySelector('#btnL');
      const btnR = document.querySelector('#btnR');
      const btnLD = document.querySelector('#btnLD');
      const btnD = document.querySelector('#btnD');
      const btnRD = document.querySelector('#btnRD');
      btnLU.addEventListener("click", () => {
        box.position.x +=1;
        box.position.z -=1;
        console.log('LU');
      })
      btnU.addEventListener("click", () => {
        box.position.z -=1;
        console.log('U');
      })
      btnRU.addEventListener("click", () => {
        box.position.x -=1, 
        box.position.z -=1
        console.log('RU');
      })
      btnL.addEventListener("click", () => {
        box.position.x +=1;
        console.log('L');
      })
      btnR.addEventListener("click", () => {
        box.position.x -=1;
        console.log('R');
      })
      btnLD.addEventListener("click", () => {
        box.position.x +=1;
        box.position.z +=1;
        console.log('LD');
      })
      btnD.addEventListener("click", () => {
        box.position.z +=1;
        console.log('D');
      })
      btnRD.addEventListener("click", () => {
        box.position.x -=1;
        box.position.z +=1;
        console.log('RD');
      })
      //按鍵行為
      const btnP = document.querySelector('#btnP');
      const btnM = document.querySelector('#btnM');
      const btnA = document.querySelector('#btnA');
      btnA.addEventListener("click", () => {
        box.position.y +=1;
        console.log('A');
      })
      return scene
    }
    /******* 結束創建場景 ******/
    const scene = createScene()
    // loop
    engine.runRenderLoop(function () {
      scene.render()
    })
    // resize
    window.addEventListener("resize", function () {
      engine.resize()
    })