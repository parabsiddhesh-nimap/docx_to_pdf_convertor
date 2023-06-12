var express = require('express');
var path = require('path');
const multer  = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        // let fileName = JSON.stringify(req.userData.name).split('"')[1];
        return cb(null,`${Date.now()}` )
    }
})
const upload = multer({ storage: storage });
// const {convert} = require("./controller/docx_tp_pdf");
const fs = require('fs');
const libre = require('libreoffice-convert');
require('dotenv').config();

var app = express();
const port = process.env.PORT || 3000;

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req,res)=>{
    // res.send({message : "Hello world"})
    res.render("doxc_to_pdf",{
        title : "Hello World"
    })
})

app.post('/uploadfile', upload.single('docxFile'),async function (req, res, next) {
    // const fileName = req.file.filename
    const fileName = `${req.file.destination}/${req.file.filename}`
    // console.log(fileName)
    // res.json({fileName})
    const ext = '.pdf'
    
    // Read file    
    const docxBuf = fs.readFileSync(fileName);
    
    const outPutFile = Date.now() + "output.pdf";

    libre.convert(docxBuf,ext,undefined,(err,done) => {
        if(err) {
            console.log('Error Occured converting' , err)
            fs.unlinkSync(req.file.destination)
            fs.unlinkSync(outPutFile)

            req.json({error : "Some Error occured while converting"})
        }
        fs.writeFileSync(outPutFile,done)
        res.download(outPutFile)
    });
  });




app.listen(port,(error) => {
    if(error) console.log(error);
    console.log(`Successfully connected to http://localhost/${port}`)
});
