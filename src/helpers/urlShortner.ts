function generateRandomCode(length: number): string {
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code: string = '';

  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return code;
}

export function generateShortUrl(originalUrl: string, baseUrl: string = 'localhost:5000'): string {
  const code: string = generateRandomCode(10);
  const shortenedUrl: string = `${baseUrl}/${code}`;

  return shortenedUrl;
}
