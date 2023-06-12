'use strict';

const path = require('path');
const fs = require('fs');

const libre = require('libreoffice-convert');
// libre.convertAsync = require('util').promisify(libre.convert);

async function convert(req,res) {
    try{
        const fileName = req.file.filename
        const ext = '.pdf'
        
        // Read file
        const docxBuf = fs.readFile(fileName);
        
        // Convert it to pdf format with undefined filter (see Libreoffice docs about filter)
        let pdfBuf = await libre.convertAsync(docxBuf, ext, undefined);
        
        // Here in done you have pdf file which you can save or transfer in another stream
        fs.writeFile(`${fileName}${ext}`, pdfBuf);
        res.download(`${fileName}${ext}`)
    }catch(e){
        console.log(e);
    }
}

module.exports = {convert};