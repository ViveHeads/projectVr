var AFRAME = require('aframe');
console.log('here');
 AFRAME.registerComponent('slap',{
        init: function(){
          this.rh = document.getElementById('rh');
          this.lh = document.getElementById('lh');
          this.mybox = document.getElementById('mybox');
        },
        tick: function(t,dt){
          var box_position = this.mybox.object3D.position;
          var rh_position= this.rh.object3D.position;
          if(box_position.distanceTo(rh_position) < 0.5){
            let sky = document.getElementById('mysky')
            if (sky.getAttribute('src') == '#sky'){
                sky.setAttribute('src', '#grid');
            }
          }
        }
      });
      
      
      AFRAME.registerComponent('swap-sky', {
        schema: {
        },
        tick: function(time, dt){
          
          try{
            if(this.gL && this.gR){
              console.log(this.gL.pose);
            }else{
              console.log('NOT');
              var gamepads = window.navigator.getGamepads();
              console.log(gamepads);
              // check if game pads are on
              if( gamepads.length > 2){
                if(gamepads[0] && gamepads[0].id == "OpenVR Gamepad"){
                  this.gL = gamepads[0];
                }
                if(gamepads[1] && gamepads[1].id == "OpenVR Gamepad"){
                  this.gR = gamepads[1];
                }
              }
            }
          }catch(e){
            console.log(e)
          }
          
        },
        init: function () {
          this.gL = this.gR = null;
          var data = this.data;
          var el = this.el;  // <a-box>
          var mybox = document.getElementById('mybox');
          if(mybox){
           
          }
          
          /*
          if (mysky.getAttribute('src') == '#sky'){
            mysky.setAttribute('src', '#grid'); 
          }
          */
          
          
          }
      });