(function(w){
	
	w.transformCss = function (node,name,value){
			//创建一个对象，保存名值对（键值对）
//			var obj = {};
			if(!node.abc){
				node.abc = {};
//				console.log(node.abc)
			};
			
			//写入  arguments 实参
			if(arguments.length > 2){
				//1.把名值对添加 对象中  node.abc
				node.abc[name] = value; //{translateX: 200, scale: 0.5}
				
				var result = '';
				
				//2.把 对象node.abc 上属性依次列举出来
				for(var i in node.abc){
					//通过单位 --- 分类
					switch (i){
						case 'translateX':
						case 'translateY':
						case 'translate':
						case 'translateZ':
							result += i+'('+ node.abc[i] +'px) ';
							break;
						case 'scale':
						case 'scaleX':
						case 'scaleY':
							result += i+'('+ node.abc[i] +') ';
							break;
						case 'rotate':
						case 'rotateX':
						case 'rotateY':
						case 'rotateZ':
						case 'skew':
						case 'skewX':
						case 'skewY':
							result += i+'('+ node.abc[i] +'deg) ';
							break;
					}
					
				}
				
				node.style.transform = result;
				
			}else{
				//读取				
				if(node.abc[name] == undefined){
					//1.直接读取  默认值
					if(name == 'scale' || name == 'scaleX' || name == 'scaleY'){
						//1.1  scale --- 1
						value = 1;
					}else{
						//1.2  translate,rotate,skew --- 0
						value = 0;
					};												
					
				}else{
					//2.写入  --- 读取（刚写上去的）
					value = node.abc[name];
				};			
				
				return value;
			}
			
		};
		
	
})(window);
