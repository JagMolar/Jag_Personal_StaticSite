const express = require('express');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');//requiere objeto google
const router = express.Router();

const accountTransport = require("../../../account_transport.json");

router.post('/send-email',(req, res)=>{
    //console.log(req.body);
    const {name, email,  message}= req.body;//recogemos el request
    // res.send("Enviado");
    const contentHtml = `
    <h1>Formulario de Contacto</h1>

    <p><strong>Nombre: </strong> ${name}</p>
    <p><strong>Email: </strong>${email} </p> 
    <p><strong>Mensaje: </strong> ${message}</p>
    `

    const CLIENT_ID= accountTransport.auth.clientId
    const CLIENT_SECRET=accountTransport.auth.clientSecret
    const REDIRECT_URI="https://developers.google.com/oauthplayground"
    const REFRESH_TOKEN=accountTransport.auth.refreshToken

    const oAuth2Client = new google.auth.OAuth2(
        CLIENT_ID,
        CLIENT_SECRET,
        REDIRECT_URI
    );

    oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN});

    async function sendMail(){
        try {
            const accessToken =await oAuth2Client.getAccessToken(); //lo generamos con await para peticiones asincronas
            const tranporter =  nodemailer.createTransport({
                service:"gmail",
                auth:{
                    type:"OAuth2",
                    user:accountTransport.auth.user,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            });
            const mailOptions ={
                from:"Contacto Web Juan A. García Muelas <micvonline2020@gmail.com>",
                to: "micvonline2020@gmail.com",
                cc:"juangmuelas@gmail.com",
                subject:"Contacto formulario",
                html:contentHtml
            }

            const result = await tranporter.sendMail(mailOptions);
            return result;          
            
        } catch (error) {
            console.log(error)
        }
    }

    sendMail()
        .then((result) => res.status(200).redirect('../index.html#contact') )
        .catch((error) => console.log(error.message))
});

module.exports=router