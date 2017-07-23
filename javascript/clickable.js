module.exports = function(AFRAME, objList, ){
	AFRAME.registerComponent('changePage',{
		schema: {
			deriction: {default: 1, type:'number'},
			state:{default:"dormant"},
			index:{default:'null', type:"number"}
		},
		init:function(){
			objList.push(this);
			console.log(objList);
		},
		update: function(){
			if(this.state === 'active'){
				console.log('run');
			}
		},
		onClick: function(index, page){
			console.log(index)
			return page[index];
		}
	})
}