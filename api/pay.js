export default async function handler(req, res) {
    try {
        // ASLI ENDPOINT YAHI HAI
        const zapUrl = "https://zapupi.com/api/create_order"; 
        
        // Teri exact active key
        const myApiKey = "zap15364f6d9b5af1b47270c52a72bb0663";
        
        const params = new URLSearchParams();
        params.append('key', myApiKey);
        params.append('client_txn_id', 'TXN' + Date.now() + Math.floor(Math.random() * 1000));
        params.append('amount', req.query.amount || '10');
        params.append('p_info', 'Khiladi Hub Recharge');
        params.append('customer_name', req.query.name || 'Player');
        params.append('customer_email', req.query.email || 'test@test.com');
        params.append('customer_mobile', '9999999999');
        // Tera redirect URL app ka
        params.append('redirect_url', req.query.redirect || 'https://google.com');

        // PURE BACKEND API CALL (Koi fake Chrome User-Agent nahi)
        const response = await fetch(zapUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // ZapUPI ko bataya ki hum ek proper server hain
                'User-Agent': 'NodeJS/Vercel-Backend' 
            },
            body: params.toString()
        });

        const textData = await response.text();
        
        let data;
        try {
            data = JSON.parse(textData);
        } catch(e) {
            return res.send(`<h3 style="color:red; text-align:center; margin-top:50px;">ZapUPI WAF Block:</h3><div style="background:#222; color:#0f0; padding:15px; font-family:monospace; word-wrap:break-word;">${textData}</div>`);
        }

        if (data.status === true || data.status === "true") {
            // SUCCESS! Seedha tere video wale PayLink par le jayega
            res.redirect(302, data.data.payment_url);
        } else {
            res.send(`<h3 style="color:red; text-align:center; margin-top:50px;">ZapUPI Error: ${data.msg || JSON.stringify(data)}</h3><center><button onclick="window.history.back()" style="padding:10px;">Go Back</button></center>`);
        }
    } catch (error) {
        res.send(`<h3 style="color:red; text-align:center; margin-top:50px;">Server Error: ${error.message}</h3>`);
    }
}
