export default async function handler(req, res) {
    try {
        const zapUrl = "https://zapupi.com/api/create_order";
        
        const payload = {
            key: "Zap15364f6d9b5af1b47270c52a72bb0663",
            client_txn_id: "TXN" + Date.now() + Math.floor(Math.random() * 1000),
            amount: req.query.amount || "10",
            p_info: "Khiladi Hub Recharge",
            customer_name: req.query.name || "Player",
            customer_email: req.query.email || "test@test.com",
            customer_mobile: "9999999999",
            redirect_url: req.query.redirect
        };

        const response = await fetch(zapUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.status === true || data.status === "true") {
            res.redirect(302, data.data.payment_url);
        } else {
            res.send(`<h3 style="color:red; text-align:center; margin-top:50px;">ZapUPI Error: ${data.msg || JSON.stringify(data)}</h3><center><button onclick="window.history.back()" style="padding:10px;">Go Back</button></center>`);
        }
    } catch (error) {
        res.send(`<h3 style="color:red; text-align:center; margin-top:50px;">Server Error: ${error.message}</h3>`);
    }
}
