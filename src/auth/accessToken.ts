let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (nextAccessToken: string | null) => {
  accessToken = nextAccessToken;
};
