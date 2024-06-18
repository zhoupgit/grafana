import { HttpResponse, http } from 'msw';

import { getMockUser } from 'app/features/users/__mocks__/userMocks';

const getUserHandler = (user = getMockUser()) =>
  http.get(`/api/user`, () => {
    return HttpResponse.json(user);
  });

const handlers = [getUserHandler()];

export default handlers;
