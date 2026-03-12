/*

script bash KALI USER psswrd *********

#!/bin/bash


RESET="\e[0m"

REPORT_DIR="reports"
mkdir -p $REPORT_DIR

pause(){
read -p "Press enter to continue"
}

network_scan(){
read -p "Target IP: " target
nmap -sS -sV -O -T4 $target -oN $REPORT_DIR/nmap_scan.txt
pause
}

full_port_scan(){
read -p "Target IP: " target
nmap -p- -T4 $target -oN $REPORT_DIR/full_ports.txt
pause
}

service_enum(){
read -p "Target IP: " target
nmap -sC -sV $target -oN $REPORT_DIR/service_enum.txt
pause
}

web_scan(){
read -p "Target URL: " target
nikto -h $target -output $REPORT_DIR/nikto.txt
pause
}

dir_scan(){
read -p "Target URL: " target
gobuster dir -u $target -w /usr/share/wordlists/dirb/common.txt -o $REPORT_DIR/directories.txt
pause
}

dir_deep_scan(){
read -p "Target URL: " target
gobuster dir -u $target -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -o $REPORT_DIR/deep_directories.txt
pause
}

sql_scan(){
read -p "URL with parameter: " target
sqlmap -u $target --batch --crawl=2 --dbs --output-dir=$REPORT_DIR
pause
}

tech_scan(){
read -p "Target URL: " target
whatweb $target > $REPORT_DIR/tech_stack.txt
pause
}

dns_enum(){
read -p "Domain: " domain
dnsenum $domain > $REPORT_DIR/dns_enum.txt
pause
}

subdomain_scan(){
read -p "Domain: " domain
amass enum -passive -d $domain -o $REPORT_DIR/subdomains.txt
pause
}

osint_scan(){
read -p "Domain: " domain
theHarvester -d $domain -b google -f $REPORT_DIR/osint.html
pause
}

whois_lookup(){
read -p "Domain: " domain
whois $domain > $REPORT_DIR/whois.txt
pause
}

cms_detect(){
read -p "Target URL: " target
whatweb $target --aggression 3 > $REPORT_DIR/cms_detection.txt
pause
}

network_sniff(){
read -p "Interface (eth0/wlan0): " iface
sudo tcpdump -i $iface -w $REPORT_DIR/network_capture.pcap
pause
}

auto_recon(){
read -p "Target domain: " domain

mkdir -p $REPORT_DIR/$domain

amass enum -passive -d $domain -o $REPORT_DIR/$domain/subdomains.txt

theHarvester -d $domain -b google -f $REPORT_DIR/$domain/osint.html

dnsenum $domain > $REPORT_DIR/$domain/dns.txt

whatweb http://$domain > $REPORT_DIR/$domain/tech.txt

nikto -h http://$domain -output $REPORT_DIR/$domain/nikto.txt

gobuster dir -u http://$domain -w /usr/share/wordlists/dirb/common.txt -o $REPORT_DIR/$domain/dirs.txt

pause
}

menu(){

clear

echo "1 Network Scan"
echo "2 Full Port Scan"
echo "3 Service Enumeration"
echo "4 Web Vulnerability Scan"
echo "5 Directory Bruteforce"
echo "6 Deep Directory Scan"
echo "7 SQL Injection Scanner"
echo "8 Technology Detection"
echo "9 DNS Enumeration"
echo "10 Subdomain Discovery"
echo "11 OSINT Email Harvest"
echo "12 WHOIS Lookup"
echo "13 CMS Detection"
echo "14 Network Sniffer"
echo "15 Auto Recon"
echo "16 Exit"

read -p "Choice: " option

case $option in

1. network_scan ;;
2. full_port_scan ;;
3. service_enum ;;
4. web_scan ;;
5. dir_scan ;;
6. dir_deep_scan ;;
7. sql_scan ;;
8. tech_scan ;;
9. dns_enum ;;
10. subdomain_scan ;;
11. osint_scan ;;
12. whois_lookup ;;
13. cms_detect ;;
14. network_sniff ;;
15. auto_recon ;;
16. exit ;;
    *) menu ;;

esac

}

while true
do
menu
done

*/

require('dotenv').config();
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

const Admin = require('./schemas/admin');
const tokens = require('./schemas/tokens'); 
const students = require('./schemas/student');
const parents = require('./schemas/parent');
const teachers = require('./schemas/teacher');

const userModels = {
    student: students,
    parent: parents,
    teacher: teachers
};

const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
});

const adminActionLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
});

// ==========================================
// MIDDLEWARE DE PROTECTION ADMIN
// ==========================================
const authenticateAdmin = (req, res, next) => {
    const token = req.cookies.AccessToken;

    if (!token) {
        return res.status(401).json({ error: "mamnou3 dokhol, token na9es." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ error: "mamnou3, khask tkoun admin." });
        }

        req.admin = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "session salat wla token mashi s7i7." });
    }
};

// ==========================================
// UTILS (Token Generation)
// ==========================================
function generateAccessToken(user) {
    return jwt.sign(
        { id: user._id, role: 'admin' }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        { id: user._id, role: 'admin' }, 
        process.env.REFRESH_SECRET,
        { expiresIn: '7d' }
    );
}

// ==========================================
// 1. AUTHENTIFICATION ADMIN
// ==========================================

router.post('/login',
    adminLoginLimiter,
    body("email").isEmail().normalizeEmail().trim(),
    body("password").exists().trim(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { email, password } = req.body;

            const admin = await Admin.findOne({ email });
            if (!admin) return res.status(401).json({ error: "lma3loumat ghalat" });

            if (!admin.isActive) {
                return res.status(403).json({ error: "l7sab mوقوف, t3asl b da3m." });
            }

            const isMatch = await bcrypt.compare(password, admin.password);
            
            if (!isMatch) {
                admin.loginAttempts = (admin.loginAttempts || 0) + 1;
                if (admin.loginAttempts >= 5) admin.isActive = false;
                await admin.save();
                return res.status(401).json({ error: "lma3loumat ghalat" });
            }

            admin.loginAttempts = 0;
            admin.lastLogin = new Date();
            await admin.save();

            const AccessToken = generateAccessToken(admin);
            const RefreshToken = generateRefreshToken(admin);

            await tokens.create({ userId: admin._id, token: RefreshToken });

            const isProd = process.env.NODE_ENV === 'production';
            const cookieSettings = {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            };

            res.cookie("AccessToken", AccessToken, { ...cookieSettings, maxAge: 3600000 });
            res.cookie("RefreshToken", RefreshToken, { ...cookieSettings, maxAge: 7 * 24 * 3600000 });

            res.json({ 
                succ: "tsejjel dokhol b njah", 
                admin: { id: admin._id, firstName: admin.first_name } 
            });

        } catch (e) {
            console.error(e);
            res.status(500).json({ error: "wa9e3 mochkil f lkhadem" });
        }
    }
);

router.post('/logout', async (req, res) => {
    try {
        const refreshToken = req.cookies.RefreshToken;
        if (refreshToken) await tokens.findOneAndDelete({ token: refreshToken });
        
        res.clearCookie("AccessToken");
        res.clearCookie("RefreshToken");
        res.json({ succ: "tsejjel lkhoroj" });
    } catch (e) {
        res.status(500).json({ error: "wa9e3 mochkil f tsejjel lkhoroj" });
    }
});

// ==========================================
// 2. GESTION DES UTILISATEURS 
// ==========================================

router.post('/ban-user', 
    authenticateAdmin,
    adminActionLimiter,
    body('targetEmail').isEmail().normalizeEmail().trim(),
    body('targetRole').isIn(['student', 'parent', 'teacher']),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { targetEmail, targetRole } = req.body;
        const Model = userModels[targetRole];

        try {
            const user = await Model.findOneAndUpdate(
                { email: targetEmail },
                { $set: { isBanned: true } },
                { new: true }
            );

            if (!user) return res.status(404).json({ error: 'ma l9inach lmostakhdem' });

            await Admin.findByIdAndUpdate(req.admin.id, { $inc: { nb_supp: 1 } });

            return res.json({ succ: `t7dar lmostakhdem (${targetRole}) b njah.` });
        } catch (e) {
            console.error(e);
            return res.status(500).json({ error: 'wa9e3 mochkil f 3amaliyat l7adr' });
        }
    }
);

module.exports = router;