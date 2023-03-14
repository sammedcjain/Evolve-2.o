$.ajax({
    url:"http://localhost:3000/kookaburra",
    method: "POST",
     data : {
         company: company,
         vehicle: vehicle,
         price: price,
         range: range,
         speed: speed
     },
    cache : false,
    success : function (data) {
      console.log("Response received: ", data);
        console.log(data);
        if(1){
            alert("Db already exists! Cannot add redundant pairs");
            console.log("Entering if loop");
        }
        else if(data["added"]){
            alert("Items added successfully");
        }
    },
    error : function (xhr, status, error) {
        console.log(error);
        alert("Oops! Something went wrong.");
    }
});
