const express = require('express')
const port = process.env.PORT || 8080
const bodyParser = require('body-parser')
const mysql = require('mysql2')

const app = express()

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Akida123",
    database: "inventory"
});
con.connect((err) => {
    if (err) throw err
    console.log("Connected to the database")
});
let urlencodedParser = express.urlencoded({ extended: false })

//Static files
app.use(express.static('views'))
app.use('/css', express.static(__dirname + 'views/css'))
app.use('/js', express.static(__dirname + 'views/js'))

console.log("done")

//set views
app.set('views', './views')
app.set('view engine', 'ejs')


app.get('/',(req,res)=>{
	res.render('index')
})

app.get('/add',(req,res)=>{
	res.render('add')
})

app.get('/display', (req, res) => {
    let sql = "SELECT * FROM items"
    con.query(sql, (err, result) => {
        if (err) throw err
        console.log(result.length)
        res.render('display', { items: result })
    })

})
app.post('/display',urlencodedParser,(req,res)=> {
	let dlt_obj = {}
	dlt_obj = Object.assign({},req.body)
	let id = parseInt(Object.keys(dlt_obj)[0])
	console.log(id)
	let sql = "DELETE FROM items WHERE id = "+id+";"
	console.log(sql)
    con.query(sql, (err, result) => {
        if (err) {
			console.log("ERROR WHILE deleting")
        }
        console.log("deleted ")
		res.redirect("/display")
    })
	
	
})
app.post('/add', urlencodedParser, (req, res) => {
    console.log(req.body)
    let sql = "INSERT INTO items(id,iname,idesc,price) VALUES(null,'"+req.body.iname+"','"+req.body.desc+"',"+req.body.price+");"
	console.log(sql)
    con.query(sql, (err, result) => {
        if (err) {
			console.log("ERROR WHILE INSERTING")
        }
        console.log("inserted ")
		res.redirect("/")
    })
})
app.listen(port, () => console.log("listening"))