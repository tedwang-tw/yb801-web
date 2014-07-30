$(document).ready(function(){
			
			var clusterList = 'data/clusters/clustergroup.json';
			var clusterType = '';
			$("table").hide();	//隱藏Table
			$('#selector').hide();			
			
			//外部連進網頁處理
			var sideNum = location.search.substring(1);//取得網址'?'後的id三碼
			if(sideNum != ""){
				//alert('location.search: '+sideNum);
				$("#bgimg").hide();
				$('#selector').show();
				$("#choose").text( "Cluster "+ sideNum );
				
				//usr_menu
				$.getJSON(clusterList, function(data){
					$("#usr_menu").html("");
					var userList = '<ul>'
					for(var i=1; i<= data.clusters.length; i++)
					userList += '<li>Job 0'+ ((i<10)? '0'+ i : i) + '</li>';
					userList += '</ul>';
					$("#usr_menu").append(userList);
					clusterType = 'Job';
				});
				$('#job_button').attr('style','background-color:#80B2CC;color:black;');
				loadGroup_job(sideNum);
			}					
			
			
			//選擇Skill or Job
			$(".toggle_button").on('click',function(){
			
				//Change 藍色標記
				$('.toggle_button').removeAttr('style');	
				$(this).attr('style','background-color:#80B2CC;color:black;');
				
				
				$('#selector').fadeIn('slow');
				
				if($(this).text() == 'Job')
					clusterType = 'Job';
				else
					clusterType = 'Skill';			
				//$("#choose").html( clusterType + "'s Cluster " );
				
				
				//Toggle Job <-> Skill 資料轉換
				if($('#tags').text() != ""){
					var clusterNo = $('thead h3').text();
					clusterNo = clusterNo.substring(clusterNo.length -3);
					if(clusterType == 'Job')
						loadGroup_job(clusterNo);
					else
						loadGroup_skill(clusterNo);
				}
								
				//usr_menu
				$.getJSON(clusterList, function(data){
					$("#usr_menu").html("");
					var userList = '<ul>'
					for(var i=0; i< data.clusters.length; i++)
					userList += '<li>'+ clusterType +'  ' + data.clusters[i].id + '</li>';
					userList += '</ul>';
					$("#usr_menu").append(userList);
				});
						
			});
			
			var isClick = false;
			//點擊選單
			$("#choose").on('click',function(){
				$("#usr_menu").slideToggle("fast");	
				$("#choose").removeAttr("style");	//移除提示黃光 or 按鈕凹陷效果
				$("#choose").text( "Select Cluster" );
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
				
				var num = clickUser.substring(clickUser.length -3);
				$("#choose").text( "Cluster "+ num );
				console.log(num);
				if(clusterType == 'Job')
					loadGroup_job(num);
				else
					loadGroup_skill(num);
				isClick = false;
				$("#choose").removeAttr("style");
			});
			
			//show Skill Cloud
			function loadGroup_skill(uid){
				$.getJSON("data/clusters/keywords/"+uid+".json", function(data){
					var info = '';	
					$("thead h3").text("Cluster-"+uid);
					info += '<tr><td><ul>';
					$.each(data.cloud, function(index, contactInfo){
						var size = data.cloud.length;
						var freq = 0;
						if(index <20) 
							freq = 5;
						else{
							if (index >=20 && index < size/4*1 )
								freq = 4;
							else if (index >= size/4*1  && index < size/2 )
								freq = 3;
							else if (index >= size/2 && index < size/4*3 )
								freq = 2;
							else
								freq = 1;
						}						
						info += '<li class="tag'+ freq +'">';
						info += contactInfo.keyword + "</li>";
					});
					info += '</ul></td></tr>';
					$("html,body").animate({scrollTop:0},900);
					$("#tags").html("");
					$("#tags").append(info);
					$("table").fadeIn("fast");
				});
			};
			//Show JOB Group
			function loadGroup_job(uid){
				
				//JOB Cluster
				var doc = 'data/clusters/jobs/'+uid+'.json';
				$.getJSON(doc, function(data){
					var info = '';
					var arr = data.group;
					var bg = 2;
					$("thead td").attr("colspan","3");
					$("thead h3").text("Cluster-"+uid);
					for( var i=0; i < arr.length/3; i+=3){
						if(arr[i].company.toString().substring(0,5) != '104測試'){
							
							info += "<tr>";
							for(var j=0; j < 3; j++){ //一排顯示三筆資料
								info += "<td class='rank'><a class='hint--bottom' data-hint='"+arr[i +j].words+"' href="+arr[i +j].url;
								info += " target='_blank' ><div class='tbg"+bg+"'><span class='job'>";
								info += arr[i +j].title;
								info += "</span ><span class='com'>"+arr[i +j].company+"</span></div></a></td>";
								
							}
							info += "</tr>";
							if(bg==2) 	bg = 1;
								else 	bg = 2;						
						}
					}
					$("html,body").animate({scrollTop:0},900);		
					$("#tags").html("");
					$("#tags").append(info);
					$("table").fadeIn("fast");
				});	
			};
		});