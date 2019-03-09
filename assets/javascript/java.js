// Initialize Firebase
var config = {
  apiKey: "AIzaSyCMWHjyphGSuyMqcDOajBWleZ1Mpt3-pLA",
  authDomain: "trainschedulehw-5c133.firebaseapp.com",
  databaseURL: "https://trainschedulehw-5c133.firebaseio.com",
  projectId: "trainschedulehw-5c133",
  storageBucket: "trainschedulehw-5c133.appspot.com",
  messagingSenderId: "938599339374"
};
firebase.initializeApp(config);

var Name = "";
var TrainNumber = "";
var Destination = "";
var DepartTime = 0;
var Frequency = 0;
var newTrain = true;

$(document).on('click', '.trainDelete', function () {
  var id = $(this).data("id");

  var ref = firebase.database().ref("trains").orderByChild("trainnumber").equalTo(id);
  ref.on("child_added", function (snapshot) {
    firebase.database().ref("trains/" + snapshot.key).remove();
  })
  location.reload();
});

$(document).on('click', '.trainEdit', function () {
  console.log("--edit------------------")
  console.log(this);
  //   var id = $(this).data("id");
  //   var ref = firebase.database().ref("trains");
  //   ref.orderByChild("trainnumber").equalTo(id).on("child_added", function (snapshot) {
  //     newTrain = false;
  //     $("#SubmitBtn").text("Edit");
  //     console.log(snapshot.val().name);
  //     var departTimeConverted = moment(snapshot.val().departUnix, "X").format("HH:mm");
  //     $("#Name").val(snapshot.val().name);
  //     $("#TrainNumber").val(snapshot.val().trainnumber);
  //     $("#Destination").val(snapshot.val().destination);
  //     $("#DepartTime").val(departTimeConverted);
  //     $("#Frequency").val(snapshot.val().frequency);
  //     Name = $("#Name").val().trim();
  //   });
});


$("#SubmitBtn").on("click", function () {
  console.log("in new train add");
  event.preventDefault();

  Name = $("#Name").val().trim();
  TrainNumber = $("#TrainNumber").val().trim();
  Destination = $("#Destination").val().trim();
  DepartTime = $("#DepartTime").val().trim();
  Frequency = $("#Frequency").val().trim();

  var departTimeConverted = moment(DepartTime, "HH:mm").subtract(1, "years");

  firebase.database().ref("trains").push({
    name: Name,
    trainnumber: TrainNumber,
    destination: Destination,
    frequency: Frequency,
    departUnix: departTimeConverted.format("X"),
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  })

  // Clears all of the text-boxes
  $("#Name").val("");
  $("#TrainNumber").val("");
  $("#Destination").val("");
  $("#DepartTime").val("");
  $("#Frequency").val("");
});



firebase.database().ref("/trains").on("child_added", function (snapshot) {

  var currentTime = moment();
  var departTimeConverted = moment(snapshot.val().departUnix, "X");
  var frequency = snapshot.val().frequency;
  var diffTime = moment().diff(moment(departTimeConverted), "minutes");
  var tRemainder = diffTime % frequency;
  var tMinutesTillTrain = frequency - tRemainder;
  var nextArrival = moment(currentTime).add(tMinutesTillTrain, "minutes");

  $("#newTrain").append("<tr><td>" + snapshot.val().name +
    "<button type='button' class='btn btn-primary float-left trainDelete' data-ID=" + snapshot.val().trainnumber + ">X</button>" +
    "<button type='button' class='btn btn-primary float-left trainEdit ml-1 mr-2' data-ID=" + snapshot.val().trainnumber + ">E</button>" +
    "</td>" +
    "<td>" + snapshot.val().trainnumber + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" +
    "<td>" + frequency + "</td>" +
    "<td>" + moment(nextArrival).format('HH:mm') + "</td>" +
    "<td>" + tMinutesTillTrain + "</td>" +
    "</tr>");
})