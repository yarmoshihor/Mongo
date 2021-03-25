const express = require("express");
const path = require("path");
const mongoose = require('mongoose')


const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const exphbs = require("express-handlebars");
const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: 'main',
  extname: 'hbs'
})

const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses');
const User = require('./models/user')
//const { start } = require("repl");
//const { join } = require("path");
const app = express();



// const hbs = exphbs.create({
//   defaultLayout: "main",
//   extname: "hbs",
// });
// app.engine("hbs", hbs.engine);

 
app.engine('.hbs',exphbs({
  defaultLayout:'main',
  extname: '.hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  // helpers:require('./utils/hbs-helpers')
}))


app.set("view engine", "hbs");
app.set("views", "views");


app.use(async (req,res,next) => {
  try{
    const user = await User.findById('605c68d8da95182814162808')
    req.user = user
    next()
  }catch(e){
    console.log(e);
  }

})

app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended: true}))

app.use('/',homeRoutes)
app.use('/add',addRoutes)
app.use('/courses',coursesRoutes)
app.use("/card", cardRoutes)

const PORT = process.env.PORT || 3000;


async function start() {
  try{
    // const url = 'mongodb+srv://yarmosh:hDQnz1gRUwSVdR3d@cluster0.7dlkt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
    const url = 'mongodb+srv://yarmosh:hDQnz1gRUwSVdR3d@cluster0.7dlkt.mongodb.net/shop'
    await mongoose.connect(url,
      {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false
      })

      const candidate = await User.findOne()
      if (!candidate) {
        const user = new User({
          email: 'igop@mail.ua',
          name: 'ihor',
          cart: {items: []}
        })
        await user.save() 
      }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch(e) {
    console.log(e);
  }
};

start();



