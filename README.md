# Blueprint AI Work Simulation Exercise

This repository contains a full-stack application for an AI-powered question-answering system that analyzes a therapy session transcript. The system allows users to ask questions about the conversation and receive AI-generated responses with relevant context and quotes.

## Demo

![Application Screenshot](./assets/screenshot.png)

[Watch Demo Video](./assets/product.mp4)

## Project Overview

The project consists of:
- A React frontend (`client`) - [View Client README](./client/README.md)
- A NestJS backend (`api`) - [View API README](./api/README.md)
- A PostgreSQL database
- A therapy session transcript for the AI agent to analyze

## Key Features

- AI-powered question answering about the transcript content
- Real-time response generation with relevant quotes
- Modern React frontend with TypeScript and Vite
- RESTful API with NestJS
- PostgreSQL database for data persistence
- Docker containerization for easy deployment

## Getting Started

1. Clone this repository
2. From the root of the project, start the application:
   ```bash
   docker compose up --build
   ```
3. In a new terminal, run the database migrations:
   ```bash
   docker compose run api npm run migration:up
   ```
4. Visit [localhost:5173](http://localhost:5173) to access the application

## Project Structure

- `/api` - Backend NestJS application with AI integration
- `/client` - Frontend React application with TypeScript
- `/api/data` - Contains the therapy session transcript
- `docker-compose.yml` - Docker configuration for all services

## Available Scripts

In the API directory:
- `npm run dev` - Start the development server
- `npm run migration:up` - Run database migrations
- `npm run test` - Run tests

In the Client directory:
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run test` - Run tests

## The Challenge

Your task is to create an AI agent that can answer questions about the contents of a provided therapy session transcript. The transcript is available in the `api/data/transcript.txt` file.

### Requirements

1. Create an endpoint in the API that accepts questions about the transcript
2. Implement a basic agent that can:
   - Read and understand the transcript
   - Answer questions about its contents
   - Provide relevant quotes or references when appropriate
3. Add a simple interface in the frontend to:
   - Display the transcript
   - Allow users to ask questions
   - Show the agent's responses

### Evaluation Criteria

Your solution will be evaluated on:
- Code organization and quality
- Implementation of the AI agent
- User interface design and experience
- Error handling and edge cases
- Documentation and comments

### Time Expectations

Plan to spend about 4 hours to complete this exercise. Focus on delivering a working solution that demonstrates your understanding of AI concepts and software engineering principles.

## Submission

When you're done:
1. Push your changes to your fork of this repository and make it public
2. Send us the link to your repository
3. Include any additional notes or documentation about your implementation

Good luck!
