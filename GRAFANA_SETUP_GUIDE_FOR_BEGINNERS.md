# Grafana & Prometheus Setup Guide - For Complete Beginners

**Welcome!** 👋 This guide will teach you how to set up your monitoring dashboards step-by-step, like you've never done this before. Don't worry if you don't know what Grafana or Prometheus are - we'll explain everything!

**Created:** October 20, 2025
**For:** Genesis Phase 4 Production Deployment
**Difficulty:** Beginner (assumes ZERO prior knowledge)
**Time to Complete:** 30-45 minutes

---

## 📖 Table of Contents

1. [What Are We Doing? (The Big Picture)](#what-are-we-doing)
2. [Step 1: Check if Everything is Running](#step-1-check-if-everything-is-running)
3. [Step 2: Open Grafana in Your Web Browser](#step-2-open-grafana-in-your-web-browser)
4. [Step 3: Log In to Grafana](#step-3-log-in-to-grafana)
5. [Step 4: Connect Grafana to Prometheus](#step-4-connect-grafana-to-prometheus)
6. [Step 5: Create Your First Dashboard](#step-5-create-your-first-dashboard)
7. [Step 6: Add Panel 1 - Test Pass Rate](#step-6-add-panel-1---test-pass-rate)
8. [Step 7: Add Panel 2 - Error Rate](#step-7-add-panel-2---error-rate)
9. [Step 8: Add More Panels](#step-8-add-more-panels)
10. [Step 9: Save Your Dashboard](#step-9-save-your-dashboard)
11. [Step 10: Set Up Auto-Refresh](#step-10-set-up-auto-refresh)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 What Are We Doing?

**The Simple Explanation:**

Imagine you're running a lemonade stand. You want to know:
- How many cups of lemonade you sold (that's like "test pass rate")
- How many customers complained (that's like "error rate")
- How long customers waited in line (that's like "latency")

Grafana is like a big scoreboard that shows all these numbers in real-time. Prometheus is like the person counting everything and writing it down. We're going to set up this scoreboard so you can watch your Genesis system run!

**What You'll See at the End:**
- Beautiful graphs showing how your system is doing
- Numbers that update automatically every few seconds
- Colors that turn red when something's wrong, green when everything's good

**Technical Terms We'll Use:**
- **Grafana** = The dashboard (the pretty graphs you'll see)
- **Prometheus** = The database storing all the numbers
- **Panel** = One graph on your dashboard
- **Query** = A question you ask Prometheus (like "how many errors happened?")
- **Metric** = A number Prometheus is tracking (like "error_count = 5")

---

## Step 1: Check if Everything is Running

**What Am I Doing?**
Before we can see our pretty graphs, we need to make sure the 4 programs (called "services") are actually running on your computer.

**What You'll Need:**
- A terminal window (that black box where you type commands)
- Access to your Genesis server

### 1.1 Open Your Terminal

**On Linux/Mac:**
- Press `Ctrl + Alt + T` (all three keys at the same time)
- Or search for "Terminal" in your applications

**On Windows:**
- If you're using Windows, you should be connecting to a Linux server using SSH
- Open "Command Prompt" or "PowerShell" and type: `ssh genesis@your-server-ip`

**What You'll See:**
A black or white box with text that says something like:
```
genesis@genesis-agent-01:~$
```

This is called a "command prompt" - it's waiting for you to type a command!

### 1.2 Type the Magic Command

**Copy and paste this EXACTLY:**
```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

**How to Paste:**
- In terminal, you usually paste with `Ctrl + Shift + V` (not just `Ctrl + V`!)
- Or right-click and select "Paste"

**Press Enter!**

### 1.3 What You Should See

**GOOD Output (Everything is Working):**
```
NAMES           STATUS         PORTS
grafana         Up 5 minutes   0.0.0.0:3000->3000/tcp
prometheus      Up 5 minutes   0.0.0.0:9090->9090/tcp
node-exporter   Up 5 minutes   0.0.0.0:9100->9100/tcp
alertmanager    Up 5 minutes   0.0.0.0:9093->9093/tcp
```

**What This Means:**
- **NAMES** = The name of each program
- **STATUS** = "Up X minutes" means it's running (good!)
- **PORTS** = The "door number" you'll use to access it (like apartment numbers)

**Important Numbers to Remember:**
- **3000** = Grafana (the dashboard)
- **9090** = Prometheus (the database)
- **9093** = Alertmanager (sends alerts)
- **9100** = Node Exporter (monitors the computer itself)

### 1.4 Common Mistakes

**❌ If You See: "docker: command not found"**
- **Problem:** Docker isn't installed
- **Solution:** Ask your system administrator to install Docker
- **Or:** Make sure you're connected to the right server

**❌ If You See: "Cannot connect to the Docker daemon"**
- **Problem:** Docker is installed but not running
- **Solution:** Type: `sudo systemctl start docker`
- **Then:** Try the command again

**❌ If You See: Empty table (no services listed)**
- **Problem:** The monitoring services aren't running
- **Solution:** Type: `docker compose up -d` in the `monitoring/` folder
- **Then:** Wait 10 seconds and try `docker ps` again

**✅ If You See the Four Services:**
Great! Everything is running. Let's move to Step 2!

---

## Step 2: Open Grafana in Your Web Browser

**What Am I Doing?**
Now we're going to open Grafana in a web browser, just like opening Facebook or YouTube!

### 2.1 Open Your Web Browser

**Any browser works:**
- Chrome (recommended)
- Firefox
- Safari
- Edge

**Just click the browser icon on your desktop!**

### 2.2 Type the Grafana Address

**In the address bar at the top (where you normally type google.com), type:**
```
http://localhost:3000
```

**IMPORTANT Notes:**
- Include the `http://` part (don't just type `localhost:3000`)
- The number `3000` is called a "port" - it's like an apartment number for programs
- Press `Enter` after typing!

**What's "localhost"?**
- "localhost" is a special word that means "this computer"
- It's like saying "home" when you give directions
- If you're on a remote server, use the server's IP address instead (like `http://192.168.1.100:3000`)

### 2.3 What You Should See

**GOOD - You See the Grafana Login Page:**

The page should have:
- A Grafana logo (looks like an orange/red graph icon)
- Two text boxes (one says "Email or username", one says "Password")
- A blue button that says "Log in"
- The page title says "Welcome to Grafana"

**If you see this, PERFECT! Move to Step 3.**

### 2.4 Common Mistakes

**❌ If You See: "This site can't be reached" or "Connection refused"**
- **Problem:** Grafana isn't running or you're using the wrong address
- **Solution 1:** Go back to Step 1 and verify Grafana is running
- **Solution 2:** Check if you typed `http://localhost:3000` correctly
- **Solution 3:** If you're on a remote server, replace `localhost` with the server's IP address

**❌ If You See: A blank white page**
- **Problem:** Grafana is starting up but not ready yet
- **Solution:** Wait 30 seconds and refresh the page (press `F5` or click the refresh button)

**❌ If You See: "Your connection is not private" (HTTPS warning)**
- **Problem:** You typed `https://` instead of `http://`
- **Solution:** Make sure the address starts with `http://` (not `https://`)

**✅ If You See the Login Page:**
Excellent! You're almost there. Let's log in!

---

## Step 3: Log In to Grafana

**What Am I Doing?**
We're going to type a username and password to get into Grafana. Think of it like unlocking your phone!

### 3.1 Type the Username

**In the first box (Email or username):**
- Click inside the box with your mouse
- Type exactly: `admin`
- That's it! Just the word "admin" in lowercase

### 3.2 Type the Password

**In the second box (Password):**
- Click inside the box
- Type exactly: `admin`
- Yes, the password is also "admin" (this is the default)

**Security Note (Don't Worry About This Now):**
- Using "admin/admin" is like having "1234" as your phone PIN
- It's okay for now while we're learning
- Later, you should change it to something more secure

### 3.3 Click the Log In Button

**Find the big blue button that says "Log in"**
- Move your mouse over it
- Click once

### 3.4 What You Should See

**First Time Logging In:**

Grafana might show you a popup box that says:
```
"Change Password"
We recommend changing the default password
```

**You have two choices:**

**Choice A: Skip for now (RECOMMENDED for learning)**
- Look for a button that says "Skip" or "I'll do it later"
- Click that button
- You can always change the password later in settings

**Choice B: Change password now**
- Type a new password (make it at least 8 characters)
- Type the same password again to confirm
- Click "Submit"
- **IMPORTANT:** Write down your new password somewhere safe!

**After logging in, you should see:**
- The Grafana home page
- A sidebar on the left with icons
- A big area in the middle that might say "Welcome to Grafana"
- Your username "admin" in the bottom-left corner

### 3.5 Common Mistakes

**❌ If You See: "Invalid username or password"**
- **Problem:** You typed the username or password wrong
- **Solution:** Try again, make sure you typed `admin` in BOTH boxes (all lowercase)
- **Tip:** Copy and paste `admin` if typing isn't working

**❌ If You See: Nothing happens when I click Login**
- **Problem:** The page might be frozen
- **Solution:** Refresh the page (press `F5`) and try logging in again

**✅ If You're Inside Grafana:**
Congratulations! 🎉 You're in! Now let's set up the connection to Prometheus.

---

## Step 4: Connect Grafana to Prometheus

**What Am I Doing?**
Remember how I said Prometheus is like the person counting all the numbers? Well, Grafana needs to know WHERE to find Prometheus so it can show those numbers on graphs. We're going to tell Grafana "Hey, Prometheus is over there!"

**The Simple Explanation:**
It's like connecting your TV to your cable box. The TV (Grafana) needs to be connected to the cable box (Prometheus) to show channels (data).

### 4.1 Open the Data Sources Menu

**Look at the left sidebar** (that vertical menu on the left side of the screen)

**You'll see several icons stacked vertically:**
- A square with 4 smaller squares inside (that's the home icon)
- A plus sign `+`
- A compass icon
- A dashboards icon
- Others...

**Find the GEAR icon ⚙️** (it looks like a gear or settings cog)
- It's usually near the bottom of the sidebar
- Move your mouse over it
- It should say "Configuration" when you hover

**Click the gear icon ⚙️**

**A menu will appear with options like:**
- Data Sources
- Plugins
- Preferences
- API Keys

**Click "Data Sources"**

### 4.2 Check if Prometheus is Already Connected

**You should now see a page that says "Data Sources" at the top**

**Look in the middle of the page:**

**If you see a box that says "Prometheus":**
- GOOD! It's already connected
- Click on "Prometheus" to check the settings
- Skip to Step 4.5 to test the connection

**If you DON'T see Prometheus:**
- That's okay! We'll add it now
- Continue to Step 4.3

### 4.3 Add Prometheus Data Source

**Click the big blue button that says "Add data source"** or "Add your first data source"

**You'll see a list of data source types:**
- Prometheus
- MySQL
- PostgreSQL
- InfluxDB
- And many more...

**In the search box at the top, type:** `prometheus`

**Click on "Prometheus"** (it usually has an orange flame icon)

### 4.4 Configure Prometheus Settings

**You should now see a form with many fields. Don't panic! We only need to fill in ONE field.**

**Find the field labeled "URL"** (it's near the top)

**In the URL box, type EXACTLY:**
```
http://prometheus:9090
```

**IMPORTANT Details:**
- Must start with `http://` (not `https://`)
- Must say `prometheus` (not `localhost`)
- Must end with `:9090`
- No spaces anywhere!

**Leave everything else as default!** Seriously, don't touch any other settings.

**Scroll down to the bottom** of the page

**You'll see a button that says "Save & Test"** (it's usually green or blue)

**Click "Save & Test"**

### 4.5 What You Should See

**GOOD - Success Message:**
```
✓ Data source is working
```

Or:
```
✓ Successfully queried the Prometheus API
```

**This means Grafana can talk to Prometheus! 🎉**

### 4.6 Common Mistakes

**❌ If You See: "HTTP Error Bad Gateway"**
- **Problem:** The URL is wrong or Prometheus isn't running
- **Solution 1:** Make sure you typed `http://prometheus:9090` (not `localhost`)
- **Solution 2:** Go back to Step 1 and verify Prometheus is running
- **Solution 3:** Check for typos (common mistake: `promethues` instead of `prometheus`)

**❌ If You See: "Timeout"**
- **Problem:** Prometheus is starting up or network issues
- **Solution:** Wait 30 seconds and click "Save & Test" again

**✅ If You See the Success Message:**
Perfect! You've connected Grafana to Prometheus. Now we can make graphs!

---

## Step 5: Create Your First Dashboard

**What Am I Doing?**
A "dashboard" is like a big bulletin board where you pin all your graphs. We're going to create an empty bulletin board, then add graphs to it one by one.

### 5.1 Go to the Dashboards Menu

**Look at the left sidebar again**

**Find the icon that looks like four squares** 📊 (it's called the "Dashboards" icon)
- It's usually the 3rd or 4th icon from the top
- When you hover over it, it should say "Dashboards"

**Click the Dashboards icon 📊**

**A menu will dropdown with options:**
- Home
- Browse
- Playlists
- Snapshots
- Library panels
- New dashboard (or "+ New")

**Click "New dashboard"** or **"+ New"** → **"New Dashboard"**

### 5.2 What You Should See

**You should now see an almost-empty page with:**
- A button that says "+ Add visualization" (big and blue)
- Or a button that says "Add panel"
- The top says "New dashboard" or "Dashboard"

**This is your blank bulletin board!**

### 5.3 Common Mistakes

**❌ If You Don't See "+ Add visualization"**
- **Problem:** You might be on the wrong page
- **Solution:** Look for a "+ Create" button or "+ New" in the top-right corner
- **Or:** Press `Escape` on your keyboard and try again from Step 5.1

**✅ If You See the Empty Dashboard:**
Great! Let's add our first graph!

---

## Step 6: Add Panel 1 - Test Pass Rate

**What Am I Doing?**
We're adding our first graph! This graph will show what percentage of tests are passing. Remember the lemonade stand analogy? This is like showing "95% of customers were happy."

**Target:** We want this to be ≥98% (greater than or equal to 98%)

### 6.1 Click "+ Add visualization"

**Big blue button in the middle of the screen**

**Click it!**

### 6.2 Select Prometheus

**You'll see a list of data sources:**
- Prometheus
- Maybe others if you added more

**Click "Prometheus"**

### 6.3 You're Now in the Panel Editor

**What you see:**
- A big graph area at the top (probably showing random data or nothing)
- A query editor box below
- Settings panels on the right

**Don't be overwhelmed! We'll fill this in step-by-step.**

### 6.4 Type the Query

**Find the box labeled "Metrics browser"** or the box where you type queries
- It might say "Select metric" or have a search icon
- Click inside this box

**Paste this EXACT text:**
```
(genesis_tests_passed / genesis_tests_total) * 100
```

**What does this mean?**
- `genesis_tests_passed` = Number of tests that passed
- `genesis_tests_total` = Total number of tests
- We divide passed by total to get a percentage
- We multiply by 100 to turn 0.98 into 98

**Press Enter or click outside the box**

### 6.5 Set the Panel Title

**Look on the right side of the screen**

**Find the section labeled "Panel options"** (you might need to scroll)

**Find the field labeled "Title"**

**Type:** `Test Pass Rate`

### 6.6 Set the Unit

**Still on the right side panel**

**Find the section labeled "Standard options"**

**Find the dropdown labeled "Unit"**
- Click it
- In the search box, type: `percent`
- Select "Percent (0-100)"

**What this does:**
- It tells Grafana "this number is a percentage"
- It will show as "98%" instead of just "98"

### 6.7 Set the Thresholds

**Find the section labeled "Thresholds"**

**You'll see colored bars with numbers:**
- Usually Base (green) and one other color

**We want three colors:**
- Red if less than 95%
- Yellow if 95-98%
- Green if 98% or higher

**Click "+ Add threshold"**

**Set the first threshold:**
- Value: `95`
- Color: Yellow (click the color box and select yellow)

**Click "+ Add threshold" again**

**Set the second threshold:**
- Value: `98`
- Color: Green (select green)

**What you should see now:**
- Three colored bars
- Red from 0 to 95
- Yellow from 95 to 98
- Green from 98 to 100

### 6.8 Save the Panel

**Look at the top-right corner of the screen**

**Click the "Apply" button** (it's blue)

**You should see your first panel appear on the dashboard!** 🎉

### 6.9 Common Mistakes

**❌ If the Graph Shows "No data"**
- **Problem:** The metric doesn't exist yet (normal if Genesis isn't running)
- **Solution:** This is okay! The panel is set up correctly; it will show data when Genesis starts sending metrics

**❌ If You See: "Parse error"**
- **Problem:** The query has a typo
- **Solution:** Copy and paste the query again exactly as shown in Step 6.4

**✅ If You See Your First Panel:**
Congratulations! You created your first monitoring panel! Let's add more!

---

## Step 7: Add Panel 2 - Error Rate

**What Am I Doing?**
This graph shows what percentage of requests are failing. Think of it like "2 out of 100 lemonades were made wrong."

**Target:** We want this to be <0.1% (less than 0.1%)

### 7.1 Add a New Panel

**In the top-right corner, click the icon that looks like a + sign** or click "Add" → "Visualization"

**Select "Prometheus" again**

### 7.2 Type the Error Rate Query

**In the query box, paste:**
```
(rate(genesis_errors_total[5m]) / rate(genesis_requests_total[5m])) * 100
```

**What does this mean?**
- `rate(...[5m])` = "how many per second in the last 5 minutes"
- `genesis_errors_total` = Total number of errors
- `genesis_requests_total` = Total number of requests
- We divide errors by requests to get error percentage

### 7.3 Set Panel Title

**Title:** `Error Rate`

### 7.4 Set Unit

**Unit:** `Percent (0-100)`

### 7.5 Set Thresholds

**We want:**
- Green if less than 0.1%
- Yellow if 0.1% to 1%
- Red if greater than 1%

**Add threshold 1:**
- Value: `0.1`
- Color: Yellow

**Add threshold 2:**
- Value: `1`
- Color: Red

**Base should be Green**

### 7.6 Click Apply

Your second panel appears!

---

## Step 8: Add More Panels

**I'll give you the quick reference for the remaining panels. Follow the same pattern as Panels 1 and 2!**

### Panel 3: P95 Latency

**Query:**
```
histogram_quantile(0.95, rate(genesis_request_duration_seconds_bucket[5m])) * 1000
```

**Title:** `P95 Latency`

**Unit:** `Milliseconds (ms)`

**Thresholds:**
- Green: < 200ms
- Yellow: 200-500ms
- Red: > 500ms

**What this shows:** How long 95% of requests take (in milliseconds)

### Panel 4: System Uptime

**Query:**
```
up{job="genesis"}
```

**Title:** `System Uptime`

**Visualization:** Change to "Stat" (instead of Time series)

**Value Mappings:**
- 0 = "Down" (Red)
- 1 = "Up" (Green)

**What this shows:** Whether the system is up (1) or down (0)

### Panel 5: Memory Usage

**Query:**
```
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes * 100
```

**Title:** `Memory Available`

**Unit:** `Percent (0-100)`

**Thresholds:**
- Red: < 10%
- Yellow: 10-30%
- Green: > 30%

### Panel 6: CPU Usage

**Query:**
```
100 - (avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)
```

**Title:** `CPU Usage`

**Unit:** `Percent (0-100)`

**Thresholds:**
- Green: < 60%
- Yellow: 60-80%
- Red: > 80%

---

## Step 9: Save Your Dashboard

**What Am I Doing?**
Now we need to save all these panels so they don't disappear when you close your browser!

### 9.1 Click the Save Icon

**Look at the top-right corner**

**Find the "save" icon** (looks like a floppy disk 💾) or a button that says "Save dashboard"

**Click it!**

### 9.2 Give Your Dashboard a Name

**A popup will appear asking for a name**

**Type:** `Genesis Production Monitoring`

**Or any name you like!**

### 9.3 Click Save

**Click the blue "Save" button**

**You'll see a success message:** "Dashboard saved"

---

## Step 10: Set Up Auto-Refresh

**What Am I Doing?**
Right now, your dashboard only updates when you refresh the page. Let's make it update automatically every 15 seconds!

### 10.1 Find the Refresh Dropdown

**Look at the top-right corner of your dashboard**

**Find a dropdown that says "Off"** or shows a time (like "5s", "30s")
- It might have a circular arrow icon 🔄
- It's usually next to the time range picker

### 10.2 Click the Dropdown

**Click it!**

**You'll see options like:**
- Off
- 5s
- 10s
- 30s
- 1m
- 5m

### 10.3 Select Your Refresh Rate

**For active monitoring, choose:** `15s` or `30s`

**What this means:**
- `15s` = Dashboard updates every 15 seconds
- `30s` = Dashboard updates every 30 seconds

**The dashboard will now update automatically!** 🎉

---

## 🎉 Congratulations!

**You did it!** You now have a fully functional monitoring dashboard!

**What you can do now:**
1. Watch your graphs update in real-time
2. See when metrics turn red (something's wrong)
3. Track your system's performance 24/7

**Next Steps:**
- Open http://localhost:3000 anytime to see your dashboard
- Set up alerts (advanced topic for later)
- Create more dashboards for different views

---

## 🆘 Troubleshooting

### General Problems

**Problem: Graphs show "No data"**
- **Cause:** Genesis isn't running yet or metrics aren't being sent
- **Solution:** This is normal! Graphs will populate when Genesis starts

**Problem: Can't access Grafana at localhost:3000**
- **Cause:** Grafana isn't running or you're using wrong address
- **Solution:** Run `docker ps` and verify Grafana is running

**Problem: Forgot my Grafana password**
- **Cause:** You changed it and forgot
- **Solution:** Reset it by running: `docker exec -it grafana grafana-cli admin reset-admin-password newpassword`

### Dashboard Problems

**Problem: Panels are all blank**
- **Cause:** No data source selected
- **Solution:** Go back to Step 4 and verify Prometheus is connected

**Problem: Queries show errors**
- **Cause:** Typo in the query
- **Solution:** Copy-paste the exact queries from this guide

**Problem: Can't find my saved dashboard**
- **Cause:** Didn't save properly or navigated away
- **Solution:** Click Dashboards → Browse → Look for your dashboard name

---

## 📚 Glossary - What Do These Words Mean?

- **Dashboard** - A page with multiple graphs and panels
- **Panel** - One single graph or chart
- **Query** - A question you ask Prometheus for data
- **Metric** - A number that Prometheus tracks over time
- **Threshold** - A limit that changes color when crossed
- **Data Source** - Where Grafana gets its data from (Prometheus)
- **Visualization** - How data is displayed (graph, number, table, etc.)
- **Time Series** - Data that changes over time (like stock prices)
- **Percentile (P95)** - "95% of values are less than this number"

---

**End of Guide**
**You are now a Grafana beginner!** 🎓
**Questions? Check the troubleshooting section or ask for help!**
