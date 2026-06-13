export default async function handler(req, res) {
    try {
        // ASLI ENDPOINT (Jo tere video mein dikha)
        const zapUrl = "https://pay.zapupi.com/api/create-order"; 
        
        // Teri exact API key
        const myApiKey = "zap15364f6d9b5af1b47270c52a72bb0663";
        
        // PAYLOAD (Variables ab video wale docs ke hisaab se hain)
        const payload = {
            zap_key: myApiKey,
            order_id: "TXN" + Date.now() + Math.floor(Math.random() * 1000),
            amount: req.query.amount || "10",
            customer_mobile: "9999999999",
            remark: "Khiladi Hub Recharge",
            success_url: req.query.redirect || "https://google.com",
            failed_url: req.query.redirect || "https://google.com",
            timeout_url: req.query.redirect || "https://google.com"
        };

        // REQUEST BHEJ RAHE HAIN (JSON Format mein, jaise video me tha)
        const response = await fetch(zapUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const textData = await response.text();
        
        let data;
        try {
            data = JSON.parse(textData);
        } catch(e) {
            return res.send(`<div style="background:#000; color:#0f0; padding:20px; height:100vh; font-family:monospace;"><h2>API Response Error:</h2><p>${textData}</p></div>`);
        }

        // NAYE SYSTEM MEIN STATUS "success" AATA HAI
        if (data.status === "success") {
            // SEEDHA PAYMENT LINK PAR REDIRECT (Jaise video me tha)
            res.redirect(302, data.payment_url);
        } else {
            res.send(`<div style="background:#000; color:red; padding:20px; height:100vh; font-family:monospace; text-align:center;"><h2>ZapUPI Error:</h2><p>${data.message || JSON.stringify(data)}</p><button onclick="window.history.back()" style="padding:10px 20px; background:red; color:white; border:none; cursor:pointer;">GO BACK</button></div>`);
        }
    } catch (error) {
        res.send(`<h3 style="color:red; text-align:center; margin-top:50px;">Server Error: ${error.message}</h3>`);
    }
}
