---
title: Event Management Platform
summary: A web platform where organizers publish events and attendees reserve tickets, built as an Express and PostgreSQL API with a React front end.
role: Backend and frontend development (top contributor in a team of six)
period: '2023'
stack: [Node.js, Express, PostgreSQL, Sequelize, Supabase, React, Redux Toolkit, Tailwind CSS]
visibility: public
repo: https://github.com/Kelompok1Harisenin/event-management-be
featured: true
order: 6
icon: ticket
---

## Overview

A team project from Kelompok 1 at Harisenin. Organizers create and manage events, attendees browse them and reserve tickets, and admins look after the platform. I was the main contributor to both the API and the web app.

The code lives in two repositories: the [backend](https://github.com/Kelompok1Harisenin/event-management-be) and the [frontend](https://github.com/Kelompok1Harisenin/event-management-fe).

## Scope

- **Accounts and roles:** sign-up and sign-in with JWT, and role-based access for Admin, Organizer and Attendee through roles, permissions and their join tables.
- **Organizers:** an organizer profile that owns its events.
- **Events:** create, edit, list, filter and remove events, each with a cover image and ticket packages.
- **Tickets:** attendees reserve tickets for an event, with payments modelled alongside.
- **Web app:** home and event pages, event details, create and edit forms, and sign-in.

## Architecture

**Backend.** An Express REST API under `/v1`, organised as routes, controllers and services, with Sequelize models on PostgreSQL. Requests are validated with Joi, errors go through a shared error middleware, and authentication middleware checks the JWT and the caller's role. Event images are uploaded with Multer and stored in a Supabase Storage bucket, which returns the public URL saved on the event. The service runs under PM2.

**Frontend.** Vite and React with React Router, Redux Toolkit for shared state, Axios for API calls, and Tailwind CSS with DaisyUI for the interface.

**Tooling.** ESLint with the Airbnb base config, Prettier, Husky and lint-staged checks before each commit, and Jest for tests.
