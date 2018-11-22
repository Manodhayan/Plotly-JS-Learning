
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
var average_list=[];
var Minimum_list=[];
var Maximum_list=[];
var date_id=document.getElementById('date_id');
var table_data='';

var firebase_object=firebase.database().ref();

//Add Trailing Zeros
function convert_to_0x(number){
    if (number < 10) {number = "0"+number;}return number;}

var date = today.getFullYear()+'-'+convert_to_0x((today.getMonth()+1))+'-'+convert_to_0x(today.getDate());
function extract_hourly_data(){
    table_data=''; check_time='00';
    average_list=[];Maximum_list=[];Minimum_list=[];
    firebase_object=firebase.database().ref(date+'/'+current_node);
firebase_object.orderByKey().on('value',function(snapshot){
    one_day_fetched_data=snapshot.val();
    for ( var time in one_day_fetched_data){
        if(check_time!=time.substring(0,2)){
            var sum=0;
            var temp_length=0;
            var max=0;
            var min=100;
            (one_day_data[check_time])['temperature']=temperature;
            (one_day_data[check_time])['humidity']=humidity;

            for (var num in (one_day_data[check_time].temperature)){

                var number=parseInt(one_day_data[check_time].temperature[num]);
                if(number<100)
                {sum+=number;temp_length+=1;
                if(max<number){max=number;}if(min>number){min=number;}
                }
            }
            average_list.push(parseInt(sum/temp_length));
            Maximum_list.push(max);
            Minimum_list.push(min);            

            table_data+=("<tr><td>"+date+"</td><td>H : "+check_time+"</td><td>"+parseInt(sum/temp_length)+"</td><td>"+min+"</td><td>"+max+"</td></tr>");
            
            


            check_time=time.substring(0,2);
            temperature=[];
            humidity=[];
        }
        
        //console.log(table_data);
        one_day_data[check_time]=[];
        temperature.push((one_day_fetched_data[time]).temperature);
        humidity.push((one_day_fetched_data[time]).humidity);
    }
    //console.log(one_day_data)
    // var t='00'
    // console.log(one_day_data[t].temperature);
});

console.log(average_list);
console.log(Minimum_list);
console.log(Maximum_list);

}
//Live Data
function live_data(){
var firebase_live_object=firebase.database().ref(date+"/"+current_node);
firebase_live_object.orderByKey().limitToLast(10).on('value',function(snapshot){
    //console.log(current_node,snapshot.key);
    
    last_few_child= snapshot.val();
    //console.log(last_few_child); last_few_time=Object.keys(last_few_child); console.log(last_few_time);
    for ( var time in last_few_child){
        //console.log(time,(last_few_child[time]).temperature,(last_few_child[time]).humidity);
        last_few_time.push(time);
        last_few_temperature.push((last_few_child[time]).temperature);
        last_few_humidity.push((last_few_child[time]).humidity);
    }
  //console.log(last_few_time); console.log(last_few_temperature); console.log(last_few_humidity);


var trace1 = {
    x: last_few_time,
    y:last_few_temperature,
    type: 'spline',
    name:'Temperature'
};
var trace2 = {
    x: last_few_time,
    y: last_few_humidity,
    type: 'spline',
    name:'Humidity'
};
var data = [trace1, trace2];

var layout1 = {
    animate:true,
    xaxis:{title:'Timestamp',
                titlefont:{
                family:'Courier New, monospace',
                size:18,
                color:'#7f7f7f'
                }

            },
    yaxis: {
        title:'Temperature,Humidity',
        titlefont:{
            family:'Courier New, monospace',
            size:18,
            color:'#7f7f7f'
            },
        showline: true,
        zeroline: true,
        range:[0,100]

        
    },
    title:'Last Updated'
};
Plotly.newPlot('chartContainer2', data, layout1);
last_few_time=[];
last_few_temperature=[];
last_few_humidity=[];
var firebase_live_object=firebase.database().ref(date+"/"+current_node);
//console.log(current_node);
});
}


setInterval(function(){ 
room_class=document.getElementById('room_id');
room_id = room_class.options[room_class.selectedIndex].value;
current_node=room_id;
live_data();
if(period_id=='hour')
{extract_hourly_data();
table_body.innerHTML=table_data;
}

else{table_data=''; check_time='00';table_body.innerHTML=table_data;}

period_class=document.getElementById('period_id');
period_id = period_class.options[period_class.selectedIndex].value;
//console.log(room_id,period_id);
}, 500);