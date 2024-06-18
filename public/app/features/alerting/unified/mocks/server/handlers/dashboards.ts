import { HttpResponse, http } from 'msw';

// TODO: Implement proper responses for searching for dashboards
const searchHandler = (response = []) =>
  http.get('/api/search', () => {
    return HttpResponse.json(response);
  });

const handlers = [searchHandler()];

export default handlers;
