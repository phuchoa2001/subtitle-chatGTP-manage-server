const FormData = require('form-data');
const axios = require('axios');
const path = require('path');
const fs = require("fs");
class xoaNenControllers {
    index(req, res) {
        var string = `${path.join(__dirname, "../../public")}\\upload\\${req.file.filename}`
        console.log(string);
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(string), path.basename(string));
        axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': 'tvUd4u7RasfawoMp1RJ8HKdX',
            },
            encoding: null
        })
            .then((response) => {
                if (response.status != 200) return console.error('Error:', response.status, response.statusText);
                fs.writeFileSync(string, response.data);
                let file = fs.readFileSync(string, { encoding: "base64" });
                console.log(file.length)
                res.json({ messger: file });
            })
            .catch((error) => {
                return console.error('Request failed:', error);
            });
    }
}
module.exports = new xoaNenControllers;