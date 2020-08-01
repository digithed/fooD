const express = require('express');
const axios = require('axios');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://quickdeliver-d9180.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("server/signUp");

app.use(express.json());

var port = 3001;
var currentSession;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT");
  next();
});

 app.post("/apiCall", (req, response) => {
 	var location = req.body.location;
 	var lat = req.body.lat;
 	var long = req.body.long;

 	axios.get('https://api.yelp.com/v3/businesses/search', {
     params: {
      term: req.body.term,
      location: location,
      latitude: lat,
      longitude: long,
      limit: req.body.limit,
     },
     headers: {
    Authorization: 'Bearer ' + 'BDKJluIkcQa-Lwn_Ye9BfW_m8ajO-agWP-WXdpyAMJ3O6iAhangiPCn8Sjch8MF2mikafe4gxR1xxM0h69cCAYBuFlTn0tOvHc2vpiogz3TAHkaRGDeZVRXf46i9XnYx'
 }
    })
    .then( res => {
       if(lat == null && long == null){
      
  		lat = res.data.businesses[0].coordinates.latitude;
  		long = res.data.businesses[0].coordinates.longitude;

  }
      

      if(req.body.limit > 1){
      res.data = res.data.businesses.filter((biz) => {
        
      		if(biz.rating >= 4){
      			return biz;

      	}

      })
    }

       var json = {data: res.data, isgood: true, viewport:{center: [lat,long], zoom:15}, isloading:false};
     
   	   response.send(json);
    
      
    
    })
    .catch( err => {
      console.log('err');
    })




});

//  app.post("/apiCallFeed", (req, response) => {

//   axios.get(`https://api.yelp.com/v3/businesses/${req.body.id}`, {
//      headers: {
//     Authorization: 'Bearer ' + 'BDKJluIkcQa-Lwn_Ye9BfW_m8ajO-agWP-WXdpyAMJ3O6iAhangiPCn8Sjch8MF2mikafe4gxR1xxM0h69cCAYBuFlTn0tOvHc2vpiogz3TAHkaRGDeZVRXf46i9XnYx'
//  }
//     })
//     .then( res => {
//       console.log(res.data.coordinates.latitude);
//       lat = res.data.coordinates.latitude;
//       long = res.data.coordinates.longitude;

//        var usersRef = ref.child(`users/${currentSession}`);
//        var viewport = {center: [lat,long], zoom:14}


//        var json = {data: res.data, isgood: true, viewport:{center: [lat,long], zoom:14}, isloading:false, lat: lat, long: long};
      
   
  
//           usersRef.update({
//             'friend_name': req.body.name,
//             'viewport': viewport
//           })

//           response.send(json);

       

   
    
      
    
//     })
//     .catch( err => {
//       console.log(err);
//     })


// });


// app.get("/getViewport", (req,res) => {
//   var usersRef = ref.child(`users/${currentSession}`);
//   usersRef.on('value', (snapshot) => {
//     console.log(snapshot.val());
//     res.send({viewport: snapshot.val().viewport});
//   });
  

// })


 app.post("/createUser", (req, res) => {
  var friends = req.body.friends.split(",");
 	var usersRef = ref.child("users");
 	usersRef.push({
 		name: req.body.name,
 		email: req.body.email,
 		pass: req.body.pass,
 		history: ["liked Mike's Pastry", "Visited Yotel Seaport"],
    friends: friends,
    ids: [''],
 	});

  // usersRef.on('value', (snapshot) => {
  //   snapshot.forEach( (child) => {
  //     if(child.val().email == req.body.email && child.val().pass == req.body.pass){
  //       currentSession = child.key;
  //     }
  //   })
  // })

  res.send({good: 'good job'});

 	});


app.post("/updateLike", (req, res, err) => {
  var usersRef = ref.child("users");
  var innerRef;
  var go = false;
  var reference;
  var mydata;
  usersRef.on('value', (snapshot) => {
    snapshot.forEach( (child) => {

      
    if(child.val().name == req.body.name){
      innerRef = ref.child(`/users/${child.key}`);
      reference = child.val()
      go = true;
    }
        
    
        
    })
    
  })

if(go == true){
  if(reference.ids != null){
  reference.ids.push(req.body.id);
  mydata = reference.ids;
}
else{
  mydata = [req.body.id];
  }
  innerRef.update({
        ids: mydata
      })
}


})

 app.post("/login", (req, res) => {

 	var usersRef = ref.child("users");
 	var s;
 	usersRef.on('value', (snapshot) => {
 		snapshot.forEach( (child) => {
 			if(child.val().email == req.body.email && child.val().pass == req.body.pass){
 				console.log("found");
 				s = true
 				currentSession = child.key;
 				res.send({success: true, name: child.val().name});
 			}

 		})
 				if(!s){
 					res.send({success: false});
 				}


 })



 	 

 })

 app.get("/history", (req, res) => {
 	var usersRef = ref.child("users" + `/${currentSession}`);
  console.log(currentSession);
 	usersRef.on('value', (snapshot) => {
    if(snapshot.val() != null){
 		res.send({history: snapshot.val().history});
  }
  else{
    res.send({history: ['None']});
  }
 	})
 })

 app.get("/getFriends", (req, res) => {
  var usersRef = ref.child("users" + `/${currentSession}`);
  var data;
  var final = {}

  
  usersRef.on('value', (snapshot) => {
    if(snapshot.val() != null){
    data = snapshot.val().friends
  }
  else{
    data = null;
  }

  })

  if(data != null){

  var newRef = ref.child("users");
  newRef.on('value', (snapshot) => {
    snapshot.forEach( (child) => {
    var i = 0;
    for(i = 0; i < data.length; i++){
    if(child.val().name == data[i]){
      var ids = child.val().ids;
      final[data[i]] = ids;
    }
  }
})
  })}
  else{
    final = null;
  }
  res.send(final);
});


app.get("/getCurrentUser", (req, res) => {
  var userRef = ref.child("users");

  userRef.on('value', (snapshot) => {
    snapshot.forEach( (child) => {
      if(child.key == currentSession){
        res.send({name: child.val().name, friends: child.val().friends});
      }
    })
  })
});

 app.listen(port, function() {
 console.log(`api running on port ${port}`);
});