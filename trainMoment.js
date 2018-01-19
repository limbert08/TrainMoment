// Config Firebase


var config = {
    apiKey: "AIzaSyDYGF4CkWGv2JibYRDPgyDdRu2CeYk75fs",
    authDomain: "fir-test1-3e363.firebaseapp.com",
    databaseURL: "https://fir-test1-3e363.firebaseio.com",
    projectId: "fir-test1-3e363",
    storageBucket: "fir-test1-3e363.appspot.com",
    messagingSenderId: "880758483837"
};
firebase.initializeApp(config);

// End Config

var trainJSON = firebase.database();

// get Data from Screen
$("#add-train-btn").on("click", function() {

    var trainName = $("#train-name-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    
    var newTrain = {

        name: trainName,
        destination: trainDestination,
        firstTrain: firstTrain,
        frequency: frequency
    };

    // Upload to Database
    trainJSON.ref().push(newTrain);

    // Log
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    // Alert
    alert("Congratulations - New Holiday Run added");

    // Clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");


    return false;
});


trainJSON.ref().on("child_added", function(childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    // snapshot values
    var xName = childSnapshot.val().name;
    var xDestination = childSnapshot.val().destination;
    var xFrequency = childSnapshot.val().frequency;
    var xFirstTrain = childSnapshot.val().firstTrain;

    var timeArrival = xFirstTrain.split(":");
    var trainTime = moment().hours(timeArrival[0]).minutes(timeArrival[1]);
    var maxTime = moment.max(moment(), trainTime);
    var xMinutes;
    var xArrival;

    //IF first train > current time, arrival ==  first train time
    if (maxTime === trainTime) {
        xArrival = trainTime.format("hh:mm A");
        xMinutes = trainTime.diff(moment(), "minutes");
    } else {

        // Modulus for next arrival
        // Division to get total number of Trains since FirstTrain 
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % xFrequency;

        var numTrain = parseInt(differenceTimes / xFrequency);
        ////var numTrainSplit = numTrainWhole.split(".");
        //var numTrain = 0;
        //numTrain = numTrainSplit[0];

        xMinutes = xFrequency - tRemainder;
        // arrival time
        xArrival = moment().add(xMinutes, "m").format("hh:mm A");
    }
    console.log("differenceTimes", differenceTimes);
    console.log("numTrain", numTrain);
    console.log("xMinutes:", xMinutes);
    console.log("xArrival:", xArrival);

    // Add <tr> ROWS
    $("#train-table > tbody").append("<tr><td>" + xName + "</td><td>" + xDestination + "</td><td>" +
        xFrequency + "</td><td>" + xArrival + "</td><td>" + xMinutes + "</td><td>" + numTrain + "</td></tr>");

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);

});