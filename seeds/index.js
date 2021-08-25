//In this file we have created some fake data and we run it seprately.
const mongoose = require('mongoose');
const { db } = require('../models/campground');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors,places} = require('./seedHelpers');
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("Connection Established !");
    })
    .catch(err=>{
        console.log("OH NO ERROR!!!!");
        console.log(err);
    })

//It gives us random element from a array.
const rand = (array)=>{
    return array[Math.floor(Math.random()*array.length)];
}

//Remember : While defining Function first define a constant then make it equal to any function.
const seedDB = async()=>{
    await Campground.deleteMany({});   // Use await because it may can take time.
    // const camp = new Campground({title:'harry',description:'Fugly'});
    // await camp.save();
    for(let i =0; i<200;i++){
        //It's Math.floor not math.floor M is Capital.!!!!
        const random = Math.floor(Math.random()*1000);
        const camp = new Campground({
            title:`${rand(descriptors)} ${rand(places)}`,
            location:`${cities[random].city} ,${cities[random].state} `,
            author:'611ab35bd0391c63042ab587',
            description:'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero officiis corporis voluptate dolores saepe placeat odit, cum reprehenderit quisquam quia amet totam, dolor quibusdam magni explicabo quaerat quae ipsam fugiat.',
            images:  [
                {
                    url: 'https://res.cloudinary.com/webd-bootcamp/image/upload/v1629692546/YelpCamp/ynvjmxovrblixwyiax9x.jpg',
                    filename: 'YelpCamp/ynvjmxovrblixwyiax9x'
                },
                {
                    url: 'https://res.cloudinary.com/webd-bootcamp/image/upload/v1629692549/YelpCamp/nsnwl6efxp5cfcdzqrdz.jpg',
                    filename: 'YelpCamp/nsnwl6efxp5cfcdzqrdz'
                }
            ],
            geometry: {
                type: "Point",
                coordinates: [cities[random].longitude,cities[random].latitude]
            },
           
        })
        await camp.save();
    }
};

seedDB().then(() => {
    // console.log("Successful!!!!")
    //This command will close the connection.
    mongoose.connection.close();
})