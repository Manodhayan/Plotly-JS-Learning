
var today = new Date();// Get Date
var last_few_child;
var last_few_time=new Array();
var last_few_temperature=new Array();
var last_few_humidity=new Array();
var current_node='lora_feather';
var one_day_fetched_data=new Array();
var check_time='00';
var one_day_data = new Object();
var temperature=new Array();
var humidity=new Array();
var room_class=document.getElementById('room_id');
var room_id = room_class.options[room_class.selectedIndex].value;
var period_class=document.getElementById('period_id');
var period_id = period_class.options[period_class.selectedIndex].value;
var data_type_class=document.getElementById('data_type_id');
var data_type_id =data_type_class.options[data_type_class.selectedIndex].value;
var input_date = document.getElementById("date_id").value;
//console.log(input_date);
var hourly_average_list=[];
var hourly_Minimum_list=[];
var hourly_Maximum_list=[];
var hourly_time_list=[];
var date_id=document.getElementById('date_id');
var table_data='';
var weekly_table_data='';

var firebase_object=firebase.database().ref();

function plot_graph(stat_data){
if (data_type_id=='Temperature'){data_type_id=data_type_id+ " (*C)"}
if (data_type_id=='Humidity'){data_type_id=data_type_id+ " (%)"}
//stat_data[0] - time  stat_data[1] - average   stat_data[2] - Maximum  stat_data[3] - Minimum
    var average_trace = {
        x: stat_data[0],
        y:stat_data[1],
        type: 'bar',
        name:'Average'
    };
    var Maximum_trace = {
        x: stat_data[0],
        y: stat_data[2],
        type: 'bar',
        name:'Maximum'
    };
    var Minimum_trace = {
        x: stat_data[0],
        y: stat_data[3],
        type: 'bar',
        name:'Minimum'
    };
    var graph_data = [average_trace, Minimum_trace,Maximum_trace];
    
    var layout1 = {
        animate:true,
        //barmode: 'stack',
        xaxis:{title:'Timestamp',
                    titlefont:{
                    family:'Courier New, monospace',
                    size:18,
                    color:'#7f7f7f'
                    }
    
                },
        yaxis: {
            //title:'Temperature(*C),Humidity(%)',
            title:data_type_id,
            titlefont:{
                family:'Courier New, monospace',
                size:18,
                color:'#7f7f7f'
                },
            showline: true,
            zeroline: true,
            range:[Math.min(...stat_data[3])-10,Math.max(...stat_data[2])+10]
    
            
        },
        //title:'Last Updated'
    };
    Plotly.newPlot('chartContainer2', graph_data, layout1);
}


//Weekly Data Calculation
function extract_weekly_data(){
    weekly_table_data=""
    var weekly_time_list=[];
    var weekly_average_list=[];
    var weekly_Maximum_list=[];
    var weekly_Minimum_list=[];
    var sum=0,length=0,average=0,max=0,min=100; 
    var firebase_week_object=firebase.database().ref();
    firebase_week_object.orderByKey().limitToLast(5).on('value',function(snapshot){
        for (var iter_date in Object.keys(snapshot.val()))
        {
            var weekly_data=extract_hourly_data(Object.keys(snapshot.val())[iter_date]);
            //console.log(Object.keys(snapshot.val())[iter_date]);
            
            for (var num in weekly_data[1]){
                sum=sum+(weekly_data[1])[num];
                //console.log(sum);
                length+=1;

            }
            for (var num in weekly_data[2]){
                if((weekly_data[2])[num]>max){max=(weekly_data[2])[num];}}

            for (var num in weekly_data[3]){
                if((weekly_data[3])[num]<min){min=(weekly_data[3])[num];}}
            
                //console.log(sum,length);
            weekly_time_list.push(Object.keys(snapshot.val())[iter_date]);
            weekly_average_list.push(sum/length);
            weekly_Maximum_list.push(max);
            weekly_Minimum_list.push(min);
            weekly_table_data+=("<tr><td>"+Object.keys(snapshot.val())[iter_date]+"</td><td>Week 39</td><td>"+parseInt(sum/length)+"</td><td>"+min+"</td><td>"+max+"</td></tr>");
        }
    });
   
//console.log(weekly_time_list,weekly_average_list,weekly_Maximum_list,weekly_Minimum_list)
    return [weekly_time_list,weekly_average_list,weekly_Maximum_list,weekly_Minimum_list];

}


//Add Trailing Zeros
function convert_to_0x(number){
    if (number < 10) {number = "0"+number;}return number;}

var today_date = today.getFullYear()+'-'+convert_to_0x((today.getMonth()+1))+'-'+convert_to_0x(today.getDate());
function extract_hourly_data(date){
    table_data=''; check_time='00';
    hourly_average_list=[];hourly_Maximum_list=[];hourly_Minimum_list=[]; hourly_time_list=[];
    firebase_hour_object=firebase.database().ref(date+'/'+current_node);
firebase_hour_object.orderByKey().on('value',function(snapshot){
    one_day_fetched_data=snapshot.val();
    check_time=(Object.keys(one_day_fetched_data)[0]).substring(0,2);
    for ( var time in one_day_fetched_data){
        if(check_time!=time.substring(0,2)){
            var sum=0;
            var temp_length=0;
            var max=0;
            var min=100;
    
            (one_day_data[check_time])['temperature']=temperature;
            (one_day_data[check_time])['humidity']=humidity;
            if(data_type_id=='Temperature')
            {
            for (var num in (one_day_data[check_time].temperature)){

                var number=parseInt(one_day_data[check_time].temperature[num]);
                if(number<100)
                {sum+=number;temp_length+=1;
                if(max<number){max=number;}if(min>number){min=number;}
                }
            }
            hourly_average_list.push(parseInt(sum/temp_length));
            hourly_Maximum_list.push(max);
            hourly_Minimum_list.push(min);
            hourly_time_list.push(check_time);            

            table_data+=("<tr><td>"+date+"</td><td>H : "+check_time+"</td><td>"+parseInt(sum/temp_length)+"</td><td>"+min+"</td><td>"+max+"</td></tr>");
        }
        if(data_type_id=='Humidity')
        {
        for (var num in (one_day_data[check_time].humidity)){

            var number=parseInt(one_day_data[check_time].humidity[num]);
            if(number<100)
            {sum+=number;temp_length+=1;
            if(max<number){max=number;}if(min>number){min=number;}
            }
        }
        hourly_average_list.push(parseInt(sum/temp_length));
        hourly_Maximum_list.push(max);
        hourly_Minimum_list.push(min);
        hourly_time_list.push(check_time);            

        table_data+=("<tr><td>"+date+"</td><td>H : "+check_time+"</td><td>"+parseInt(sum/temp_length)+"</td><td>"+min+"</td><td>"+max+"</td></tr>");
        }
            


            check_time=time.substring(0,2);
            temperature=[];
            humidity=[];
        }
        
        //console.log(table_data);
        //console.log((one_day_fetched_data[time]).temperature);
        one_day_data[check_time]=[];
        temperature.push((one_day_fetched_data[time]).temperature);
        humidity.push((one_day_fetched_data[time]).humidity);
    }

    
    //console.log(one_day_data)
    // var t='00'
    // console.log(one_day_data[t].temperature);


});
return [hourly_time_list,hourly_average_list,hourly_Maximum_list,hourly_Minimum_list];
//console.log(hourly_average_list);
//console.log(hourly_Minimum_list);
//console.log(hourly_Maximum_list);

}
//Live Data
var firebase_live_object=firebase.database().ref(today_date+"/"+current_node);
firebase_live_object.on('child_added',function(snapshot){
    //console.log(current_node,snapshot.key);
    
    last_few_child= snapshot.val();
    live_data_time.innerHTML=today_date+"/ "+ snapshot.key;
    live_table.innerHTML=("<tr><td>Temperature: <b style=\"font-size:25px\">"+last_few_child.temperature+" *C </b> Humidity: <b style=\"font-size:25px\">"+last_few_child.humidity+"%</b></td></tr>");

    //console.log(last_few_child); last_few_time=Object.keys(last_few_child); console.log(last_few_time);
    // for ( var time in last_few_child){
    //     //console.log(time,(last_few_child[time]).temperature,(last_few_child[time]).humidity);
    //     last_few_time.push(time);
    //     last_few_temperature.push((last_few_child[time]).temperature);
    //     last_few_humidity.push((last_few_child[time]).humidity);
    // }
  //console.log(last_few_time); console.log(last_few_temperature); console.log(last_few_humidity);


});



setInterval(function(){ 
room_class=document.getElementById('room_id');
room_id = room_class.options[room_class.selectedIndex].value;
if(current_node!=room_id)
{
    live_table.innerHTML=""
    var firebase_live_object=firebase.database().ref(today_date+"/"+current_node);
    firebase_live_object.on('child_added',function(snapshot){
    last_few_child= snapshot.val();
    live_data_time.innerHTML=today_date+"/ "+ snapshot.key;
    live_table.innerHTML=("<tr><td>Temperature: <b style=\"font-size:25px\">"+last_few_child.temperature+" *C </b> Humidity: <b style=\"font-size:25px\">"+last_few_child.humidity+"%</b></td></tr>");});
}
current_node=room_id;

period_class=document.getElementById('period_id');
period_id = period_class.options[period_class.selectedIndex].value;

data_type_class=document.getElementById('data_type_id');
data_type_id =data_type_class.options[data_type_class.selectedIndex].value;

//calender_type_class=document.getElementById('calender_type_id');
//calender_type_id =calender_type_class.options[calender_type_class.selectedIndex].value;
//"<input type=\"date\" name=\"bday\" id=\"date_id\" value=\"\">"
input_date = document.getElementById("date_id").value;

//console.log(input_date);

if(period_id=='hour')
{
//calender_type_id.innerHTML= "<input type=\"date\" name=\"bday\" id=\"date_id\" value=\"\">"
if(input_date=='')
{   console.log("No date Selected");
    input_date=today_date;}
plot_graph(extract_hourly_data(input_date));
table_body.innerHTML=table_data;
}

else if(period_id=='week')
{
table_body.innerHTML="";
plot_graph(extract_weekly_data());
table_body.innerHTML=weekly_table_data;
//calender_type_id.innerHTML= "<input type=\"week\" name=\"bday\" id=\"date_id\" value=\"\">"
}
else{
    table_data='<tr><h4>No Data Available :(<h4></tr>'; check_time='00';table_body.innerHTML=table_data;
//plot_graph([]);
}


//console.log(data_type_id);
//console.log(room_id,period_id);
}, 1000);