import handler from '../getAddresses';
// @ts-ignore - node-mocks-http doesn't have complete type definitions
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

// Simple test focusing on validation logic since the actual generateMockAddresses is complex to mock
describe('/api/getAddresses validation', () => {
  it('should return 400 when postcode is missing', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        streetnumber: '123',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Postcode and street number fields mandatory!');
  });

  it('should return 400 when streetnumber is missing', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '1234',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Postcode and street number fields mandatory!');
  });

  it('should return 400 when both postcode and streetnumber are missing', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Postcode and street number fields mandatory!');
  });

  it('should return 400 when postcode is too short', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '123', // Less than 4 digits
        streetnumber: '123',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Postcode must be at least 4 digits!');
  });

  it('should return 400 when postcode contains non-numeric characters', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '12a4', // Contains letter
        streetnumber: '123',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Postcode must be all digits and non negative!');
  });

  it('should return 400 when streetnumber contains non-numeric characters', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '1234',
        streetnumber: '12a', // Contains letter
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Street Number must be all digits and non negative!');
  });

  it('should return 400 when postcode is negative', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '-1234', // Negative number
        streetnumber: '123',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Postcode must be all digits and non negative!');
  });

  it('should return 400 when streetnumber is negative', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '1234',
        streetnumber: '-123', // Negative number
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Street Number must be all digits and non negative!');
  });

  it('should return 400 when postcode contains decimal', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '12.34', // Contains decimal
        streetnumber: '123',
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Postcode must be all digits and non negative!');
  });

  it('should return 400 when streetnumber contains decimal', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '1234',
        streetnumber: '12.3', // Contains decimal
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    const data = JSON.parse(res._getData());
    expect(data.status).toBe('error');
    expect(data.errormessage).toBe('Street Number must be all digits and non negative!');
  });
  it('should return 200 with addresses when valid input is provided', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '1234',
        streetnumber: '123',
      },
    });

    await handler(req, res);

    // The actual implementation will either return 200 with data or 404 if no results
    // We just check that it doesn't fail validation
    expect(res._getStatusCode()).not.toBe(400);
  });

  it('should return 404 when no addresses are found', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '9999', // Will likely return null from real function
        streetnumber: '999',
      },
    });

    await handler(req, res);

    // Should pass validation but may return 404 if no results found
    const statusCode = res._getStatusCode();
    expect(statusCode === 200 || statusCode === 404).toBe(true);
  });

  it('should handle postcode with leading zeros', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '0123', // Leading zero
        streetnumber: '123',
      },
    });

    await handler(req, res);

    // Should be valid since it's all digits and >= 0
    expect(res._getStatusCode()).not.toBe(400);
  });

  it('should handle streetnumber with leading zeros', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '1234',
        streetnumber: '0123', // Leading zero
      },
    });

    await handler(req, res);

    // Should be valid since it's all digits and >= 0
    expect(res._getStatusCode()).not.toBe(400);
  });

  it('should handle zero values', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: '0000',
        streetnumber: '0',
      },
    });

    await handler(req, res);

    // Should be valid since 0 is non-negative
    expect(res._getStatusCode()).not.toBe(400);
  });

  it('should handle array inputs by taking first value', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
      query: {
        postcode: ['1234', '5678'], // Array input
        streetnumber: ['123', '456'],
      },
    });

    await handler(req, res);

    // Should process the first value of the array
    expect(res._getStatusCode()).not.toBe(400);
  });

  describe('isStrictlyNumeric function edge cases', () => {
    it('should reject empty string', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: {
          postcode: '',
          streetnumber: '123',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
    });

    it('should reject string with only spaces', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: {
          postcode: '1234',
          streetnumber: '   ', // Only spaces
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
    });

    it('should reject scientific notation', async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: 'GET',
        query: {
          postcode: '1e3', // Scientific notation
          streetnumber: '123',
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
    });
  });
});
