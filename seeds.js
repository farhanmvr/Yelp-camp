
const mongoose     = require('mongoose'),
      Campground   = require('./models/campgrounds')
      Comment      = require('./models/comments')

var data = [
    {
        name:"Image 1",
        image:'https://images.unsplash.com/photo-1587994026454-f7c8f447fd8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat assumenda ratione et quisquam ea iusto voluptatem atque cum earum reprehenderit iure hic aliquid esse, veniam magnam! Alias delectus deserunt expedita!'
    },
    {
        name:"Image 2",
        image:'https://images.unsplash.com/photo-1587994026454-f7c8f447fd8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat assumenda ratione et quisquam ea iusto voluptatem atque cum earum reprehenderit iure hic aliquid esse, veniam magnam! Alias delectus deserunt expedita!'    },
    {
        name:"Image 3",
        image:'https://images.unsplash.com/photo-1587994026454-f7c8f447fd8b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
        desc:'Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat assumenda ratione et quisquam ea iusto voluptatem atque cum earum reprehenderit iure hic aliquid esse, veniam magnam! Alias delectus deserunt expedita!'
    }
]      

async function seedDB() {
    try{
        await Campground.deleteMany({})
        await Comment.deleteMany({})
        
        for(const seed of data){
            let newCampground = await Campground.create(seed)
            let comment = await Comment.create({
                text:'This is a awesome picture',
                author:'Farhan'
            })
            newCampground.comments.push(comment)
            await newCampground.save()
        }

    }catch(err){
        console.log(err)
    }
}     


module.exports = seedDB