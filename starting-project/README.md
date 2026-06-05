## Using Claude Code

In this project we will explore Claude Code and we are going to use some agents, skills, and other things that will helps us out using it to it's full potential!

### 1. Getting started

Let's first create a `SPEC.md` file with some specifications for the project. This will come in handy so we can have some specifications for Claude to follow along and to help us create some features in our application.

### 2. /init and /clear

When we are in a Claude Code session, we can run the command `/init`.
This command will tell Claude Code to analyze the project, creating the file `CLAUDE.md`. This is one of the most important files when working with claude!

the `/clear` command clears the context window, this way you don't need to always stop the session and create another one in another terminal for others tasks.

### 3. .CLAUDE.md file

`CLAUDE.md` will be automatically loaded into every session you have with Claude Code.
In this file should have general rules and general information about the project.

In there we can give it some important instructions, like keeping the responses concise, avoiding some unnecessary fluff, etc. Wording will have a big impact in the tokens we spend, so some tweaks will be really important!

### 4. First prompt

This will be the first prompt we will five to Claude Code to start creating our application:

```
    Let's start building the application described in @SPEC.MD
    Start by setting up the core route structure. Only add a dummy message to each page. No actual page content yet.
    Just create all those different page.tsx files for the different application touts. Don't implement authentication yet.
```

We will execute this in **`plan mode`**.

### 5. Plan mode

`Plan mode`is super important. It's purpose is to help out creating an implementation plan before doing anything in your project.
It can ask clarification questions if it has something that it needs more information.

This mode doesn't have edit permissions, it only reads the files and prepares an implementation plan!

### 6. Second prompt

This will be the next prompt:

```
    Implement authentication and database access.
    Add a "lib" folder with "auth.ts" and "db.ts" files. Export a db handle in the db.ts file and make sure WAL mode is used and all required database tables are created if they don't exist yet.
```

But chances are that Claude might get this wrong. There's integrations with SQLite and Better Auth with Bun, so we could pass it the documentation for those in the prompt... Or we could do that in another way, and that's using MCP Servers 🚀

Documentation for Bun integration with [SQLite](https://bun.com/docs/runtime/sqlite) and [Better Auth](https://better-auth.com/docs/adapters/sqlite)

### 7. MCP Servers

Here's some documentation on what are [MCP Servers](https://modelcontextprotocol.io/docs/getting-started/intro)

MCP Servers is a standard for tools that Claude Code can use. This will give Claude more tools to use.
One great MCP that we will use is [context7](https://github.com/upstash/context7) MCP. We can run the command `claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp` to install that MCP server 💪

### 8. Second prompt with context7

With this, we can run the prompt like this:

```
    Implement authentication and database access.
    Add a "lib" folder with "auth.ts" and "db.ts" files. Export a db handle in the db.ts file and make sure WAL mode is used and all required database tables are created if they don't exist yet.
    Use web search or the context7 mcp to find the relevant documentation for Bun SQLite and better-auth setup (with NExt.js and Bun SQLite).
```

For this, Claude Code will use our new MCP server to check the web for that documentation we were checking above
