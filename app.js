const express = require('express');
const path = require('path');
const { create } = require('express-handlebars');
const axios = require('axios');
const app = express();

//MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({extended:false}))


const hbs = create({
	partialsDir: [
		"views/partials/",
	],
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));



//RUTAS VISTAS

app.get(["/", "/home"], async (req, res) => {
    let response = await axios.get("http://localhost:3000/posts");
    let posts = response.data.data;
    console.log(posts)
    res.render("home", {
        posts
    });
})

app.get("/posts/details/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let response = await axios.get("http://localhost:3000/posts/"+id);
        console.log(response)
        let post = response.data.data;
        let responseComentarios = await axios.get("http://localhost:3000/comentarios/"+post.id);
        let comentarios = responseComentarios.data.data;
        console.log(post)
        console.log(comentarios)
        res.render("postDetalles", {
            post,
            comentarios
        });
    } catch (error) {
        res.render("postDetalles", {
            error: "No se pudo encontrar el producto"
        });
    }
})




app.listen(3001, () => console.log("http://localhost:3001/"))