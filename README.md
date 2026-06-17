📦 rtu-solutions
┃
┣ 📂 app
┃ ┣ 📂 admin
┃ ┃ ┣ 📜 page.jsx
┃ ┃ ┣ 📂 degrees
┃ ┃ ┃ ┗ 📜 page.jsx
┃ ┃ ┣ 📂 branches
┃ ┃ ┃ ┗ 📜 page.jsx
┃ ┃ ┣ 📂 semesters
┃ ┃ ┃ ┗ 📜 page.jsx
┃ ┃ ┣ 📂 subjects
┃ ┃ ┃ ┗ 📜 page.jsx
┃ ┃ ┣ 📂 solutions
┃ ┃ ┃ ┗ 📜 page.jsx
┃ ┃ ┣ 📂 videos
┃ ┃ ┃ ┗ 📜 page.jsx
┃ ┃ ┗ 📂 users
┃ ┃ ┃ ┗ 📜 page.jsx
┃ ┃
┃ ┣ 📂 api
┃ ┃ ┣ 📂 degrees
┃ ┃ ┃ ┗ 📜 route.js
┃ ┃ ┣ 📂 branch
┃ ┃ ┃ ┗ 📜 route.js
┃ ┃ ┣ 📂 semesters
┃ ┃ ┃ ┗ 📜 route.js
┃ ┃ ┣ 📂 subjects
┃ ┃ ┃ ┗ 📜 route.js
┃ ┃ ┣ 📂 solutions
┃ ┃ ┃ ┗ 📜 route.js
┃ ┃ ┣ 📂 youtube
┃ ┃ ┃ ┗ 📜 route.js
┃ ┃ ┗ 📂 users
┃ ┃ ┃ ┗ 📜 route.js
┃
┣ 📂 lib
┃ ┣ 📜 db.js
┃ ┣ 📜 auth.js
┃ ┗ 📜 upload.js
┃
┣ 📂 services
┃ ┣ 📜 degreeService.js
┃ ┣ 📜 branchService.js
┃ ┣ 📜 semesterService.js
┃ ┣ 📜 subjectService.js
┃ ┣ 📜 solutionService.js
┃ ┣ 📜 youtubeService.js
┃ ┗ 📜 userService.js
┃
┣ 📂 src
┃ ┣ 📂 admin
┃ ┃ ┣ 📜 AdminLayout.jsx
┃ ┃ ┣ 📜 AdminNavbar.jsx
┃ ┃ ┣ 📜 AdminSidebar.jsx
┃ ┃ ┣ 📜 DegreeForm.jsx
┃ ┃ ┣ 📜 BranchForm.jsx
┃ ┃ ┣ 📜 SemesterForm.jsx
┃ ┃ ┣ 📜 SubjectForm.jsx
┃ ┃ ┣ 📜 SolutionForm.jsx
┃ ┃ ┣ 📜 VideoForm.jsx
┃ ┃ ┗ 📜 UserTable.jsx
┃ ┃
┃ ┣ 📂 components
┃ ┃ ┣ 📜 Navbar.jsx
┃ ┃ ┣ 📜 Footer.jsx
┃ ┃ ┣ 📜 Hero.jsx
┃ ┃ ┣ 📜 Notes.jsx
┃ ┃ ┣ 📜 Loader.jsx
┃ ┃ ┣ 📜 BlogCard.jsx
┃ ┃ ┣ 📜 Sidebar.jsx
┃ ┃ ┗ 📜 YoutubeVideo.jsx
┃
┣ 📂 public
┃ ┣ 📂 uploads
┃ ┃ ┣ 📂 notes
┃ ┃ ┣ 📂 pyq
┃ ┃ ┗ 📂 videos
┃ ┣ 📜 logo.jpg
┃ ┗ 📜 hero.webp
┃
┣ 📜 .env
┣ 📜 package.json
┣ 📜 next.config.ts
┣ 📜 README.md
┗ 📜 tsconfig.json
















Abhi tak jo components humne banaye hain (Navbar, Footer, Hero, SubjectCard, NoteCard, VideoCard, BlogCard, SearchBar, Sidebar, Loader), unke liye ye packages install kar lo:

npm install react-icons

Agar Tailwind abhi install nahi hai:

npm install tailwindcss @tailwindcss/postcss postcss

Agar future me MySQL use karna hai:

npm install prisma @prisma/client

Prisma initialize:

npx prisma init

Agar Login System banana hai:

npm install next-auth

(Auth.js latest version baad me add karenge)

Agar Payment Gateway lagana hai:

npm install razorpay

Agar Forms handle karne hain:

npm install react-hook-form

Agar Validation chahiye:

npm install zod

Agar Notifications (Toast) chahiye:

npm install react-hot-toast

Agar Loading Animation aur Advanced Animations chahiye:

npm install framer-motion
Mere hisab se abhi ek hi command chala do
npm install react-icons react-hook-form react-hot-toast framer-motion zod
Database aur Payment baad me
npm install prisma @prisma/client razorpay next-auth
Current Phase (Frontend Only)

Tumhe abhi sirf ye chahiye:

npm install react-icons react-hot-toast framer-motion




npx shadcn@latest init
