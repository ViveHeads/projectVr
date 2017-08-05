var zoneList = ['zone-1', 'zone-2', 'zone-3']; // fill by query
var index = 0;
module.exports = function(AFRAME, objList ){
	AFRAME.registerComponent('changepage',{
		schema: {
			deriction: {default: 1, type:'number'},
			state:{default:"dormant"},
			index:{default:'null', type:"number"}
		},
		init:function(){
			objList.push(this);
			this.el.setAttribute('src', getZone(index+1));
			var scene = document.querySelector('a-scene');
			var sky = scene.querySelector('a-sky');
			sky.setAttribute('src',  getZone(index));
      		this.el.addEventListener('click', this.onClick);
			console.log(objList);
		},
		update: function(){
			if(this.state === 'active'){
				console.log('run');
			}
		},
		onClick: function(){
			index++
			this.setAttribute('src', getZone(index+1));
			var scene = document.querySelector('a-scene');
			var sky = scene.querySelector('a-sky');
			sky.setAttribute('src',  getZone(index));
			console.log('works');
		}
	})
}


function getZone(index){
	return  '#' + zoneList[index % zoneList.length];
}