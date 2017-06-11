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
	AFRAME.registerComponent('grab',{
		schema: {
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