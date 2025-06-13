import express from "express";

const app = express();
const port = 3000;
var Task = [];
var Pabili = [];
var Price = [];
var Total = 0;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index.ejs");
});
app.post("/submit", (req, res) => {
    const { action } = req.body;
    if (action === "action1") {
        res.render("agenda.ejs", { tasks: Task });
    } else if (action === "action2") {
        res.render("pabili.ejs", { pabili: Pabili, prices: Price, total: Total });
    }
    else {
        res.render("index.ejs", { error: "Invalid action" });
    }
});

app.post("/getinput", (req, res) => {
    const input = req.body["task"];
    if (input && input.trim() !== "") {
        Task.push(input);
        console.log(Task);
    }
    res.redirect("/agenda");
});

app.get("/agenda", (req, res) => {
    res.render("agenda.ejs", { tasks: Task });
});

app.post("/getGrocery", (req, res) => {
    const item = req.body["pabili"];
    const price = req.body["price"];
    if (item && item.trim() !== "") {
        Pabili.push(item);
        Price.push(price);
        Total += parseFloat(price) || 0; // Ensure price is a number
        console.log(Pabili, Price);
    }
    res.redirect("/pabili");
});

app.get("/pabili", (req, res) => {
    res.render("pabili.ejs", { pabili: Pabili, prices: Price, total: Total });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
