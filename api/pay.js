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
            redirect_url: req.query.redirect || "https://google.com"
        };

        const response = await fetch(zapUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // JADOO: ZapUPI ko lagega ki ye ek asli Google Chrome browser se aa raha hai
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify(payload)
        });

        // Pura data pehle normal text mein padho taaki crash na ho
        const textData = await response.text();

        let data;
        try {
            data = JSON.parse(textData); // Ab JSON mein convert karo
        } catch (err) {
            // Agar ZapUPI ne fir block kiya, toh crash hone ke bajaye Asli Error screen par dikhayega
            return res.send(`<h3 style="color:red; text-align:center; margin-top:50px;">ZapUPI Firewall Response:</h3><div style="background:#f4f4f4; padding:15px; border:1px solid #ccc; font-family:monospace; word-wrap:break-word;">${textData}</div>`);
        }
        
        if (data.status === true || data.status === "true") {
            res.redirect(302, data.data.payment_url);
        } else {
            res.send(`<h3 style="color:red; text-align:center; margin-top:50px;">ZapUPI Error: ${data.msg || JSON.stringify(data)}</h3><center><button onclick="window.history.back()" style="padding:10px;">Go Back</button></center>`);
        }
    } catch (error) {
        res.send(`<h3 style="color:red; text-align:center; margin-top:50px;">Server Error: ${error.message}</h3>`);
    }
}
