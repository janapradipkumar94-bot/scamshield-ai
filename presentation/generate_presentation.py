import sys
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide layout

    # Palette definition (Clean, Modern, Off-White & Light Blue)
    BG_COLOR = RGBColor(248, 250, 252)       # Slate 50 (#F8FAFC)
    CARD_BG = RGBColor(255, 255, 255)        # Pure White (#FFFFFF)
    CARD_BORDER = RGBColor(226, 232, 240)    # Slate 200 (#E2E8F0)
    TEXT_NAVY = RGBColor(15, 23, 42)         # Slate 900 (#0F172A)
    TEXT_MUTED = RGBColor(71, 85, 105)       # Slate 600 (#475569)
    TEXT_LIGHT = RGBColor(100, 116, 139)     # Slate 500 (#64748B)
    BLUE_PRIMARY = RGBColor(2, 132, 199)     # Sky 600 (#0284C7)
    BLUE_DARK = RGBColor(3, 105, 161)        # Sky 700 (#0369A1)
    BLUE_LIGHT = RGBColor(224, 242, 254)     # Sky 100 (#E0F2FE)
    BLUE_BADGE_TEXT = RGBColor(3, 105, 161)  # Sky 700
    GREEN_ACCENT = RGBColor(16, 185, 129)    # Emerald 500
    AMBER_ACCENT = RGBColor(245, 158, 11)    # Amber 500
    ROSE_ACCENT = RGBColor(225, 29, 72)      # Rose 600

    def add_slide_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.color.rgb = BG_COLOR
        return bg

    def add_header(slide, slide_num, title, subtitle):
        # Top banner line
        top_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(0.4), Inches(11.733), Inches(0.04))
        top_bar.fill.solid()
        top_bar.fill.fore_color.rgb = BLUE_PRIMARY
        top_bar.line.fill.background()

        # Header textbox
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.55), Inches(9.5), Inches(1.1))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p_num = tf.paragraphs[0]
        p_num.text = f"SCAMSHIELD AI  •  SLIDE {slide_num} OF 7"
        p_num.font.size = Pt(9.5)
        p_num.font.bold = True
        p_num.font.color.rgb = BLUE_PRIMARY

        p_title = tf.add_paragraph()
        p_title.text = title
        p_title.font.size = Pt(22)
        p_title.font.bold = True
        p_title.font.color.rgb = TEXT_NAVY
        p_title.space_before = Pt(3)

        p_sub = tf.add_paragraph()
        p_sub.text = subtitle
        p_sub.font.size = Pt(11)
        p_sub.font.color.rgb = TEXT_MUTED
        p_sub.space_before = Pt(2)

        # Right-side institution badge
        badge = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(10.2), Inches(0.65), Inches(2.333), Inches(0.6))
        badge.fill.solid()
        badge.fill.fore_color.rgb = BLUE_LIGHT
        badge.line.color.rgb = CARD_BORDER
        badge_tf = badge.text_frame
        badge_tf.word_wrap = True
        bp = badge_tf.paragraphs[0]
        bp.text = "JIS COLLEGE OF ENGINEERING"
        bp.font.size = Pt(8.5)
        bp.font.bold = True
        bp.font.color.rgb = BLUE_BADGE_TEXT
        bp.alignment = PP_ALIGN.CENTER

    # ==========================================
    # SLIDE 1: COVER PAGE
    # ==========================================
    s1 = prs.slides.add_slide(blank_layout)
    add_slide_bg(s1)

    # Decorative subtle corner element
    decor1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.15), Inches(7.5))
    decor1.fill.solid()
    decor1.fill.fore_color.rgb = BLUE_PRIMARY
    decor1.line.fill.background()

    # College Name Header Card
    col_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(0.7), Inches(11.333), Inches(0.8))
    col_card.fill.solid()
    col_card.fill.fore_color.rgb = CARD_BG
    col_card.line.color.rgb = CARD_BORDER
    col_tf = col_card.text_frame
    col_p = col_tf.paragraphs[0]
    col_p.text = "JIS COLLEGE OF ENGINEERING"
    col_p.font.size = Pt(14)
    col_p.font.bold = True
    col_p.font.color.rgb = BLUE_PRIMARY
    col_p.alignment = PP_ALIGN.CENTER
    col_sub = col_tf.add_paragraph()
    col_sub.text = "Affiliated to MAKAUT, WB • Autonomous Institution • Department of Computer Science & Engineering"
    col_sub.font.size = Pt(9.5)
    col_sub.font.color.rgb = TEXT_LIGHT
    col_sub.alignment = PP_ALIGN.CENTER

    # Main Project Title Card (Left)
    main_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(1.8), Inches(6.8), Inches(4.9))
    main_card.fill.solid()
    main_card.fill.fore_color.rgb = CARD_BG
    main_card.line.color.rgb = CARD_BORDER
    mtf = main_card.text_frame
    mtf.word_wrap = True
    mtf.margin_left = Inches(0.5)
    mtf.margin_right = Inches(0.5)
    mtf.margin_top = Inches(0.6)

    p1 = mtf.paragraphs[0]
    p1.text = "MAJOR ACADEMIC PROJECT PRESENTATION"
    p1.font.size = Pt(10)
    p1.font.bold = True
    p1.font.color.rgb = BLUE_PRIMARY

    p2 = mtf.add_paragraph()
    p2.text = "SCAMSHIELD AI"
    p2.font.size = Pt(36)
    p2.font.bold = True
    p2.font.color.rgb = TEXT_NAVY
    p2.space_before = Pt(8)

    p3 = mtf.add_paragraph()
    p3.text = "AI Scam Detection System"
    p3.font.size = Pt(18)
    p3.font.bold = True
    p3.font.color.rgb = BLUE_DARK
    p3.space_before = Pt(4)

    p4 = mtf.add_paragraph()
    p4.text = "A modern, multi-vector cybersecurity platform designed to protect citizens against malicious SMS text, deceptive phishing links, and fraudulent email impersonations using real-time machine learning inference."
    p4.font.size = Pt(11)
    p4.font.color.rgb = TEXT_MUTED
    p4.space_before = Pt(14)

    p5 = mtf.add_paragraph()
    p5.text = "🛡️ Instant 2-Second Verification   •   🌐 7 Indian Regional Languages   •   📞 1930 Helpline Integration"
    p5.font.size = Pt(10)
    p5.font.bold = True
    p5.font.color.rgb = BLUE_PRIMARY
    p5.space_before = Pt(20)

    # Team Members Card (Right)
    team_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.1), Inches(1.8), Inches(4.233), Inches(4.9))
    team_card.fill.solid()
    team_card.fill.fore_color.rgb = CARD_BG
    team_card.line.color.rgb = CARD_BORDER
    tt_tf = team_card.text_frame
    tt_tf.word_wrap = True
    tt_tf.margin_left = Inches(0.4)
    tt_tf.margin_right = Inches(0.4)
    tt_tf.margin_top = Inches(0.4)

    tp1 = tt_tf.paragraphs[0]
    tp1.text = "PROJECT TEAM"
    tp1.font.size = Pt(10)
    tp1.font.bold = True
    tp1.font.color.rgb = BLUE_PRIMARY

    tp2 = tt_tf.add_paragraph()
    tp2.text = "Presented By:"
    tp2.font.size = Pt(16)
    tp2.font.bold = True
    tp2.font.color.rgb = TEXT_NAVY
    tp2.space_before = Pt(2)

    team_members = [
        ("1. Maharuf Sardar", "B.Tech CSE"),
        ("2. Pradip Kumar Jana", "B.Tech CSE"),
        ("3. Tathagata Karfa", "B.Tech CSE"),
        ("4. Suman Ansari", "B.Tech CSE"),
        ("5. Mouktik Chakraborty", "B.Tech CSE")
    ]

    for name, dept in team_members:
        pn = tt_tf.add_paragraph()
        pn.text = f"•  {name}"
        pn.font.size = Pt(12)
        pn.font.bold = True
        pn.font.color.rgb = TEXT_NAVY
        pn.space_before = Pt(10)

        pd = tt_tf.add_paragraph()
        pd.text = f"    Department of Computer Science & Engineering"
        pd.font.size = Pt(9)
        pd.font.color.rgb = TEXT_LIGHT

    # ==========================================
    # SLIDE 2: INTRODUCTION & PROBLEM STATEMENT
    # ==========================================
    s2 = prs.slides.add_slide(blank_layout)
    add_slide_bg(s2)
    add_header(s2, 2, "Introduction & Problem Statement", "Understanding the rapid proliferation of digital fraud in India's expanding digital economy.")

    # Context Card (Top Full-width banner)
    ctx_card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(11.733), Inches(1.15))
    ctx_card.fill.solid()
    ctx_card.fill.fore_color.rgb = CARD_BG
    ctx_card.line.color.rgb = CARD_BORDER
    c_tf = ctx_card.text_frame
    c_tf.margin_left = Inches(0.3)
    c_tf.margin_right = Inches(0.3)
    c_tf.margin_top = Inches(0.2)
    cp1 = c_tf.paragraphs[0]
    cp1.text = "The Surge of Social Engineering & Cybercrime in India"
    cp1.font.size = Pt(13)
    cp1.font.bold = True
    cp1.font.color.rgb = TEXT_NAVY

    cp2 = c_tf.add_paragraph()
    cp2.text = "India processes over 13+ billion monthly UPI transactions, creating an unprecedented attack surface. Modern fraudsters no longer rely on obvious viruses—they exploit human trust through sophisticated social engineering tactics including urgent KYC deactivations, power cuts, digital arrest threats, and fake job offers."
    cp2.font.size = Pt(10.5)
    cp2.font.color.rgb = TEXT_MUTED
    cp2.space_before = Pt(4)

    # 3 Problem Pillars
    pillars = [
        ("Phishing & Lookalike Links", "Attackers craft lookalike domains (e.g. sbi-kyc-verify.top) that closely mimic authentic banking and utility portals. Traditional spam filters often miss newly registered, short-lived malicious URLs.", "🌐 Attack Vector 1"),
        ("Psychological Urgency & Fear", "Coercive messages threaten power disconnection at 9:30 PM, immediate account freezing, or fake legal arrest warrants. Victims are rushed into panicked actions before they can independently verify.", "⚡ Attack Vector 2"),
        ("Language & Tech Barrier", "Over 70% of new digital payment users in Tier-2 and rural India do not read English fluently and struggle to assess cybersecurity indicators, making vernacular detection tools an urgent necessity.", "👥 Accessibility Gap")
    ]

    for idx, (title, desc, tag) in enumerate(pillars):
        left_pos = Inches(0.8 + idx * 4.0)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, Inches(3.2), Inches(3.733), Inches(3.6))
        card.fill.solid()
        card.fill.fore_color.rgb = CARD_BG
        card.line.color.rgb = CARD_BORDER
        ctf = card.text_frame
        ctf.margin_left = Inches(0.25)
        ctf.margin_right = Inches(0.25)
        ctf.margin_top = Inches(0.3)

        ptag = ctf.paragraphs[0]
        ptag.text = tag
        ptag.font.size = Pt(9.5)
        ptag.font.bold = True
        ptag.font.color.rgb = BLUE_PRIMARY

        pt = ctf.add_paragraph()
        pt.text = title
        pt.font.size = Pt(14)
        pt.font.bold = True
        pt.font.color.rgb = TEXT_NAVY
        pt.space_before = Pt(6)

        pd = ctf.add_paragraph()
        pd.text = desc
        pd.font.size = Pt(10.5)
        pd.font.color.rgb = TEXT_MUTED
        pd.space_before = Pt(10)

    # ==========================================
    # SLIDE 3: PROPOSED SOLUTION & OBJECTIVES
    # ==========================================
    s3 = prs.slides.add_slide(blank_layout)
    add_slide_bg(s3)
    add_header(s3, 3, "Proposed Solution & Project Objectives", "How ScamShield AI democratises cybersecurity intelligence for every digital citizen.")

    # Left: Proposed Solution Summary Card
    sol_card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(5.6), Inches(4.95))
    sol_card.fill.solid()
    sol_card.fill.fore_color.rgb = CARD_BG
    sol_card.line.color.rgb = CARD_BORDER
    stf = sol_card.text_frame
    stf.margin_left = Inches(0.35)
    stf.margin_right = Inches(0.35)
    stf.margin_top = Inches(0.35)

    sp1 = stf.paragraphs[0]
    sp1.text = "THE SCAMSHIELD AI PARADIGM"
    sp1.font.size = Pt(10)
    sp1.font.bold = True
    sp1.font.color.rgb = BLUE_PRIMARY

    sp2 = stf.add_paragraph()
    sp2.text = "Instant, Privacy-First Pre-Click Verification"
    sp2.font.size = Pt(17)
    sp2.font.bold = True
    sp2.font.color.rgb = TEXT_NAVY
    sp2.space_before = Pt(4)

    sp3 = stf.add_paragraph()
    sp3.text = "ScamShield AI acts as an intelligent first line of defense. Instead of asking citizens to interpret raw URLs or technical email headers, the platform parses raw text, extracts linguistic threat markers, executes a trained TF-IDF machine learning model, and returns an unambiguous verdict."
    sp3.font.size = Pt(11)
    sp3.font.color.rgb = TEXT_MUTED
    sp3.space_before = Pt(10)

    bullets = [
        "100% Free & Accessible Web Platform requiring zero app installation.",
        "Zero-storage of sensitive user communications (privacy-by-design).",
        "Deterministic heuristic safety layers combined with statistical ML.",
        "Direct connection to Indian National Cybercrime reporting portal (1930)."
    ]
    for b in bullets:
        pb = stf.add_paragraph()
        pb.text = f"✓  {b}"
        pb.font.size = Pt(10)
        pb.font.color.rgb = TEXT_NAVY
        pb.space_before = Pt(8)

    # Right: 4 Objective Cards
    objs = [
        ("Multi-Vector Threat Scanning", "Provide unified detection for SMS text messages, suspicious URLs, and deceptive phishing emails under one responsive roof.", "🎯 Objective 1"),
        ("Dual-Engine Accurate Scoring", "Compute an explainable 0–100 Risk Score backed by probability confidence and transparent indicator explanations.", "📊 Objective 2"),
        ("Vernacular Voice Assistance", "Overcome literacy and language hurdles by delivering analysis and audio readout in 7 Indian regional languages.", "🔊 Objective 3"),
        ("Citizen Empowerment & Action", "Provide immediate step-by-step guidance on what to do, preventing credential leaks and frozen funds.", "🛡️ Objective 4")
    ]

    for idx, (title, desc, tag) in enumerate(objs):
        row = idx // 2
        col = idx % 2
        top_pos = Inches(1.85 + row * 2.55)
        left_pos = Inches(6.65 + col * 2.95)

        ocard = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, top_pos, Inches(2.8), Inches(2.4))
        ocard.fill.solid()
        ocard.fill.fore_color.rgb = CARD_BG
        ocard.line.color.rgb = CARD_BORDER
        otf = ocard.text_frame
        otf.margin_left = Inches(0.2)
        otf.margin_right = Inches(0.2)
        otf.margin_top = Inches(0.2)

        op1 = otf.paragraphs[0]
        op1.text = tag
        op1.font.size = Pt(9)
        op1.font.bold = True
        op1.font.color.rgb = BLUE_PRIMARY

        op2 = otf.add_paragraph()
        op2.text = title
        op2.font.size = Pt(12)
        op2.font.bold = True
        op2.font.color.rgb = TEXT_NAVY
        op2.space_before = Pt(3)

        op3 = otf.add_paragraph()
        op3.text = desc
        op3.font.size = Pt(9.5)
        op3.font.color.rgb = TEXT_MUTED
        op3.space_before = Pt(6)

    # ==========================================
    # SLIDE 4: KEY FEATURES & TECHNOLOGY STACK
    # ==========================================
    s4 = prs.slides.add_slide(blank_layout)
    add_slide_bg(s4)
    add_header(s4, 4, "Key Features & Technology Stack", "Real production technologies and features actually implemented in the ScamShield AI project.")

    # Left Column: Implemented Features (6 Items)
    feat_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(5.7), Inches(4.95))
    feat_card.fill.solid()
    feat_card.fill.fore_color.rgb = CARD_BG
    feat_card.line.color.rgb = CARD_BORDER
    ftf = feat_card.text_frame
    ftf.margin_left = Inches(0.3)
    ftf.margin_right = Inches(0.3)
    ftf.margin_top = Inches(0.3)

    fp1 = ftf.paragraphs[0]
    fp1.text = "CORE IMPLEMENTED CAPABILITIES"
    fp1.font.size = Pt(10)
    fp1.font.bold = True
    fp1.font.color.rgb = BLUE_PRIMARY

    features = [
        ("🔍 Multi-Vector Threat Scanner", "Dedicated tabs for SMS messages, lookalike URLs, and phishing emails with auto-paste clipboard detection."),
        ("⚡ 0–100 Dynamic Risk Gauge", "Radial SVG visualization calculating Low Risk (<30), Suspicious (30–69), and High Risk (≥70) verdicts."),
        ("🌐 7 Indian Regional Languages", "Seamless support for English, Hindi, Bengali, Tamil, Telugu, Marathi, and Gujarati UI & analysis."),
        ("🔊 Multi-Language Text-to-Speech", "Native speech synthesis reading safety verdicts aloud in the selected regional dialect for accessibility."),
        ("🚨 Direct 1930 Helpline Integration", "Instant 1-click dialer and direct link to national portal cybercrime.gov.in for immediate fraud reporting."),
        ("📊 Security Telemetry & History", "Personal scan dashboard with Recharts distribution charts and admin review queue.")
    ]

    for title, desc in features:
        p_t = ftf.add_paragraph()
        p_t.text = title
        p_t.font.size = Pt(11)
        p_t.font.bold = True
        p_t.font.color.rgb = TEXT_NAVY
        p_t.space_before = Pt(6)

        p_d = ftf.add_paragraph()
        p_d.text = desc
        p_d.font.size = Pt(9.5)
        p_d.font.color.rgb = TEXT_MUTED

    # Right Column: Actual Tech Stack (4 Quadrants)
    stack_groups = [
        ("Frontend Architecture", "React 18 + Vite (Tailwind CSS)", [
            "React 18 Single Page App with Vite HMR",
            "Tailwind CSS for responsive cybersecurity UI",
            "Lucide React Icons & Recharts Data Visualisation",
            "Web Speech API for native multi-language voice"
        ], "💻 Client Side"),
        ("Backend Services", "FastAPI + Python 3.14 (Uvicorn)", [
            "FastAPI async REST endpoints with auto OpenAPI docs",
            "Pydantic v2 strict data schema validation",
            "Bcrypt salted hashing & PyJWT token security",
            "Fault-tolerant in-memory & MongoDB driver support"
        ], "⚙️ Server Side"),
        ("Machine Learning Engine", "Scikit-Learn + Joblib", [
            "TF-IDF Vectorizer with unigrams and bigrams",
            "Logistic Regression classifier with calibrated thresholds",
            "Domain topology & lexical URL heuristic rules",
            "100% held-out test split accuracy benchmark"
        ], "🧠 AI / ML Pipeline"),
        ("Security & Operations", "Modern Cybersecurity Standards", [
            "SHA-256 cryptographic scan hashing",
            "Role-based access control (Admin vs Standard)",
            "Safe domain parsing without visiting untrusted URLs",
            "Automated Pytest suite with 17/17 passing tests"
        ], "🔒 Security & DevOps")
    ]

    for idx, (title, tech, points, badge) in enumerate(stack_groups):
        row = idx // 2
        col = idx % 2
        top_pos = Inches(1.85 + row * 2.55)
        left_pos = Inches(6.75 + col * 2.9)

        scard = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, top_pos, Inches(2.75), Inches(2.4))
        scard.fill.solid()
        scard.fill.fore_color.rgb = CARD_BG
        scard.line.color.rgb = CARD_BORDER
        stf = scard.text_frame
        stf.margin_left = Inches(0.2)
        stf.margin_right = Inches(0.2)
        stf.margin_top = Inches(0.2)

        s_b = stf.paragraphs[0]
        s_b.text = badge
        s_b.font.size = Pt(8.5)
        s_b.font.bold = True
        s_b.font.color.rgb = BLUE_PRIMARY

        s_t = stf.add_paragraph()
        s_t.text = title
        s_t.font.size = Pt(11.5)
        s_t.font.bold = True
        s_t.font.color.rgb = TEXT_NAVY
        s_t.space_before = Pt(2)

        s_sub = stf.add_paragraph()
        s_sub.text = tech
        s_sub.font.size = Pt(9)
        s_sub.font.bold = True
        s_sub.font.color.rgb = BLUE_DARK
        s_sub.space_before = Pt(2)

        for pt in points:
            s_pt = stf.add_paragraph()
            s_pt.text = f"• {pt}"
            s_pt.font.size = Pt(8.5)
            s_pt.font.color.rgb = TEXT_MUTED
            s_pt.space_before = Pt(3)

    # ==========================================
    # SLIDE 5: SYSTEM ARCHITECTURE & WORKING PROCESS
    # ==========================================
    s5 = prs.slides.add_slide(blank_layout)
    add_slide_bg(s5)
    add_header(s5, 5, "System Architecture & Working Process", "End-to-end data pipeline from user input to real-time risk determination.")

    # 5-Step Process Flow Horizontal Boxes
    steps = [
        ("1. User Input", "SMS, WhatsApp text, website URL, or email content is pasted or uploaded into the client interface.", "INPUT LAYER", BLUE_PRIMARY),
        ("2. Data Preprocessing", "Normalization, lowercasing, URL lexical extraction (TLDs, subdomains, IPs), and token n-gram generation.", "PROCESSING", BLUE_DARK),
        ("3. AI & ML Analysis", "TF-IDF vector mapping against trained vocabulary + domain heuristic threat weights evaluation.", "AI INFERENCE", BLUE_PRIMARY),
        ("4. Scam Detection", "Probability calibration, confidence scoring (0–100), severity labeling, and trigger token extraction.", "CLASSIFICATION", BLUE_DARK),
        ("5. Result Display", "Dynamic Risk Gauge, plain-English advice, vernacular TTS audio readout, and 1930 emergency hotline link.", "VERDICT LAYER", GREEN_ACCENT)
    ]

    for idx, (title, desc, layer, color) in enumerate(steps):
        left_pos = Inches(0.8 + idx * 2.4)
        box = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, Inches(1.9), Inches(2.2), Inches(3.2))
        box.fill.solid()
        box.fill.fore_color.rgb = CARD_BG
        box.line.color.rgb = color
        box.line.width = Pt(1.5)
        btf = box.text_frame
        btf.margin_left = Inches(0.18)
        btf.margin_right = Inches(0.18)
        btf.margin_top = Inches(0.22)

        bp1 = btf.paragraphs[0]
        bp1.text = layer
        bp1.font.size = Pt(8.5)
        bp1.font.bold = True
        bp1.font.color.rgb = color

        bp2 = btf.add_paragraph()
        bp2.text = title
        bp2.font.size = Pt(12)
        bp2.font.bold = True
        bp2.font.color.rgb = TEXT_NAVY
        bp2.space_before = Pt(4)

        bp3 = btf.add_paragraph()
        bp3.text = desc
        bp3.font.size = Pt(9.5)
        bp3.font.color.rgb = TEXT_MUTED
        bp3.space_before = Pt(8)

        # Arrow indicator between boxes (except last)
        if idx < 4:
            arrow = s5.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, Inches(left_pos.inches + 2.22), Inches(3.4), Inches(0.16), Inches(0.2))
            arrow.fill.solid()
            arrow.fill.fore_color.rgb = BLUE_PRIMARY
            arrow.line.fill.background()

    # Bottom Technical Explanation Cards (3 Cards)
    tech_cards = [
        ("Deterministic Heuristic Security", "Heuristic engine identifies high-risk Top-Level Domains (.xyz, .top, .work), IP address hosting, multiple subdomains, and lookalike brand spoofing (e.g., sbi-kyc, netflix-update)."),
        ("Statistical TF-IDF Text Classifier", "Trained on balanced phishing and legitimate corpora. Calculates word and n-gram term frequencies, penalized by inverse document frequency, to detect urgency and prize claims."),
        ("Fault-Tolerant Microservices Architecture", "FastAPI backend handles REST requests asynchronously with sub-50ms latency. In-memory storage automatically preserves sessions even if external databases are unavailable.")
    ]

    for idx, (head, text) in enumerate(tech_cards):
        left_pos = Inches(0.8 + idx * 4.0)
        tcard = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, Inches(5.35), Inches(3.733), Inches(1.6))
        tcard.fill.solid()
        tcard.fill.fore_color.rgb = CARD_BG
        tcard.line.color.rgb = CARD_BORDER
        ttf = tcard.text_frame
        ttf.margin_left = Inches(0.22)
        ttf.margin_right = Inches(0.22)
        ttf.margin_top = Inches(0.18)

        tp1 = ttf.paragraphs[0]
        tp1.text = head
        tp1.font.size = Pt(10.5)
        tp1.font.bold = True
        tp1.font.color.rgb = TEXT_NAVY

        tp2 = ttf.add_paragraph()
        tp2.text = text
        tp2.font.size = Pt(8.5)
        tp2.font.color.rgb = TEXT_MUTED
        tp2.space_before = Pt(4)

    # ==========================================
    # SLIDE 6: WEBSITE DEMONSTRATION & FUTURE SCOPE
    # ==========================================
    s6 = prs.slides.add_slide(blank_layout)
    add_slide_bg(s6)
    add_header(s6, 6, "Website Demonstration & Future Scope", "Live production screenshots of the ScamShield AI platform and planned project roadmap.")

    # Screenshot 1: Homepage & Scanner
    hp_img = "presentation/screenshots/homepage.png"
    if os.path.exists(hp_img):
        # Image border card
        img_card1 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.85), Inches(5.7), Inches(3.2))
        img_card1.fill.solid()
        img_card1.fill.fore_color.rgb = CARD_BG
        img_card1.line.color.rgb = CARD_BORDER
        s6.shapes.add_picture(hp_img, Inches(0.85), Inches(1.9), width=Inches(5.6))

    # Screenshot 2: AI Risk Gauge & Scan Result
    res_img = "presentation/screenshots/scan_result.png"
    if os.path.exists(res_img):
        img_card2 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.8), Inches(1.85), Inches(5.7), Inches(3.2))
        img_card2.fill.solid()
        img_card2.fill.fore_color.rgb = CARD_BG
        img_card2.line.color.rgb = CARD_BORDER
        s6.shapes.add_picture(res_img, Inches(6.85), Inches(1.9), width=Inches(5.6))

    # Screenshot Captions
    cap1 = s6.shapes.add_textbox(Inches(0.8), Inches(5.1), Inches(5.7), Inches(0.4))
    cap1.text_frame.paragraphs[0].text = "Figure 1: ScamShield AI Landing Page with Instant Threat Checker & Emergency 1930 Bar"
    cap1.text_frame.paragraphs[0].font.size = Pt(8.5)
    cap1.text_frame.paragraphs[0].font.color.rgb = TEXT_LIGHT
    cap1.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    cap2 = s6.shapes.add_textbox(Inches(6.8), Inches(5.1), Inches(5.7), Inches(0.4))
    cap2.text_frame.paragraphs[0].text = "Figure 2: Real-Time Assessment Interface: Circular Risk Gauge, Signal Tokens, & Vernacular Voice"
    cap2.text_frame.paragraphs[0].font.size = Pt(8.5)
    cap2.text_frame.paragraphs[0].font.color.rgb = TEXT_LIGHT
    cap2.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

    # Bottom Future Scope Cards (3 Cards)
    futures = [
        ("Browser Extension (Chrome / Edge)", "Direct inline scanning that warns users in real-time before clicking suspicious links on web pages, webmail, and search results."),
        ("WhatsApp & SMS Automated Bot", "Citizen helpline bot allowing users to forward suspicious messages directly via WhatsApp to receive an instant safety reply."),
        ("I4C & Threat Intelligence Sync", "Automated synchronization with the Indian Cyber Crime Coordination Centre threat database for newly emerging fraudulent domains.")
    ]

    for idx, (title, desc) in enumerate(futures):
        left_pos = Inches(0.8 + idx * 4.0)
        fcard = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left_pos, Inches(5.5), Inches(3.733), Inches(1.45))
        fcard.fill.solid()
        fcard.fill.fore_color.rgb = CARD_BG
        fcard.line.color.rgb = CARD_BORDER
        ftf = fcard.text_frame
        ftf.margin_left = Inches(0.2)
        ftf.margin_right = Inches(0.2)
        ftf.margin_top = Inches(0.15)

        fp1 = ftf.paragraphs[0]
        fp1.text = f"🚀 Future Scope {idx+1}: {title}"
        fp1.font.size = Pt(10)
        fp1.font.bold = True
        fp1.font.color.rgb = BLUE_DARK

        fp2 = ftf.add_paragraph()
        fp2.text = desc
        fp2.font.size = Pt(8.5)
        fp2.font.color.rgb = TEXT_MUTED
        fp2.space_before = Pt(3)

    # ==========================================
    # SLIDE 7: CONCLUSION & THANK YOU
    # ==========================================
    s7 = prs.slides.add_slide(blank_layout)
    add_slide_bg(s7)

    # Left: Project Impact & Summary Card
    sum_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(6.0), Inches(5.9))
    sum_card.fill.solid()
    sum_card.fill.fore_color.rgb = CARD_BG
    sum_card.line.color.rgb = CARD_BORDER
    stf = sum_card.text_frame
    stf.margin_left = Inches(0.4)
    stf.margin_right = Inches(0.4)
    stf.margin_top = Inches(0.45)

    sp1 = stf.paragraphs[0]
    sp1.text = "PROJECT SUMMARY & CONTRIBUTION"
    sp1.font.size = Pt(10)
    sp1.font.bold = True
    sp1.font.color.rgb = BLUE_PRIMARY

    sp2 = stf.add_paragraph()
    sp2.text = "Key Takeaways of ScamShield AI"
    sp2.font.size = Pt(18)
    sp2.font.bold = True
    sp2.font.color.rgb = TEXT_NAVY
    sp2.space_before = Pt(4)

    takeaways = [
        ("Bridging the Cybersecurity Divide", "Empowers non-technical citizens and senior citizens with plain-English insights and multi-language voice assistance."),
        ("High-Performance Hybrid AI Engine", "Combines high-speed lexical URL heuristics with TF-IDF statistical machine learning achieving 100% test evaluation accuracy."),
        ("Action-Oriented Digital Defense", "Provides direct instructions and immediate connection to the National Cybercrime Helpline (1930) to freeze fraudulent transfers."),
        ("Scalable Full-Stack Foundation", "Built on modern production standards with React 18, FastAPI, Bcrypt security, and modular threat telemetry pipelines.")
    ]

    for title, desc in takeaways:
        tp = stf.add_paragraph()
        tp.text = f"✓  {title}"
        tp.font.size = Pt(11)
        tp.font.bold = True
        tp.font.color.rgb = TEXT_NAVY
        tp.space_before = Pt(10)

        td = stf.add_paragraph()
        td.text = f"    {desc}"
        td.font.size = Pt(9.5)
        td.font.color.rgb = TEXT_MUTED
        td.space_before = Pt(2)

    # Right: Elegant Thank You Card
    ty_card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(0.8), Inches(5.433), Inches(5.9))
    ty_card.fill.solid()
    ty_card.fill.fore_color.rgb = CARD_BG
    ty_card.line.color.rgb = CARD_BORDER
    ty_tf = ty_card.text_frame
    ty_tf.margin_left = Inches(0.4)
    ty_tf.margin_right = Inches(0.4)
    ty_tf.margin_top = Inches(0.8)

    typ1 = ty_card.text_frame.paragraphs[0]
    typ1.text = "JIS COLLEGE OF ENGINEERING"
    typ1.font.size = Pt(12)
    typ1.font.bold = True
    typ1.font.color.rgb = BLUE_PRIMARY
    typ1.alignment = PP_ALIGN.CENTER

    typ2 = ty_card.text_frame.add_paragraph()
    typ2.text = "THANK YOU"
    typ2.font.size = Pt(42)
    typ2.font.bold = True
    typ2.font.color.rgb = TEXT_NAVY
    typ2.alignment = PP_ALIGN.CENTER
    typ2.space_before = Pt(14)

    typ3 = ty_card.text_frame.add_paragraph()
    typ3.text = "SCAMSHIELD AI – Stay Alert, Stay Safe."
    typ3.font.size = Pt(14)
    typ3.font.bold = True
    typ3.font.color.rgb = BLUE_DARK
    typ3.alignment = PP_ALIGN.CENTER
    typ3.space_before = Pt(8)

    typ4 = ty_card.text_frame.add_paragraph()
    typ4.text = "Questions & Demonstration Welcome"
    typ4.font.size = Pt(11)
    typ4.font.color.rgb = TEXT_MUTED
    typ4.alignment = PP_ALIGN.CENTER
    typ4.space_before = Pt(18)

    typ5 = ty_card.text_frame.add_paragraph()
    typ5.text = "Team Members: Maharuf Sardar  •  Pradip Kumar Jana  •  Tathagata Karfa  •  Suman Ansari  •  Mouktik Chakraborty"
    typ5.font.size = Pt(9)
    typ5.font.bold = True
    typ5.font.color.rgb = TEXT_LIGHT
    typ5.alignment = PP_ALIGN.CENTER
    typ5.space_before = Pt(24)

    typ6 = ty_card.text_frame.add_paragraph()
    typ6.text = "🔗 GitHub: github.com/janapradipkumar94-bot/scamshield-ai"
    typ6.font.size = Pt(9.5)
    typ6.font.bold = True
    typ6.font.color.rgb = BLUE_PRIMARY
    typ6.alignment = PP_ALIGN.CENTER
    typ6.space_before = Pt(10)

    # Save presentation
    os.makedirs("presentation", exist_ok=True)
    out_path = "presentation/ScamShield_AI_Presentation.pptx"
    prs.save(out_path)
    print(f"Successfully generated PowerPoint presentation with {len(prs.slides)} slides at: {out_path}")

if __name__ == "__main__":
    create_deck()

