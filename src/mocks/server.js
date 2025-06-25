import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const handlers = [
  http.get('/api/getAddresses', ({ request }) => {
    return HttpResponse.json({ id: 1, name: 'Alice' });
  }),
];

export const server = setupServer(...handlers);
