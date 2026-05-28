# AI Finance Assistant

An AI-powered personal finance platform that transforms raw financial documents into intelligent insights, categorized transactions, semantic financial search, and AI-driven recommendations.

Built with modern full stack architecture using Next.js, Django REST Framework, PostgreSQL, OpenAI, Celery, Redis, pgvector, and cloud object storage.

---

# ✨ Overview

AI Finance Assistant helps users upload:

* Bank statements
* Expense CSVs
* Receipts
* Invoices
* Subscription bills
* Financial screenshots

The platform automatically:

* Extracts transactions
* Detects document types
* Categorizes expenses using AI
* Generates semantic embeddings
* Enables AI-powered transaction search
* Detects recurring subscriptions
* Tracks spending behavior
* Generates financial insights

The project combines:

* AI document parsing
* RAG-style semantic retrieval
* Vector search
* Financial analytics
* Intelligent categorization
* Modern SaaS architecture

---

# 🧠 Core Features

## 📂 Smart Financial Document Upload

Supports:

* PDF bank statements
* CSV exports
* Invoice images
* Receipt screenshots
* Subscription receipts

Features:

* Drag & drop uploads
* Real-time processing states
* AI extraction progress
* Retry failed uploads
* File history dashboard
* Automatic stuck upload cleanup

---

## 🤖 AI-Powered Transaction Extraction

The system intelligently extracts:

* Date
* Merchant
* Amount
* Transaction type
* Balance
* Raw transaction text

Supported parsers:

* Bank statement parser
* CSV transaction parser
* Receipt parser
* Subscription parser
* AI fallback parser using OpenAI

---

## 🧾 Intelligent Transaction Categorization

Transactions are automatically categorized into:

* Food
* Groceries
* Rent
* Utilities
* Travel
* Shopping
* Investments
* Subscriptions
* Healthcare
* Entertainment
* Salary
* And more

Categorization sources:

* Rule-based engine
* AI categorization
* Manual user override

---

## 🔍 AI Semantic Search (RAG-style)

Users can search transactions naturally:

Examples:

* “Show all food orders”
* “Find Amazon purchases”
* “Recurring subscription payments”
* “Large fuel expenses”
* “Travel-related transactions”

Uses:

* OpenAI embeddings
* pgvector vector search
* Semantic similarity matching

---

## 📈 AI Financial Insights

The platform analyzes user financial behavior and generates:

* Spending trends
* Subscription detection
* Expense patterns
* Financial recommendations
* Spending velocity analysis
* AI finance tips

---

## 📊 Interactive Dashboard

Dashboard includes:

* Financial overview
* Upload activity
* AI insights
* Transaction analytics
* Upload processing states
* Smart alerts

---

# 🏗️ System Architecture

## Frontend

Built with:

* Next.js 15
* React
* TypeScript
* Tailwind CSS

Frontend responsibilities:

* File uploads
* Real-time progress UI
* Transaction management
* Semantic search
* Dashboard visualization
* Pagination
* AI-enhanced UX

---

## Backend

Built with:

* Django
* Django REST Framework
* PostgreSQL
* Celery
* Redis

Backend responsibilities:

* File processing
* AI orchestration
* Transaction extraction
* Semantic embeddings
* API management
* Authentication
* Background jobs

---

## AI Layer

Uses:

* OpenAI GPT-4.1-mini
* OpenAI Embeddings
* pgvector

Capabilities:

* Transaction extraction
* AI categorization
* Semantic search
* Financial insights
* Intelligent parsing fallback

---

## Storage Layer

Uses:

* Cloudflare R2 object storage

Stores:

* Uploaded financial documents
* PDFs
* CSVs
* Images

---

## Async Processing

Uses:

* Celery
* Redis

Handles:

* Background parsing
* AI processing
* Embedding generation
* Upload cleanup
* Retry queues

---

# 🔄 Full Workflow

## Step 1 — Upload

User uploads:

* Bank statement
* Receipt
* Invoice
* CSV
* Screenshot

Frontend sends file to Django API.

---

## Step 2 — File Storage

Backend stores the file in:

* Cloudflare R2

Metadata stored in PostgreSQL.

---

## Step 3 — Background Processing

Celery worker starts async processing:

* Detect file type
* Extract text
* Parse transactions
* Generate AI insights

---

## Step 4 — AI Processing

System:

* Detects document type
* Extracts structured financial data
* Categorizes transactions
* Generates embeddings

---

## Step 5 — Vector Embeddings

Transaction embeddings are stored in:

* pgvector

This powers semantic search.

---

## Step 6 — Dashboard Updates

Frontend polls backend and updates:

* Processing progress
* AI status
* Transaction counts
* Insights

---

## Step 7 — AI Search & Insights

Users can:

* Search transactions naturally
* Find similar spending
* Detect subscriptions
* Analyze spending behavior

---

# 🧩 Key Technical Highlights

## ✅ Real-Time Upload UX

* Animated upload progress
* Dynamic processing states
* Retry mechanism
* Failure recovery
* Auto-cleanup for stuck uploads

---

## ✅ AI + Traditional Parsing Hybrid

Combines:

* Rule-based parsing
* AI parsing
* Heuristic extraction
* Vector retrieval

This improves accuracy and reliability.

---

## ✅ Scalable SaaS Architecture

Production-ready architecture using:

* Async workers
* Cloud object storage
* Vector database
* REST APIs
* Pagination
* Optimized queries

---

## ✅ Semantic Retrieval System

Implements:

* Embedding generation
* Vector similarity search
* RAG-inspired retrieval workflow

---

# 🛠️ Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Backend

* Django
* Django REST Framework
* PostgreSQL
* Celery
* Redis

## AI / ML

* OpenAI GPT
* OpenAI Embeddings
* pgvector

## Infrastructure

* Railway
* Vercel
* Cloudflare R2

---

# 📸 Screens

## Upload Dashboard

* Upload files
* AI progress tracking
* Retry failed uploads
* Processing animations

## Transactions Dashboard

* AI categorized transactions
* Semantic search
* Smart filtering
* Pagination
* Bulk actions

## File History

* Upload audit trail
* Processing status
* Parsed extraction results

---

# 🔐 Authentication & Security

* JWT Authentication
* Protected APIs
* User-specific financial isolation
* Secure cloud storage

---

# 🚀 Future Enhancements

Planned features:

* AI chat assistant for finance
* Budget forecasting
* Monthly financial reports
* Fraud detection
* Auto tax categorization
* OCR for scanned documents
* Multi-bank integrations
* Real-time financial assistant

---

# 📦 Local Setup

## Clone Repository

```bash
git clone https://github.com/souviknath18/ai-finance-assistant.git
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Backend Setup

```bash
cd backend

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

## Start Celery

```bash
celery -A core worker -l info
```

---

## Start Redis

```bash
redis-server
```

---

# 🌐 Deployment

## Frontend

* Vercel

## Backend

* Railway

## Database

* PostgreSQL

## File Storage

* Cloudflare R2

---

# 💡 Why This Project Stands Out

This project demonstrates real-world experience with:

* Full stack SaaS architecture
* AI integrations
* RAG systems
* Async background processing
* Semantic search
* Vector databases
* Cloud deployment
* Financial data workflows
* Production-grade UI/UX

It combines modern AI engineering with scalable software engineering principles.

---

# 👨‍💻 Author

Souvik Nath

Full Stack Engineer focused on:

* AI-powered applications
* RAG systems
* Scalable SaaS platforms
* Modern frontend/backend systems

GitHub:
https://github.com/souviknath18

LinkedIn:
https://www.linkedin.com/in/souvik-nath-0111a721a/
