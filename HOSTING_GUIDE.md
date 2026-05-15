# Apache Tomcat হোস্টিং গাইড (Local Server)

এই প্রজেক্টটি Apache Tomcat-এ হোস্ট করার জন্য নিচের ধাপগুলো অনুসরণ করুন:

### ধাপ ১: প্রজেক্ট এক্সপোর্ট করা
১. AI Studio-এর উপরের ডানদিকের **Settings (Gear Icon)** এ যান।
২. **Export to ZIP** বাটনে ক্লিক করে প্রজেক্টটি আপনার কম্পিউটারে ডাউনলোড করুন।
৩. ডাউনলোড করা জিপ ফাইলটি আনজিপ করুন।

### ধাপ ২: লোকাল এনভায়রনমেন্ট সেটআপ
১. নিশ্চিত করুন আপনার পিসিতে **Node.js** ইনস্টল করা আছে।
২. আনজিপ করা ফোল্ডারে কমান্ড প্রম্পট (CMD) বা টার্মিনাল ওপেন করুন।
৩. নিচের কমান্ডগুলো রান করুন:
   ```bash
   npm install
   npm run build
   ```
৪. এটি আপনার প্রজেক্ট ফোল্ডারে একটি নতুন `dist` নামের ফোল্ডার তৈরি করবে।

### ধাপ ৩: Tomcat-এ ফাইল রাখা (সঠিক পদ্ধতি)
১. আপনার পিসিতে Tomcat ফোল্ডারে যান (যেমন: `C:\apache-tomcat-8.0.53`).
২. `webapps` ফোল্ডারটি ওপেন করুন।
৩. এখানে একটি নতুন ফোল্ডার তৈরি করুন যার নাম দিন `cstdashboard`.
৪. আপনার প্রজেক্টের বিল্ড করা `dist` ফোল্ডারের **ভেতরের** সব ফাইল কপি করুন।
৫. ফাইলগুলো `webapps/cstdashboard/` ফোল্ডারে পেস্ট করুন।

**সঠিক ফোল্ডার বিন্যাস (Visual Check):**
নিশ্চিত করুন আপনার ফাইলগুলো এভাবে আছে:
- `...\webapps\cstdashboard\index.html` (সরাসরি এখানে থাকবে)
- `...\webapps\cstdashboard\assets\` (ফোল্ডার হিসেবে থাকবে)

### ধাপ ৪: 404 Error সমাধান (web.xml যোগ করা)
React এর রাউটিং বা রিফ্রেশ জনিত ৪০৪ এরর বন্ধ করতে নিচের কাজটুকু করুন:
১. `webapps/cstdashboard/` এর ভেতরে একটি নতুন ফোল্ডার খুলুন নাম দিন `WEB-INF`.
২. `WEB-INF` এর ভেতরে একটি টেক্সট ফাইল খুলুন নাম দিন `web.xml`.
৩. নিচের কোডটুকু সেই ফাইলে দিয়ে সেভ করুন:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
                      http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
  version="3.1">

  <error-page>
    <error-code>404</error-code>
    <location>/index.html</location>
  </error-page>

</web-app>
```
৪. এবার ব্রাউজার থেকে `http://localhost:8080/cstdashboard/` ভিজিট করুন। (Ctrl+F5 দিন যদি আগে থেকে ওপেন থাকে)।

---
**মনে রাখবেন:** যদি আপনি Client-side Routing ব্যবহার করেন (যেমন React Router), তবে Tomcat-এ `WEB-INF/web.xml` কনফিগারেশন লাগতে পারে যাতে সব রিকোয়েস্ট `index.html`-এ রিডাইরেক্ট হয়।
