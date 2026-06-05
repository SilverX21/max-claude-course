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

### 9. Subagents

Subagents are agents that Claude Code deploys to handle some tasks. Sometimes when work is being done, we can see some other tasks being done. That's Claude using some sub agents to take care of other tasks.
Sub agents will have their own session and will come back to the main session with the work done. To create subagents, we can do the following:

- Go to your `.claude/` folder
- add a folder named `agents/`
- inside that folder, create an md file with the name of your agent, in this case we will call it DocsExplorer.md
- in that file, we can specify some info and rules:
  - name, description, tools and model
  - Workflow that will be done
  - Rules to be applied
  - Output format of the agent work

### 10. Encouraging Agents usage

We can make Claude to use the subagents we create, for that, we must use the CLAUDE.md file and give there some instructions and rules for it to use those agents:

```
Whenever working with any third-party library or something similar, you MUST look up the official documentation to ensire that you're working with up-to-date information.
Use the DocsExplorer subagent for efficient documentation lookup.
```

### 11. Skills

Skills are like things an agent is good at, for example, we can have an agent that is good at programming in C#, other in TypeScript, etc. Some can even be good at security, architecture and so on.
Skills are created basically like the agents, but in this case we will have a `SKILL.md` file, like this:

- First create a folder called `skills/` inside `.claude/` folder
- then you can create another folder with the skill name you want, for example: `dotnet-master`
- inside you'll need to create a file called `SKILL.md`, where you have your instructions and rules for that skill
- inside a skill we can have:
  - extra .md files
  - a `references/` folder
  - a `scripts/` folder
  - as `assets/` folder
