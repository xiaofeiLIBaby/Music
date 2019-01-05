(function(window){
	
	window.dragBind = function (navWrap,callback){
			//基础滑动 ， 橡皮筋拖 ， 橡皮筋回弹 ， 加速 , 即点即停 ，防抖动
			
			var navList = navWrap.children[0];
			transformCss(navList,'translateZ',0.1);
			
			//定义元素初始位置
			var eleY = 0;
			//定义手指初始位置
			var startY = 0;
			
			//加速
			var s1 = 0;
			var t1 = 0;
			var s2 = 0;
			var t2 = 0;
			var disS = 0;
			var disT = 1; //非零数字
			
			var Tween = {
				//中间过程：正常加速  --- 匀速
				Linear: function(t,b,c,d){ return c*t/d + b; },			
				//两边效果：橡皮筋回弹  --- 回弹
				easeOut: function(t,b,c,d,s){
		            if (s == undefined) s = 1.70158;
		            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		        }
			};
			var timer = null;
			
			//防抖动
			var startX = 0;
			var isFirst = true;
			var isY = true;
			
			//手指按下
			navWrap.addEventListener('touchstart',function(event){
				var touch = event.changedTouches[0];
				
				//真正的即点即停
				clearInterval(timer);
				
				//清除过渡
				navList.style.transition = 'none'
				
				//元素初始位置
				eleY = transformCss(navList,'translateY');
				//手指初始位置
				startY = touch.clientY;
				startX = touch.clientX;
				
				//加速
				s1 = eleY;
				t1 = new Date().getTime(); // 毫秒
				
				//清除上一次disS的结果，保证speed为0
				disS = 0;
				
				//重置
				isFirst = true;
				isY = true;
				
				//检测touchstart 状态 （外部逻辑）
				if(callback && typeof callback['start'] === 'function'){
					callback['start']();
				};
				
			});
			//手指移动
			navWrap.addEventListener('touchmove',function(event){
				var touch = event.changedTouches[0];
				
				if(!isY){
					return;
				};
				
				//手指结束位置
				var endY = touch.clientY;
				var endX = touch.clientX;
				//手指距离差
				var disY = endY - startY;
				var disX = endX - startX;
				
				//范围限定 （橡皮筋越来越难拖）
				var translateY = disY+eleY;
				//橡皮筋越来越难拖  左边
				if(translateY > 0){
					var scale = 0.6 - translateY/(document.documentElement.clientHeight*3);					
					translateY = 0 + translateY * scale;					
				}else if(translateY < document.documentElement.clientHeight-navList.offsetHeight){
					//右边留白(正值) = translateY - 临界值
					var over = Math.abs(translateY) - Math.abs(document.documentElement.clientHeight-navList.offsetHeight)
					//比例 = 1 - 留白/屏幕宽     逐渐减小
					var scale = 0.6 - over/(document.documentElement.clientHeight*3);
					
					//新的translateY（负数） = 临界值 + 新的右边留白
					translateY = document.documentElement.clientHeight-navList.offsetHeight - over * scale;
				};
				
				if(isFirst){
					isFirst = false;
					if(Math.abs(disX) > Math.abs(disY)){
						//垂直方向逻辑禁止掉
						isY = false;
						return;
					}
				}
				
				//确定元素最终位置
				transformCss(navList,'translateY',translateY);
//				console.log('translateY='+translateY)
				
				//加速
				s2 = translateY;
				t2 = new Date().getTime();
				
				disS = s2 - s1;
				disT = t2 - t1;
				
				//检测touchmove 状态 （外部逻辑）
				if(callback && typeof callback['move'] === 'function'){
					callback['move']();
				};
				
			});
			//手指离开 --- 加速
			navWrap.addEventListener('touchend',function(){
				//速度 = 距离差/时间差
				var speed = disS / disT;
//				console.log('speed='+speed)
				
				//元素目标位置 = touchmove 产生的位移值 + 速度产生的位置
				var target = transformCss(navList,'translateY')+ speed*100;
//				console.log('translateY='+transformCss(navList,'translateY'))
//				console.log('target='+target)
				
				var type = 'Linear';
				if(target > 0){
					target = 0;
					type = 'easeOut';
				}else if(target < document.documentElement.clientHeight-navList.offsetHeight){
					target = document.documentElement.clientHeight-navList.offsetHeight;
					type = 'easeOut';
				};
				
				//总时间
				var timeAll = 1;
				//tween算法模拟加速与回弹
				tweenMove(target,timeAll,type);
				
				
				
				
			});
			function tweenMove(target,timeAll,type){
				//t : 当前次数
				var t = 0;
				//b : 元素初始位置
				var b = transformCss(navList,'translateY');
//				console.log('b='+b)
				//c : 元素结束位置与初始位置  距离差
				var c = target - b;
//				console.log('c='+c)
				//d : 总次数 = 总时间/每次花费的时间
				var d = timeAll/0.02;
//				console.log(d)
				
				//重置开启定时器，清除上一次的定时器
				clearInterval(timer);
				timer = setInterval(function(){
					t++;
					
					if(t > d){
						if(callback && typeof callback['end'] === 'function'){
							callback['end']();
						};
						//元素停止状态
						//停止定时器
						clearInterval(timer)
					}else{
						if(callback && typeof callback['move'] === 'function'){
							callback['move']();
						};
						//元素正常走的状态（加速和回弹）
						var point = Tween[type](t,b,c,d);
//						console.log(point)
						transformCss(navList,'translateY',point);
					}
					
					
				},20);
				
				
				
			};
			
		};
		
	
})(window);
