var AFRAME = require('aframe');
console.log('here');
 // AFRAME.registerComponent('slap',{
 //        init: function(){
 //          this.rh = document.getElementById('rh');
 //          this.lh = document.getElementById('lh');
 //          this.mybox = document.getElementById('mybox');
 //        },
 //        tick: function(t,dt){
 //        }
 //      });
      
var zoneList = ['zone-1', 'zone-2', 'zone-3'];
var currentZone = {
	value: 0
};
	AFRAME.registerComponent('grab',
  {
		schema: {
      delay: {default: 0, min: 0},
      chunk: {min: 0},
      src: {},
      id: {}
		},

		init:function(){
			console.log(this.el);
			var clickable = ['nextZone', 'preZone'];	
			var self = this;
			var boundingBox = new THREE.Box3();
		 	self.el.addEventListener('triggerdown', function () {
		 		clickable.forEach(function(each){
		 			var zone = document.getElementById(each);
		 			if(zone){
			 			var location = zone.attributes.position.value.split(' ');
			 			elePostion = {
			 				x: Number(location[0]),
			 				y: Number(location[1]),
			 				z: Number(location[2])
			 			}
			 			var mesh = self.el.getObject3D('mesh')
			 			boundingBox.setFromObject(mesh);
			 			var min = boundingBox.min;
			 			var max = boundingBox.max;

			 			var intersect = (min.x  - elePostion.x <= 0.5 && min.x  - elePostion.x >= -0.5 ) &&
                      		(min.y - elePostion.y  <= 0.5 && min.y - elePostion.y  >= -0.5 ) &&
							(min.z - elePostion.z <= 0.5&& min.z - elePostion.z >= -0.5);
			 			if(intersect){
			 				if(each === 'preZone'){
				 				currentZone.value--  ;
			 				} else {
				 				currentZone.value++ ;
			 				}
			 				console.log(currentZone.value);	
			 				var sky  = document.getElementById('mysky');
			 				var value = Math.abs(currentZone.value % (clickable.length+1));
			 				console.log(value);
			 				if (sky){
				                sky.setAttribute('src', '#'+ zoneList[value]);
				            }
			 			}
		 			}
		 		})
	    	});
	
		},

		triggerdown:{

		},
    /**
     * Called once when component is attached. Generally for initial setup.
     */
    init2: function () {
      /**
       * Make sure Assets Exists
       */

      if (!assetsChecked) {
        assetsChecked = true;
        if(document.querySelector("a-assets") == null){
          aScene = $("a-scene");
          aAssets = document.createElement("a-assets");
          aScene.prepend(aAssets);
          aAssets = $("a-assets");
        }
      }

      // Gather Up Lazy Loads
      if (!lazyLoadInitiated) {
        lazyLoadInitiated = true;
        initLazyLoading($('[lazy-load]'));
      }

    },

    /**
     * Called when component is attached and when component data changes.
     * Generally modifies the entity based on the data.
     */
    update: function (oldData) {

    },

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    remove: function () {

    },

    // Checking existance of <a-assets>
    assetsChecked: false,
    aScene: null,
    aAssets: null,

    // Checking to see if lazy-load initialized
    lazyLoadInitiated: false,

    // Where we're putting all our assets in load order
    lazyLoadManifest: [],

    initLazyLoading: function(elements){
      console.log("~~~Setting Up Lazy Loading~~~");
      // Reset Stack for jQuery
      setTimeout(function(){

        // Build Load Order
        elements.each(function(i){
          var el = $(elements[i]);
          // If has delay, and not concerned with chunk, set off immediately
          if(el.attr("lazy-load").chunk == undefined && el.attr("lazy-load").delay != undefined){
            dispatchLoad(el);
          }
          // If it has a chunk, add to manifest
          if(el.attr("lazy-load").chunk != undefined){
            var pos = el.attr("lazy-load").chunk;
            // If nothing exists at that position, create new set of arrays
            if(lazyLoadManifest[pos] == undefined){
              lazyLoadManifest[pos] = [[],[]];
            }
            // Prioritize if has src
            if(el.attr("lazy-load").src){
              // 0 array contains only uploads with srcs
              lazyLoadManifest[pos][0].push(el);
            } else {
              // 1 array contains anything with only an id
              lazyLoadManifest[pos][1].push(el);
            }
          }
        });

        // Start Loading! Set in motion recurssion!!!
        console.log("~~~Lazy Loading~~~");
        console.log(lazyLoadManifest);
        runLazyLoad(0,0,lazyLoadManifest.length);
      });
    },

    runLazyLoad: function(currentChunk, currentSet, lastChunk){
      var thisChunk = currentChunk;
      var thisSet = currentSet;

      // Stop if we're past the last chunk
      if(thisChunk > lastChunk){
        return;
      }
      // Check to see if we're in an undefined chunk
      if (lazyLoadManifest[thisChunk] == undefined){
        runLazyLoad((thisChunk+1), 0, lastChunk);
        return;
      }
      // Set Remaining Variables
      var assetsToHandle = lazyLoadManifest[thisChunk][thisSet].length;
      var assetsHandled = 0;

      // Check to see if we're in an empty chunk
      if (lazyLoadManifest[thisChunk][thisSet].length == 0){
        if (thisSet == 0){
          runLazyLoad(thisChunk, 1, lastChunk);
          return;
        } else {
          runLazyLoad((thisChunk+1), 0, lastChunk);
          return;
        }
      } else {
        // Run this chunk if not undefined
        for (var asset in lazyLoadManifest[thisChunk][thisSet]){
          // For each asset in our SRC set
          if (thisSet == 0){
            dispatchLoad(lazyLoadManifest[thisChunk][thisSet][asset], function(){
              assetsHandled++;
              if(assetsHandled == assetsToHandle){
                runLazyLoad(thisChunk, 1, lastChunk);
              }
            });
          } else {
            // Set our material srcs, and increment. 
            lazyLoadManifest[thisChunk][thisSet][asset].attr("material","src:#" + lazyLoadManifest[currentChunk][currentSet][asset].attr("lazy-load").id);
            assetsHandled++;
            if(assetsHandled == assetsToHandle){
              runLazyLoad((thisChunk+1), 0, lastChunk);
            }
          }
        }
      }

    },

    dispatchLoad: function(el,cb){
      setTimeout(function(){
        // If the asset has a SRC
        if(el.attr("lazy-load").src){
          // Add to a-assets
          aAssets.prepend('<img id=' + el.attr("lazy-load").id + ' src="' + el.attr("lazy-load").src + '">');
          // Wait till loaded...
          $('#'+ el.attr("lazy-load").id).on('load', function(){
            // To update entity's material property
            $(el).attr("material","src:#" + el.attr("lazy-load").id);
            // Run callback
            if (cb) return cb();
          });
        } else {
          // Otherwise, just upadte tag
          $(el).attr("material","src:#" + el.attr("lazy-load").id);
          if (cb) return cb();
        }
      }, el.attr("lazy-load").delay || 0);
    }
	});

   //  AFRAME.registerComponent('swap-sky', {
   //      schema: {
   //      },
   //      tick: function(time, dt){
          
   //        try{
   //          if(this.gL && this.gR){
   //            console.log(this.gL.pose);
   //          }else{
   //            console.log('NOT');
   //            var gamepads = window.navigator.getGamepads();
   //            console.log(gamepads);
   //            // check if game pads are on
   //            if( gamepads.length > 2){
   //              if(gamepads[0] && gamepads[0].id == "OpenVR Gamepad"){
   //                this.gL = gamepads[0];
   //              }
   //              if(gamepads[1] && gamepads[1].id == "OpenVR Gamepad"){
   //                this.gR = gamepads[1];
   //              }
   //            }
   //          }
   //        }catch(e){
   //          console.log(e)
   //        }
          
   //      },
   //      init: function () {
			// this.gL = this.gR = null;
			// var data = this.data;
			// var el = this.el;  // <a-box>
			// var mybox = document.getElementById('mybox');
			// if(mybox){

			// }        
          
	  //   }
  	// });


/*AFRAME.registerComponent('set-image', {
  schema: {
    on: {type: 'string'},
    target: {type: 'selector'},
    src: {type: 'string'},
    dur: {type: 'number', default: 300}
  },

  init: function () {
    var data = this.data;
    var el = this.el;

    this.setupFadeAnimation();

    el.addEventListener(data.on, function () {
      // Fade out image.
      data.target.emit('set-image-fade');
      // Wait for fade to complete.
      setTimeout(function () {
        // Set image.
        data.target.setAttribute('material', 'src', data.src);
      }, data.dur);
    });
  },

  setupFadeAnimation: function () {
    var data = this.data;
    var targetEl = this.data.target;

    // Only set up once.
    if (targetEl.dataset.setImageFadeSetup) { return; }
    targetEl.dataset.setImageFadeSetup = true;

    // Create animation.
    targetEl.setAttribute('animation__fade', {
      property: 'material.color',
      startEvents: 'set-image-fade',
      dir: 'alternate',
      dur: data.dur,
      from: '#FFF',
      to: '#000'
    });
  }
});*/