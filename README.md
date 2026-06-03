This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## ⚡ Supabase Database Setup & Account Guide (Urdu/Hindi & English)

Agaye aap production database setup karne ke liye! Agar aapko Supabase par account banana hai aur naya database ready karna hai, to is guide ko follow karein:

### 1. Supabase Account Kaise Banayein (How to Create Account)

1. **Official Website:** Sabse pehle [https://supabase.com](https://supabase.com) par jayein.
2. **Sign Up:** Top-right corner par **Start your project** ya **Sign In** button par click karein.
3. **GitHub Connect (Highly Recommended):** Apne GitHub account se login karein (yeh sabse safe aur fast tareeqa hai) ya phir apni Email address enter karke account banayein.

### 2. Naya Project Kaise Banayein (How to Create a New Project)

1. Login karne ke baad dashboard screen par **New Project** button par click karein.
2. Apni **Organization** select karein (Default free context selected hota hai).
3. Project ki details fill karein:
   - **Name:** `PakJobs Live` type karein.
   - **Database Password:** Ek strong password set karein (Is password ko kahin save kar lein, yeh baad mein connection ke liye zaroori hoga!).
   - **Region:** `Singapore` (ap-southeast-1) ya `Mumbai` select karein (taake Pakistan aur remote region ke users ke liye connections super-fast rahein).
   - **Pricing Plan:** **Free** Tier (Plan) ko select karein.
4. **Create new project** par click karein. Database setup hone mein 1 se 2 minute lagte hain.

### 3. Hamein (Gemini / Developer) Ko Kia Provide Krna Ho Ga? (What to provide to me?)

Database build hone ke baad, aapko project connect karne ke liye hamein **Database Connection String** provide karni hogi:

1. **Dashboard** mein bottom left corner par **Project Settings** (Gear icon ⚙️) par click karein.
2. Sidebar mein **Database** option ko select karein.
3. Scroll down karke **Connection String** section par jayein aur **URI** string copy karein.
4. Woh string kuch is tarah dikhai degi:
   ```env
   postgres://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
   _(Aapko `[YOUR-PASSWORD]` ki jagah apna set kiya hua real database password likh kar mujhe batana hoga, ya `.env` file mein self-add karna hoga)_

### 4. Connection Setup (How to apply it)

Aap is URL ko root folder mein `.env` file bana kar usme set kar sakte hain:

```env
DATABASE_URL="copy_string_here_with_your_password"
```

Iske baad simple `npx prisma db push` command run karke hum local database ko live production Supabase database par switch kar denge!

postgresql://postgres:tF?#D\*6rz%B?2k8@db.lonnmsipeppmyqpeihdp.supabase.co:5432/postgres
