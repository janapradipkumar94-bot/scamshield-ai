"""
Dataset generator for ScamShield AI.
Generates a curated development dataset containing realistic scam, phishing,
job fraud, financial fraud, impersonation messages alongside authentic personal,
transactional, and benign promotional messages.
"""

import os
import pandas as pd

DATA = [
    # --- SCAM: Financial Fraud & Fake KYC / Account Suspension ---
    ("Dear SBI Customer, your YONO account will be blocked today. Please update your Pan Card immediately by clicking http://sbi-kyc-update.xyz/login", "scam", "financial_fraud"),
    ("URGENT: Your HDFC Bank account has been suspended due to suspicious activity. Verify your identity at http://hdfc-security-portal.top or call 9876543210 immediately.", "scam", "financial_fraud"),
    ("ICICI Alert: Your NetBanking access has been revoked. Re-activate by submitting your Debit Card details & PIN at http://icici-verify-support.online", "scam", "financial_fraud"),
    ("Dear Customer, Your electricity connection will be disconnected tonight at 9:30 PM by electricity office because your previous month bill was not updated. Please immediately contact our electricity officer at 8972109384. Thank you.", "scam", "financial_fraud"),
    ("Power department notice: Bill outstanding of Rs 2,450. Disconnection order issued for tonight. Call electricity officer at 9123456780 to clear dues now.", "scam", "financial_fraud"),
    ("Dear User, your Paytm KYC has expired! Your wallet will be permanently deactivated. Complete video KYC now by downloading AnyDesk and calling 9871234567.", "scam", "financial_fraud"),
    ("Notice: Your Bank of Baroda account has been credited with an unverified deposit of Rs 85,000. Transfer ₹1,200 clearing charge to 9811223344@upi to release funds.", "scam", "financial_fraud"),
    ("Your Axis Bank credit card reward points worth Rs 9,850 are expiring today! Redeem points immediately into cash: http://axis-rewards-cash.xyz", "scam", "financial_fraud"),
    ("Attention: Unrecognized transaction of Rs 49,999 initiated on your Visa card. If not done by you, cancel transaction immediately at http://cancel-visa-txn.net/dispute", "scam", "financial_fraud"),
    ("Urgent: Income Tax Refund of Rs 26,490 approved. Please confirm your bank account and debit card CVV at http://incometax-refundgov.in.co/portal to receive payment.", "scam", "financial_fraud"),
    ("SBI Notification: You have won Rs 5,000 cash back on recent UPI transactions. Click here to claim your cashback to bank account: http://sbi-cashback.shop", "scam", "financial_fraud"),
    ("Dear customer, your SIM card will be blocked within 12 hours due to pending Aadhaar biometric verification. Contact Airtel executive immediately at 9845012345.", "scam", "financial_fraud"),

    # --- SCAM: Phishing & Credential Theft ---
    ("Google Security Alert: Unauthorized login attempt detected from Russia. If this was not you, secure your Google Account immediately at http://security-google-verify.me", "scam", "phishing"),
    ("Microsoft 365: Your password expires in 2 hours. Keep your existing password by logging into http://office365-password-keep.cc/login", "scam", "phishing"),
    ("Netflix Account Suspended: We could not process your latest billing payment. Update your credit card info now to resume watching: http://netflix-update-billing.info", "scam", "phishing"),
    ("Apple ID Alert: Your iCloud storage has been locked. Verify your credentials and payment details at http://appleid-security-cloud.biz within 24 hours.", "scam", "phishing"),
    ("Facebook Security Team: Your page has violated copyright guidelines. Your account will be deleted permanently. Appeal your case: http://meta-copyright-appeal.site", "scam", "phishing"),
    ("Instagram Notice: You have been selected for verified blue badge verification. Fill the form with your login password at http://instagram-verify-badge.top", "scam", "phishing"),
    ("PayPal Alert: Unusual login from unknown device. A security hold has been placed on your account. Verify identity at http://paypal-resolution-center.vip", "scam", "phishing"),
    ("Amazon Security: An iPhone 15 Pro was purchased from your account for $1,199. If unauthorized, login here to dispute: http://amazon-cancel-order.shop/auth", "scam", "phishing"),

    # --- SCAM: OTP & Sensitive Information Requests ---
    ("Hi, this is Rajesh from bank customer support. An unauthorized debit of 25,000 is happening. I have sent an OTP to cancel it. Please share the 6-digit OTP immediately.", "scam", "impersonation"),
    ("Security team verifying your transaction: Please reply with the One-Time-Password (OTP) sent to your mobile phone to complete refund process.", "scam", "impersonation"),
    ("Courier Delivery boy here: Your parcel is arrived. To confirm delivery please give me the OTP you just received from Indian Postal Service.", "scam", "impersonation"),
    ("WhatsApp Support: Someone tried to register your number on a new phone. Send back the 6-digit SMS verification code to verify you are the real owner.", "scam", "impersonation"),
    ("Hello Sir, call from telecom department. Your mobile number will be disconnected unless you share the OTP received on SMS for verification.", "scam", "impersonation"),

    # --- SCAM: Fake Job Offers & Task Fraud ---
    ("Exciting Part Time Job Opportunity! Work 1-2 hours daily from home and earn Rs 3,000 to Rs 8,000 daily by liking YouTube videos. No experience needed. Contact HR on WhatsApp: https://wa.me/919988776655", "scam", "job_scam"),
    ("Congratulations! Amazon India is hiring remote review assistants. Daily payout Rs 2,500 - 5,000. Registration fee Rs 499 (100% refundable after first task). Join Telegram: @amazon_job_hr", "scam", "job_scam"),
    ("Part-time online job: Earn Rs 50,000 per month just rating hotels on Google Maps. Send message on Telegram @hotel_rating_agency to start now.", "scam", "job_scam"),
    ("Dear candidate, your resume has been shortlisted for international data entry work. Salary $4,500 monthly. Deposit $50 visa processing fee to confirm slot.", "scam", "job_scam"),
    ("Urgent hiring: Earn 2,000 INR per day working from your smartphone. Just subscribe to channels and take screenshots. Daily bank transfer. Ping on WhatsApp now.", "scam", "job_scam"),
    ("Flipkart Logistics hiring warehouse supervisors. Salary 45,000/month with free accommodation. Pay Rs 1,200 for company uniform and gate pass: http://flipkart-jobs.xyz", "scam", "job_scam"),
    ("Work from home typing job. Earn Rs 25 per page. 100 pages per day guaranteed. Deposit security money Rs 999 to get raw materials.", "scam", "job_scam"),

    # --- SCAM: Fake Lottery, Prize & Gift Card ---
    ("CONGRATULATIONS! Your mobile number won 1st Prize of Rs 25,00,000 in Kaun Banega Crorepati (KBC) Lucky Draw 2026. Contact KBC Manager Rana Pratap on WhatsApp +91-9876543210 to claim check.", "scam", "lottery_scam"),
    ("Dear Winner, You have been awarded 500,000 GBP in BMW International Lottery Promo. Send your full name, address, and processing fee of 150 GBP to bmwlottery@gmail.com", "scam", "lottery_scam"),
    ("You have won a free iPhone 15 Pro Max from T-Mobile anniversary spin! Claim before timer runs out: http://free-iphone-gift.top/claim?win=1", "scam", "lottery_scam"),
    ("Amazon Lucky Draw: You are selected as the lucky customer of the week. Win Rs 50,000 gift voucher. Click http://amazon-spin-wheel.xyz to claim now.", "scam", "lottery_scam"),
    ("Congratulations! You have received a scratch card worth up to Rs 10,000 from Google Pay. Click here to scratch and claim direct to your bank: http://gpay-scratch.club", "scam", "lottery_scam"),
    ("Dear user, you won $1,000 Walmart Gift Card! Answer 3 simple questions and pay $1 shipping to claim your prize today: http://walmart-survey-gift.site", "scam", "lottery_scam"),

    # --- SCAM: Impersonation (Police, Customs, Family Emergency) ---
    ("This is Inspector Sharma from Delhi Police Cyber Crime Cell. An arrest warrant has been issued against your name for parcel containing illegal narcotics. Call immediately to settle matter out of court.", "scam", "impersonation"),
    ("Customs Department Notice: A package addressed to you from UK has been seized at Mumbai airport containing $50,000 foreign currency. Pay customs duty Rs 35,000 to prevent arrest.", "scam", "impersonation"),
    ("Mum, I dropped my phone in the sink and this is my new temporary number. I urgently need to pay my rent today and my banking app is locked. Can you please transfer $400 to this account?", "scam", "impersonation"),
    ("Dad, lost my wallet and cards while traveling. Please wire 15,000 rupees immediately to this UPI ID: friend_account@upi. Urgent please don't call this number.", "scam", "impersonation"),
    ("CBI Notice: Your bank account is linked to money laundering case #891. Transfer your balance to RBI verified escrow account 10928374 for safety audit.", "scam", "impersonation"),

    # --- SCAM: Crypto, Forex & Guaranteed High-Yield Schemes ---
    ("Guaranteed 300% profit in 24 hours! Automated AI crypto trading bot doubles your Bitcoin and USDT. Minimum deposit $100. Join our VIP Telegram channel: t.me/crypto_double_profit", "scam", "crypto_scam"),
    ("Earn passive income 10% daily ROI guaranteed with zero risk! Invest your USDT in our decentralized smart contract: http://defi-smart-invest.biz", "scam", "crypto_scam"),
    ("Elon Musk Giveaway: Send 0.1 BTC to get 0.2 BTC back immediately. Verified by Tesla official foundation: http://tesla-btc-giveaway.top", "scam", "crypto_scam"),
    ("Binance official bonus: 500 USDT welcome reward waiting for your wallet. Connect your Metamask seed phrase to claim: http://binance-claim-airdrop.xyz", "scam", "crypto_scam"),

    # --- SCAM: Delivery / Courier Phishing ---
    ("FedEx: Your package delivery has been put on hold due to missing street address number. Update your details and pay $1.99 redelivery fee at http://fedex-parcel-redelivery.cc", "scam", "phishing"),
    ("DHL Express: Shipment #DHL8921893 is awaiting customs clearance fee of $3.50. Pay online to release package: http://dhl-tracking-express.top", "scam", "phishing"),
    ("India Post: Your package could not be delivered as no one was available at home. Reschedule delivery: http://indiapost-parcel-reschedule.info", "scam", "phishing"),
    ("UPS Delivery: We attempted to deliver your package today. Reschedule delivery and pay handling charge at http://ups-parcel-track.site", "scam", "phishing"),

    # --- SCAM: Tech Support & Ransom/Virus Scare ---
    ("WARNING: Your computer has been locked by Windows Defender due to Trojan virus infection. Do not restart. Call Microsoft certified technician immediately at 1-800-419-0921.", "scam", "phishing"),
    ("Security Alert: We have recorded you visiting adult websites via your webcam. If you do not pay $500 in Bitcoin within 48 hours, we will send this video to all your Facebook contacts.", "scam", "phishing"),
    ("McAfee Antivirus: Your subscription expired 3 days ago. 5 viruses detected on your device. Renew now for $49.99 to prevent data wipe: http://mcafee-renew-protection.site", "scam", "phishing"),

    # =========================================================================
    # --- LEGITIMATE: Transactional & Banking Notifications ---
    ("Your SBI account ending in 4102 was debited by Rs 450.00 on 24-Oct-26 at 14:22 via UPI/Swiggy. Available balance: Rs 14,250.70. Never share your UPI PIN with anyone.", "legitimate", "legitimate"),
    ("HDFC Bank Alert: Rs 12,000.00 credited to A/C ending XX8912 on 23-Oct via NEFT. Ref no 29381920381. Check balance on HDFC Bank NetBanking or MobileBanking app.", "legitimate", "legitimate"),
    ("ICICI Bank: OTP for transaction of Rs 1,299.00 at AMAZON INDIA is 482910. Valid for 5 minutes. DO NOT share OTP with anyone including bank staff.", "legitimate", "legitimate"),
    ("Axis Bank: Your credit card statement for statement cycle ending 15-Oct is ready. Total amount due: Rs 4,120. Minimum due: Rs 500. Due date: 05-Nov. View in Axis Mobile App.", "legitimate", "legitimate"),
    ("Dear Customer, Your monthly e-statement for SBI Savings account ending 7731 for the month of September has been sent to your registered email address.", "legitimate", "legitimate"),
    ("Paytm: Paid Rs 65 to Sharma Grocery Store from Wallet. Updated Paytm balance: Rs 420. For queries visit 24x7 help section in Paytm app.", "legitimate", "legitimate"),
    ("Dear customer, your request for cheque book of 25 leaves for account XX3412 has been accepted and dispatched via speed post tracking #EM98271892IN.", "legitimate", "legitimate"),

    # --- LEGITIMATE: E-commerce, Delivery & Travel ---
    ("Your Amazon order #402-9182371 has been dispatched with courier partner Delhivery. Expected delivery by Thursday, 30 Oct. Track your shipment directly in the Amazon app.", "legitimate", "legitimate"),
    ("Flipkart: Out for delivery! Your order containing 'Boat Wireless Earphones' will be delivered today by delivery associate Suresh. Share PIN 49 with delivery agent upon arrival.", "legitimate", "legitimate"),
    ("Zomato: Your order from Biryani Blues is confirmed and being prepared by the restaurant. Delivery partner will be assigned shortly.", "legitimate", "legitimate"),
    ("Uber: Your driver Mukesh is arriving in a white Swift Dzire (DL01AB1234). Your trip PIN is 8812. Have a safe journey!", "legitimate", "legitimate"),
    ("IRCTC: PNR 2819281729, Train 12952 / MUMBAI RAJDHANI, Date: 29-Oct. Status: B4, Berth 42 (MB). Chart prepared. Happy journey!", "legitimate", "legitimate"),
    ("IndiGo flight 6E-205 from DEL to BLR is on time. Web check-in is now open. Download your boarding pass on the official IndiGo app or goindigo.in.", "legitimate", "legitimate"),
    ("Blue Dart Courier: AWB #4928192810 has been delivered to recipient at Reception. Thank you for using Blue Dart services.", "legitimate", "legitimate"),

    # --- LEGITIMATE: Personal Messages & Work Communications ---
    ("Hey Sarah, are you coming to the team lunch today at 1:30? Let me know so we can book the table accordingly.", "legitimate", "legitimate"),
    ("Hi Dad, reached home safely after the exam. Everything went well. Will call you after having dinner.", "legitimate", "legitimate"),
    ("Hi everyone, please find attached the updated slides for tomorrow's engineering sync. Let me know if you have feedback before our 10 AM meeting.", "legitimate", "legitimate"),
    ("Can you please send me the recipe for the pasta sauce you made last Sunday? Everyone loved it!", "legitimate", "legitimate"),
    ("Hey buddy, happy birthday! Wishing you a fantastic year ahead full of success and happiness. Let's catch up this weekend.", "legitimate", "legitimate"),
    ("The doctor's appointment has been confirmed for Friday at 4 PM at Apollo Clinic. Please arrive 15 minutes early.", "legitimate", "legitimate"),
    ("Mom, I will be late from office today because of a critical release deployment. Don't wait for dinner.", "legitimate", "legitimate"),
    ("Thanks for the reference letter! The interview went really well and they promised to get back by next Tuesday.", "legitimate", "legitimate"),

    # --- LEGITIMATE: Benign Promotional & Marketing (Spam, but NOT Fraud) ---
    ("Domino's Pizza: Craving cheesy pizza? Enjoy flat 40% off on all large pizzas this Wednesday! Use coupon code PIZZA40 at checkout on dominos.co.in or mobile app. T&C apply.", "legitimate", "legitimate"),
    ("Myntra Big Fashion Festival is live! Get 50-80% off on top fashion brands including Nike, Puma, Levi's. Shop the season's biggest styles on Myntra app today.", "legitimate", "legitimate"),
    ("Cult.fit: Renew your annual gym membership today and get 2 extra months free plus 5 personal trainer sessions. Offer valid till month end. Visit cult.fit.", "legitimate", "legitimate"),
    ("BookMyShow: Blockbuster weekend! Book 2 tickets for the new sci-fi movie and get Rs 150 discount with credit card offer. Book your seats now on bookmyshow.com.", "legitimate", "legitimate"),
    ("Nykaa: Flash Sale starts tonight at 8 PM. Get flat 25% off on luxury skincare essentials. Free shipping on orders above Rs 499. Visit nykaa.com.", "legitimate", "legitimate"),
    ("Airtel Thanks: You have consumed 50% of your daily high-speed data quota of 1.5GB. Recharge data pack via Airtel Thanks App or dial *121#.", "legitimate", "legitimate"),
    ("Jio: Your daily data quota is exhausted. High speed internet will resume at midnight. To continue high-speed data, recharge with 1GB booster pack at Rs 15 on MyJio.", "legitimate", "legitimate"),

    # --- LEGITIMATE: Software, Subscriptions & Accounts ---
    ("GitHub: We noticed a new sign-in to your GitHub account from IP address 122.161.42.10 (Chrome on Windows). If this was you, no action is needed.", "legitimate", "legitimate"),
    ("Google: Your security alert. A new device signed in to your account. Review activity in your Google Account security checkup: myaccount.google.com/security", "legitimate", "legitimate"),
    ("LinkedIn: Alex Morgan and 4 other people viewed your profile this week. See who is looking at your public profile.", "legitimate", "legitimate"),
    ("Spotify: Your monthly Premium subscription receipt is ready. Payment of $9.99 was successfully processed via PayPal. Manage subscription in Spotify settings.", "legitimate", "legitimate"),
    ("Slack: You have been invited to join the workspace 'DevOps Team 2026'. Click to accept invitation and create your account.", "legitimate", "legitimate"),
    ("Zoom: Meeting invitation for 'Product Architecture Review' scheduled for Oct 29, 2026 at 3:00 PM IST. Join Zoom Meeting link in your calendar invite.", "legitimate", "legitimate"),

    # --- ADDITIONAL REALISTIC SCAM EXAMPLES FOR BALANCE & ROBUSTNESS ---
    ("ALERT: Dear user, your electricity power will be terminated tonight at 10 PM by head office officer. Call quickly to pay due bill: 9812948192", "scam", "financial_fraud"),
    ("Your SBI netbanking has expired! Click link to update Aadhaar & PAN card immediately: http://statebank-login-online.cc/kyc", "scam", "financial_fraud"),
    ("KBC Lucky Winner 2026: Dear customer, you have won Rs 25 Lakhs cash lottery. Contact WhatsApp number +91 9771122334 to receive banker check.", "scam", "lottery_scam"),
    ("Special Part Time Job: Like 3 Instagram reels and earn 1500 Rs every day. No investment. Payment via UPI. Message WhatsApp: +919182374615", "scam", "job_scam"),
    ("Telegram Task Job: Rating YouTube videos. Earn Rs 4000 daily. Send your name and phone number to @yt_promoter_agency to get first task.", "scam", "job_scam"),
    ("URGENT: Income Tax Department has approved a refund of Rs 15,490. Update your bank IFSC and ATM card number at http://incometax-gov-refund.top", "scam", "financial_fraud"),
    ("FedEx Delivery Notice: Parcel tracking #FX8912 is stuck at transit depot due to invalid postal code. Click http://fedex-parcel-update.biz to pay $2.50 fee.", "scam", "phishing"),
    ("Amazon Security: An order of Apple MacBook Pro ($2,400) was placed. If you did not make this purchase, call support at 1-888-291-0982 immediately.", "scam", "phishing"),
    ("Bank Manager speaking: We noticed international debit on your card. To cancel, please tell me the 6 digit code received on your SMS right now.", "scam", "impersonation"),
    ("WhatsApp Gold edition released! Download WhatsApp Gold with video calling and free emojis: http://download-whatsapp-gold.xyz/install", "scam", "phishing"),
    ("Double your money in 48 hours with crypto trading software. 100% guaranteed success. Send 50 USDT to wallet address 0x98123... to start.", "scam", "crypto_scam"),
    ("Police Department Warning: A cyber case #9812 is registered against your mobile. Contact cyber inspector immediately at 9192837461 to avoid immediate arrest.", "scam", "impersonation"),
    ("Dad, my phone broke so I'm messaging from my friend's phone. Please send $350 via Venmo to pay for car tow truck, will pay you back tomorrow.", "scam", "impersonation"),
    ("Dear HDFC Customer, your rewards point of 8,500 INR will expire by 11:59 PM. Convert your points to cash directly: http://hdfc-rewards-portal.top", "scam", "financial_fraud"),

    # --- ADDITIONAL REALISTIC LEGITIMATE EXAMPLES ---
    ("Your Airtel broadband bill for account 0114928192 for the month of October is Rs 943.00. Due date is 04-Nov-2026. Pay securely on Airtel Thanks app.", "legitimate", "legitimate"),
    ("Electricity Bill Update: Your payment of Rs 1,840.00 for CA #100291823 was successfully received on 22-Oct. Current balance is Rs 0.00. Thank you, BSES.", "legitimate", "legitimate"),
    ("Swiggy: Your order from Chai Point has been delivered. Enjoy your meal! Please rate your delivery partner in the app.", "legitimate", "legitimate"),
    ("Hi Rahul, let's reschedule our design review to 4:30 PM today so that David can also attend. See you then.", "legitimate", "legitimate"),
    ("Your SBI Fastag account was debited with Rs 65.00 at Kherki Daula Toll Plaza on 24-Oct at 08:35. Available Fastag balance: Rs 430.00.", "legitimate", "legitimate"),
    ("Coursera: Keep up your momentum! You have completed 3 of 5 modules in Machine Learning Specialization. Continue your next lesson today.", "legitimate", "legitimate"),
    ("GitHub: [Security] Dependabot alert resolved in repository scamshield-ai. No further action needed.", "legitimate", "legitimate"),
    ("Hey mom, picked up the groceries you asked for: milk, bread, and fruits. Heading home now in metro.", "legitimate", "legitimate"),
    ("Your one-time password for logging into your employee portal is 918234. This code is valid for 10 minutes. Do not share it with anyone.", "legitimate", "legitimate"),
    ("Tata Sky: Your DTH recharge of Rs 350 for subscriber ID 10928374 is successful. Your connection is active till 25-Nov-2026.", "legitimate", "legitimate"),
    ("Hey Sarah, are we still meeting for lunch today at 1:30 PM? Let me know so I can reserve the table.", "legitimate", "legitimate"),
    ("Hey, how are you doing today? Hope everything is going well with you.", "legitimate", "legitimate"),
    ("Can you please send me the notes from today's lecture? I missed the first half hour.", "legitimate", "legitimate"),
    ("Happy anniversary to both of you! Wishing you many more years of joy and togetherness.", "legitimate", "legitimate"),
    ("Hi, I left my blue umbrella in your car yesterday. Can you bring it to office tomorrow?", "legitimate", "legitimate"),
    ("Let's grab a coffee this evening after work around 6 PM if you are free.", "legitimate", "legitimate"),
    ("The project documentation has been reviewed and merged into the main repository branch.", "legitimate", "legitimate"),
    ("Good morning team, our daily standup call will be pushed back by 15 minutes today.", "legitimate", "legitimate"),
    ("Hi Dr. Gupta, confirming my dental checkup appointment scheduled for tomorrow morning.", "legitimate", "legitimate"),
    ("Your laundry has been washed, pressed, and is ready for pickup at CleanCare branch.", "legitimate", "legitimate"),
    ("Great presentation today! The client was very impressed with our architecture proposal.", "legitimate", "legitimate"),
    ("Hi mom, landed safely in Bangalore. Taking an airport taxi to the hotel now.", "legitimate", "legitimate"),
    ("Please remember to buy milk and bread on your way back home this evening.", "legitimate", "legitimate"),
    ("Your movie tickets for Inception IMAX screening have been sent to your registered email.", "legitimate", "legitimate"),
    ("Thanks for helping me fix the kitchen sink pipe yesterday! Really appreciate it.", "legitimate", "legitimate"),
    ("Hey folks, do we have any plans for dinner tonight or are we ordering takeout?", "legitimate", "legitimate"),
    ("Here is the WiFi password for the guest network at our office: OfficeGuest2026", "legitimate", "legitimate"),
    ("Can we reschedule our one-on-one meeting to Thursday afternoon? Conflict came up.", "legitimate", "legitimate"),
]

def generate_csv():
    os.makedirs("datasets", exist_ok=True)
    df = pd.DataFrame(DATA, columns=["text", "label", "category"])
    # Add source column
    df["source"] = "scamshield_curated_v1"
    
    # Save CSV
    out_path = os.path.join("datasets", "scam_detection_dataset.csv")
    df.to_csv(out_path, index=False, encoding="utf-8")
    
    print(f"Generated {len(df)} samples in {out_path}")
    print("Class distribution:")
    print(df["label"].value_counts())
    print("\nCategory distribution:")
    print(df["category"].value_counts())

if __name__ == "__main__":
    generate_csv()
