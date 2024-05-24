/*
youtube-3D-net
by @darredondort at @SignaLab

Based on
3d-force-graph https://github.com/vasturiano/3d-force-graph
MIT License
Copyright (c) 2017 Vasco Asturiano
*/

function initScene() {


  // Info DOM Selections
  let postInfoContainer = document.getElementById("postInfoContainer");
  let nodeCountInfo = document.getElementById("nodeCount");
  let linkCountInfo = document.getElementById("linkCount");
  let communityCountInfo = document.getElementById("communityCount");
  let header = document.getElementById("videonet-header");

  let postImage = document.getElementById("postImage");
  let reactionContainer = document.getElementById("reactionContainer");
  let postImageContainer = document.getElementById("postImageContainer");

  let videoDescription = document.getElementById("videoDescription");
  let viewCount = document.getElementById("viewCount");
  let likeCount = document.getElementById("likeCount");
  // let dislikeCount = document.getElementById("dislikeCount");
  let commentCount = document.getElementById("commentCount");
  // let pageRank = document.getElementById("pageRank");
  let inDegree = document.getElementById("inDegree");
  let outDegree = document.getElementById("outDegree");

  let currNode;
  let info = true;
  let zoomToggle = false;
  let zoomLabel = "Activar zoom";

  let zoomToogleBtn = document.getElementById("zoom-toggle");
  zoomToogleBtn.style.backgroundColor = '#38d7d7';
  // zoomToogleBtn.style.backgroundColor = '#465063';


  // set min / max node size & color palette
  const nodeMin = 120;
  const nodeMax = 400;
  let communityCount = {};
  const colors = ["#fff463",
    "#009394",
    "#f15a00",
    "#01ef58",
    "#ff6e28",
    "#02f182",
    "#f26d2d",
    "#54f849",
    "#b14713",
    "#3eff8f",
    "#c45b00",
    "#02f5ed",
    "#f58900",
    "#1bd8dc",
    "#e07300",
    "#02f2cc",
    "#ff844a",
    "#00e866",
    "#f68956",
    "#01c902",
    "#b66139",
    "#4de52c",
    "#9d5939",
    "#86fb34",
    "#b36946",
    "#72ec23",
    "#895f46",
    "#a2fe27",
    "#407f80",
    "#eaff10",
    "#00827d",
    "#ffff35",
    "#00b9ba",
    "#f5af00",
    "#6dfffb",
    "#d97a00",
    "#53ffe8",
    "#ff9d2e",
    "#00eaad",
    "#a65600",
    "#01ed9d",
    "#ff9b45",
    "#01dc5d",
    "#9b5800",
    "#5effbe",
    "#ffb72e",
    "#03bdb6",
    "#e6db00",
    "#60ccce",
    "#ffcf2e",
    "#009a90",
    "#e5b500",
    "#8af5f7",
    "#dca600",
    "#7ae3e5",
    "#ca8c00",
    "#00d8af",
    "#ffb040",
    "#00d098",
    "#bf8200",
    "#afffff",
    "#99d800",
    "#37726b",
    "#beff43",
    "#925c3a",
    "#79ff71",
    "#b0765c",
    "#01c12b",
    "#f9a782",
    "#0cb500",
    "#e49876",
    "#00ca45",
    "#ffab7b",
    "#00b833",
    "#d08968",
    "#68cd00",
    "#d79a7f",
    "#93ff66",
    "#866140",
    "#80ff96",
    "#8a6033",
    "#94ff8b",
    "#c8937a",
    "#30ad00",
    "#ffbd9f",
    "#21a000",
    "#fcc3aa",
    "#019e1c",
    "#ffb36e",
    "#00c75d",
    "#ffbe8b",
    "#019521",
    "#ffd7b7",
    "#45a500",
    "#e2bda4",
    "#68b500",
    "#91755a",
    "#f7ff53",
    "#008873",
    "#ffe941",
    "#007959",
    "#ffd14a",
    "#00b397",
    "#d6c300",
    "#73aba3",
    "#b1d700",
    "#507761",
    "#bed300",
    "#a7ffe5",
    "#a57500",
    "#84ffcc",
    "#896118",
    "#86ffbe",
    "#b28b00",
    "#00cc89",
    "#ffbc58",
    "#008a67",
    "#d1b100",
    "#019c70",
    "#ffe059",
    "#06784b",
    "#f7ff6c",
    "#3a7454",
    "#ffd55e",
    "#27764e",
    "#fff174",
    "#477349",
    "#d1ff6e",
    "#7c6544",
    "#b0ff71",
    "#897958",
    "#9bcb00",
    "#617556",
    "#e8ff80",
    "#72704d",
    "#a7ff8d",
    "#7a6717",
    "#9dffb4",
    "#7a6805",
    "#acffc4",
    "#7c6f00",
    "#dcfbda",
    "#238600",
    "#f2d8b6",
    "#008b28",
    "#ffc874",
    "#00b65c",
    "#ffd28a",
    "#009240",
    "#ffd774",
    "#00ae74",
    "#ffe673",
    "#00843c",
    "#ffebbe",
    "#337709",
    "#f3f0c8",
    "#227921",
    "#fcffca",
    "#457511",
    "#c5eed3",
    "#b4bb00",
    "#9cc5ac",
    "#b7ac00",
    "#01ac65",
    "#ffe4ab",
    "#019352",
    "#ffe88e",
    "#3b753b",
    "#fffa8e",
    "#37762a",
    "#fff29e",
    "#517223",
    "#f7ffbc",
    "#548700",
    "#d3ffca",
    "#988400",
    "#c5ffb9",
    "#6b6d1c",
    "#baff89",
    "#696c35",
    "#b6ff99",
    "#5c6f39",
    "#cbff90",
    "#a69d79",
    "#83af00",
    "#a5c3a3",
    "#aba900",
    "#829e80",
    "#9da100",
    "#c7caa4",
    "#7c9800",
    "#d3ffb9",
    "#737900",
    "#b4ffa6",
    "#587213",
    "#faffa1",
    "#6f8a00",
    "#e0ffaa",
    "#919000",
    "#9ca581"
  ];


  let highlightNodes = [];
  // let highlightLink = null;

  //JSON data parsing
  let viewMax, viewMin, likeMax, likeMin, commentMax, commentMin, inDegreeMax, inDegreeMin, outDegreeMax, outDegreeMin;
  const jsonURL = "datasets/20200403_coronavirus-mexico_videonet_search500_nodes500_2020_04_03_videoNet.json";
  async function getData() {
    const response = await fetch(jsonURL);
    const data = await response.json();
    console.log(data);
    console.log(data.nodes);
    //const { nodes, links } = data;

    let viewData = [];
    let likeData = [];
    // let dislikeData = [];
    let commentData = [];
    // let pageRankData = [];
    let inDegreeData = [];
    let outDegreeData = [];
    let modularityClassData = [];


    for (let i = 0; i < data.nodes.length; i++) {
      //console.log(data.nodes[i].dislikeCount);
      if (data.nodes[i].viewCount) {
        viewData.push(parseInt(data.nodes[i].viewCount));

      }
      if (data.nodes[i].likeCount) {
        likeData.push(parseInt(data.nodes[i].likeCount));
      }
      // if(data.nodes[i].dislikeCount) {
      //   dislikeData.push(parseFloat(data.nodes[i].dislikeCount));
      // }
      if (data.nodes[i].commentCount) {
        commentData.push(parseFloat(data.nodes[i].commentCount));
      }
      // pageRankData.push(parseFloat(data.nodes[i].pageRank));
      inDegreeData.push(parseInt(data.nodes[i].inDegree));
      outDegreeData.push(parseInt(data.nodes[i].outDegree));
      modularityClassData.push(data.nodes[i].modularityClass);
    }

    for (let i = 0; i < modularityClassData.length; i++) {
      communityCount[modularityClassData[i]] = 1 + (communityCount[modularityClassData[i]] || 0);
    }
    console.log(Object.keys(communityCount).length);
    // console.log("counted " + communityCount.keys().length + "communities");


    // Node properties min/max
    viewMax = Math.max(...viewData);
    viewMin = Math.min(...viewData);
    likeMax = Math.max(...likeData);
    likeMin = Math.min(...likeData);
    // dislikeMax = Math.max(...dislikeData);
    // dislikeMin = Math.min(...dislikeData);
    commentMax = Math.max(...commentData);
    commentMin = Math.min(...commentData);
    // pageRankMax = Math.max(...pageRankData);
    // pageRankMin = Math.min(...pageRankData);
    inDegreeMax = Math.max(...inDegreeData);
    inDegreeMin = Math.min(...inDegreeData);
    outDegreeMax = Math.max(...outDegreeData);
    outDegreeMin = Math.min(...outDegreeData);
    console.log("data max/mins:" + viewMin, viewMax, likeMin, likeMax, commentMin, commentMax, inDegreeMin, inDegreeMax, outDegreeMin, outDegreeMax);

    getTextures("likeCount", likeMin, likeMax);
    console.log("likeCount max: " + likeMax);

  }
  getData();

  // Draw 3d-graph
  const Graph = ForceGraph3D()
    (document.getElementById('3d-graph'))
    .jsonUrl(jsonURL)
    .enableNodeDrag(false)
    .enableNavigationControls(zoomToggle)
    .showNavInfo(false)
    // .cameraPosition({
    //     x: 0,
    //     y: 0,
    //     z: -7500
    //   }, // new position
    //   {
    //     x: 0,
    //     y: 0,
    //     z: 0
    //   }) //lookAt

      .cameraPosition({

        // x: 272.15,
        // y: 2676.53,
        // // z: -10325
        // z: -768.59
        // x: 415.9131995197888, y: 3042.216334146434, z: -883.1345302718179 // initial hero transition
        x: 1902.7409061838885, y: 12187.278186829668, z: 2500


      }, // new position
      {
        x: 0,
        y: 0,
        z: 0

        // x: 2945.3,
        // y: 9008.3,
        // z: -9613.8
      }) //lookAt



      


    // .nodeAutoColorBy('modularityClass')
    // .nodeColor(node => colors[parseInt(node.modularityClass)])
    .nodeColor(node => colors[parseInt(node.modularityClass)] ? colors[parseInt(node.modularityClass)] : 'rgba(255,255,255,255)')
    // .linkAutoColorBy('parentClass')
    .linkColor(link => colors[parseInt(link.parentClass)])
    .linkMaterial("MeshPhongMaterial")
    // .linkMaterial("MeshLambertMaterial")
    // .linkMaterial("MeshToonMaterial")
    // .linkDirectionalParticleColor(link => link.color)
    .linkWidth(4)
    .nodeLabel(node => `${node.channelTitle}: ${node.label}`);

    
  Graph.backgroundColor("#000000");

  


  let near = Graph.camera().near;
  console.log("near: " + near);
  let light = new THREE.DirectionalLight(0xffffff, 1.5);
  light.position.y = 10;
  Graph.scene().add(light);

  let light2 = new THREE.DirectionalLight(0xffffff, 1.5);
  light2.position.set(-100, -100, -1000);
  Graph.scene().add(light2);

  let ambLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
  Graph.scene().add(ambLight);

  // console.log(Graph.camera().near);
  let minVis = -5000;
  let maxVis = 5000;
  let minCam = 1080;
  let maxCam = 14500;
  Graph.controls().minDistance = minCam;
  Graph.controls().maxDistance = maxCam;

  // fog settings
  // let fogDistance = 2; // hero
  let fogDistance = 2.5;
  let fogAlpha = THREE.Math.mapLinear(Graph.cameraPosition().z, minCam, maxCam, 0, 0.15);
  // let fogAlpha = THREE.Math.mapLinear(Graph.cameraPosition().z, minCam, maxCam, 0, 255);
  // let fogAlpha = THREE.Math.mapLinear(Graph.camera().near, -2500, 2000, 0, 0.2);
  // let fogColor = new THREE.Color("rgb(0, 0, 0)");
  let fogColor = new THREE.Color(`rgba(1,1,1,${fogAlpha})`);
  // fogColor.lerp( "0", fogAlpha );
  Graph.scene().fog = new THREE.Fog( -fogColor, minCam, maxCam*fogDistance);

  Graph.linkOpacity(0);
  // Graph.linkOpacity(1);
  Graph.linkOpacity(THREE.Math.mapLinear(Graph.camera().near, maxVis, minVis, 0.0, 0.8));
  Graph.linkMaterial().shininess = 80;
  Graph.linkMaterial().reflectivity = 0.5;

  // Graph.linkOpacity(THREE.Math.mapLinear(Graph.camera.z, -100, 5000, 0, 1));
  console.log("camera:" + Graph.cameraPosition());
  console.log("camera z:" + Graph.cameraPosition().z);

  // function printCameraPosition(obj) {
  //    console.log("position changed in object");
  //    console.log("camera z:" + Graph.cameraPosition().z);
  //    console.log(obj);
  //  }
  //
  // let graphControl = Graph.controls;
  // graphControl.addEventListener('change', printCameraPosition);

  function getTextures(dataProp, dataMin, dataMax) {
    // console.log(Graph.graphData().nodes);
    // linkCount.innerHTML = Graph.graphData().links.length;

    console.log("scaled by " + dataProp + " min/max " + dataMin + "/" + dataMax);
    Graph.nodeThreeObject(node => {
      communityCountInfo.innerHTML = String(Object.keys(communityCount).length);
      nodeCountInfo.innerHTML = String(Graph.graphData().nodes.length);
      linkCountInfo.innerHTML = String(Graph.graphData().links.length);
      let imgWidth = THREE.Math.mapLinear(node[dataProp], dataMin, dataMax, nodeMin, nodeMax);
      let imgHeight = THREE.Math.mapLinear(node[dataProp], dataMin, dataMax, nodeMin, nodeMax);
      const obj = new THREE.Mesh(
        new THREE.SphereGeometry(imgWidth / 2),
        // new THREE.BoxGeometry( imgWidth, imgHeight, imgWidth ),
        new THREE.MeshPhongMaterial({
          depthWrite: false,
          shininess: 200,
          flatShading: false,
          transparent: true,
          opacity: 0.0
        })
        // new THREE.MeshBasicMaterial({ depthWrite: true, shininess: 15, flatShading: false, transparent: true, opacity: 1, color: "yellow"})
      );


      // obj.material.opacity = 1;
      // obj.material.color.set(colors[parseInt(node.modularityClass)]);
      const imgTexture = new THREE.TextureLoader().setCrossOrigin("Anonymous");
      // imgTexture.crossOrigin = 'Anonymous';
      // const mapOverlay = imgTexture.load(node.imgCors + "/0.jpg");
      const mapOverlay = imgTexture.load("imgs/thumbs-coronavirus-mx/" + node.id + ".jpg", function (imgTexture) {
        // const mapOverlay = imgTexture.load("imgs/thumbs-yosoy132/"+node.id+ ".png", function(imgTexture) {
        // const mapOverlay = imgTexture.load(node.imgCors + "/0.jpg", function(imgTexture) {
        mapOverlay.needsUpdate = true;
        mapOverlay.wrapS = THREE.RepeatWrapping;
        let material;
        // const material = new THREE.SpriteMaterial({ map: mapOverlay });
        if (navigator.userAgent.indexOf("Chrome") != -1) {
          mapOverlay.repeat.x = -1;
          mapOverlay.flipY = true;
          material = new THREE.SpriteMaterial({
            map: mapOverlay,
            rotation: Math.PI,
            // fog: false
            fog: true

          });
          // flip material
          obj.scale.x = -1;
          material.side = THREE.DoubleSide;
        } else {
          // mapOverlay.flipY = true;
          material = new THREE.SpriteMaterial({
            map: mapOverlay,
            // fog: false
            fog: true,
            opacity: 0.80
          });
        }

        const sprite = new THREE.Sprite(material);
        if (node[dataProp]) {
          sprite.scale.set(imgWidth, imgHeight);
        } else {
          sprite.scale.set(nodeMin);
        }
        obj.add(sprite);
        return obj;

      }, () => console.log("loading thumbnails"), () => console.log("no thumbnails found"));
      return obj;


    })
  }

  let initialDistance = 1800;
  let initialStrength = -1500;

  // Spread nodes a little wider
  Graph.d3Force('charge').strength(initialStrength);
  const linkForce = Graph
    .d3Force('link')
    .distance(link => settings.Distancia);

  //Define GUI
  const Settings = function () {
    this.Distancia = initialDistance;
    // this.Particles = false;
    this.Información = true;
    this.Recargar = function () {
      console.log("reloaded");
      this.Distancia = initialDistance;
      // this.Particles = false;
      this.Información = true;
      // displayParticles();
      for (var i in gui.__controllers) {
        gui.__controllers[i].updateDisplay();
      }
      Graph.cameraPosition({
            // x: 0,
            // y: 0,
            // z: -6500

            x: 1902.7409061838885, y: 12187.278186829668, z: -530.6122384110279

          }, // new position
          {
            x: 0,
            y: 0,
            z: 0
          },1000) //lookAt
        .linkPositionUpdate(link => link.source)
        .linkVisibility(true)
        .numDimensions(3)
        .d3Force('charge').strength(initialStrength);
      // linkForce.distance(link => this.Distance);
      postImage.style.display = "none";
      reactionContainer.style.display = "none";
      postImageContainer.style.display = "none";
    }

  };

  //dat GUI distance controller
  const settings = new Settings();
  const gui = new dat.GUI();

  // closed GUI by default
  // gui.close();
  var guiContainer = gui.domElement.id = 'guiContainer';
  var text = {
    Tamaño: 'likes'
  }
  const controllerOne = gui.add(settings, 'Distancia', 200, 5000);
  // const controllerTwo = gui.add(settings, 'Particles', false);
  const controllerFour = gui.add(settings, 'Información', true);
  const controllerThree = gui.add(settings, 'Recargar');
  const controllerFive = gui.add(text, 'Tamaño', ['vistas', 'likes', 'comentarios', 'recomendaciones']);

  controllerOne.onChange(updateLinkDistance);
  // controllerTwo.onChange(displayParticles);
  controllerFour.onChange(showInfo);
  controllerFive.onChange(changeSize);

  function changeSize() {
    console.log("size changed");
    switch (controllerFive.object.Tamaño) {
      case "vistas":
        console.log("selected viewCount");
        getTextures("viewCount", viewMin, viewMax);
        console.log("view max: " + viewMax);
        Graph.numDimensions(3); // Re-heat simulation
        // .d3Force('charge').strength(-800);
        break;
      case "likes":
        console.log("selected likeCount");
        getTextures("likeCount", likeMin, likeMax);
        console.log("like max: " + likeMax);
        Graph.numDimensions(3); // Re-heat simulation
        // .d3Force('charge').strength(-800);
        break;
        // case "dislikeCount":
        //   console.log("selected dislikeCount");
        //   getTextures("dislikeCount", dislikeMin, dislikeMax);
        //   console.log("dislike max: " + dislikeMax);
        //   Graph.numDimensions(3); // Re-heat simulation
        //   // .d3Force('charge').strength(-800);
        //   break;
      case "comentarios":
        console.log("selected commentCount");
        getTextures("commentCount", commentMin, commentMax);
        console.log("comment max: " + commentMax);
        Graph.numDimensions(3); // Re-heat simulation
        // .d3Force('charge').strength(-800);
        break;
        // case "pageRank":
        //   console.log("selected pageRank");
        //   getTextures("pageRank", pageRankMin, pageRankMax);
        //   console.log("pageRank max: " + pageRankMax);
        //   Graph.numDimensions(3); // Re-heat simulation
        //   // .d3Force('charge').strength(-800);
        //   break;
      case "recomendaciones":
        console.log("selected inDegree");
        getTextures("inDegree", inDegreeMin, inDegreeMax);
        console.log("inDegree max: " + inDegreeMax);
        Graph.numDimensions(3); // Re-heat simulation
        // .d3Force('charge').strength(-800);
        break;
        //  case "outDegree":
        //    console.log("selected outDegree");
        //    getTextures("outDegree", outDegreeMin, outDegreeMax);
        //    console.log("outDegree max: " + outDegreeMax);
        //    Graph.numDimensions(3) // Re-heat simulation
        //    // .d3Force('charge').strength(-800);
        //    break;
      default:
    }

    Graph
      .numDimensions(3)
      .d3Force('charge').strength(initialStrength);

  }

  function updateLinkDistance() {
    linkForce.distance(link => settings.Distancia);
    Graph.numDimensions(3)
      .d3Force('charge').strength(initialStrength); // Re-heat simulation
  }

  // function displayParticles() {
  //   if (!controllerTwo.object.Particles) {
  //     Graph.linkDirectionalParticles(0)
  //     .linkDirectionalParticleWidth(0)
  //     // .numDimensions(3);
  //     // console.log(controllerTwo.object.Particles);
  //   }
  //   if (controllerTwo.object.Particles) {
  //     Graph.linkDirectionalParticles(link => link.weight)
  //     .linkDirectionalParticleWidth(3)
  //     // .numDimensions(3);
  //     // console.log(controllerTwo.object.Particles);
  //   }
  // }

  function showInfo() {
    if (controllerFour.object.Información) {
      info = true;
      postInfoContainer.style.display = "flex";
      header.style.display = "flex";

    } else if (!controllerFour.object.Información) {
      info = false;
      postInfoContainer.style.display = "none";
      header.style.display = "none";
    }
  }

  //node camera focus
  Graph.onNodeClick(node => {
    filterStatus = true;
    document.getElementById("3d-graph").style.cursor = "cursor";

    const distance = 500;
    // const distance = node.val + 100;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    Graph.cameraPosition({
        x: node.x * distRatio,
        y: node.y * distRatio,
        z: node.z * distRatio
      }, // new position
      node, // lookAt ({ x, y, z })
      // 3000 // ms transition duration
      4000 // ms transition duration
    );

    if ((!node && !highlightNodes.length) || (highlightNodes.length === 1 && highlightNodes[0] === node)) return;

    Graph.linkVisibility(link => showThisLink(link, node));
    highlightNodes = node ? [node] : [];

    if (node && node.id != "null" && info) {
      //console.log(node.user);
      currNode = node.id;
      console.log("https://www.youtube-nocookie.com/embed/" + node.id + "?controls=0");
      postImage.style.display = "flex";
      postImageContainer.style.display = "flex";
      reactionContainer.style.display = "flex";
      postImage.src = "https://www.youtube-nocookie.com/embed/" + node.id + "?controls=0";
      postImage.style.zIndex = 3;
      postImageContainer.style.zIndex = 3;

      videoDescription.innerHTML = `${node.channelTitle}: ${node.label}`;
      viewCount.innerHTML = node.viewCount;
      likeCount.innerHTML = node.likeCount;
      //  dislikeCount.innerHTML = node.dislikeCount;
      commentCount.innerHTML = node.commentCount;
      //pageRank.innerHTML = node.pageRank;
      inDegree.innerHTML = node.inDegree;
      outDegree.innerHTML = node.outDegree;
    } else if (!node) {
      postImage.style.display = "none";
      reactionContainer.style.display = "none";
      postImageContainer.style.display = "none";
    }
  });

  document.getElementById("3d-graph").style.cursor = "cursor";

  Graph.onNodeHover(node => {
    if (node) {
      console.log("over node: " + node.id);
      zoomToggle = false;
      zoomLabel = "Ver video"
      toogleZoomButton('#FFFFFF');
      Graph.enableNavigationControls(zoomToggle);
    } 
    
    // else {

    //   if (!node && !zoomToggle) {
    //     console.log("not over");
    //     zoomLabel = "Activar zoom";
    //     toogleZoomButton('#38d7d7');
    //     zoomToggle = true;
    //     Graph.enableNavigationControls(zoomToggle);
    //   }
    //   else if (!node && zoomToggle) {
    //     console.log("not over");
    //     zoomLabel = "Desactivar zoom";
    //     toogleZoomButton('#465063');
    //     zoomToggle = false;
    //     Graph.enableNavigationControls(zoomToggle);
    //   }
    // }
    else {
      console.log("not over");
      zoomLabel = "Desactivar zoom";
      toogleZoomButton('#465063');
      zoomToggle = true;
      Graph.enableNavigationControls(zoomToggle);
    }
    document.getElementById("3d-graph").style.cursor = node ? 'pointer' : null;
  });

  let filterStatus = false;

  function showThisLink(link, baseNode) {
    return link.source === baseNode || link.target === baseNode;
  }

  function showAllLink(link) {
    return link;
  }

  Graph.onBackgroundClick(showLinks);

  function showLinks() {
    console.log("back click")
    if (filterStatus) {
      Graph.linkVisibility(true)
      // .cameraPosition(
      //   { x: 0, y: 0, z: -5500 }, // new position
      //   { x: 0, y: 0, z: 0 }) //lookAt
      console.log("filter removed");
    } else {
      console.log("nothing filtered yet");
    }
  }


  function toogleZoomButton(toggleZoomColor) {
    zoomToogleBtn.innerHTML = `${zoomLabel}`;
    zoomToogleBtn.style.backgroundColor = toggleZoomColor;
  }


  zoomToogleBtn.addEventListener("click", function () {
    let state1 = 'Activar zoom';
    let state2 = 'Desactivar zoom';

    if (zoomToogleBtn.innerHTML == state1) {
      zoomLabel = "Desactivar zoom";
      toogleZoomButton('#465063');
      // toogleZoomButton('#38d7d7');
      zoomToggle = true;
      Graph.enableNavigationControls(zoomToggle);

    } else if (zoomToogleBtn.innerHTML == state2) {
      zoomLabel = "Activar zoom";
      toogleZoomButton('#38d7d7');
      // toogleZoomButton('#465063');
      zoomToggle = false;
      Graph.enableNavigationControls(zoomToggle);
    } else {
      // toogleZoomButton('#465063');
      toogleZoomButton('#38d7d7');

      Graph.enableNavigationControls(false);
    }
  }, false);

  // let graphControl = Graph.controls;
  Graph.controls().addEventListener('change', printCameraPosition);
  
  function printCameraPosition() {
    console.log("camera position:", Graph.cameraPosition());
    console.log("camera position:", Graph.cameraPosition());
    console.log("camera z:", Graph.cameraPosition().z);
  }

  let linkOpacityTarget = THREE.Math.mapLinear(Graph.camera().near, maxVis, minVis, 0.0, 0.8);
  let linkOpacityCurr = 0;
  let linkOpacityStep = 0.0035; // reveal hero

  function revealTo() {
    printCameraPosition();
  
    if (linkOpacityCurr < linkOpacityTarget) {
      linkOpacityCurr+=linkOpacityStep;
      Graph.linkOpacity(linkOpacityCurr);
    }    
  }

  // reposition with click
  // Graph.controls().addEventListener( 'change', revealTo);
  // Graph.onBackgroundClick(function() {
  //   Graph.cameraPosition({
  //     x: 1902.7409061838885, y: 12187.278186829668, z: -530.6122384110279
  //   }, // new position
  //   {
  //     x: 0,
  //     y: 0,
  //     z: 0

  //     // x: 2945.3,
  //     // y: 9008.3,
  //     // z: -9613.8
  //   },1000)
  //   // },20000) // transition hero

  // });

}

// once everything is loaded, run
window.onload = initScene;
