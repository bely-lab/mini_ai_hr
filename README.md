# Mini AI HR Admin System

## 1. Project Overview

Mini AI HR is a web application for HR Admins to manage employee records through both a standard web interface and an AI HR Assistant.

The application supports creating, viewing, updating, and deactivating employee records. The AI HR Assistant can understand natural-language requests and perform these actions on employee records stored in the database.

The application also supports generating a short professional employee summary based on the available employee information.

## 2. Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Auth
- Supabase PostgreSQL
- OpenAI Responses API
- Vercel

## 3. How to Run the Project Locally

Clone the repository:

```bash
git clone https://github.com/bely-lab/mini_ai_hr.git
cd mini_ai_hr
npm install
Create a `.env.local` file in the project root with the variables from section 4, then start the app:
npm run dev
```

Open http://localhost:3000.

## 4. Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (public) key |
| `OPENAI_API_KEY` | OpenAI API key  |


## 5. How the AI HR Assistant Works

The assistant uses the OpenAI Responses API with function calling. 

1. The HR Admin sends a request in plain language.
2. The model picks the matching tool and fills in its arguments.
3. The server validates the arguments and runs the operation in Supabase PostgreSQL.
4. The result is returned and the assistant reports it.

Available functionality:

- List employees
- Find an employee
- Create an employee
- Update employee information
- Deactivate an employee
- Generate an employee summary
- Save an employee summary
## 6. Example Prompts

**Create an employee**
```
Create an employee named John Doe. Email john@example.com. Phone +46701234567.
Job title Software Engineer. Department Engineering. Employment type full time.
Joining date 2026-06-01. Manager Sarah Miller. Location Stockholm.
```

**View employees**
```
Show me all active employees.
```

**Find an employee**
```
Find John Doe.
```

**Update an employee**
```
Update John Doe's department to Product and job title to Product Engineer.
```

**Deactivate an employee**
```
Deactivate John Doe.
```

**Generate a summary**
```
Generate an employee summary for John Doe.
```
## 7. Known Limitations

- Only the HR Admin role is supported.
- Chat history is not saved and resets on page reload.
- The AI assistant depends on OpenAI availability and account rate limits.
- There is no pagination on the employee list.