		$(document).ready(function(){
			$("table").hide();	//隱藏Table
			$("#choose").attr("style","box-shadow: 0px 0px 15px yellow;");	//提示黃光
			
			
			//usr_menu
			$.getJSON("data/recommendation/resumelist.json", function(data){
				var userList = '<ul>'
				for(var i=1; i <= data.resumes.length; i++)
					userList += '<li>user_' + i + '</li>';
				userList += '</ul>';
				$("#usr_menu").append(userList);
			});
			
			//點擊選單
			var isClick = false;	//按鈕是否被啟動
			$("#choose").on('click',function(){				
				$("#usr_menu").slideToggle("fast");				
				$("#choose").removeAttr("style");	//移除提示黃光
				if(isClick){
					isClick = false;
				}
				else{
					isClick = true;
					$("#choose").attr("style","-moz-box-shadow:5px 5px 5px #999 inset;-webkit-box-shadow:5px 5px 5px #999 inset;box-shadow:5px 5px 5px #999 inset;");
				}
					
			});
			
			//點擊使用者
			
			$("#usr_menu").on('click', 'li', function(){	//click後才搜尋 #usr_menu 的li
				$("#usr_menu").slideUp("fast");
				$("#bgimg").hide();
				var clickUser = $(this).text();
				$("#choose").text( clickUser );
				$("#choose").removeAttr("style");
				loadResume(parseInt( clickUser.substring(clickUser.length -1)) - 1);
				isClick = false;
			});
				
			//Show推薦清單
			function loadResume(uid){
				
				//讀取resumelist檔取出使用者
				$.getJSON("data/recommendation/resumelist.json", function(data1){
					var doc= 'data/recommendation/';
					doc += data1.resumes[uid].id_no;
					doc += ".json";
					console.log(doc);
					$("#userId").text("User ID : " + data1.resumes[uid].id_no);
					$.getJSON(doc, function(data){
						var info = '';
						var arr = data.jobs;
						var rank = 1;

						arr = arr.sort(function(a, b){
							if (a.similarity < b.similarity)	return 1;
							if (a.similarity > b.similarity)	return -1;
							return 0;
						});
						
						for( var i=0; i < arr.length; i++){
							var similar = parseFloat(arr[i].similarity.toString());
							similar = Math.round(similar*1000)/10;	//similar 百分比取小數1位
						
							info += "<tr>";
							info += "<td class='rank'><div class='tbg1'><div class='tbg1' style='background-color:#CCAB6A;width:";
							info += similar +"%;'><span class='ranking'>"+(i + 1)+"</span >";
							info += "<span class='result' style='left:50px;'>"+ similar +"</span></div></div></td>";
							info += "<td class='rank'><a href="+arr[i].url+"  target='_blank'><div class='tbg2'><span class='job'>";
							info += arr[i].title;
							info += "</span ><span class='com'>"+arr[i].company+"</span></div></a></td>";
							info += "<td><a href='clusters.html?0"+arr[i].group+"'><img src='images/skill_clustering_g.gif'/></a><td/>";
							info += "</tr>";
						}
						
						$("#tags").html("");
						$("#tags").append(info);
						$("table").fadeIn("fast");
					});		
				});
			};
			
			
		});