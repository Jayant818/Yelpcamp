const mongoose = require('mongoose');
const opts = {toJSON:{ virtuals :true}};
// const campground = require('./campground');
const Review = require('./reviews');
const User = require('./user');
const Schema = mongoose.Schema;   // Making our code more shorter

//using virtuals 
//virtuals can be only applied to the schema
const ImageSchema = new Schema({
    url:String,
    filename:String,
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_100');
})

const campgroundSchema= new Schema(
    {
        title:String,
        images:[ImageSchema],
        geometry:{
            type: {
              type: String, // Don't do `{ location: { type: String } }`
              enum: ['Point'], // 'location.type' must be 'Point'
              required: true
            },
            coordinates: {
              type: [Number],
              required: true
            }
          },
        price:Number,
        description:String,
        location:String,
        author:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        reviews:[
            {
                type : Schema.Types.ObjectId,
                ref: 'Review'
            }
        ]
    },opts);
campgroundSchema.virtual('properties.popUp').get(function(){
    return`
    <strong><a href="/campground/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})
campgroundSchema.post('findOneAndDelete',async function (doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                    $in:doc.reviews    
                }
        })
    }
})


// WE can do like this except doing like this -->\
//const Campground = mongoose.model('Campground',campgroundSchema);
//module.exports = Campground;
//Remember that the mongodb store it as a campgrounds it will lowercase it and make it plural and then make the collection
module.exports = mongoose.model('Campground',campgroundSchema);  

