<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Use `npm install --legacy-peer-deps` to install dependencies.


Do not use `python manage.py runserver` for backend dependencies. Use `uv run manage.py runserver`, instead.
Do not use `pip install` for backend dependencies. Use `uv add`, instead.

