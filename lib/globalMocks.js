const fetch = jest.fn()
fetch.mockResolvedValueOnce({ json: jest.fn() })

global.fetch = fetch
