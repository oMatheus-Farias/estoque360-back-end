import 'reflect-metadata';

import { fastifyCors } from '@fastify/cors';
import { fastify } from 'fastify';

export const app = fastify();

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});

// heath check route
app.get('/health', () => {
  return { status: 'ok' };
});
