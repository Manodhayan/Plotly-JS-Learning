//Get Date 
var today = new Date();
//Add Trailing Zeros
function convert_to_0x(m){
    if (m < 10) {m = "0"+m;}return m}

var date = today.getFullYear()+'-'+convert_to_0x((today.getMonth()+1))+'-'+convert_to_0x(today.getDate());
console.log(date);