		$(document).ready(function(){
			$("table").hide();	//隱藏Table
			$("#choose").hide().fadeIn('slow');
					
			/**點擊選單*/
			var isClick = false;	//按鈕是否被啟動
			$("#choose").on('click',function(){				
				$("#usr_menu").slideToggle("fast");				
				if(isClick){
					isClick = false;
					$("#choose").removeAttr('style');
				}
				else{
					isClick = true;
					$("#choose").attr("style","-moz-box-shadow:5px 5px 5px #999 inset;-webkit-box-shadow:5px 5px 5px #999 inset;box-shadow:5px 5px 5px #999 inset;");
				}				
			});
			
							
			/**點擊List	*/
			var listType = '';
			var listPath = '';			
			$("#usr_menu").on('click', 'li', function(){	//click後才搜尋 #usr_menu 的li
				var clickUser = $(this).text();
				if(clickUser == 'Recommend by Job' || clickUser == 'Recommend by Resume'){
				
					//選擇Recommend By "Job" or "Resume"
					if($(this).text() == 'Recommend by Job'){
					listType = 'Job';
					listPath = "data/recommendation/joblist.json";
					$("#userId").text('Job ID');
					$("#icon").html("<img src='images/"+listType+".png' />");
					}
					else{
						listType = 'Resume';	
						$("#userId").text('User ID');	
						listPath = "data/recommendation/resumelist.json";
						$("#icon").html("<img src='images/"+listType+".png' />");					
					}				
					//usr_menu
					$.getJSON( listPath , function(data){
						$("#usr_menu").html('');		
						var userList = '<ul><li>back</li>'
						for(var i=1; i <= data.resumes.length; i++)
							userList += '<li>'+listType+'_' + ((i<10)? '0'+ i : i) + '</li>';
						userList += '</ul>';
						$("#usr_menu").append(userList);
					});
				}
				
				//選擇List
				else{		
					if(clickUser == 'back'){
						$("#usr_menu").html("");
						$("#usr_menu").html("<ul><li>Recommend by Job</li><li>Recommend by Resume</li></ul>");
					}
					else{
						$("#choose").text( clickUser );
						var num = clickUser.substring(clickUser.length -2);
						loadResume(parseInt(num) - 1);
						console.log(clickUser.substring(0,clickUser.length-3));
						isClick = false;
					}
				}
			});
				
			/**Show推薦清單*/
			function loadResume(uid){
			
				
				//讀取resumelist檔取出使用者
				$.getJSON("data/recommendation/resumelist.json", function(data1){
					var doc= 'data/recommendation/';
					doc += data1.resumes[uid].id_no;
					doc += ".json";
					//console.log(doc);
					$("#icon").html("<a href='"+data1.resumes[uid].referer+"' target='_blank'><img src='images/"+listType+".png' /></a>");
					$("#userId").html("<a class='hint--bottom' data-hint='"+data1.resumes[uid].words+"' >User ID : " + data1.resumes[uid].id_no + "</a>")
					console.log(data1.resumes[uid].id_no);
					$.getJSON(doc, function(data){
						var info = '';
						var arr = data.jobs;
						var rank = 1;
/*
						arr = arr.sort(function(a, b){
							if (a.similarity < b.similarity)	return 1;
							if (a.similarity > b.similarity)	return -1;
							return 0;
						});
					*/	
					
						
						for( var i=0; i < arr.length; i++){
							var similar = parseFloat(arr[i].similarity.toString());
							similar = Math.round(similar*1000)/10;	//similar 百分比取小數1位
							
							info += "<tr>";
							info += "<td class='rank'><div class='tbg1'><div class='tbg1' style='background-color:#CCAB6A;width:";
							info += similar +"%;'><span class='ranking'>"+(i + 1)+"</span >";
							info += "<span class='result' style='left:50px;'>"+ similar +"</span></div></div></td>";
							info += "<td class='rank'><a  class='hint--bottom' data-hint='"+arr[i].words+"'href="+arr[i].url;
							info += "  target='_blank'><div class='tbg2'><span class='job'>";
							info += arr[i].title;
							info += "</span ><span class='com'>"+arr[i].company+"</span></div></a></td>";
							info += "<td><a href='clusters.html?0"+ (arr[i].group<10?'0'+arr[i].group:arr[i].group) +"'  target='_blank'>";
							info += "<img src='images/skill_clustering_g.gif'/></a><td/>";
							info += "</tr>";
						}
						$("#bg_info").hide();
						$("#tags").html("");
						$("#usr_menu").slideUp("fast");
						$("#choose").removeAttr('style');						
						
						if(arr.length == 0){
							console.log('ZERO');
							$("#bg_info").html('No Recommendation can be provided.<p><span>Sorry...</span>');
							$("#bg_info").attr('style','border:2px solid #868686;border-radius:25px;height:200px;margin-bottom:38%;').show();
							$('table').hide();
						}else{
							$("#tags").append(info);
							$("table").fadeIn("fast");
						}												
					});		
				});
			};
			
			
		});