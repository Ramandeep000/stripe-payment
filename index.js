const express = require("express");
const path = require('path');
const app = express();



require("dotenv").config()

const cors = require("cors");

const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY)



app.use(express.json());
app.use(cors({origin:"http://localhost:5173"}));

app.post("/checkout" ,async(req , res)=>{
    try{
        const session = await stripe.checkout.sessions.create({
            payment_method_types:["card"],
            mode :"payment" ,
            line_items:req.body.items.map(item=>{
                return{
                    price_data:{
                        currency:"inr",
                        product_data:{
                            name:item.name,
                            
                        },
                        unit_amount:(item.price)*100,

                    },
                    quantity:item.quantity
                }
            }),
            success_url:"http://localhost:5173/success",

            cancel_url :"http://localhost:5173/cancel"
        })

        res.json({url:session.url})
    }
    catch(error){
        res.status(500).json({error:error.message})
    }
})


app.use(express.static(path.join(__dirname,"../frontend/dist")))
app.get('*' , function(req , res){
    res.sendFile(path.join(__dirname , "../frontend/dist/index.html"));
});

app.listen(8000);