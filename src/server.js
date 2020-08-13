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
   var food_type;

   if(req.body.id){
    axios.get(`https://api.yelp.com/v3/businesses/${req.body.id}`, {
      headers: {
        Authorization: 'Bearer ' + 'BDKJluIkcQa-Lwn_Ye9BfW_m8ajO-agWP-WXdpyAMJ3O6iAhangiPCn8Sjch8MF2mikafe4gxR1xxM0h69cCAYBuFlTn0tOvHc2vpiogz3TAHkaRGDeZVRXf46i9XnYx'
     }

  })
  .then( (res) => {

    var json = {data: res.data, isgood: true, viewport:{center: [res.data.coordinates.latitude,res.data.coordinates.longitude], zoom:16}, isloading:false};
      return response.send(json);

  })
  .catch( (err) => {
    console.log(err);
  })
}
else{

   if(req.body.food_type){
    food_type = req.body.food_type.replace(/\s/g, '');
   }
   else{
     food_type = null;
   }

 	axios.get('https://api.yelp.com/v3/businesses/search', {
     params: {
      term: req.body.term,
      location: location,
      latitude: lat,
      longitude: long,
      limit: req.body.limit,
      radius: req.body.radius,
      categories: food_type
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

       
    var json = {data: res.data, isgood: true, viewport:{center: [lat,long], zoom:16}, isloading:false};
     
      return response.send(json);
      
    
    })
    .catch( err => {
      console.log('err');
      return response.send({error: true});
      
    })

  }
});


 app.post("/createUser", (req, res) => {
  var friends = req.body.friends.split(",");
 	var usersRef = ref.child("users");
 	usersRef.push({
 		name: req.body.name,
 		email: req.body.email,
    pass: req.body.pass,
    gender: req.body.gender,
    friends: friends,
    ids: [''],
 	});

  return res.send({good: 'good job'});

 	});


app.post("/updateLike", (req, res) => {
  var innerRef = ref.child(`/users/${currentSession}`);
  var go = false;
  var reference;
  var mydata;


  innerRef.once('value', (snapshot) => {
    if(snapshot.child("ids").exists()){
      
      reference = snapshot.val();
      var obj = {timestamp: req.body.timestamp, raw_date: req.body.raw_date, name: req.body.name, id: req.body.id};
      reference.ids.push(obj);
      mydata = reference.ids;
      innerRef.update({
        ids: mydata
      });
      
   }

   else if(!snapshot.child("ids").exists()){
      var obj = {timestamp: req.body.timestamp, raw_date: req.body.raw_date, name: req.body.name, id: req.body.id};
      var reference = [];
      reference.push(obj);
      mydata = reference;
      
      innerRef.update({
        ids: mydata
      });
      
   }
   
});

});

 app.post("/login", (req, res) => {

   var usersRef = ref.child("users");
   var success = false;
   var name;
 	usersRef.once('value', (snapshot) => {
 		snapshot.forEach( (child) => {
 			if(child.val().email == req.body.email && child.val().pass == req.body.pass){
 				currentSession = child.key;
         success = true;
         name = child.val().name;
       }
       

     });


     res.send({success: success, name: name});
 });     



 })

 app.get("/history", (req, res) => {
   var usersRef = ref.child("users" + `/${currentSession}`);
   var obj = {};
 	usersRef.once('value', (snapshot) => {
    if(snapshot.val() != null){
      obj = {history: snapshot.val().ids};
  }
    res.send(obj);
    return;
   })
   
   console.log('history');
   
 })

 app.get("/getFriends", (req, res) => {
  var usersRef = ref.child("users" + `/${currentSession}`);
  var data;
  var final = {};

  usersRef.once('value', (snapshot) => {
    if(snapshot.child('friends').exists()){
      
    data = snapshot.val().friends;
    var newRef = ref.child("users");
  newRef.once('value', (snapshot) => {
    snapshot.forEach( (child) => {
    var i = 0;
    for(i = 0; i < data.length; i++){
    if(child.val().name == data[i]){
      var ids = child.val().ids;
      final[data[i]] = ids;
    }
  }
})
  res.send(final);
  });
  
}

  else{
   final = null;
   res.send(final);
  }

  

  });

  

});


app.get("/getCurrentUser", (req, res) => {
  var userRef = ref.child("users");

  userRef.once('value', (snapshot) => {
    snapshot.forEach( (child) => {
      if(child.key == currentSession){
        return res.send({name: child.val().name, friends: child.val().friends});
      }
    })
  })
});


app.post("/addFriend", (req, res) => {
  var usersRef = ref.child("users");
  usersRef.once('value', (snapshot) => {
    snapshot.forEach( (child) => {
      if(child.val().email == req.body.email){
        var newRef = ref.child("users" + `/${child.key}`);
        newRef.update({
          friend_requests_in: [req.body.friend]
        })
        res.send({good: 'good'});
      }
    });
  });

})

app.post("/getFriendRequest", (req, res) => {
  var usersRef = ref.child("users");
  usersRef.once('value', (snapshot) => {
    snapshot.forEach( (child) => {
      if(child.val().name == req.body.name){
        var data = child.val().friend_requests_in;
        res.send({friendRequests: data});
      }
    })
  })
})

app.post("/acceptRequest", (req, res) => {
  console.log(req.body.friendName);
  var usersRef = ref.child("users");
  usersRef.once('value', (snapshot) => {
    snapshot.forEach( (child) => {
      if(child.val().name == req.body.name){
        var reference = child.val();
        var newRef = ref.child("users" + `/${child.key}`);

        if(child.child('friends').exists()){
          console.log('true friends exist');
        reference.friends.push(req.body.friendName);
        var mydata = reference.friends;
        var request = reference.friend_requests_in;
        request.splice(request.indexOf(req.body.friendName));
        }

      else{
        console.log('friends do not exist');
        var request = reference.friend_requests_in;
        request.splice(request.indexOf(req.body.friendName));
        var mydata = [req.body.friendName];

      }
      newRef.update({
        friends: mydata,
        friend_requests_in: request,
      })
    }
      

      if(child.val().name == req.body.friendName){
        console.log('uuu');
        var reference = child.val();
        var newRef = ref.child("users" + `/${child.key}`);
        if(child.child('friends').exists()){
        reference.friends.push(req.body.name);
        var mydata = reference.friends;
        console.log(mydata);
        }
        else{
          var mydata = [req.body.name];
        }
        newRef.update({
          friends: mydata,
        })
        
      }
    });
        

        res.send({good: 'good'});
      
  });

});

 app.listen(port, function() {
 console.log(`api running on port ${port}`);
});